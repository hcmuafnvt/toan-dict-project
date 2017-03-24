var router = require('express').Router(),
    keystone = require('keystone'),
    http = require('http'),
    zlib = require('zlib');

//  search auto complete word
router.get('/autocomplete/:word', keystone.middleware.api, function (req, res) {
    var options = {
        host: 'dict.laban.vn',
        port: 80,
        path: '/ajax/autocomplete?type=1&site=dictionary&query=' + req.params.word,
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip,deflate,sdch"
        }
    };

    var buffer = [];

    http.get(options, function (response) {
        if (response.statusCode == 404) {
            res.apiError('error', 'No results found.');
        } else {
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
                    res.apiResponse(result);
                })
                .on('error', function (err) {
                    res.apiError('error', err);
                });
        }
    });
});

router.get('/find/:word', keystone.middleware.api, function (req, res) {
    var options = {
        host: 'dict.laban.vn',
        port: 80,
        path: '/ajax/find?type=1&query=' + req.params.word,
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip,deflate,sdch"
        }
    };

    var buffer = [];

    http.get(options, function (response) {        
        if (response.statusCode == 404) {
            res.apiError('error', 'No results found.');
        } else {
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
                    res.apiResponse(result);
                })
                .on('error', function (err) {
                    res.apiError('error', err);
                });
        }
    });
});

module.exports = router;
