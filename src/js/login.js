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
        url:'../src/php/login.php',
        dataType:'json',
        async:false,//一定要有，不然会出现result还是undefineded
        data:{'name':name,'password':password},

        success:function (ans) {
            console.log(ans);
            result = ans.isSuccessful;
            userId = ans.userID;
            //console.log("结果是"+result);
            //console.log(ans.userID);
        }
    } );
    //console.log(result);
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

