const mongoose = require('mongoose');
const express = require('express');
const config = require("./config/default.json");
const users = require('./routes/contacts');
const auth = require('./routes/auth');

const app = express();

const mongoDbUrl = config.db;
///username:password@host:port
mongoose.connect(mongoDbUrl)
    .then(() => console.log('Connected to MongoDB...' + mongoDbUrl))
    .catch(error => console.error('Could not connect to MongoDB', error));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || config.port;
app.listen(port, () => console.log(`Listening on port ${port}...`));