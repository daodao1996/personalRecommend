const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const pearson = require('./pearson');
const getCon = require('./DBConnect');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

function getInterestDegree(neighbors,res,currentUserScore) {
    let neighborsID = Object.keys(neighbors).join(",");
    let sql = `select * from score where userID in (${neighborsID});`;
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        let allCourses = {};
        results.forEach(item => {
            for(let iter in item){
                if(typeof item[iter] != "string"){
                    let newP = neighbors[item.userID] * item[iter];
                    if(!allCourses.hasOwnProperty(iter)){
                        allCourses[iter] = newP;
                    }else if(allCourses.hasOwnProperty(iter) && allCourses[iter] < newP){
                        allCourses[iter] = newP;
                    }
                }
            }
        });
        res.send(getRecommendCourse(allCourses,currentUserScore));
    });
}


function getRecommendCourse(allCourses,currentUserScore) {
    let sortedCourse = Object.keys(allCourses).sort(function (a,b) {
        return allCourses[b]-allCourses[a];
    });
    let result = [];
    sortedCourse.forEach(item => {
        if(currentUserScore[item] < 5){
            result.push(item);
        }
    });
    return result;
}

module.exports = {
    getInterestDegree

};
