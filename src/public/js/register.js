'use strict';

const BASE_URL = 'http://127.0.0.1:9696';
let verificationCode = "";
let userID = "";

window.onload = function () {
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

function getUserInfo() {
    let info = {};
    info.userName = $(".userName").val();
    info.password = $(".password").val();
    info.email = $(".email").val();
    let interest = [];
    let obj = document.getElementsByName("like");
    for (let k in obj) {
        if (obj[k].checked) {
            interest.push(obj[k].value)
        }
    }
    info.interest = interest.join(";");
    console.log(info);
    return info;
}

function register() {
    let userInfo = getUserInfo();
    userInfo.userID = userID;
    if (judgeFormat(userInfo)) {
        $.ajax({
            type: "POST",
            url: BASE_URL + "/register.html/register",
            datatype: "JSON",
            data: userInfo,
            crossDomain: true,
            success: function (result) {
                if (result === true) {
                    alert("注册成功");
                    sessionStorage.setItem("onlineUserID", userInfo.userID);
                    sessionStorage.setItem("onlineUserName", userInfo.userName);
                    // window.location.href=sessionStorage.getItem("beforeLogin");
                    // sessionStorage.removeItem("beforeLogin");
                    window.location.href = BASE_URL + "/mainPage.html";
                }
            }
        });
    }
}

function judgeFormat(data) {
    if (!data.userName.match(/^[a-zA-Z0-9\u4e00-\u9fa5_\.]+$/)) {
        alert("用户名只能由汉字、字母、数字、点和下划线组成");
        return false;
    } else {
        if (judgeUsernameUnique(data.userName) === false) {
            alert("用户名已被占用");
        } else {
            if (data.password !== $(".passwordEnter").val()) {
                alert("两次密码不同，请重新输入");
                return false;
            } else {
                if ($(".securityCode").val() !== verificationCode) {
                    alert("验证码输入错误");
                } else {
                    return true;
                }
            }
        }
    }
}

function emailVerification() {
    let email = $(".email").val();
    if (email && email.match(/^[a-z0-9]+([._]*[a-z0-9]+)*@[a-z0-9]+([_.][a-z0-9]+)+$/gi)) {
        $.ajax({
            type: "POST",
            url: BASE_URL + "/register.html/sendCode",
            datatype: "JSON",
            data: {
                email: email
            },
            async: false,
            crossDomain: true,
            success: function (result) {
                verificationCode = result.vcode;
                userID = result.userID;
            }
        });
    } else {
        alert("邮箱格式不正确");
    }
}

function judgeUsernameUnique(username) {
    let flag = true;
    $.ajax({
        type: "POST",
        url: BASE_URL + "/register.html/judgeUsernameUnique",
        datatype: "JSON",
        data: {
            userName: username
        },
        async: false,
        crossDomain: true,
        success: function (result) {
            if (result === true) {
                flag = true;
            } else {
                flag = false;
            }
        }
    });
    console.log(typeof flag);
    return flag;
}
