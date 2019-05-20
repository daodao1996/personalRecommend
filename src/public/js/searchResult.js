'use strict';

const BASE_URL = 'http://127.0.0.1:9696';

window.onload = function () {
    loadLoginInfo();
    loadKeywork();
    getSearchResult();
};

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

function jumpSearchResult() {
    let keyWord = $(".searchInput").val();
    if (keyWord !== "") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + keyWord);
    }
}

function loadKeywork() {
    let keyword = decodeURI(window.location.search.split("=")[1]);
    $(".searchInput").val(keyword);
}

function getSearchResult() {     //解析url将搜索关键字传给后台
    $.ajax(
        {
            type: 'POST',
            url: BASE_URL + '/searchResult.html',
            data: {
                keyWord: decodeURI(window.location.search.split("=")[1]),
                userID:sessionStorage.getItem("onlineUserID")
            },
            datatype: 'JSON',
            crossDomain: true,
            success: function (data) {
                usePage(data);
            }
        });
}

function loadSearchResult(item) {
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

function usePage(data) {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'searchResultPage'
            , count: data.length
            , theme: '#FFB800'
            , limit: 2
            , jump: function (obj) {
                // 模拟渲染
                document.getElementById('searchResultContent').innerHTML = function () {
                    var arr = []
                        , thisData = data.concat().splice(obj.curr * obj.limit - obj.limit, obj.limit);
                    layui.each(thisData, function (index, item) {
                        arr.push(loadSearchResult(item));
                    });
                    return arr.join('');
                }();
            }
        });
    });
}

