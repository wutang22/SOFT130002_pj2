<?php

require_once('config.php');

$imgID = $_POST['imgID'];
$userID = $_POST['userID'];

try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "DELETE FROM travelimagefavor WHERE ImageID='".$imgID."' AND UID = '".$userID."'";
    $result = $pdo->query($sql);

    $pdo = null;
    echo json_encode("取消完毕");

}catch (PDOException $e) {
    die( $e->getMessage() );
}
