//this scropt is to get the data on the blockchain by server
//先要到itweb啓動npm start
const request=require('request');
var Web3 = require("web3")
var web3 = new Web3
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
var abi =[{"constant":false,"inputs":[{"name":"state","type":"string"}],"name":"addState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clearDataOfState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPresentState","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_containerID","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"_index","type":"uint256"},{"indexed":false,"name":"_containerState","type":"string"}],"name":"stateUploadEvent","type":"event"}];
var myEvent;
class ServerDB{
    startWatch(req,res,next){
        console.log(JSON.stringify(req.body));
        var address = req.body.idAddress;
        console.log(address);
// contract address
//var address = "0x2c5d50beec247c21813861fa91e88040180e0907";
//get the contract by address
        var sensorContract = web3.eth.contract(abi).at(address);
        //var sensorContract = web3.eth.contract(abi, address);

        myEvent = sensorContract.stateUploadEvent();
        var index = 0;  //the index of transaction
        var account_one = web3.eth.accounts[0];
        var Id = sensorContract.containerID.call();

        res.json({status:"Senser start to watch"});

        myEvent.watch(function(err, result) {  //print index and state
        	let obj = {}; 
            let gps = {};   
        	let str = result.args._containerState;
            let state =  str.split(",");
            //`${obj.mac},${formatted},${obj.gps.lat},${obj.gps.lng},${obj.temperature},${obj.humidity}+data.Id+"','"+data.Contract_Address+"','"+data.Transaction_Hash+`
            obj.mac = state[0];
            obj.timestamp = state[1];
            gps.lat = state[2];
            gps.lng= state[3];
            obj.gps = gps;
            obj.temperature = state[4];
            obj.humidity = state[5];
            obj.info = "NULL";
            obj.Transaction_Hash = result.transactionHash;
            obj.Id = Id;
            obj.Contract_Address = address;

            console.log(obj);
            request.post({url:"http://140.119.163.196:3000/save", form: {data:JSON.stringify(obj)}}, function(err,httpResponse,body){
                console.log(obj);
                console.log(body);
            })
            index = sensorContract.getPresentState.call();
            console.log(`last index:  ${index}`);
        //	console.log(result.args);


        	//new
        });
        return;
    }

    stopWatch(req,res,next){
        myEvent.stopWatching();
        console.log(`Stop watching`);
        res.json({status:"Senser stop watching"});

        return;
    }
}

module.exports = ServerDB;
//將資料分批寫入MySQL
//API write to DB
