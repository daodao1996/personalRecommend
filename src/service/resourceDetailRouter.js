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
    if (values.id) {
        let sql = `select resourceName,teachers,imgURL,resourceOverview,resourceOutline,mark,rateNumber from resourceinfo where id='${values.id}';`;
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        });
    }
});

router.post('/updateHits', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    if (values.id) {
        let sql1 = `select hits from resourceinfo where id='${values.id}';`;
        connection.query(sql1, function (error, resultHits, fields) {
            if (error) throw error;
            let newHits = resultHits[0].hits + 1;
            let sql2 = `update resourceinfo set hits=${newHits} where id='${values.id}';`;
            connection.query(sql2, function (error, result, fields) {
                if (error) throw error;
                res.send(result);
            });
        });
    }
});

router.post('/updateComprehensiveScore', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    let resourceID = values.resourceID;
    if (values.userID && values.resourceID) {
        let sql1 = "select `" + values.resourceID + "` from comprehensiveScore where userID='" + values.userID + "';";
        connection.query(sql1, function (error, resultOld, fields) {
            if (error) throw error;
            let newHits = parseInt(resultOld[0][resourceID]) + 1;
            let sql2 = "update comprehensiveScore set `" + values.resourceID + "`=" + newHits + " where userID='" + values.userID + "';";
            connection.query(sql2, function (error, result, fields) {
                if (error) throw error;
                res.send(result);
            });
        });
    }
});


router.post('/updateScore', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    if (values.resourceID && values.score && values.userID) {
        let sqlUpdateScore = "update score set `" + values.resourceID + "`=" + values.score + " where userID='" + values.userID + "';";
        connection.query(sqlUpdateScore, function (error, result1, fields) {
            if (error) throw error;
            let sqlSelectMarkAndNum = `select mark,rateNumber from resourceinfo where id='${values.resourceID}';`;
            connection.query(sqlSelectMarkAndNum, function (error, result, fields) {
                if (error) throw error;
                let oldMark = parseFloat(result[0].mark);
                let oldRateNumber = parseInt(result[0].rateNumber);
                let newRateNumber = oldRateNumber + 1;
                let newMark = (((oldMark * oldRateNumber) + parseFloat(values.score)) / newRateNumber).toFixed(2) + "";
                let sqlUpdateResourceInfo = `update resourceinfo set mark='${newMark}',rateNumber=${newRateNumber} where id=${values.resourceID};`;
                connection.query(sqlUpdateResourceInfo, function (error, result2, fields) {
                    if (error) throw error;
                    res.send({mark: newMark, rateNumber: newRateNumber});
                });
            });
        });
    }
});


router.post('/getCurrentUserMark', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    if (values.resourceID && values.userID) {
        let sql = "select `" + values.resourceID + "` from score where userID='" + values.userID + "';";
        connection.query(sql, function (error, result, fields) {
            if (error) throw error;
            res.send(result[0]);
        });
    }
});

router.post('/collectionResource', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    if (values.resourceID && values.userID) {
        let sql = `select collectionCourses from user where id='${values.userID}'`;
        connection.query(sql, function (error, result, fields) {
            if (error) throw error;
            let resourcesStr = result[0].collectionCourses;
            if (resourcesStr && resourcesStr !== "") {
                if (resourcesStr.indexOf(values.resourceID) === -1) {
                    resourcesStr += ";" + values.resourceID;
                }
            } else {
                resourcesStr += values.resourceID;
            }
            if (resourcesStr !== result[0].collectionCourses) {
                let sql1 = `update user set collectionCourses='${resourcesStr}' where id='${values.userID}';`;
                connection.query(sql1, function (error, result, fields) {
                    if (error) throw error;
                    updateComprehensiveScore(values.userID, values.resourceID, "add",res);
                });
            }else{
                res.send(true);
            }
        });
    }
});

router.post('/cancelCollectionResource', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    if (values.resourceID && values.userID) {
        let sql = `select collectionCourses from user where id='${values.userID}'`;
        connection.query(sql, function (error, result, fields) {
            if (error) throw error;
            let resourcesStr = result[0].collectionCourses;
            if (resourcesStr !== "") {
                let oldCourceArr = resourcesStr.split(";");
                let newCourceArr = oldCourceArr.filter(item => item !== values.resourceID);
                let sql1 = `update user set collectionCourses='${newCourceArr.join(";")}' where id='${values.userID}';`;
                connection.query(sql1, function (error, result, fields) {
                    if (error) throw error;
                    updateComprehensiveScore(values.userID, values.resourceID, "sub",res);
                });
            } else {
                res.send(false);
            }

        });
    }
});

router.post('/judgeIfUserCollection', urlencodedParser, function (req, res) {
    let values = req.body;
    console.log(values);
    if (values.resourceID && values.userID) {
        let sql = `select collectionCourses from user where id='${values.userID}';`;
        connection.query(sql, function (error, result, fields) {
            if (error) throw error;
            if(result[0].collectionCourses && result[0].collectionCourses !== ""){
                let collectionCourseArr = result[0].collectionCourses.split(";");
                if (collectionCourseArr.includes(values.resourceID)) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }else{
                res.send(false);
            }

        });
    }else{
        res.send(false);
    }
});

function updateComprehensiveScore(userID, resourceID, option,res) {
    let sql = "select `" + resourceID + "` from comprehensiveScore where userID='" + userID + "';";
    connection.query(sql, function (error, result, fields) {
        if (error) throw error;
        let oldScore = result[0][resourceID];
        let newScore = 0;
        if (option === "add") {
            newScore = parseInt(oldScore) + 3;
        } else if (option === "sub") {
            newScore = parseInt(oldScore) - 3;
        }
        let sql1 = "update comprehensiveScore set `" + resourceID + "`=" + newScore + " where userID='" + userID + "';";
        connection.query(sql1, function (error, result, fields) {
            res.send(true);
        });
    });
}

module.exports = router;
