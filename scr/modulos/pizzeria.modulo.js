const mongoose = require('mongoose') // importamos mongoose

const usuariosSchema = new mongoose.Schema(
    {
       nombre: String,
       direccion: String,
       horario: String,
       cargo: String
    }
)

module.exports = mongoose.model('usuarios', usuariosSchema)