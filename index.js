var server = require('./artificeserver');
var router = require('./router');

server.start(router.route);