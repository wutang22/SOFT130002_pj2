<?php

require_once('config.php');

class FavorImg{
    var $imgID;
    var $path;
    var $title;
    var $des;

    function __construct($id,$pa,$t,$d){
        $this->imgID = $id;
        $this->path=$pa;
        $this->title = $t;
        $this->des = $d;
    }
}

$userID = $_POST['userID'];

try {
    //创建PDO实例
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT travelimage.ImageID,Title,Description,PATH FROM travelimage,travelimagefavor WHERE travelimagefavor.UID='".$userID."' 
    AND travelimage.ImageID = travelimagefavor.ImageID";
    $result = $pdo->query($sql);

    $photos = array();
    while($row = $result->fetch()) {
        $photos[]=new FavorImg($row['ImageID'],$row['PATH'],$row['Title'],$row['Description']);
    }

    $pdo = null;
    echo json_encode($photos);

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}
