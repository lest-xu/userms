const express = require('express');
const config = require("./config/default.json");
const app = express();

// logging
require('./startup/logging');

// routes
require('./startup/routes')(app);

// mongodb
require('./startup/db')();


const port = process.env.PORT || config.port;
app.listen(port, () => console.log(`Listening on port ${port}...`));