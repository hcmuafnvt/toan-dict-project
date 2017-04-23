var router = require('express').Router(),
    keystone = require('keystone');

var translate = require('@google-cloud/translate')({
    projectId: 'elvoca-165315',
    keyFilename: __dirname + '/keys/elvoca-75cd573b84a8.json'
});
   

router.post('/vi', keystone.middleware.api, function (req, res) {
    translate.translate(req.body.text, 'vi', function(err, translation) {
        if (err) return res.apiError({success: false, error: err});
        res.apiResponse({success: true, translated: translation});
    });
});

module.exports = router;
