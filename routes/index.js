/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')	
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.all('/signup', routes.views.auth.signup);
	app.all('/signin', routes.views.auth.signin);
	app.get('/signout', routes.views.auth.signout);
	app.get('/libraries', routes.views.libraries);
	app.get('/definition/:type/:word', routes.views.searchresult);
	app.get('/learn', routes.views.learn);
	app.get('/wordcrawler', routes.views.wordcrawler);
	app.get('/lists', routes.views.list.index);
	app.all('/lists/add', routes.views.list.add);

	// api
	app.use('/api/autocomplete', require('./api/autocomplete-search'));
	app.use('/api/translate', require('./api/google-translate'));
	app.use('/api/words', require('./api/word'));
	app.use('/api/lists', require('./api/list'));
	app.use('/api/crawlingvdict', require('./api/wordcrawler.vdict'));
	app.use('/api/crawlingoxford', require('./api/wordcrawler.oxford'));
	app.use('/api/getwordlist', require('./api/word-list'));

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
