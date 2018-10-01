//web3 version 0.20.6
//部署后先輸入 sensor.address確認合約地址並更改合約地址
//this is one IoTDevice

const serial = require('serialport');
const sensor= require("node-dht-sensor");
const request=require('request');
const fs=require('fs');

//the code for blockchain
var Web3 = require("web3")
var web3 = new Web3
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
var abi =[{"constant":false,"inputs":[{"name":"state","type":"string"}],"name":"addState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerID","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clearDataOfState","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"containerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPresentState","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_containerID","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_address","type":"address"},{"indexed":false,"name":"_index","type":"uint256"},{"indexed":false,"name":"_containerState","type":"string"}],"name":"stateUploadEvent","type":"event"}];


var index = 0;  //the index of transaction
var state = ""; //the content send from the IoT device
var account_one = web3.eth.accounts[0];
var unlockAccount = web3.personal.unlockAccount(account_one,"nccutest",999999999);
var clearInterval_id;
var myEvent;
var portTest;

console.log(`account_one: ${account_one} `)
console.log(`unlockAccount: ${unlockAccount} `)
//add address manually
//function 
// get device start
// change the address of the device
// contract address
//url used idAddress
class GetSensor{
	start(req,res,next){

		// let data=JSON.parse(req.body.data);
		// console.log(data);
		console.log(req.body);
		var address = req.body.idAddress;
		console.log(address)

		//get the contract by address
		var sensorContract = web3.eth.contract(abi).at(address);
		//var sensorContract = web3.eth.contract(abi, address);
		myEvent = sensorContract.stateUploadEvent();
		let count =0 ;

		myEvent.watch(function(err, result) {  //print index and state
			console.log(result.args);
			// res.write(JSON.stringify(result.args));
			//new
		});

		main(req,res,address,sensorContract);
		res.send(JSON.stringify({status:"start"}));
		return;

		}

	stop(req,res,next){
        myEvent.stopWatching();
        clearInterval(clearInterval_id);
        portTest.close();
        console.log(`clearInterval and stop watching`);
		res.send(JSON.stringify({status:"stop"}));
        return;
    }
}


//for IoT
function main(req,res,address,sensorContract){
	let obj={};
	obj.address = address;

	let port = new serial('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_D-if00-port0',{
		 baudRate: 4800
	});
	portTest = port;
	let buf="";
	port.on('data',function(data){
		if(data=='$'){
		
			if(buf.includes("$GPGGA")){
				let str;
				let gps={};
				str=buf.split(',');
				gps.lat=parseFloat(str[2])/100;
				gps.lng=parseFloat(str[4])/100;
				obj.gps=gps;
			}
			buf="";
		}

		buf += data.toString('ascii');
	
		
	});
	//3 second for a loop to send the gps state
	clearInterval_id = setInterval(function(){
		try{
			let str;
			let aaa;
			var dateTime = require('node-datetime');
			var dt = dateTime.create();
			var formatted = dt.format('Y-m-d H:M:S');
			require('getmac').getMac({iface: 'wlan0'}, function(err, macAddress){
				obj.mac=macAddress;
			});

			sensor.read(11, 21, function(err, temperature, humidity){
				obj.temperature=temperature;
				obj.humidity=humidity;
			});
			if(obj.temperature!==undefined && obj.gps!==undefined){
				//can uploate the str varible
				str=obj.mac+","+formatted+","+obj.temperature+","+obj.humidity+","+obj.gps.lat+","+obj.gps.lng+","+"test\n"; 
				obj.info="NULL";
				console.log(str); 
				fs.appendFile('sensorDate.csv', str, function (err) {
					if (err) throw err;
						 console.log('Log Saved!');
				});
	            
	          //  aaa = `${obj.mac}_${formatted}`
		    //send transaction to the blockchain
			var txhash = sensorContract.addState(`${obj.mac},${formatted},${obj.gps.lat},${obj.gps.lng},${obj.temperature},${obj.humidity}`, {from:account_one, gas:4300000});                                          
			console.log(`hash: ${txhash}`);
			// res.write(`hash: ${txhash}`);
			}
		}
		catch (e) {
       //promise.reject(e);
        console.error(e);
	    }
    },5000);
}


module.exports = GetSensor;