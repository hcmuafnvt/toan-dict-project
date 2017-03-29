var router = require('express').Router(),
    keystone = require('keystone'),
    List = keystone.list('List');

// get all lists by user
router.get('/', keystone.middleware.api, function (req, res) {
    List.model.find({createdBy: res.locals.user.id}, function (err, lists) {
        if (err) return res.apiError('database error', err);
        res.apiResponse(lists);
    });
});

module.exports = router;
