const express = require('express')
const router = express.Router()
const Usuario = require('../modulos/pizzeria.modulo')

//Middleware para obtener el usuario por ID
const getUsuarioById = async(req, res, next) => {
    let usuario;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {   
        return res.status(400).json({ message: 'ID inválido' });
    }
    //if (!mongoose.isValidObjectId(id)) {
    //    return res.status(400).json({ message: 'ID inválido' });
    //}

    try {
        usuario = await Usuario.findById(id)
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.usuario = usuario
    next()
}

// Obtener todos los usuarios
router.get('/', async(req, res) => {
    try {
        const usuarios = await Usuario.find()
        console.log("Todos los usuarios: ", usuarios)
        if (!usuarios) {
            return res.status(204).json({ message: 'No hay usuarios' });
        } 
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Crear un nuevo usuario
router.post('/', async(req, res) => {
    const { nombre, direccion, horario, cargo } = req.body
    if (!nombre || !direccion || !horario || !cargo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }
    const nuevoUsuario = new Usuario({
        nombre,
        direccion,
        horario,
        cargo
    })
    try {
        const savedUsuario = await nuevoUsuario.save();
        console.log("Nuevo usuario creado: ", savedUsuario)
        res.status(201).json(savedUsuario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Obtener un usuario por ID
router.get('/:id', getUsuarioById, (req, res) => {
    res.json(res.usuario)
})

router.put('/:id', getUsuarioById, async(req, res) => {
    try {
        const usuario = res.usuario
        usuario.nombre = req.body.nombre || usuario.nombre
        usuario.direccion = req.body.direccion || usuario.direccion
        usuario.horario = req.body.horario || usuario.horario
        usuario.cargo = req.body.cargo || usuario.cargo
        const updatedUsuario = await usuario.save()
        res.json(updatedUsuario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})

router.patch('/:id', getUsuarioById, async(req, res) => {
    if (!req.body.nombre && !req.body.direccion && !req.body.horario && !req.body.cargo) {
        return res.status(400).json({ message: 'No hay campos para actualizar' })
    }
    try {
        const usuario = res.usuario
        usuario.nombre = req.body.nombre || usuario.nombre
        usuario.direccion = req.body.direccion || usuario.direccion
        usuario.horario = req.body.horario || usuario.horario
        usuario.cargo = req.body.cargo || usuario.cargo
        const updatedUsuario = await usuario.save()
        res.json(updatedUsuario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id', getUsuarioById, async(req, res) => {
    try {
        const usuario = res.usuario
        await usuario.deleteOne({
            _id: usuario._id
        })
        res.json({ message: `Usuario ${usuario.nombre} eliminado` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router