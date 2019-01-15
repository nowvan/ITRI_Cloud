const db = require('./connection_db');
let dateTime = require('node-datetime');

class backend{

    getDataById(req, res, next) {
         console.log(req.query);
        // console.log(req.query.timestampstart);
        if(req.query.timestampstart){

                    let sql=`SELECT * FROM container WHERE id = '${req.query.id}' AND timestamp BETWEEN '${req.query.timestampstart}' AND '${req.query.timestampend}' `;
                    db.query(sql,function(err,ressql){
                        if(!err && ressql.length !== 0){
                            console.log("ressql: "+ressql);
                            res.json(ressql);
                        }
                        else if(!err && ressql.length === 0){
                            res.json("ContainerError");
                        }
                        else{
                            console.log(err);
                            res.json(err);
                        }
                    });

        }else{
                console.log(req.query.id);
                    if(req.query.id != undefined && req.query.id != ""){
                        let sql=`SELECT * FROM container WHERE id = '${req.query.id}'`;
                        db.query(sql,function(err,ressql){
                            if(!err){
                                //console.log(ressql);
                                res.json(ressql);
                            }
                        });
                    }
                    else{
                        let sql="SELECT * FROM `container` WHERE 1";
                        db.query(sql,function(err,ressql){
                            if(!err){
                                //console.log(ressql);
                                res.json(ressql);
                            }
                        });
                    }
        }
    }

    // getDataByIdTime(req, res, next) {
    //     // console.log(req.query);
    //     let conn=mysql.createConnection({
    //         host:"127.0.0.1",
    //         user:"pi",
    //         password:"nccutest",
    //         database:"ITRIProject"
    //     });
    //     conn.connect(function(err){
    //
    //         if(!err){
    //             let sql=`SELECT * FROM container WHERE id = '${req.query.id}' AND timestamp BETWEEN '${req.query.timestampstart}' AND '${req.query.timestampend}' `;
    //             conn.query(sql,function(err,ressql){
    //                 if(!err){
    //                     console.log("ressql: "+ressql);
    //                     res.send(JSON.stringify(ressql));
    //
    //                 }
    //                 else{
    //                     console.log(err);
    //                 }
    //                 conn.end();
    //             });
    //         }
    //     });
    // }

    containerlist(req, res, next) {

            console.log(req.query.id);
                let sql=`SELECT * FROM IdMapContract WHERE 1`;
                db.query(sql,function(err,ressql){
                    if(!err){
                        //console.log(ressql);
                        res.json(ressql);
                    }
                    else{
                        res.status(500).json({err:"DBError"});
                    }
                });
    }

    getAddressById(req, res, next) {
        console.log(req.query.id);
        let sql=`SELECT Contract_Address FROM IdMapContract WHERE Id = "${req.query.id}"`;
        db.query(sql,function(err,ressql){
            if(!err){
                console.log(ressql[0]);
                res.json(ressql[0]);
            }
            else{
                res.status(500).json({err:"DBError"});
            }
        });
    }

    save(req,response){

        let data=JSON.parse(req.body.data);

                let sql="";
                if(data.mac != undefined && data.gps != undefined && data.temperature != undefined && data.humidity != undefined && data.info != undefined)
                    sql="INSERT INTO `container`(`pi_mac`, `timestamp` ,`lat`, `lng`, `temperature`, `humidity`,`Id`,`Contract_Address`,`Transaction_Hash`,`info`) VALUES ('"+data.mac+"','"+data.timestamp+"','"+data.gps.lat+"','"+data.gps.lng+"','"+data.temperature+"','"+data.humidity+"','"+data.Id+"','"+data.Contract_Address+"','"+data.Transaction_Hash+"','"+data.info+"')";

                console.log("sql= "+sql);
                db.query(sql,function(err,res){
                    if(err){
                        response.write("false");
                        response.end();
                    }else{
                        response.write('true');
                        response.end();
                    }
                });

    }
	registryDevice(req, res, next){
		let mac=req.body.mac;
		let checkSql=`SELECT * FROM AllDeives WHERE macAddress='${mac}'`;
		let dt = dateTime.create();
		let formatted = dt.format('Y-m-d H:M:S');
		db.query(checkSql,function(err,respond){
                    if(err){
                        res.write("false");
                        res.end();
                    }else{
			    if(respond.length == 0){
				    let insertSql=`INSERT INTO AllDeives(macAddress) VALUES ('${mac}')`;
				    db.query(insertSql,function(err,respond){
					res.write('true');
                        		res.end();    
				    });
			    }else if(respond.length == 1){
				    let updateSql=`UPDATE AllDeives SET Date ='${formatted}' WHERE macAddress = '${mac}'`;
				    db.query(updateSql,function(err,respond){
					res.write('true');
                        		res.end();    
				    });

			    }else{
			 	res.write("false");
                        	res.end();   
			    }
                    }
                });
	}
	getAllDevice(req, res, next){
		let sql=`SELECT * FROM AllDeives`;
		let dt = dateTime.create();
		let formatted = dt.format('Y-m-d H:M:S');
		db.query(sql,function(err,respond){
			if(err){
				res.write("false");
                        	res.end();
			}else{
				let device=[];
				let allDevice=respond;
				for(let i=0 ; i< allDevice.length ; i++){
					let deviceDate = new Date(allDevice[i].Date);
					let serverDate = new Date(formatted);
					console.log(serverDate-deviceDate)
					if(serverDate-deviceDate<120000)
						device.push(allDevice[i].macAddress);
				}
				if(device.length==0)
					res.write("false");
				else
					res.write(JSON.stringify(device));
				
				res.end();
			}	
		});
	}
	searchMission(req, res, next){
		let mac=req.query.mac;
		let sql=`SELECT * FROM InvoiceOfTracker WHERE mac='${mac}' and status='start'`;
		db.query(sql,function(err,respond){
			if(err){
				res.write("false");
                        	res.end();
			}else{
				let obj={};
				if(respond.length==0){
					obj.status="false";
					res.write(JSON.stringify(obj));
					res.end();
				}else{
					obj.status="true";
					let getaddress=`SELECT Contract_Address FROM IdMapContract WHERE Id='${respond[0].id}'`;
					db.query(getaddress,function(err,respond){
						if(err){
							res.write("false");
							res.end();		
						}else{
							obj.Contract_Address=respond[0].Contract_Address;
							res.write(JSON.stringify(obj));
							res.end();
						}
					});
				}
			}
		});
	}
}

module.exports = backend;
