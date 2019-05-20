const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({extended: true});
connection.connect();

router.post('/', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    let sql = `SELECT id,resourceName,teachers,imgURL,resourceIntroduction from resourceinfo where resourceName like '%${values.keyWord}%' or teachers like '%${values.keyWord}%';`;
    if (values.keyWord && values.userID) {
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            addComprehensiveScore(results, values.userID);
            res.send(results);
        });
    }
});

function addComprehensiveScore(resourcesArr, userID) {
    if (resourcesArr.length > 0 && userID) {
        let idArr = resourcesArr.map(item => item.id);
        let sql1 = "select `" + idArr.join("`,`") + "` from comprehensiveScore where userID='" + userID + "'";
        connection.query(sql1, function (error, resultOldScore, fields) {
            if (error) throw error;
            let newScoreSql = [];
            for (let iter in resultOldScore[0]) {
                newScoreSql.push("`" + iter + "`=" + ++resultOldScore[0][iter]);
            }

            let updateSql = "update comprehensiveScore set " + newScoreSql + " where userID='" + userID + "';";
            connection.query(updateSql, function (error, results, fields) {
                if (error) throw error;
                // res.send(results);
            });
        });
    }
}

module.exports = router;