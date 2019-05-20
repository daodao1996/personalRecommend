const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('../public'));
app.all('*', function (req, res, next)
{ res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const getUserRatingRouter = require('./getUserRatingRouter');
app.use('/recommend.html',getUserRatingRouter);

const mainPageRouter = require('./mainPageRouter');
app.use('/mainPage.html',mainPageRouter);

const resourceDetailRouter = require('./resourceDetailRouter');
app.use('/resourceDetail.html',resourceDetailRouter);

const registerRouter = require('./registerRouter');
app.use("/register.html",registerRouter);

const loginRouter = require('./loginRouter');
app.use("/login.html",loginRouter);

const searchResultRouter = require('./searchResultRouter');
app.use("/searchResult.html",searchResultRouter);

const allResourcesRouter = require('./allResourcesRouter');
app.use("/allResources.html",allResourcesRouter);

const personalCenterRouter = require("./personalCenterRouter");
app.use("/personalCenter.html",personalCenterRouter);

const tryRouter = require("./tryRouter");
app.use("/try.html",tryRouter);

var server = app.listen(9696,'localhost',function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
