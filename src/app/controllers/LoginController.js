const session = require('../config/session');

const api = require('../middlewares/api');

const Usuario = require('../models/Usuario');

const LoginController =
{
    login: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { email, password } = request.body;

                    if (!email || !password) { return response.status(400).json({ message: 'Email y password son obligatorios.' }); }

                    const usuario = await Usuario.findOne({ email });

                    if (!usuario) { return response.status(404).json({ message: 'Usuario no encontrado.' }); }

                    if (usuario.password !== password) { return response.status(401).json({ message: 'Password no válido.' }); }

                    const token = session.token(usuario._id);

                    response.status(200).json({ message: '¡Bienvenido!', token });
                }
                catch (error)
                {
                    console.log(error);

                    response.status(500).json({ message: 'Internal Server Error' });
                }
            }
        );
    }
}

module.exports = LoginController;
