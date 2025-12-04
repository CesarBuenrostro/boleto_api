const dbConnection = require('../config/db.js');
const unidadesController = require('./unidades.controller.js');

const rutasController = {};
// CRUD Rutas - Crear, leer, Actualizar, Eliminar
// Crear Ruta
rutasController.createRuta = async (req, res) => {
    let { nombre, origen, destino, hora_salida, hora_llegada, estado, precio } = req.body;
    //validaciones básicas
    if (!nombre || !origen || !destino || !hora_salida || !hora_llegada || !estado || !precio) {
        return res.status(400).json({message: 'Faltan datos obligatorios'});
    }

    let query = `INSERT INTO rutas (nombre, origen, destino, hora_salida, hora_llegada, estado, precio) VALUES (?,?,?,?,?,?, ?)`;
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [nombre, origen, destino, hora_salida, hora_llegada, estado, precio]);
        const data = {
            id: result.insertId,
            nombre,
            origen,
            destino,
            hora_salida,
            hora_llegada,
            estado,
            precio
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({message: 'No se pudo crear la ruta'});
        }
        res.status(201).json({
            success: true,
            data: data,
            message: 'Ruta creada exitosamente'
        });
    } catch (error) {
        console.error('Error en la creación de ruta: ',error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }

};

// Mostrar Rutas
rutasController.getRuta = async (req, res) => {
    let query = 'SELECT * FROM rutas';
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.query(query);
        if (result.length === 0) {
            res.status(200).json({
                success: false,
                message: 'No hay rutas para mostrar'
            });
        } else {
            res.status(200).json({
                success: true,
                data: result,
                message: 'Rutas obtenidas exitosamente'
            });
        }
    } catch (error) {
        console.log('error al obtener rutas', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

// Actualizar Ruta
rutasController.updateRuta = async (req, res) => {
    const { id } = req.params;
    const { nombre, origen, destino, hora_salida, hora_llegada, estado }  = req.body;

    let query = 'UPDATE rutas SET nombre = ?, origen = ?, destino = ?, hora_salida = ?, hora_llegada = ?, estado = ? WHERE id_ruta = ?';
    let connection;

    try {
        connection = await dbConnection();

        const [result] = await connection.query(query, [nombre, origen, destino, hora_salida, hora_llegada, estado, id]);
        if (result.affectedRows === 0) {
            res.status(400).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        } else {
            res.status(200).json({
                succes: true,
                // data: data,
                message: 'Rutas actualizada exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al actualizar ruta', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
};

// Eliminar Ruta
rutasController.deleteRuta = async (req, res) => {
    let { id } = req.params;
    let query = `DELETE FROM rutas WHERE id_ruta = ?`;
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [id]);
        if (result.affectedRows === 0) {
            res.status(400).json({
                success: false,
                message: 'Ruta no encontrada'
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Ruta eliminada exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al eliminar ruta', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

module.exports = rutasController;