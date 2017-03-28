var keystone = require('keystone');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'viewlists';    
    locals.data = {
        lists: 'No result found.'
    };

    view.on('init', function(next) {
        var q = keystone.list('List').model.find();
        q.exec(function(err, results) {
            locals.data.lists = results;
            next(err);
        });
    });

    view.render('list/index');
};