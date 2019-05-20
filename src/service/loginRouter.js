const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/', urlencodedParser, function(req, res) {
    let values = req.body;
    let sql = `select id,userName,password from user where userName='${values.userName}'`;
    if(values.userName){
        connection.query(sql, function(error, results, fields) {
            if (error) throw error;
            res.send(results[0]);
        });
    }
});

module.exports = router;