const mongoose = require('mongoose');

const api = require('../middlewares/api');

const Usuario = require('../models/Usuario');

const DestinatarioController =
{
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

                    const usuario = await Usuario.findById(id).populate(
                        'friends',
                        'nombre email imagen'
                    ).lean();

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
    }
}

module.exports = DestinatarioController;
