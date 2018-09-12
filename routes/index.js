const express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { id: req.query.id });
});


router.get('/searchbyidtime', function(req, res, next) {

    console.log(req.query)
    res.render('searchbyidtime', { id: req.query.id,
        timeinterval: req.query.timeinterval });
});

router.get('/registerid', function(req, res, next) {

    res.render('registerid', { });
});


router.get('/manager',function(req, res , next){

    res.render('manager',{   });

});



module.exports = router;
