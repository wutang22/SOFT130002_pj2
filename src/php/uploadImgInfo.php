<?php

require_once('config.php');

//从请求URL地址中获取 getType 参数
$imgID=$_GET['imgID'];

//获得修改图片信息
class ImageMes{
    var $path;
    var $title;
    var $des;
    var $theme;
    var $countryISO;
    var $cityCode;

    function __construct($pa,$t,$d,$the,$coun,$ci){
        $this->path=$pa;
        $this->title = $t;
        $this->des = $d;
        $this->theme = $the;
        $this->countryISO = $coun;
        $this->cityCode = $ci;
    }
}

try {
    //创建PDO实例
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT ImageID,Title,Description,PATH,Content,CityCode,CountryCodeISO FROM travelimage WHERE ImageID='".$imgID."'";
    $result = $pdo->query($sql);

    if($row = $result->fetch()) {
        $resultSet=new ImageMes($row['PATH'],$row['Title'],$row['Description'],$row['Content'],$row['CountryCodeISO'],$row['CityCode']);
    }

    $pdo = null;
    echo json_encode($resultSet);

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}
?>