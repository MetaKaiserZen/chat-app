const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');

dotenv.config();

const session =
{
    token: (id) =>
    {
        const payload = { id: id }

        const secretOrPrivateKey = process.env.SECRETORPRIVATEKEY;

        const token = jwt.sign(payload, secretOrPrivateKey, { expiresIn: '1h' });

        return token;
    }
}

module.exports = session;
