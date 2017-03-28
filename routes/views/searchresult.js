var keystone = require('keystone'),
    http = require('http'),
    zlib = require('zlib');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'searchresult';
    locals.word = req.query.word.trim();
    locals.data = {
        searchResult: 'No result found.'
    };

    view.on('init', function(next) {
        if(!req.query.word || locals.word === '') return next();

        var options = {
            host: 'dict.laban.vn',
            port: 80,
            path: '/ajax/find?type=1&query=' + locals.word,
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Accept-Encoding": "gzip,deflate,sdch"
            }
        };

        var buffer = [];

        http.get(options, function (response) {        
            var gunzip = zlib.createGunzip();
            response.pipe(gunzip);

            gunzip.on('data', function (chunk) {
                buffer.push(chunk.toString());
            })
                .on('end', function () {
                    try {
                        result = JSON.parse(buffer.join(""));
                    } catch (exp) {
                        result = { 'status_code': 500, 'status_text': 'JSON Parse Failed' };
                    }                    
                    locals.data.searchResult = result.enViData.best;
                    next();
                })
                .on('error', function (err) {
                    next(err);
                });
        });
    });

    view.render('searchresult');
};