//导航栏，采用innerHTML
function drawUserCenter() {
    let personalCenter = document.getElementById("personal_center");
    let html = "";
    if(isUserLogin()){
        html = "<span class=\"dropbtn\" >个⼈中⼼<i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></span>\n" +
            "        <div class=\"dropdown-content\">\n" +
            "            <a href=\"/src/upload.html\" onclick='cancelEdit();'><i class=\"fa fa-upload\" aria-hidden=\"true\"></i> 上传</a>\n" +
            "            <a href=\"/src/myPhoto.html\"><i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i> 我的照⽚</a>\n" +
            "            <a href=\"/src/favor.html\"><i class=\"fa fa-heart\" aria-hidden=\"true\"></i> 我的收藏</a>\n" +
            "            <a href=\"#\" onclick='quit()'><i class=\"fa fa-sign-in\" aria-hidden=\"true\"></i> 登出</a>\n" +
            "        </div>";
    }else {
        html = "<span class=\"dropbtn\" onclick='loginIn()'>登录</span>\n";
    }
    personalCenter.innerHTML = html;
}

//登出
function quit() {
    let user = {};
    user.loginState = false;//用户的登录状态为 未登录
    user.name = null;
    user.userID =-1;
    sessionStorage.setItem('user',JSON.stringify(user));
    window.location.href='../src/login.html';//跳转到登录页面了
}

//登录
function loginIn() {
    window.location.href='../src/login.html';
}
