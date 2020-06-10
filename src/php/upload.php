<?php

require_once('config.php');

$ifhasImgFile = $_POST['ifhasImgFile'];
$imgID = $_POST["imgID"];
$title = $_POST["titleName"];
$des = $_POST["imgDes"];
$cityCode = $_POST["selCity"];
$countryISO = $_POST["selCountry"];
$userID = $_POST["userID"];
$content = $_POST["selTheme"];

echo "php这边开始上传";
function setPath($ifhasImgFile ){
    if($ifhasImgFile=="true"){
        //获取绝对路径
        $bashpath = dirname(__FILE__);///Users/wuyanqi0822/Desktop/web_PJ2_6.21/myPJ2/src/php
        //echo $bashpath.",,,,,,,,";
        $array1 = explode("/",$bashpath);
        for($i=0; $i<count($array1)-2; $i++){
            $str_arr2[] = $array1[$i];
        }
        $bashpath =implode("/",$str_arr2);
        $bashpath= $bashpath."/travel-images/medium/";

        if ($_FILES["chooseImage"]["error"] > 0)
        {
            echo "错误: " . $_FILES["chooseImage"]["error"] . "<br>";
        } else {
            if (file_exists($bashpath. $_FILES["chooseImage"]["name"])) {
                echo $_FILES["chooseImage"]["name"] . " 文件已经存在。 ";
            }else{
                move_uploaded_file($_FILES["chooseImage"]["tmp_name"], $bashpath.$_FILES["chooseImage"]["name"]);
                //echo $_FILES["chooseImage"]["tmp_name"]."   ".$_FILES["chooseImage"]["name"];
                echo "文件转移成功";
            }
        }
        $path = $_FILES["chooseImage"]["name"];
    }else{
        $path = $_POST['noFilePath'];
    }
    return $path;
}

try{
    echo "开始移动文件";
    $path = setPath($ifhasImgFile);
    //创建PDO实例
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "开始执行数据库操作";
    //判断修改还是新增
    if($imgID==-1){//新增
        echo "新增";
        //设置sql语句
        $sql = "INSERT INTO travelimage (Title, Description,CityCode,CountryCodeISO,UID,PATH,Content) 
VALUES ('".$title."','".$des."','".$cityCode."','".$countryISO."','".$userID."','".$path."','".$content."')";
        $result = $pdo->query($sql);
    }else{//修改
        echo "修改";
        $sql = "UPDATE travelimage SET Title = '".$title."', Description = '".$des."', CityCode = '".$cityCode."', 
            CountryCodeISO = '".$countryISO."', PATH = '".$path."', Content = '".$content."' WHERE ImageID=".$imgID;
        $result = $pdo->query($sql);
    }
    $pdo = null;
}catch (PDOException $e) {//异常处理
    echo"出现异常";
    die( $e->getMessage() );
}

?>