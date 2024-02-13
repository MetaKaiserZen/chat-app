const mongoose = require('mongoose');

const api = require('../middlewares/api');

const Usuario = require('../models/Usuario');

const FriendRequestController =
{
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
                        'friendRequests',
                        'nombre email imagen'
                    ).lean();

                    const friendRequests = usuario.friendRequests;

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
    aceptarFriendRequest: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { id, destinatario } = request.body;

                    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(destinatario)) { return response.status(400).json({ message: 'Bad Request' }); }

                    const usuario = await Usuario.findById(id);
                    const emisor = await Usuario.findById(destinatario);

                    usuario.friends.push(destinatario);
                    emisor.friends.push(id);

                    usuario.friendRequests = usuario.friendRequests.filter((request) =>
                    {
                        request.toString() !== id.toString();
                    });

                    emisor.sentFriendRequests = emisor.sentFriendRequests.filter((request) =>
                    {
                        request.toString() !== destinatario.toString();
                    });

                    await usuario.save();
                    await emisor.save();

                    response.status(201).json({ message: 'Solicitud de amistad aceptada exitosamente.' });
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

module.exports = FriendRequestController;
