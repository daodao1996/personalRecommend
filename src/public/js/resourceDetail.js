'use strict';

const BASE_URL = 'http://127.0.0.1:9696';

window.onload = function () {
    $(".markCard").hide();
    // sessionStorage.setItem("currentLoggedInUser","daodao");
    getResourceInfo();
    addHits();
    updateComprehensiveScore();
    loadLoginInfo();

    if(sessionStorage.getItem("onlineUserID")){
        if(judgeIfUserCollection()){
            $(".collection").trigger("click");
        }
    }

    // if(window.location.search.split("=")[1] === '1205834821'){
    //     $(".information img").hide();
    // }else{
    //     $(".information video").hide();
    // }
};

function closeRate() {
    $(".layui-btn-normal").show();
    $(".markCard").hide();
    $(".collection").show();
}

function changeCollectionStatement() {
    let ele = document.getElementsByClassName("collection")[0];
    if (ele.getAttribute("name") === "collection") {
        collectionResource();
        $(".collection i").css("color", "red");
        $(".collection span").css("color", "red");
        $(".collection span").html("已收藏");
        ele.setAttribute("name", "haveCollectioned")
    } else {
        cancelCollectionResource();
        $(".collection i").css("color", "black");
        $(".collection span").css("color", "black");
        $(".collection span").html("收藏");
        ele.setAttribute("name", "collection")

    }
}

function judgeIfUserCollection() {
    let ans = true;
    if(!sessionStorage.getItem("onlineUserID")){
        return false;
    }else{
        $.ajax({
            type: 'POST',
            url: BASE_URL + "/resourceDetail.html/judgeIfUserCollection",
            data: {
                resourceID: window.location.search.split("=")[1],
                userID: sessionStorage.getItem("onlineUserID")
            },
            datatype: 'JSON',
            async: false,
            crossDomain: true,
            success: function (result) {
                ans = result;
            }
        });
        return ans;
    }
}

function collectionResource() {
    if(sessionStorage.getItem("onlineUserID")){
        $.ajax({
            type: 'POST',
            url: BASE_URL + "/resourceDetail.html/collectionResource",
            data: {
                resourceID: window.location.search.split("=")[1],
                userID: sessionStorage.getItem("onlineUserID")
            },
            datatype: 'JSON',
            crossDomain: true,
            success: function (result) {
                alert("收藏成功");
            }
        });
    }else {
        alert("请先登录");
    }
}


function cancelCollectionResource() {
    if(sessionStorage.getItem("onlineUserID")) {
        $.ajax({
            type: 'POST',
            url: BASE_URL + "/resourceDetail.html/cancelCollectionResource",
            data: {
                resourceID: window.location.search.split("=")[1],
                userID: sessionStorage.getItem("onlineUserID")
            },
            datatype: 'JSON',
            crossDomain: true,
            success: function (result) {
                alert("取消收藏成功");
            }
        });
    }else{
        alert("请先登录");
    }
}

function jumpSearchResult() {
    let keyWord = $(".searchInput").val();
    if (keyWord !== "") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + keyWord);
    }
}

function loadLoginInfo() {
    if (sessionStorage.getItem("onlineUserName")) {
        $(".onlineName").html(`${sessionStorage.getItem("onlineUserName")}已`);
        $(".navLoginBtn").hide();
        $(".navRegisterBtn").hide();
    } else {
        $(".onlineName").html(`未`);
        $(".navLogoutBtn").hide();
    }
}

function logout() {
    sessionStorage.removeItem("onlineUserID");
    sessionStorage.removeItem("onlineUserName");
}

function loadInformation(data) {
    loadResourceOutline(data.resourceOutline);
    loadResourceOverview(data.resourceOverview);
    loadResourcePicture(data.imgURL);
    loadResourceName(data.resourceName);
    loadResourceTeacher(data.teachers);
    loadScoreNum(data.mark);
    loadScorePeople(data.rateNumber);
}

//我要评分按钮的监听函数
function btnNormalOnClick() {
    let score = getCurrentUserMark();
    console.log(score);
    if (sessionStorage.getItem("onlineUserName")) {
        $(".layui-btn-normal").hide();
        $(".markCard").show();
        $(".collection").hide();
        // 如果用户之前给此资源评分过，显示之前的评分
        layui.use(['rate'], function () {
            var rate = layui.rate;
            rate.render({
                elem: '.starRate'
                , value: score
                , text: true
                , half: true
            })
        });
    } else {
        alert("您还没有登录，请先登录");
        window.location.href = BASE_URL + "/login.html";
    }
}

function updateScore() {
    let rateString = $(".starRate>span").text();
    let score = parseFloat([...rateString].splice(0, rateString.length - 1).join(""));

    $.ajax({
        type: 'POST',
        url: BASE_URL + "/resourceDetail.html/updateScore",
        data: {
            resourceID: window.location.search.split("=")[1],
            score: score,
            userID: sessionStorage.getItem("onlineUserID")
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
            $(".scoreNum").html(result.mark);
            $(".scorePeople").html(result.rateNumber);
        }
    });
}

function loadResourceOutline(data) {
    let html = "";
    JSON.parse(data).forEach(chapter => {
        let ulEle = document.createElement("ul");
        chapter.plan.split(";;;").forEach(item => {
            let liEle = document.createElement("li");
            liEle.innerHTML = item;
            ulEle.append(liEle);
        });

        html += `<li class="layui-timeline-item">
                    <i class="layui-icon layui-timeline-axis">&#xe63f;</i>
                    <div class="layui-timeline-content layui-text">
                        <div class="layui-timeline-title">
                        <h3>${chapter.name}</h3>
                            <p>${chapter.goals}</p>
                        </div>
                        <ul class="plan">
                        ${ulEle.innerHTML}
                        </ul>
                    </div>
                </li>`;
    });
    html += `<li class="layui-timeline-item">
                    <div class="layui-timeline-content layui-text">
                        <div class="layui-timeline-title"></div>
                    </div>
                </li>`;
    $(".layui-timeline").html(html);
}

function loadResourceOverview(overview) {
    let html = `<p>${overview}</p>`;
    $(".courseOverview .content").html(html);
}

function loadResourcePicture(picture) {
    $(".information>img").attr("src", picture);
}

function loadResourceName(name) {
    $(".resourceName").html(`${name}`);
}

function loadResourceTeacher(teachers) {
    $(".teacher").html(`${teachers.split(";").join("&nbsp;&nbsp;&nbsp;&nbsp;")}`);
}

function loadScoreNum(score) {
    $(".scoreNum").html(`${score}`);
}

function loadScorePeople(p) {
    $(".scorePeople").html(`${p + ""}`);
}

function getResourceInfo() {
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/resourceDetail.html",
        data: {
            id: window.location.search.split("=")[1]
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
            loadInformation(result[0]);
        }
    });
}

function addHits() {
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/resourceDetail.html/updateHits",
        data: {
            id: window.location.search.split("=")[1]
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
        }
    });
}

function updateComprehensiveScore() {
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/resourceDetail.html/updateComprehensiveScore",
        data: {
            userID: sessionStorage.getItem("onlineUserID"),
            resourceID: window.location.search.split("=")[1]
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
        }
    });
}

function getCurrentUserMark() {
    let userID = sessionStorage.getItem("onlineUserID");
    let resourceID = window.location.search.split("=")[1];
    let score = 0;
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/resourceDetail.html/getCurrentUserMark",
        data: {
            userID: userID,
            resourceID: resourceID
        },
        datatype: 'JSON',
        async: false,
        crossDomain: true,
        success: function (result) {
            score = result[resourceID];
        }
    });
    return score;
}