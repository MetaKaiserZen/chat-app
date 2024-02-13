const api = require('../middlewares/api');

const Usuario = require('../models/Usuario');

const RegisterController =
{
    register: () =>
    {
        return (
            async (request, response) =>
            {
                try
                {
                    api.credentials(request, response);

                    const { nombre, email, password, imagen } = request.body;

                    if (!nombre || !email || !password) { return response.status(400).json({ message: 'todos los campos son obligatorios.' }); }

                    await new Usuario(
                    {
                        nombre,
                        email,
                        password,
                        imagen
                    }).save();

                    response.status(201).json({ message: 'Usuario registrado exitosamente.' });
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

module.exports = RegisterController;
