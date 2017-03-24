var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function (req, res) {
	if(req.user) return res.redirect('/');

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'signup';
	locals.form = req.body;

	function validate(cb) {
		if(!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
			req.flash('error', 'Please enter all input fields.');
			return cb(true);
		}

		return cb();
	}

	function checkUserExist(cb) {
		keystone.list('User').model.findOne({email: req.body.email}, function(err, user) {
			if(err || user) {
				req.flash('error', 'User already exists with that email.');
				return cb(true);
			}
			return cb();
		});
	}

	function createUser(cb) {
		var UserData = {
			name: {
				first: req.body.firstname,
				last: req.body.lastname
			},
			email: req.body.email,
			password: req.body.password
		};

		var User = keystone.list('User').model,
			newUser = new User(UserData);

		newUser.save(function(err) {
			return cb(err);
		});
	}

	function finish(err) {
		if(err) return next();

		var onSuccess = function() {
			res.redirect('/');
		};

		var onFail = function(e) {
			req.flash('error', 'There was a problem signing you up, please try again.');
			return next();
		};

		keystone.session.signin({email: req.body.email, password: req.body.password}, req, res, onSuccess, onFail);
	}

	view.on('post', function(next) {
		async.series([
			validate,
			checkUserExist,
			createUser
		], finish);
	});

	// Render the view
	view.render('auth/signup');
};
