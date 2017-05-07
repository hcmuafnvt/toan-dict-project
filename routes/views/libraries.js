var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function (req, res) {
	//if(!req.user) return res.redirect('/signin');

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'user';
    locals.breadcrumb = [
        {level: 1, name: 'Home', link: '/'},
        {level: 2, name: 'user', link: '/user'}
    ]

	// Render the view
	view.render('user/index');
};
