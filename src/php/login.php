<?php

require_once('config.php');

class UserLoginState{
    var $isSuccessful;
    var $userID;

    function __construct($su,$uid){
        $this->isSuccessful = $su;
        $this->userID = $uid;
    }
}

$name = $_POST['name'];
//密码加密再与数据库的判断
$password = $_POST['password'];

//判断用户名与密码是否匹配
try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //这里可以用预处理，防止sql注入
    //$sql = "SELECT UID FROM traveluser WHERE UserName ='".$name."' AND Pass='".$password."'";
    $sql = "SELECT UID,Pass FROM traveluser WHERE UserName ='".$name."'";
    $result = $pdo->query($sql);

    if($row = $result->fetch()){
        if (password_verify($password, $row['Pass'])) {
            $answer = new  UserLoginState(true,$row['UID']);
        } else {
            $answer = new UserLoginState(false,-1);//密码不对
        }
    }else{
        $answer = new UserLoginState(false,-1);
    }

    $pdo = null;
    echo json_encode($answer);

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}
