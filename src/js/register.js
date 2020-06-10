function register() {
    let name = document.getElementById("name").value;
    let pass1 = document.getElementById("password1").value;
    let pass2 = document.getElementById("password2").value;
    let mail = document.getElementById("email").value;

    /*
    console.log(name);
    console.log(mail);
    console.log(pass1);
    console.log(pass2);
*/
    if(!checkSimpleName(name)){
        alert("用户名不是由不少于四个数字，字母组成的");
        return false;
    }

    if(checkExistedName(name)==true){
        alert("该用户名已注册！");
        return false;
    }

    if(!checkMail(mail)){
        alert("邮箱格式错误！");
        return false;
    }

    if(!checkSimplePass(pass1)){
        alert("密码不是由不少于六个数字，字母组成的");
        return false;
    }
    if(!checkSamePass(pass1,pass2)){
        alert("再次输入密码不一致！");
        return false;
    }

    console.log("检查成功");
    let count = signUp(name,pass1,mail);
    if(count==0){
        alert("插入失败");
        return false;
    }

    return true;
}

//用户名由字母数字组成，长达不少于4
function checkSimpleName(name) {
    let nameRe = /^[0-9A-Za-z]{4,}$/;
    return nameRe.test(name);
}

function checkExistedName(name) {
    let result;
    let xml=$.ajax({
        type: "POST",
        url:'/src/php/checkUser.php',
        dataType:'json',
        async:false,
        data:{'name':name},

        success:function (ans) {
            result = ans;
            //console.log(result);
            return result;
        }
    } );
    return result;
}

//密码由字母数字组成，长度不少于6
function checkSimplePass(password) {
    let passRe = /^[0-9A-Za-z]{6,}$/;
    return passRe.test(password);
}

function checkSamePass(pass1,pass2) {
    return pass1===pass2;
}

function checkMail(mail) {
    let mailRe = /[a-zA-Z0-9_-]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/ ;
    return mailRe.test(mail);
}

function signUp(name,password,mail) {
    let result;
    let xml=$.ajax({
        type: "POST",
        url:'/src/php/register.php',
        dataType:'json',
        async:false,
        data:{'name':name,'password':password,'mail':mail},

        success:function (ans) {
            result = ans;
            //console.log(result);
            return result;
        }
    } );
    return result;
}
