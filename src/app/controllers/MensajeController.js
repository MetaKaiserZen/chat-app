const mongoose = require('mongoose');

const api = require('../middlewares/api');

const Usuario = require('../models/Usuario');
const Mensaje = require('../models/Mensaje');

const MensajeController =
{
    listarDestinatario: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { destinatario } = request.params;

                    if (!mongoose.isValidObjectId(destinatario)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const emisor = await Usuario.findById(destinatario);

                    response.status(200).json(emisor);
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    },
    listarMensaje: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id, destinatario } = request.params;

                    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(destinatario)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const usuario = id;

                    const mensajes = await Mensaje.find(
                    {
                        $or:
                        [
                            { usuario: usuario, destinatario: destinatario },
                            { usuario: destinatario, destinatario: usuario }
                        ]
                    }).populate('usuario', '_id nombre');

                    response.status(200).json(mensajes);
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    },
    crearMensaje: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id, destinatario, mensaje, tipo } = request.body;

                    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(destinatario)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const usuario = id;

                    await new Mensaje(
                    {
                        mensaje,
                        imagen: tipo === 'imagen' ? request.file.filename : null,
                        tipo,
                        usuario,
                        destinatario,
                        created_at: new Date(),
                    }).save();

                    response.status(201).json({ message: 'Mensaje enviado exitosamente.' });
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    },
    eliminarMensaje: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { mensajesArray } = request.body;

                    if (!Array.isArray(mensajesArray) || mensajesArray.length === 0)
                    {
                        return response.status(400).json({ message: 'Bad Request' });
                    }

                    await Mensaje.deleteMany({ _id: { $in: mensajesArray } });

                    response.status(200).json({ message: 'Mensajes eliminados exitosamente.' });
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    }
}

module.exports = MensajeController;
