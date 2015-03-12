var express = require('express');
var bodyParser = require('body-parser');
 
var app = module.exports = express();
 
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');
app.set('views', __dirname);
app.use(express.static(__dirname + '/views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));
 
require('./router.js')(app);
 
app.listen(app.get('port'), function() {
	console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});