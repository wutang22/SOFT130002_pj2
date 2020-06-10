<?php
//获得所有主题

require_once('config.php');

try {
    //创建PDO实例
    $pdo = new PDO(DBCONNSTRING,DBUSER,DBPASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    //设置sql语句  按热度排序获得imageID，title，des，path
    $sql = "SELECT Content FROM travelimage GROUP BY Content order by Content";
    $result = $pdo->query($sql);

    $themes =array();
    //遍历结果集
    while ($row = $result->fetch()) {
        $themes[] = $row['Content'];
    }

    $pdo = null;
    echo json_encode($themes);

}catch (PDOException $e) {//异常处理
    die( $e->getMessage() );
}
