<?php

require_once('config.php');

//获得图片显示详情
class ImageData{
    var $imgID;

    var $title;
    var $des;
    var $path;
    var $theme;

    var $cityName;
    var $countryName;
    var $ownerName;

    var $favorNum;

    function __construct($id,$title,$description,$pa,$con){
        $this->imgID = $id;
        $this->title = $title;
        $this->des = $description;
        $this->path = $pa;
        $this->theme = $con;
    }

    function setCityName($cn){
        $this->cityName = $cn;
    }

    function setCountryName($counN){
        $this->countryName = $counN;
    }

    function setOwner($owner){
        $this->ownerName = $owner;
    }

    function setFavorN($favorN){
        $this->favorNum = $favorN;
    }
}


$imgID=$_POST['imgID'];

try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT Title,Description,PATH,Content,CityCode,CountryCodeISO,UID FROM travelimage WHERE ImageID='".$imgID."'";
    $result = $pdo->query($sql);

    if($row = $result->fetch()) {
        $resultSet=new ImageData($imgID,$row['Title'],$row['Description'],$row['PATH'],$row['Content']);
        $CityCode = $row['CityCode'];
        $CountryCodeISO = $row['CountryCodeISO'];
        $UID =$row['UID'];

        $sql = "SELECT AsciiName FROM geocities WHERE GeoNameID='".$CityCode."'";
        $result = $pdo->query($sql);
        if($row = $result->fetch()){
            $resultSet->setCityName($row['AsciiName']);
        }

        $sql = "SELECT CountryName FROM geocountries WHERE ISO='".$CountryCodeISO."'";
        $result = $pdo->query($sql);
        if($row = $result->fetch()){
            $resultSet->setCountryName($row['CountryName']);
        }

        $sql = "SELECT UserName FROM traveluser WHERE UID='".$UID."'";
        $result = $pdo->query($sql);
        if($row = $result->fetch()){
            $resultSet->setOwner($row['UserName']);
        }

        $sql = "SELECT COUNT(*) AS FavorN FROM `travelimagefavor`  WHERE ImageID='".$imgID."'";
        $result = $pdo->query($sql);
        if($row = $result->fetch()){
            $resultSet->setFavorN($row['FavorN']);
        }
    }

    $pdo = null;
    echo json_encode($resultSet);

}catch (PDOException $e) {
    die($e->getMessage());
}