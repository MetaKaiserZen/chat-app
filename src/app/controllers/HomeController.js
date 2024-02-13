const mongoose = require('mongoose');

const api = require('../middlewares/api');

const Usuario = require('../models/Usuario');

const HomeController =
{
    listarUsuario: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id } = request.params;

                    if (!mongoose.isValidObjectId(id)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const usuario = await Usuario.findById(id);

                    const friendRequests = usuario.friendRequests;

                    const notInArray = [];

                    notInArray.push(id);
                    notInArray.push(friendRequests);

                    const usuarios = await Usuario.find({ _id: { $nin: notInArray } });

                    response.status(200).json(usuarios);
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    },
    listarDestinatario: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id } = request.params;

                    if (!mongoose.isValidObjectId(id)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const usuario = await Usuario.findById(id);

                    const destinatarios = usuario.friends;

                    response.status(200).json(destinatarios);
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    },
    listarFriendRequest: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id } = request.params;

                    if (!mongoose.isValidObjectId(id)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const usuario = await Usuario.findById(id).populate(
                        'sentFriendRequests',
                        'nombre email imagen'
                    ).lean();

                    const friendRequests = usuario.sentFriendRequests;

                    response.status(200).json(friendRequests);
                }
                catch (error)
                {
                    console.log(error)

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    },
    crearFriendRequest: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id, destinatario } = request.body;

                    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(destinatario)) { return response.status(400).json({ message: 'Bad Request' }); }

                    await Usuario.findByIdAndUpdate(destinatario,
                    {
                        $push: { friendRequests: id }
                    });

                    await Usuario.findByIdAndUpdate(id,
                    {
                        $push: { sentFriendRequests: destinatario }
                    });

                    response.status(201).json({ message: 'Solicitud de amistad enviada exitosamente.' });
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

module.exports = HomeController;
