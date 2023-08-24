global.config = require('./configuration/config');
const app = require('./app');
const {jobCron} = require('./helpers/mongo-helpers/reviews-helper');
jobCron.stop();
// Start the server
const port = config.port || 2200;
var server = require('http').createServer(app);

var io = require('socket.io')(server, { transports: [
        'websocket',
        'xhr-polling',
        'jsonp-polling',
        'polling'
    ] });
var sock_listeners = require('./socket-routes/socket_routes')(io);

server.listen(port);
console.log(`Server listening at ${port}`, `and environment is ${process.env.NODE_ENV}`);
