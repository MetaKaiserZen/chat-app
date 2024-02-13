const dotenv = require('dotenv');

const database = require('./config/database');

dotenv.config();

database.mongoose(process.env.PORT);
