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

$searchType=$_POST['searchType'];
$searchValue = $_POST['value'];

try {
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if($searchType=="title"){//标题搜索
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE Title LIKE '%".$searchValue."%'";
        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="all"){
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage limit 0,80";
        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="choices"){//联合搜索
        $theme = $_POST['theme'];
        $country = $_POST['country'];
        $city = $_POST['city'];
        $isFirst = true;
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage where";
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

        $sql=$sql." limit 0,80";//5*16==80

        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="hotCountry"){//热门国家
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE CountryCodeISO='".$searchValue."' limit 0,80";
        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="hotCity"){//热门城市
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE CityCode='".$searchValue."' limit 0,80";
        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[]=new ImageSimple($row['ImageID'],$row['Title'],$row['Description'],$row['PATH']);
        }
    }else if($searchType=="hotTheme") {//热门主题
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE Content='" . $searchValue . "' limit 0,80";
        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[] = new ImageSimple($row['ImageID'], $row['Title'], $row['Description'], $row['PATH']);
        }
    }else if($searchType=="des") {//描述搜索（搜索页面的）
        $sql = "SELECT ImageID,Title,Description,PATH FROM travelimage WHERE Description LIKE '%" . $searchValue . "%'";
        $result = $pdo->query($sql);

        $resultSet = array();
        while ($row = $result->fetch()) {
            $resultSet[] = new ImageSimple($row['ImageID'], $row['Title'], $row['Description'], $row['PATH']);
        }
    }
    $pdo = null;
    echo json_encode($resultSet);

}catch (PDOException $e) {
    die( $e->getMessage() );
}

