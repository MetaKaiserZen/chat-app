const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema(
{
    nombre:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    imagen:
    {
        type: String,
        required: false
    },
    friends:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ],
    friendRequests:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ],
    sentFriendRequests:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ]
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
