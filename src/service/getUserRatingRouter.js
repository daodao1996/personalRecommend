const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pearson = require('./pearson');
const getRecommend = require('./getRecommendCourse');
const getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/', urlencodedParser, function(req, res) {
    let values = req.body;
  let sql = `select * from score;`;
  connection.query(sql, function(error, scoreResults, fields) {
      if (error) throw error;
      let sql1 = `select * from comprehensiveScore;'`;
      connection.query(sql1, function(error, comprehensiveResult, fields) {
          let currentUserInfo ={};
          let currentUser = [];
          let otherUsers = {};
          dealScoreAndComprehensivescore(currentUserInfo,currentUser,otherUsers,scoreResults,comprehensiveResult,values.userID);
          console.log(currentUserInfo);
          let neighbors = searchNeighbors(currentUser,otherUsers);
          console.log(neighbors);
          if(Object.keys(neighbors).length >= 5){
              getRecommend.getInterestDegree(neighbors,res,currentUserInfo);
              return 0;
          }else{
            recommendBasedInterest(values.userID,res);
          }
      });
  });
});


function dealScoreAndComprehensivescore(currentUserInfo,currentUser,otherUsers,scoreResults,comprehensiveResult,nowUserID) {
    comprehensiveResult[0].forEach(itemCom => {
        let itemScore = scoreResults.filter(item => item.userID===itemCom.userID)[0];
        if(itemCom.userID === nowUserID){
            currentUserInfo = itemScore;
            for(let iter in itemScore){
                if(typeof itemScore[iter] !== "string"){
                    let nowNumber=getComplexScore(itemScore[iter],itemCom[iter]);
                    currentUserInfo[iter]=nowNumber;
                    currentUser.push(nowNumber);
                }
            }
        }else{
            let sArr = [];
            for(let iter in itemScore){
                if(typeof itemScore[iter] !== "string"){
                    sArr.push(getComplexScore(itemScore[iter],itemCom[iter]));
                }
            }
            otherUsers[itemScore.userID] = sArr;
        }
    });
}

function recommendBasedInterest(userID,res){
    if(userID){
        let sql = `select interest from user where id='${userID}';`;
        connection.query(sql, function(error, resultInterest, fields) {
            if (error) throw error;
            let interests = resultInterest[0].interest.split(";");
            let sqlWhere = interests.map(item => `resourceName like '%${item}%'`);
            let sql1 = `select id,resourceName,teachers,imgURL,resourceIntroduction from resourceinfo where ${sqlWhere.join(" or ")};`;
            connection.query(sql1, function(error, result, fields) {
                if (error) throw error;
                res.send(result);
            });
        });
    }
}

function searchNeighbors(currentUserScore,otherUserScore){
  let correlation = {};
  for(let iter in otherUserScore){
      let currentPearson =  pearson(currentUserScore,otherUserScore[iter]);
      console.log(iter + " "+currentPearson);
      if(currentPearson > 0.6){
          correlation[iter] = currentPearson;
      }
  }
  return correlation;
}

function getComplexScore(score,comScore){
    let res=comScore;
    if(score>=3){
        res+=(score-2.5);
    }else if(score>=1 && score<=1.5){
        res -= 0.5;
    }else if(score>=0 && score<=0.5){
        res -= 1;
    }

    if(res<=0){
        return 0;
    }else{
        return res;
    }
}

module.exports = router;
