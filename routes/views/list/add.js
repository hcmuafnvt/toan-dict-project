var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'addlist';
	locals.form = req.body;

	function validate(cb) {
		if(!req.body.title || !req.body.description) {
			req.flash('error', 'Please enter all input fields.');
			return cb(true);
		}

		return cb();
	}

	function checkListExist(cb) {
        var regex = new RegExp(["^", req.body.title, "$"].join(""), "i");
		keystone.list('List').model.findOne({title: regex}, function(err, list) {
			if(err || list) {
				req.flash('error', 'List already exists with that title.');
				return cb(true);
			}
			return cb();
		});
	}

	function createList(cb) {
		var listData = {
			title: req.body.title,
            description: req.body.description,
            createdBy: res.locals.user.id
		};

		var List = keystone.list('List').model,
			newList = new List(listData);

		newList.save(function(err) {
			return cb(err);
		});
	}

	function finish(err) {
		if(err) return next();
		res.redirect('/lists');
	}

	view.on('post', function(next) {
		async.series([
			validate,
			checkListExist,
			createList
		], finish);
	});

	// Render the view
	view.render('list/add');
};
