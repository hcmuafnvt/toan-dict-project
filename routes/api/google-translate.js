var router = require('express').Router(),
    keystone = require('keystone');

var translate = require('@google-cloud/translate')({
    projectId: 'elvoca-165315',
    keyFilename: __dirname + '/keys/elvoca-75cd573b84a8.json'
    //key: 'AIzaSyDpAs0NtO72cnq630Mznf0u2LKVm7O2YKQ'
});
   

router.post('/en-vi', keystone.middleware.api, function (req, res) {
    console.log(req.body.text);
    translate.translate(req.body.text, 'vi', function(err, translation) {
        if (err) return res.apiError({success: false, error: err});
        res.apiResponse({success: true, translated: translation});
    });
});

module.exports = router;
