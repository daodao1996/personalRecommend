'use strict';

const BASE_URL = 'http://127.0.0.1:9696';

window.onload = function () {
    sessionStorage.setItem("beforeLogin", document.referrer);
    loadLoginInfo();
};

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

function login() {
    $.ajax({
        type: "POST",
        url: BASE_URL + "/login.html",
        datatype: "JSON",
        data: {
            userName: $(".userName").val()
        },
        crossDomain: true,
        success: function (result) {
            if (result.password) {
                if (result.password === $(".password").val()) {
                    sessionStorage.setItem("onlineUserID", result.id);
                    sessionStorage.setItem("onlineUserName", result.userName);
                    // window.location.href = window.referrer;
                    window.location.href = BASE_URL + "/mainPage.html";
                } else {
                    alert("密码错误");
                }
            } else {
                alert("用户名不存在");
            }
        }
    });
}