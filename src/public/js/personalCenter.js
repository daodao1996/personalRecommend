'use strict';

const BASE_URL = 'http://127.0.0.1:9696';

window.onload = function () {
    if(loadLoginInfo()){
        getRecommend();
        getMyCollections();
    }else{
        window.location.href = BASE_URL + "/login.html";
    }
};

function loadLoginInfo() {
    if (sessionStorage.getItem("onlineUserName")) {
        $(".onlineName").html(`${sessionStorage.getItem("onlineUserName")}已`);
        $(".navLoginBtn").hide();
        $(".navRegisterBtn").hide();
        return true;
    } else {
        window.location.href = BASE_URL + "/login.html";
        return false;
    }
}

function logout() {
    window.location.href = BASE_URL + "/login.html";
    sessionStorage.removeItem("onlineUserID");
    sessionStorage.removeItem("onlineUserName");
}

function jumpSearchResult() {
    let keyWord = $(".searchInput").val();
    if (keyWord !== "") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + keyWord);
    }
}


function getMyCollections() {
    $.ajax(
        {
            type: 'POST',
            url: BASE_URL + '/personalCenter.html/myCollection',
            data: {
                userID: sessionStorage.getItem("onlineUserID")
            },
            datatype: 'JSON',
            crossDomain: true,
            success: function (data) {
                useCollectionPage(data);
            }
        });
}

function getRecommend() {
    $.ajax(
        {
            type: 'POST',
            url: BASE_URL + '/recommend.html',
            data: {
                userID: sessionStorage.getItem("onlineUserID")
            },
            datatype: 'JSON',
            crossDomain: true,
            success: function (data) {
                useRecommendPage(data);
            }
        });
}


function loadResource(item) {
    return `<div>
                <a href="${BASE_URL}/resourceDetail.html?id=${item.id}">
                    <img src="${item.imgURL}" alt="">
                </a>
                <a href="${BASE_URL}/resourceDetail.html?id=${item.id}">
                    <div class="info">
                        <p class="resourceName">${item.resourceName}</p>
                        <p class="teacher">${item.teachers.split(";").join("&nbsp;&nbsp;&nbsp;&nbsp;")}</p>
                        <p class="introduction">${item.resourceIntroduction}</p>
                    </div>
                </a>
            </div>`;
}


function useRecommendPage(data) {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'recommendPage'
            , count: data.length
            , theme: '#FFB800'
            , limit: 2
            , jump: function (obj) {
                // 模拟渲染
                document.getElementById('recommendContent').innerHTML = function () {
                    var arr = []
                        , thisData = data.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                    layui.each(thisData, function (index, item) {
                        arr.push(loadResource(item));
                    });
                    return arr.join('');
                }();
            }
        });
    });
}

function useCollectionPage(data) {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'myCollectionPage'
            , count: data.length
            , theme: '#FFB800'
            , limit: 2
            , jump: function (obj) {
                // 模拟渲染
                document.getElementById('myCollectionContent').innerHTML = function () {
                    var arr = []
                        , thisData = data.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                    layui.each(thisData, function (index, item) {
                        arr.push(loadResource(item));
                    });
                    return arr.join('');
                }();
            }
        });
    });
}