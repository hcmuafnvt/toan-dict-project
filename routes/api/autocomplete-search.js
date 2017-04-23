var router = require('express').Router(),
    keystone = require('keystone');
    // http = require('http'),
    // zlib = require('zlib');

//  search auto complete word
router.get('/word/:type/:pagesize/:word', keystone.middleware.api, function (req, res) {    
    var regex = new RegExp('^' + req.params.word, 'i');
    var searchFilter = {name : regex};
    var selectedFields = {name: 1, mainType: 1, phoneticSpelling: 1};
    if(req.params.type === 'en-vi') {
        searchFilter.mainViMean = {$exists: true};
        selectedFields.mainViMean = 1;        
    } else if(req.params.type === 'en-en') {
        searchFilter.mainEnMean = {$exists: true};
        selectedFields.mainEnMean = 1; 
    } else if(req.params.type === 'vi-en') {
        //TODO
    }
    
    keystone.list('Word').model.find(searchFilter, selectedFields).sort({name: 1}).limit(req.params.pagesize).exec(function(err, words) {
        if(err) return res.apiError('error', err);               
        res.apiResponse(words);
    });
});

// router.get('/find/:word', keystone.middleware.api, function (req, res) {
//     var options = {
//         host: 'dict.laban.vn',
//         port: 80,
//         path: '/ajax/find?type=1&query=' + req.params.word,
//         method: 'GET',
//         headers: {
//             "Accept": "application/json",
//             "Accept-Encoding": "gzip,deflate,sdch"
//         }
//     };

//     var buffer = [];

//     http.get(options, function (response) {        
//         if (response.statusCode == 404) {
//             res.apiError('error', 'No results found.');
//         } else {
//             var gunzip = zlib.createGunzip();
//             response.pipe(gunzip);

//             gunzip.on('data', function (chunk) {
//                 buffer.push(chunk.toString());
//             })
//                 .on('end', function () {
//                     try {
//                         result = JSON.parse(buffer.join(""));
//                     } catch (exp) {
//                         result = { 'status_code': 500, 'status_text': 'JSON Parse Failed' };
//                     }
//                     res.apiResponse(result);
//                 })
//                 .on('error', function (err) {
//                     res.apiError('error', err);
//                 });
//         }
//     });
// });

module.exports = router;
