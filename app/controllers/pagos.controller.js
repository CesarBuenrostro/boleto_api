const dbConnection = require('../config/db.js');

const pagosController = {};

// Crear pago (sin boletos)
pagosController.createPago = async (req, res) => {
    const { id_usuario, total_boletos, monto, metodo } = req.body;

    if (!id_usuario || !total_boletos || !monto || !metodo) {
        return res.status(400).json({
            success: false,
            message: "Faltan datos para registrar el pago"
        });
    }

    let connection;
    try {
        connection = await dbConnection();
        const fecha = new Date();

        const [result] = await connection.execute(
            `INSERT INTO pagos (id_usuario, fecha_pago, total_boletos, monto, metodo)
             VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, fecha, total_boletos, monto, metodo]
        );

        return res.status(201).json({
            success: true,
            message: "Pago registrado correctamente",
            data: { id_pago: result.insertId }
        });

    } catch (error) {
        console.error("Error al crear pago:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el servidor"
        });
    } finally {
        if (connection) connection.end();
    }
};


// Obtener pagos
pagosController.getPagos = async (req, res) => {
    let connection;

    try {
        connection = await dbConnection();
        const [rows] = await connection.query("SELECT * FROM pagos");

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error("Error al obtener pagos:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el servidor"
        });
    } finally {
        if (connection) connection.end();
    }
};


// Obtener pagos por usuario
pagosController.getPagosByUser = async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await dbConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM pagos WHERE id_usuario = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error("Error al obtener pagos por usuario:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el servidor"
        });
    } finally {
        if (connection) connection.end();
    }
};


// Eliminar pago
pagosController.deletePago = async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.execute(
            "DELETE FROM pagos WHERE id_pago = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Pago no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Pago eliminado"
        });

    } catch (error) {
        console.error("Error al eliminar pago:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el servidor"
        });
    } finally {
        if (connection) connection.end();
    }
};


// Obtener pago con boletos (muy útil)
pagosController.getPagoDetalle = async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await dbConnection();

        // Pago
        const [pago] = await connection.execute(
            "SELECT * FROM pagos WHERE id_pago = ?",
            [id]
        );

        if (pago.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Pago no encontrado"
            });
        }

        // Boletos asociados
        const [boletos] = await connection.execute(
            "SELECT * FROM boletos WHERE id_pago = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            pago: pago[0],
            boletos
        });

    } catch (error) {
        console.error("Error al obtener detalles del pago:", error);
        return res.status(500).json({
            success: false,
            message: "Error en el servidor"
        });
    } finally {
        if (connection) connection.end();
    }
};

module.exports = pagosController;
