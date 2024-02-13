const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema(
{
    mensaje: String,
    imagen: String,
    tipo:
    {
        type: String,
        enum: ['texto', 'imagen']
    },
    usuario:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    destinatario:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    created_at:
    {
        type: Date,
        default: Date.now()
    }
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;
