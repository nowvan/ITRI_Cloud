const db = require('./connection_db');


class backend{
//輸入id將回傳所有此id所有資料
//如果加上輸入timestamp就會回傳特定時間區間的資料
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
                            res.json({err:"ContainerError"});
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
//回傳所有已註冊的id以及address
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
//輸入id回傳address
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
//資料儲存至資料庫的api
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



}

module.exports = backend;
