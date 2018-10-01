const express = require('express');
var router = express.Router();

//new adding 20180917
const CreateNew = require('../models/createNewcontainer');
const ServerDB = require('../models/server_DB');
const Backend = require('../models/backend')

let createNew = new CreateNew();
let serverDB = new ServerDB();
let backend = new Backend();

//router for eth
router.post('/CreateNew',createNew.create);
router.post('/startWatch',serverDB.startWatch);
router.post('/stopWatch',serverDB.stopWatch)
router.get('/getDataById',backend.getDataById);
router.get('/getDataByIdTime',backend.getDataByIdTime);
router.post('/save',backend.save);
router.get('/containerlist',backend.containerlist);

//router for web
router.get('/',function(req, res , next){
    res.render('manager',{  });
});

router.get('/searchbyid', function(req, res, next) {
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


module.exports = router;
