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
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT CountryName,ISO FROM geocountries order by CountryName";
    $result = $pdo->query($sql);

    $ccDatas = array();
    $ccDataN = 0;
    $cISO = array();

    while ($row = $result->fetch()) {
        $ccDatas[] = new County($row['CountryName'],$row['ISO']);
        $cISO[] = $row['ISO'];
        $ccDataN++;
    }

    for ($i=0;$i<$ccDataN;$i++){
        $sql = "SELECT AsciiName,GeoNameID FROM geocities WHERE CountryCodeISO =  '".$cISO[$i]."' order by AsciiName";
        $result = $pdo->query($sql);

        while ($row = $result->fetch()){
            $ccDatas[$i]->pushCity($row['AsciiName'],$row['GeoNameID']);
        }
    }
    $pdo = null;
    echo json_encode($ccDatas);

}catch (PDOException $e) {
    die( $e->getMessage() );
}
