const dbConnection = require('../config/db.js');
const boletosController = {};


// CRUD Boletos - Crear, Leer, Actualizar, Eliminar
// Crear Boleto
boletosController.createBoleto = async (req, res) => {
    let { id_usuario,id_ruta, id_unidad,feche_compra,codigo_qr, estado } = req.body;
    let query = `INSERT INTO boletos (id_usuario,id_ruta, id_unidad,codigo_qr, estado) VALUES (?,?,?,?,?)`;
    
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [id_usuario,id_ruta, id_unidad,codigo_qr, estado]);

        const data = {
            id: result.insertId,
            id_usuario,
            id_ruta,
            id_unidad,
            codigo_qr,
            estado
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({message: 'No se pudo crear el boleto'});
        }
        res.status(201).json({
            success: true,
            data: data,
            message: 'Boleto creado exitosamente'
        });
    } catch (error) {
        console.error('Error en la creación de boleto: ',error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Mostrar todos los Boletos
boletosController.getBoletos = async (req, res) => {
    let query = 'SELECT * FROM boletos';
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query);
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
boletosController.validateBoletoById = async (req, res) => {
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

// Actualizar detalles de Boleto  - Esto queda a criterio de la implementación pues no todos los campos pueden ser actualizables
boletosController.updateBoleto = async (req, res) => {
    const { id } = req.params;
    res.send(`Boleto con ID: ${id} actualizado`);
}

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