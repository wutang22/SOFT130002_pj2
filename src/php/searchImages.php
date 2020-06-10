<?php
require_once('config.php');

class ImageSimple{
    var $ID;
    var $title;
    var $des;
    var $path;

    public function __construct($id,$t,$d,$p)
    {
        $this->ID=$id;
        $this->title = $t;
        $this->des = $d;
        $this->path=$p;
    }
}

//从请求URL地址中获取 searchType 参数
$searchType=$_POST['searchType'];
$searchValue = $_POST['value'];

try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if($searchType=="title"){
        //设置sql语句  获得imageID，title，des，path
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE Title LIKE '%".$searchValue."%'";
        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="all"){
        //设置sql语句  获得imageID，title，des，path 只取80个
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage limit 0,80";
        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="choices"){
        $theme = $_POST['theme'];
        $country = $_POST['country'];
        $city = $_POST['city'];
        //设置sql语句  获得imageID，title，des，path 只取80个
        $isFirst = true;
        //至少有一项
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage where";//limit 0,80
        if($theme!='notSelected'){
            $sql=$sql." Content='".$theme."'";
            $isFirst = false;
        }
        if($country!='notSelected'){
            if($isFirst){
                $sql=$sql." CountryCodeISO='".$country."'";
            }else{
                $sql=$sql." AND CountryCodeISO='".$country."'";
            }
            $isFirst =false;
        }
        if($city!='notSelected'){
            if($isFirst){
                $sql=$sql." CityCode='".$city."'";
            }else{
                $sql=$sql." AND CityCode='".$city."'";
            }
            $isFirst =false;
        }

        $sql=$sql." limit 0,80";//不超过80项即可

        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="hotCountry"){
        //设置sql语句  获得imageID，title，des，path 只取80个
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE CountryCodeISO='".$searchValue."' limit 0,80";
        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="hotCity"){
        //设置sql语句  获得imageID，title，des，path 只取80个
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE CityCode='".$searchValue."' limit 0,80";
        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="hotTheme") {
        //设置sql语句  获得imageID，title，des，path 只取80个
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE Content='" . $searchValue . "' limit 0,80";
        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[] = new ImageSimple($row['ImageID'], $row['Title'], $row['Description'], $row['PATH']);
        }
    }else if($searchType=="des") {
        //设置sql语句  获得imageID，title，des，path
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE Description LIKE '%" . $searchValue . "%'";
        $result = $pdo->query($sql);

        //遍历结果集
        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[] = new ImageSimple($row['ImageID'], $row['Title'], $row['Description'], $row['PATH']);
        }
    }
    $pdo = null;
    echo json_encode($resultSet);

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}

