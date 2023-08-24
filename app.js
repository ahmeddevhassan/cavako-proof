const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressIp = require('express-ip');
const fingerPrint = require('express-fingerprint');
const gifObj = require('./models/gif-funnel-model');


// database connection
mongoose.connect(global.config.db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log(`Connection Successful on ${global.config.db}`);
    } else {
        console.log('Connection not successful', err);
    }
});

const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressIp().getIpInfoMiddleware);
app.use(fingerPrint({
    parameters: [
        // Defaults
        fingerPrint.useragent,
        fingerPrint.acceptHeaders,
        fingerPrint.geoip
    ]
}));
app.use(function corsHandler(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //config.applicationUrl
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Routes
app.use('/proof', require('./routes/proof-routes'));
/*app.use('/goals', require('./routes/goal-routes'));*/

module.exports = app;

