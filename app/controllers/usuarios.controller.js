const dbConnection = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// agregar un controlaor para que un admin pueda cambiar los permisos de usuario, para eliminar la seleccion de tipo al momento de registro
// agregar saldo de usuario en la aplicación


const usuariosController = {};

// CRUD Usuarios - Crear, Leer, Actualizar, Eliminar
// Crear Usuario
usuariosController.createUsuario = async (req, res) => {
    let { nombre, correo, contrasena, rol, matricula } = req.body;

    //validaciones básicas
    if (!nombre || !correo || !contrasena || !rol || !matricula) {
        return res.status(400).json({message: 'Faltan datos obligatorios'});
    }

    // validadr longitud mínima de la contraseña
    if (contrasena.length < 8) {
        return res.status(400).json({message: 'La contraseña debe tener al menos 8 caracteres'});
    }

    // Normalizar correo a minúsculas
    correo = correo.trim().toLowerCase();

    // salt y hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    contrasena =  await bcrypt.hash(contrasena, salt);

    let query = `INSERT INTO usuarios (nombre, correo, contrasena, rol, matricula) VALUES (?,?,?,?,?)`;
    let connection;

    try {
        connection = await dbConnection();
        const [result] = await connection.query(query   , [nombre, correo, contrasena, rol, matricula]);
        const data = {
            id: result.insertId,
            nombre,
            correo,
            contrasena,
            rol,
            matricula
        }
        if (result.affectedRows === 0) {
            return res.status(400).json({message: 'No se pudo crear el usuario'});
        }
        res.status(201).json({
            success: true,
            data: data,
            message: 'Usuario creado exitosamente'
        });
    } catch (error) {
        console.error('Error en la creación de usuario: ',error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Mostrar todos los Usuarios
usuariosController.getUsuarios = async (req, res) => {
    let query = 'SELECT * FROM usuarios';
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query);
        if (result.length === 0) {
            res.status(200).json({
                success: false,
                message: 'No hay usuarios disponibles'
            });
        } else {
            res.status(200).json({
                success: true,
                data: result,
                message: 'Usuarios obtenidos exitosamente'
            });
        }
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }

};

// Obtener usuario por ID
usuariosController.getUsuarioById = async (req, res) => {
    const {id} = req.params;
    let query = 'SELECT * FROM usuarios WHERE id_usuario = ?'
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Usuario no encontrado"});
        };
        res.status(200).json({
            success: "true",
            message: "Usuario obtenido correctamente",
            data: result
        });
    } catch (error) {
        console.error('Error al obtener usuario: ', error);
        res.status(500).json({message: "Error en el servidor"})
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Obtener Saldo usuario por ID
usuariosController.getUsuarioSaldoById = async (req, res) => {
    const {id} = req.params;
    let query = 'SELECT saldo FROM usuarios WHERE id_usuario = ?'
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Usuario no encontrado"});
        };
        console.log(result);
        res.status(200).json({
            success: "true",
            message: "Usuario obtenido correctamente",
            data: result
        });
    } catch (error) {
        console.error('Error al obtener usuario: ', error);
        res.status(500).json({message: "Error en el servidor"})
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Actualizar Usuario - hace falta implementar encriptación de contraseña si se actualiza
usuariosController.updateUsuario = async (req, res) => {
    const { id } = req.params;
    let { nombre, correo, contrasena, rol, saldo, matricula } = req.body;

    try {
        // Encriptar contraseña si viene en la petición
        if (contrasena) {
            const salt = await bcrypt.genSalt(10);
            contrasena = await bcrypt.hash(contrasena, salt);
        }

        // Crear lista dinámica de campos a actualizar
        const campos = [];
        const valores = [];

        const posiblesCampos = { nombre, correo, contrasena, rol, saldo, matricula };

        for (const campo in posiblesCampos) {
            if (posiblesCampos[campo] !== undefined) {
                campos.push(`${campo} = ?`);
                valores.push(posiblesCampos[campo]);
            }
        }

        if (campos.length === 0) {
            return res.status(400).json({ message: 'No se enviaron datos para actualizar' });
        }

        const query = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`;
        valores.push(id);

        const connection = await dbConnection();
        const [result] = await connection.query(query, valores);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente'
        });

    } catch (error) {
        console.error('Error al actualizar usuario: ', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Eliminar Usuario
usuariosController.deleteUsuario = async (req, res) => {
    const { id } = req.params;
    let query = `DELETE FROM usuarios WHERE id_usuario = ?`;
    let connection;
    try {
        connection = await dbConnection();
        const [result] = await connection.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar el usuario: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

// Login de Usuario
usuariosController.loginUsuario = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Validaciones básicas
        if (!correo || !contrasena) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        const connection = await dbConnection();
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo.trim().toLowerCase()]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const usuario = rows[0];

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        // Generar token JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            success: true,
            token: token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
                // AGREGAR MATRICULA

            },
            rol: usuario.rol,
            message: 'Login exitoso'
        });
    } catch (error) {
        console.error('Error en el login del usuario: ', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}


module.exports = usuariosController;