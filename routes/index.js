const express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: '' });
});

router.get('/searchbyidtime', function(req, res, next) {

    console.log(req.query)
    res.render('searchbyidtime', { id: req.query.id,
        timeinterval: req.query.timeinterval });
});



module.exports = router;
