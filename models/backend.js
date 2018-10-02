const mysql=require('mysql');


class backend{

    getDataById(req, res, next) {
         console.log(req.query);
        let conn=mysql.createConnection({
            host:"127.0.0.1",
            user:"pi",
            password:"nccutest",
            database:"ITRIProject"
        });
        // console.log(req.query.timestampstart);
        if(req.query.timestampstart){
            conn.connect(function(err){

                if(!err){
                    let sql=`SELECT * FROM container WHERE id = '${req.query.id}' AND timestamp BETWEEN '${req.query.timestampstart}' AND '${req.query.timestampend}' `;
                    conn.query(sql,function(err,ressql){
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
                        conn.end();
                    });
                }
            });
        }else{
            conn.connect(function(err){
                console.log(req.query.id);
                if(!err){
                    if(req.query.id != undefined && req.query.id != ""){
                        let sql=`SELECT * FROM container WHERE id = '${req.query.id}'`;
                        conn.query(sql,function(err,ressql){
                            if(!err){
                                //console.log(ressql);
                                res.json(ressql);
                            }
                        });
                    }
                    else{
                        let sql="SELECT * FROM `container` WHERE 1";
                        conn.query(sql,function(err,ressql){
                            if(!err){
                                //console.log(ressql);
                                res.json(ressql);
                            }
                        });
                    }
                    conn.end();
                }
            });
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
        // console.log(req.query);
        let conn=mysql.createConnection({
            host:"127.0.0.1",
            user:"pi",
            password:"nccutest",
            database:"ITRIProject"
        });

        conn.connect(function(err){
            console.log(req.query.id);
            if(!err){
                let sql=`SELECT * FROM IdMapContract WHERE 1`;
                conn.query(sql,function(err,ressql){
                    if(!err){
                        //console.log(ressql);
                        res.json(ressql);
                    }
                    else{
                        res.status(500).json({DBError:err});
                    }
                });
                conn.end();
            }
            else{
                res.status(500).json({DBError:err});
            }
        });
    }

    save(req,response){

        let data=JSON.parse(req.body.data);

        let conn=mysql.createConnection({
            host:"127.0.0.1",
            user:"pi",
            password:"nccutest",
            database:"ITRIProject"
        });

        conn.connect(function(err){
            if(!err){
                let sql="";
                if(data.mac != undefined && data.gps != undefined && data.temperature != undefined && data.humidity != undefined && data.info != undefined)
                    sql="INSERT INTO `container`(`pi_mac`, `timestamp` ,`lat`, `lng`, `temperature`, `humidity`,`Id`,`Contract_Address`,`Transaction_Hash`,`info`) VALUES ('"+data.mac+"','"+data.timestamp+"','"+data.gps.lat+"','"+data.gps.lng+"','"+data.temperature+"','"+data.humidity+"','"+data.Id+"','"+data.Contract_Address+"','"+data.Transaction_Hash+"','"+data.info+"')";

                console.log("sql= "+sql);
                conn.query(sql,function(err,res){
                    if(err){
                        response.write("false");
                        response.end();
                    }else{
                        response.write('true');
                        response.end();
                    }
                });

            }else{
                console.log(err);
            }
            conn.end();
        });
    }



}

module.exports = backend;
