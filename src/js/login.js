//登录操作
function login() {
    let nameElement = document.getElementById('username');
    let passwordE = document.getElementById('password');
    let name = nameElement.value;
    let password = passwordE.value;

    //console.log("name:"+name);
    //console.log("password:"+password);

    let result;
    let userId=-1;
    let xml=$.ajax({
        type: "POST",
        url:'/src/php/login.php',
        dataType:'json',
        async:false,
        data:{'name':name,'password':password},

        success:function (ans) {
            result = ans.isSuccessful;
            userId = ans.userID;
        }
    } );

    if(result){
        setUser(name,userId);
        console.log("登录成功");
        return true;
    }else {
        console.log("登录失败");
        alert("用户名和密码错误，请重试");
        return false;
    }
}

//登录成功设置用户登录信息
function setUser(userName,userID) {
    let user = {};
    user.userID = userID;
    user.name = userName;
    user.loginState =true;
    sessionStorage.setItem('user',JSON.stringify(user));
}
