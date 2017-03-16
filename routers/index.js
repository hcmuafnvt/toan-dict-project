var http = require('http'),
    zlib = require('zlib');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    //api
    app.get('/api/search/:word', function (req, res) {        
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
            //console.log("\nstatus code: ", res.statusCode);
            if (response.statusCode == 404) {
                res.json({ msg: "No such entry found" });
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
                        res.json(result);
                    })
                    .on('error', function (err) {
                        res.json({ msg: err });
                    });
            }
        });
    });

    app.use(function (req, res) {
        res.end('<h1>404 page</h1>');
    });


};
