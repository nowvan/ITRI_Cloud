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
router.put('/startWatch',serverDB.startWatch);
router.put('/stopWatch',serverDB.stopWatch)
router.get('/api/container/data',backend.getDataById);
router.post('/save',backend.save);
router.get('/api/containerlist',backend.containerlist);
router.get('/api/container',backend.getAddressById );

// router for device

router.post('/registerDevice',backend.registryDevice);
router.get('/getAllDevice',backend.getAllDevice);
router.get('/getAllMission',backend.searchMission);
router.post('/startContainer',backend.startContainer);
router.post('/stopContainer',backend.stopContainer);
router.get('/startMission',backend.startMission);
router.put('/resetDevice',backend.resetDevice);
router.put('/startDevice',backend.startDevice);
router.put('/stopDevice',backend.stopDevice);

//router for web

router.get('/',function(req, res , next){
    res.render('manager',{  });
});

router.get('/manager',function(req, res , next){
    res.render('manager',{  });
});

router.get('/container', function(req, res, next) {
    console.log(req.query);

    if(req.query.timeinterval){
        res.render('searchbyidtime', { id: req.query.id,
            timeinterval: req.query.timeinterval });
    }
    else{
        res.render('index', { id: req.query.id });
    }
});

router.get('/registerid', function(req, res, next) {
    res.render('registerid', { });
});




module.exports = router;
