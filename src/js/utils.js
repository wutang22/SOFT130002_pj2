//判断用户是否登录
function isUserLogin() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(!user){
        return false;
    }else {
        return user.loginState;
    }
}

//登录成功设置用户登录信息
function setUser(userName,userID) {
    let user = {};
    user.userID = userID;
    user.name = userName;
    user.loginState =true;
    sessionStorage.setItem('user',JSON.stringify(user));
    console.log("登录成功，现在的user是"+JSON.stringify(user));
}

//获得用户ID，若失败则返回-1
function getUserID() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(user===undefined){
        return -1;
    }
    if(user.loginState===false){
        return -1;
    }
    return user.userID;
}

//设置点击图片的ID
function setClickImgId(imgId) {
    console.log("设置当前点击图片的ID="+imgId);//
    sessionStorage.setItem('imgId',imgId);
}

//获得点击图片的ID
function getClickImgId() {
    return sessionStorage.getItem('imgId');
}


//设置修改图片的ID（点击修改时）
function setEditImg(imgID) {
    console.log("设置当前修改图片的ID="+imgID);//
    sessionStorage.setItem('isEditing',true);
    sessionStorage.setItem('editImgId',imgID);
}

//获得修改图片的ID，若当前不在修改状态则返回-1
function getEditImg() {
    let isEditing = sessionStorage.getItem('isEditing');
    console.log("isEditing="+isEditing);//
    let imgID;
    if(isEditing=='true'){
        console.log("isEditing===true");//
        imgID =sessionStorage.getItem('editImgId');
    }else {
        console.log("not isEditing===true");//
        imgID=-1;
    }
    return imgID;
}

//取消编辑修改状态(点击上传按钮时)
function cancelEdit() {
    console.log("cancelEdit");//
    sessionStorage.setItem('isEditing',false);
}
