var photoState={};

window.onload = function () {
    drawUserCenter();
    photoState.imgs=[];
    photoState.pageI = 1;//当前页面 从1开始
    getPhotosAndShow();
};

//根据用户ID，从后台获取我的所有照片
function getPhotosAndShow() {
    let userID = getUserID();
    let xml1 = $.ajax({
        type: "POST",
        url: '../src/php/getMyPhotos.php',
        dataType: 'json',
        //async: false,//异步，必须的
        data: {'userID': userID},

        success: function (ans) {
            //imgs[]= Imgae{ImageID,imagePathe,title,des}
            photoState.imgs = ans;
            console.log("ans.length="+ans.length);//

            if (photoState.imgs.length > 0) {
                //有：将所有图片进行渲染
                //  1.图片，页码信息进行设置
                photoState.pageI = 1;
                //  2.页码单页渲染
                drawCurrentPage();
            } else {
                //无：显示一句话
                let imgDivE = document.getElementById("myPhotos");
                imgDivE.innerHTML = "您还没有上传照片，赶紧点击个人中心的上传按钮增加一张吧！";
                let pageBtns = document.getElementById("pageBtns");
                pageBtns.innerHTML = "<br><br>\n";
            }
        }
    });
}

//页码单页渲染(imgs有值)
function drawCurrentPage() {
    let startIndex = (photoState.pageI-1)*8;//八个一页
    let img = photoState.imgs[startIndex];
    let html = getOneImgHtml(img,true);
    console.log("startIndex="+startIndex+";photoState.imgs.length="+photoState.imgs.length);//
    for(let i=startIndex+1;i<photoState.imgs.length&& i<startIndex+8;i++){
        img = photoState.imgs[i];
        html+=getOneImgHtml(img,false);
    }
    let imgDivE = document.getElementById("myPhotos");
    imgDivE.innerHTML =html;

    //页码显示
    showPageBtns();
}

//更新页码显示
function showPageBtns() {
    let pageN =Math.ceil(photoState.imgs.length/8) ;//总页数 每页8个
    if(pageN===0){pageN =1;}//如果为空，则显示一页空
    if(pageN>5){pageN=5;}//只显示前五页
    let element =document.getElementById("pageBtns");
    let html = "<br><br>\n" +
        "                <label>" +
        "<button onclick=\"changePage(" +1+")\"><i class=\"fa fa-angle-double-left\" aria-hidden=\"true\"></i></button>\n";
    for(let pageI=1;pageI<pageN+1;pageI++){
        if(photoState.pageI===pageI){
            html+="<button onclick=\"changePage(" +pageI+")\" class=\"highlight\">" +pageI+"</button>\n" ;
        }else {
            html+="<button onclick=\"changePage(" +pageI+")\">" +pageI+"</button>\n" ;
        }

    }
    html+="<button onclick=\"changePage(" +pageN+")\"><i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i></button>" +
        "</label>";
    element.innerHTML=html;
}

//拼凑单个图片的html
function getOneImgHtml(img,isFirst) {
    let basePath = "../travel-images/medium/";
    let path = basePath+img.path;
    let html;
    /*
    if(isFirst){
        html = "<div>\n" ;
    }else {
        html="<div class=\"secondsgroup\">\n";
    }
     */
    html="<div class=\"secondsgroup\">\n";
    let descri = img.des;
    if(img.des==null){
        descri="暂无描述";
    }
    console.log("imgID="+img.imgID);//
    // <div class="secondsgroup">
    //             <a href="../src/details.html">
    //             <div class="leftPart" style="background-image: url(../img/222222.jpg)"></div>
    //             </a>
    //             <div class="rightPart">
    //                 <br><h3>Title</h3>
    //                 <p>
    //                     唐人张谓有句这样的诗：“看花寻径远，听鸟入林迷”。人生的途程不也如此吗？每一条规画好的道路、每一个经纬明确固定的位置，如果依着手册的指示而到达了固然可羡可慕，但那些“未求已应”的恩惠却更令人惊艳。那被嘤嘤鸟鸣所引渡而到达的迷离幻域，那因一朵花的呼唤而误闯的桃源，才是上天 更慷慨的福泽 的倾注。 曾经，我急于用我的小手向生命的大掌中掏取一粒粒耀眼的珍宝，但珍宝乍然消失，我抓不到我想要的东西。可是，也在这同时，我知道我被那温暖的大手握住了。手里没有东西，只有那双手掌而已，那掌心温暖厚实安妥，是“未求已应”的生命的触握
    //                 </p><br>
    //                 <button onclick="window.location.href='./upload.html'"><i class="fa fa-pencil" aria-hidden="true" ></i> 修改</button>
    //                 <button onclick="alert('图片已删除')"><i class="fa fa-trash" aria-hidden="true" ></i> 删除</button>
    //             </div>
    //             <div class="clear"></div>
    //         </div>
    html+="                    <!--图片-->\n" +
        "                        <a href=\"./details.html\" onclick='setClickImgId(" +img.imgID+")'>\n" +
        "                            <div class=\"leftPart\" style=\"background-image: url("+path+")\"></div>\n"+
        "                        </a>\n" +
        "                    </div>\n" +
        "                    <div class=\"rightPart\">\n" +
        "                        <br><h3>" +img.title+"</h3>\n" +
        "                        <p>\n" +descri+
        "                        </p><br>\n" +
        "                        <button onclick=\"modifyImg(" +img.imgID+")\"><i class=\"fa fa-pencil\" aria-hidden=\"true\" ></i> 修改</button>\n" +
        "                        <button onclick=\"deleteImg(" +img.imgID+")\"><i class=\"fa fa-trash\" aria-hidden=\"true\" ></i> 删除</button>\n" +
        "                    </div>\n" +
        "                    <div class=\"clear\"></div>\n" +
        "                </div>";

    return html;
}

//----------按钮处理事件-------------------
//修改按钮
function modifyImg(imgID) {
    setEditImg(imgID);
    console.log("开始修改");
    window.location.href='./upload.html';
}

//删除按钮
function deleteImg(imgID) {
    let xml1=$.ajax({
        type: "POST",
        url:'../src/php/deleteImage.php',
        dataType:'json',
        //async:true,
        data:{'imgID':imgID},

        success:function (ans) {
            console.log("删除完毕");//
            getPhotosAndShow();//重新显示
        }
    });
}

//页码点击 跳转页面 从1开始 pageN可能是字符串
function changePage(pageI) {
    if(pageI==1){
        photoState.pageI = 1;
    }else if(pageI==2){
        photoState.pageI = 2;
    }else if(pageI==3){
        photoState.pageI = 3;
    }else if(pageI==4){
        photoState.pageI = 4;
    }else if(pageI==5){
        photoState.pageI = 5;
    }
    drawCurrentPage();
}

