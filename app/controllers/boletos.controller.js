const dbConnection = require('../config/db.js');
const boletosController = {};
let uuidv4;

(async () => {
  const { v4 } = await import('uuid');
  uuidv4 = v4;
})();

// CRUD Boletos - Crear, Leer, Actualizar, Eliminar
// Crear Boletos
boletosController.createBoleto = async (req, res) => {
    let { id_usuario, id_ruta, id_unidad, cantidad, monto, metodo } = req.body;

    if (!cantidad || cantidad < 1) {
        return res.status(400).json({ success: false, message: "Cantidad inválida" });
    }

    let connection;

    try {
        connection = await dbConnection();

        // 🚨 INICIAR TRANSACCIÓN
        await connection.beginTransaction();

        // 1. Obtener saldo actual del usuario
        const [usuarioResult] = await connection.execute(
            `SELECT saldo FROM usuarios WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (usuarioResult.length === 0) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const saldoActual = usuarioResult[0].saldo;

        if (saldoActual < monto) {
            return res.status(400).json({ success: false, message: "Saldo insuficiente" });
        }

        // 2. Descontar saldo
        const nuevoSaldo = saldoActual - monto;
        await connection.execute(
            `UPDATE usuarios SET saldo = ? WHERE id_usuario = ?`,
            [nuevoSaldo, id_usuario]
        );

        // 3. Registrar el pago
        const fecha = new Date();
        const [pagoResult] = await connection.execute(
            `INSERT INTO pagos (id_usuario, fecha_pago, total_boletos, monto, metodo)
             VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, fecha, cantidad, monto, metodo]
        );

        const id_pago = pagoResult.insertId;

        // 4. Registrar los boletos asociados
        const boletos = [];

        for (let i = 0; i < cantidad; i++) {
            const codigo_qr = uuidv4(); 

            const [boletoResult] = await connection.execute(
                `INSERT INTO boletos (id_pago, id_usuario, id_ruta, id_unidad, codigo_qr, estado)
                 VALUES (?, ?, ?, ?, ?, "pendiente")`,
                [id_pago, id_usuario, id_ruta, id_unidad, codigo_qr]
            );

            boletos.push({
                id_boleto: boletoResult.insertId,
                codigo_qr
            });
        }

        // 🚨 CONFIRMAR TODO
        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Boletos creados y saldo actualizado",
            data: {
                id_pago,
                cantidad,
                monto,
                nuevoSaldo,
                boletos
            }
        });

    } catch (error) {
        console.error("Error al crear boleto:", error);

        // 🚨 REVERSAR TODO SI FALLA ALGO
        if (connection) await connection.rollback();

        return res.status(500).json({ success: false, message: "Error en el servidor" });

    } finally {
        if (connection) connection.end();
    }
};



// Mostrar todos los Boletos
boletosController.getBoletos = async (req, res) => {
    const { usuario, estado } = req.query;
    
    if (!usuario) {
        return res.status(400).json({ error: "Falta el parámetro usuario" });
    }

    let query = 'SELECT * FROM boletos WHERE id_usuario = ?';
    const params = [usuario];

    if (estado) {
        query += " AND estado = ?";
        params.push(estado);
    };

    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.execute(query, params);
        
        if (result.length === 0) {
            res.status(200).json({
                success: false,
                message: 'No hay boletos disponibles'
            });
        } else {
            res.status(200).json({
                success: true,
                data: result,
                message: 'Boletos obtenidos exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al obtener los boletos: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}


// validar Boleto
boletosController.updateBoletoById = async (req, res) => {
    const { id } = req.params;
    let query = 'UPDATE boletos SET estado="validado" WHERE id_boleto = ?';
    let connection;
    try {
        connection = await dbConnection();
        const data = {
            id_boleto: id,
            estado: 'validado'
        }
        const [result] = await connection.execute(query, [id]);
        if (result.affectedRows === 0) {
            res.status(200).json({
                success: false,
                message: 'Boleto no encontrado'
            });
        } else {
            res.status(200).json({
                success: true,
                data: data,
                message: 'Boleto encontrado exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al obtener el boleto: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

boletosController.validateBoletoById = async (req, res) => {
    const { codigo_qr } = req.params; 
    let connection;

    try {
        if (!codigo_qr) {
            return res.status(400).json({ success: false, message: "Código QR requerido" });
        }

        connection = await dbConnection();

        // 1. Buscar boleto por su UUID
        const [rows] = await connection.query(
            `SELECT * FROM boletos WHERE codigo_qr = ?`,
            [codigo_qr]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "QR no válido" });
        }

        const boleto = rows[0];

        // 2. Revisar si ya está validado
        if (boleto.estado === "validado") {
            return res.status(200).json({
                success: false,
                message: "Este boleto ya fue validado previamente",
                data: boleto
            });
        }

        // 3. Actualizar estado
        const [update] = await connection.query(
            `UPDATE boletos SET estado = "validado" WHERE id_boleto = ?`,
            [boleto.id_boleto]
        );

        if (update.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "No se pudo validar el boleto" });
        }

        boleto.estado = "validado";

        res.status(200).json({
            success: true,
            message: "Boleto validado correctamente",
            data: boleto
        });

    } catch (error) {
        console.error("Error al validar boleto:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    } finally {
        if (connection) connection.end();
    }
};

// Eliminar Boleto
boletosController.deleteBoleto = async (req, res) => {
    const { id } = req.params;
    let query = 'DELETE FROM boletos WHERE id_boleto = ?';
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.execute(query, [id]);
        if (result.affectedRows === 0) {
            res.status(200).json({
                success: false,
                message: 'Boleto no encontrado'
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Boleto eliminado exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al eliminar el boleto: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

module.exports = boletosController;