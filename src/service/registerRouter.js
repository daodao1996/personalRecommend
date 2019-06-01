const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getCon = require('./DBConnect');
const nodemailer = require('nodemailer');
let connection = getCon.DBConnect();
let urlencodedParser = bodyParser.urlencoded({ extended: true });
connection.connect();

router.post('/sendCode', urlencodedParser, function(req, res) {
    let values = req.body;
    let vcode = getNumber();
    sendCode(vcode,values.email);
    res.send({"vcode":vcode,"userID":getUserID()});
});

router.post('/register', urlencodedParser, function(req, res) {
    let values = req.body;
    console.log(values);
    let sql = `insert into user values('${values.userID}','${values.userName}','${values.password}','${values.email}','${values.interest}','');`;
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        res.send(true);
    });
});

router.post('/judgeUsernameUnique', urlencodedParser, function(req, res) {
    let values = req.body;
    console.log(values);
    let sql = `select * from user where userName='${values.userName}';`;
    connection.query(sql, function(error, results, fields) {
        if (error) throw error;
        let result=true;
        if(results.length!==0){
            result=false;
        }
        res.send(result);
    });
});

//邮件发送验证码
function sendCode(vcode,cod) {
    const smtpTransport = nodemailer.createTransport({
        service: '163',
        port: 465,
        secureConnection: true,
        auth: {
            user: '17782749939@163.com',
            pass: 'Dingyunpeng996'//注：此处为授权码，并非邮箱密码
        }
    });
    smtpTransport.sendMail({
        from: '17782749939@163.com',//发件人邮箱
        to: cod,//收件人邮箱，多个邮箱地址间用','隔开
        subject: '欢迎注册个性推荐学习资源网',//邮件主题
        text: 'Hello!You are registering a user,your verification code is [' + vcode + '].This verification code is valid for five minutes.'//text和html两者只支持一种
    }, function (err, res) {
        console.log(err, res);
    });
}

function getNumber(){
    let num="";
    for(let i=0;i<6;i++){
        num+=Math.floor(Math.random()*10);
    }
    return num;
}

function getUserID() {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `user_${r}`;
    return id;
}

module.exports = router;
