'use strict';
/**
 * Require dependences
 */
var express = require('express'),
    ejs = require('ejs'),
    expressLayouts = require('express-ejs-layouts'),
    bodyParser = require('body-parser');

/**
* App config
*/
var app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(expressLayouts);

/**
* Routers
*/
require('./routers')(app);

/**
* start app
*/
function startServer(port) {
   var port = port || app.get('port');
   app.listen(port, '172.20.1.166', function() {
      console.log('Express started on http://localhost:%d; press Ctrl-C to terminate.', port);
   });
}

if (require.main === module) {
   startServer();
} else {
   module.exports = startServer;
}
