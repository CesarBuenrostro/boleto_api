const dbConnection = require('../config/db.js')

const unidadesController = {};

// CRUD unidades - Crear, leer, Actualizar, Eliminar
// Crear Unidad
unidadesController.createUnidad = async (req, res) => {
    let { placa, capacidad, id_chofer, estado } = req.body;
    //validaciones básicas
    if (!placa || !capacidad || !id_chofer || !estado) {
        return res.status(400).json({message: 'Faltan datos obligatorios'});
    }
    let query = `INSERT INTO unidades (placa, capacidad, id_chofer, estado) VALUES (?,?,?,?)`;
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [placa, capacidad, id_chofer, estado]);
        const data = {
            id: result.insertId,
            placa,
            capacidad,
            id_chofer,
            estado
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({message: 'No se pudo crear la unidad'});
        }
        res.status(201).json({
            success: true,
            data: data,
            message: 'Unidad creada exitosamente'
        });
    } catch (error) {
        console.error('Error en la creación de unidad: ',error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

//Mostrar todas las Unidades
unidadesController.getUnidades = async (req, res) => {
    let query = `SELECT * FROM unidades`;
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query);
        if (result.length === 0) {
            res.status(200).json({
                success: false,
                message: 'No hay unidades disponibles'
            });
        } else {
            res.status(200).json({
                success: true,
                data: result,
                message: 'Unidades obtenidas exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al obtener las unidades: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Actualizar Unidad
unidadesController.updateUnidad = async (req, res) => {
    let { id } = req.params;
    let { placa, capacidad, id_chofer, estado } = req.body;
    if (!placa || !capacidad || !id_chofer || !estado) {
        return res.status(400).json({message: 'Faltan datos obligatorios'});
    }
    let query = `UPDATE unidades SET placa = ?, capacidad = ?, id_chofer = ?, estado = ? WHERE id_unidad = ?`;
    let connection;
    
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [placa, capacidad, id_chofer, estado, id]);
        if (result.affectedRows === 0) {
            return res.status(400).json({message: 'No se pudo actualizar la unidad'});
        }
        res.status(200).json({
            success: true,
            message: 'Unidad actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar la unidad: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Eliminar Unidad
unidadesController.deleteUnidad = async (req, res) => {
    let { id } = req.params;
    let query = `DELETE FROM unidades WHERE id_unidad = ?`;
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(400).json({
                success: false,
                message: 'Unidad no encontrada'    
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Unidad eliminada exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al eliminar la unidad: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

module.exports = unidadesController;