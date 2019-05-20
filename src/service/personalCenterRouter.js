const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/myCollection', urlencodedParser, function(req, res) {
    let values = req.body;
    if(values.userID){
        let sql = `select collectionCourses from user where id='${values.userID}';`;
        connection.query(sql, function(error, results, fields) {
            if (error) throw error;
            if(results[0].collectionCourses.length > 0){
                let sql1 = `select id,resourceName,teachers,imgURL,resourceIntroduction from resourceinfo where id in (${results[0].collectionCourses.split(";").join(",")});`;
                connection.query(sql1, function(error, result, fields) {
                    if (error) throw error;
                    res.send(result);
                });
            }

        });
    }
});

module.exports = router;