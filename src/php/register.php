<?php

require_once('config.php');

$name = $_POST['name'];
//这里做哈希加盐
$pass = $_POST['password'];
$pass = password_hash($pass, PASSWORD_DEFAULT);

$mail = $_POST['mail'];

//在前端检查所有参数合理性后，往表中插入一条数据
try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //State,DateJoined,DateLastModified 默认null，就没设置
    $sql = "INSERT INTO traveluser(UserName,Pass,Email) VALUES ('".$name."','".$pass."','".$mail."')";
    $count = $pdo->exec($sql);

    $pdo = null;
    echo json_encode($count);

}catch (PDOException $e) {
    die( $e->getMessage() );
}