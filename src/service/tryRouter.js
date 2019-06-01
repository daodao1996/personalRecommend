const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/', urlencodedParser, function(req, res) {
    let sql = `select * from comprehensiveScore;select * from score;`;
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});


module.exports = router;
