<?php
//获得Counties和Cities

require_once('config.php');

class County{
    var $country;
    var $cities;
    var $iso;
    var $citiesCode;
    public function __construct($countryName,$countryIso)
    {
        $this->country = $countryName;
        $this->iso = $countryIso;
        $this->cities = array();
    }
    public function pushCity($city,$citiesC){
        $this->cities[] = $city;
        $this->citiesCode[] = $citiesC;
    }
}

try {
    //创建PDO实例
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //设置sql语句  按热度排序获得imageID，title，des，path
    $sql = "SELECT CountryName,ISO FROM geocountries order by CountryName";
    $result = $pdo->query($sql);

    $ccDatas = array();
    $ccDataN = 0;
    $cISO = array();
    //遍历结果集
    while ($row = $result->fetch()) {
        $ccDatas[] = new County($row['CountryName'],$row['ISO']);
        $cISO[] = $row['ISO'];
        $ccDataN++;
    }

    for ($i=0;$i<$ccDataN;$i++){
//            echo $cISO[$i]."<br>";//
        $sql = "SELECT AsciiName,GeoNameID FROM geocities WHERE CountryCodeISO =  '".$cISO[$i]."' order by AsciiName";
        $result = $pdo->query($sql);

        while ($row = $result->fetch()){
//                echo "--->".$row['AsciiName']."<br>";//
            $ccDatas[$i]->pushCity($row['AsciiName'],$row['GeoNameID']);
        }
    }
    $pdo = null;
    echo json_encode($ccDatas);

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}
