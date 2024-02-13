const dotenv = require('dotenv');

dotenv.config();

const api =
{
    credentials: (request, response) =>
    {
        const apiKey = request.headers['api-key'];
        const apiSecret = request.headers['api-secret'];

        if (apiKey != process.env.API_KEY || apiSecret != process.env.API_SECRET) { return response.status(401).json({ message: 'Unauthorized' }); }
    }
}

module.exports = api;
