<?php

require_once('config.php');

$imgID = $_POST['imgID'];

try {
    //创建PDO实例
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "DELETE FROM travelimage WHERE ImageID='".$imgID."'";
    $result = $pdo->query($sql);

    $pdo = null;
    echo json_encode("删除完毕");

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}