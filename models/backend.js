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
		let obj={};
		db.query(sql,function(err,respond){
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
                        	res.end();
			}else{
				let device=[];
				let allDevice=respond;
				obj.status="true";
				for(let i=0 ; i< allDevice.length ; i++){
					let deviceDate = new Date(allDevice[i].Date);
					let serverDate = new Date(formatted);
					if(serverDate-deviceDate<120000)
						device.push(allDevice[i].macAddress+`#${allDevice[i].status}`);
				}
				if(device.length==0){
					obj.status="false";
					res.write(JSON.stringify(obj));
				}else{
					obj.allDevice=device;
					res.write(JSON.stringify(obj));
				}
				res.end();
			}	
		});
	}
	searchMission(req, res, next){
		let mac=req.query.mac;
		let sql=`SELECT * FROM InvoiceOfTracker WHERE mac='${mac}' and status='start'`;
		db.query(sql,function(err,respond){
			let obj={};
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
                        	res.end();
			}else{
				if(respond.length==0){
					obj.status="false";
					res.write(JSON.stringify(obj));
					res.end();
				}else{
					obj.status="true";
					let getaddress=`SELECT Contract_Address FROM IdMapContract WHERE Id='${respond[0].id}'`;
					db.query(getaddress,function(err,respond){
						if(err){
							obj.status="false";
							res.write(JSON.stringify(obj));
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
	startContainer(req, res, next){
		let address = req.body.idAddress;
		let mac= req.body.mac;
		let searchId=`SELECT * FROM IdMapContract WHERE Contract_Address="${address}"`;
		let obj={};
		db.query(searchId,function(err,respond){
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
                        	res.end();
			}else{
				if(respond.length==0){
					obj.status="false";
					res.write(JSON.stringify(obj));
					res.end();
				}else{
					obj.status="true";
					let Id=respond[0].Id;
					let checkSql=`SELECT mac, id, status FROM InvoiceOfTracker WHERE mac='${mac}' and id ='${Id}'`;
					console.log(checkSql)
					db.query(checkSql,function(err,respond){
						if(err){
							obj.status="false";
							res.write(JSON.stringify(obj));
							res.end();		
						}else{
							let promise=new Promise(function(resolve){		
								let checkDevice=`SELECT * FROM AllDeives WHERE macAddress = '${mac}'`;
								console.log(checkDevice);
								db.query(checkDevice,function(err,respond){
									if(err)
										resolve({flag:false});
									else{
										let flag="true";
										if(respond.length==0){
											resolve({flag:false});
										}else{
											if(respond[0].status==null || respond[0].status=="null")
												resolve({flag:true});
											else
												resolve({flag:false});
										
										}
									}
									
								});
							});
							promise.then(function(full){
								if(full.flag==true){
									if(respond.length == 0){
										let insertStartCmd=`INSERT INTO InvoiceOfTracker (mac, id, status) VALUES ('${mac}','${Id}','start')`;
										db.query(insertStartCmd,function(err,respond){});
									}else{
										let update=`UPDATE InvoiceOfTracker SET status='start' WHERE id='${Id}'`;
										db.query(update,function(err,respond){});
									}
								}else{
									obj.status="false";	
								}
								res.write(JSON.stringify(obj));
								res.end();
							});
							
						}
					});
				}
			}
		});
	}
	stopContainer(req, res, next){
		let address = req.body.idAddress;
		let mac= req.body.mac;
		let searchId=`SELECT * FROM IdMapContract WHERE Contract_Address="${address}"`;
		let obj={};
		db.query(searchId,function(err,respond){
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
                        	res.end();
			}else{
				if(respond.length==0){
					obj.status="false";
					res.write(JSON.stringify(obj));
					res.end();
				}else{
					obj.status="true";
					let Id=respond[0].Id;
					let checkSql=`SELECT mac, id, status FROM InvoiceOfTracker WHERE mac='${mac}' and id ='${Id}'`;
					console.log(checkSql)
					db.query(checkSql,function(err,respond){
						if(err){
							obj.status="false";
							res.write(JSON.stringify(obj));
							res.end();		
						}else{
							if(respond.length == 0){
								let insertStartCmd=`INSERT INTO InvoiceOfTracker (mac, id, status) VALUES ('${mac}','${Id}','stop')`;
								db.query(insertStartCmd,function(err,respond){});
							}else{
								let update=`UPDATE InvoiceOfTracker SET status='stop' WHERE id='${Id}'`;
								db.query(update,function(err,respond){});
							}
							res.write(JSON.stringify(obj));
							res.end();
						}
					});
				}
			}
		});
	}
	resetDevice(req, res, next){
		let mac= req.body.mac;	
		let updateDevice=`UPDATE AllDeives SET status='null' WHERE macAddress='${mac}'`;
		console.log(updateDevice);
		let allInvoce=`SELECT * FROM InvoiceOfTracker WHERE mac ='${mac}'`;
		console.log(allInvoce);
		db.query(updateDevice,function(err,respond){
			let obj={};
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
				res.end();	
			}else{
				obj.status="true";
				db.query(allInvoce,function(err,respond){
					if(err){
						obj.status="false";
						res.write(JSON.stringify(obj));
						res.end();
					}else{
						for(let i = 0 ; i<respond.length ; i++){
							let updateInvoce=`UPDATE InvoiceOfTracker SET status='stop' WHERE index_invoice= ${respond[i].index_invoice}`;
							console.log(updateInvoce)
							db.query(updateInvoce,function(err,respond){
								if(err)
									obj.status="false";
							});
						}
						res.write(JSON.stringify(obj));
						res.end();
					}	
				});	
			}
		});

	}
	startMission(req, res, next){
		let mac= req.query.mac;
		let allmission=`SELECT * FROM IdMapContract WHERE (SELECT id FROM InvoiceOfTracker WHERE mac='${mac}' and status='start')=Id`;
		let obj={};
		db.query(allmission,function(err,respond){
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
				res.end();
			}else{
				obj.status="true";
				obj.missions=[];
				for(let i =0 ; i<respond.length ; i++){
					let mission={};
					mission.Contract_Address=respond[i].Contract_Address;
					obj.missions.push(mission);
				}
				res.write(JSON.stringify(obj));
				res.end();
			}	
		});
	}
	startDevice(req, res, next){
		let mac=req.body.mac;
		let Contract_Address=req.body.Contract_Address;
		let getContainerId=`SELECT Id FROM IdMapContract WHERE Contract_Address = '${Contract_Address}'`
		console.log(getContainerId);	
		let obj={};
		db.query(getContainerId,function(err,respond){
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
				res.end();
			}else{
				obj.status="true";
				let updateDevice=`UPDATE AllDeives SET status='${respond[0].Id}' WHERE macAddress='${mac}'`;
				console.log(updateDevice)
				db.query(updateDevice,function(err,respond){
					if(err){
						obj.status="false";
					}else{
						res.write(JSON.stringify(obj));
						res.end();	
					}
				});
			}
		});
		
	}
	stopDevice(req, res, next){
		let mac=req.body.mac;
		let Contract_Address=req.body.Contract_Address;
		let updateDevice=`UPDATE AllDeives SET status='null' WHERE macAddress='${mac}'`;
		let obj={};
		db.query(updateDevice,function(err,respond){
			if(err){
				obj.status="false";
				res.write(JSON.stringify(obj));
				res.end();
			}else{
				obj.status="true";
				res.write(JSON.stringify(obj));
				res.end();	
			}
		});
	}
}

module.exports = backend;
