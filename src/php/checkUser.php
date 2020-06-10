<?php

require_once('config.php');

$name = $_POST['name'];

//检查用户名是否重复
try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT UID FROM traveluser WHERE UserName ='".$name."'";
    $result = $pdo->query($sql);

    if($row = $result->fetch()){
        $answer = true;
    }else{
        $answer = false;
    }

    $pdo = null;
    echo json_encode($answer);

}catch (PDOException $e) {
    die( $e->getMessage() );
}