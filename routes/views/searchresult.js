var keystone = require('keystone'),
    http = require('http'),
    zlib = require('zlib'),    
    Word = keystone.list('Word'),

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'searchresult';    
    locals.word = req.params.word.trim().toLowerCase();
    locals.type = req.params.type;
    locals.data = {
        searchResult: 'No result found.'
    };

    locals.breadcrumb = [
        {level: 1, name: 'Home', link: '/'},
        {level: 2, name: 'Dictionary', link: '/dictionary'},
        {level: 3, name: locals.word, link: '/' + locals.type + '/' + locals.word}
    ];

    view.on('init', function(next) {
        if(locals.word === '') return next();        

        var regex = new RegExp('^' + locals.word + '$', 'i');
        Word.model.findOne({name: regex}, function(err, word) {
            if(err) return next(err);             
            locals.data.searchResult = word;            
            next();
        });
    });

    view.render('searchresult');
};