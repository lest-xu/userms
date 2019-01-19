require('express-async-errors');
const error = require('./middleware/error');
const mongoose = require('mongoose');
const express = require('express');
const config = require("./config/default.json");
const users = require('./routes/contacts');
const addresses = require('./routes/address');
const hr = require('./routes/hr');
const departments = require('./routes/department');
const roles = require('./routes/role');
const apps = require('./routes/app');
const auth = require('./routes/auth');

const app = express();

const mongoDbUrl = config.db;

///username:password@host:port
mongoose.connect(mongoDbUrl)
    .then(() => console.log('Connected to MongoDB...' + mongoDbUrl))
    .catch(error => console.error('Could not connect to MongoDB', error));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/addresses', addresses);
app.use('/api/hr', hr);
app.use('/api/departments', departments);
app.use('/api/roles', roles);
app.use('/api/apps', apps);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || config.port;
app.listen(port, () => console.log(`Listening on port ${port}...`));