const SDK_CONTROLLER = require('../controllers/sdk-controller');
const _ = require('lodash');
var geoip = require('geoip-lite');
module.exports = function (io) {
    io.on('connection', function(client) {
        client.on('join', function(data) {
            console.log(data);
            client.emit('messages', 'Hello from server');
        });
        // store signUps
        client.on('store_recent_Data', function (data) {
            const ip = (client.request.headers['x-forwarded-for']) ? (client.request.headers['x-forwarded-for']).split(',')[0] : '127.0. 0.1';
            data['geolocation'] =  geoip.lookup(ip);
            SDK_CONTROLLER.storeDataSocket(data);
        });

        client.on('store_clicks', function (data) {
            const ip = (client.request.headers['x-forwarded-for']) ? (client.request.headers['x-forwarded-for']).split(',')[0] : '127.0. 0.1';
            data['locationData'] = geoip.lookup(ip);
           SDK_CONTROLLER.storeClicksSockets(data)
        });

        client.on('store_goals_achieved', function (data) {
            const ip = (client.request.headers['x-forwarded-for']) ? (client.request.headers['x-forwarded-for']).split(',')[0] : '127.0. 0.1';
            data['locationData'] = geoip.lookup(ip);
            SDK_CONTROLLER.storeGoalCompletionSocket(data)
        });

        client.on('_cavako_store_impressions', function (data) {
            const ip = (client.request.headers['x-forwarded-for']) ? (client.request.headers['x-forwarded-for']).split(',')[0] : '127.0. 0.1';
            data['locationData'] = geoip.lookup(ip);
            SDK_CONTROLLER.storeImpressions(data)
        })

    });
};

