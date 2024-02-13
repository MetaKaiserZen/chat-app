const express = require('express');

const cors = require('cors');

const router = require('./routes/web');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/public', express.static('public'));

app.use(router);

module.exports = app;
