var favorState = {};

window.onload = function () {
    drawUserCenter();
    favorState.imgs=[];
    favorState.pageI = 1;//当前页码
    console.log("初始化加载");
    getAndShowFavor();
};

//显示我的收藏
function getAndShowFavor() {
    let userID = getUserID();
    let xml1 = $.ajax({
        type: "POST",
        url: '../src/php/getMyFavors.php',
        dataType: 'json',
        //async: false,
        data: {'userID': userID},

        success: function (ans) {
            favorState.imgs = ans;
            if (favorState.imgs.length > 0) {
                favorState.pageI = 1;
                drawCurrentPage();
            } else {
                let imgDivE = document.getElementById("favorImages");
                imgDivE.innerHTML = "您还没有收藏照片，赶紧收藏一张喜爱的照片吧！";
                let pageBtns = document.getElementById("pageBtns");
                pageBtns.innerHTML = "<br><br>\n";
            }
        }
    });
}

//页码单页渲染
function drawCurrentPage(){
    let startIndex = (favorState.pageI-1)*8;//八个一页
    let img = favorState.imgs[startIndex];
    let html = getOneImgHtml(img);
    console.log("startIndex="+startIndex+";photoState.imgs.length="+favorState.imgs.length);//
    for(let i=startIndex+1;i<favorState.imgs.length&& i<startIndex+8;i++){
        img = favorState.imgs[i];
        html+=getOneImgHtml(img);
    }
    let imgDivE = document.getElementById("favorImages");
    imgDivE.innerHTML =html;

    //页码显示
    showPageBtns();
}

//更新页码显示
function showPageBtns(){
    let pageN =Math.ceil(favorState.imgs.length/8) ;//总页数 每页8个
    if(pageN===0){pageN =1;}//如果为空，则显示一页空
    if(pageN>5){pageN=5;}//只显示前五页
    let element =document.getElementById("pageBtns");
    let html = "<br><br>\n" +
        "                <label>" +
        "<button onclick=\"changePage(" +1+")\"><i class=\"fa fa-angle-double-left\" aria-hidden=\"true\"></i></button>\n";
    for(let pageI=1;pageI<pageN+1;pageI++){
        if(favorState.pageI===pageI){
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
function getOneImgHtml(img) {
    let basePath = "../travel-images/medium/";
    let path = basePath+img.path;
    let html;
    html="<div class=\"secondsgroup\">\n";
    console.log("imgID="+img.imgID);
    let descri = img.des;
    if(img.des==null){
        descri="暂无描述";
    }
    //<div class="secondsgroup">
    //             <a href="../src/details.html">
    //             <div class="leftPart" style="background-image: url(../img/222222.jpg)"></div>
    //             </a>
    //             <div class="rightPart">
    //                 <br><h3>Title</h3>
    //                 <p>
    //                     唐人张谓有句这样的诗：“看花寻径远，听鸟入林迷”。人生的途程不也如此吗？每一条规画好的道路、每一个经纬明确固定的位置，如果依着手册的指示而到达了固然可羡可慕，但那些“未求已应”的恩惠却更令人惊艳。那被嘤嘤鸟鸣所引渡而到达的迷离幻域，那因一朵花的呼唤而误闯的桃源，才是上天 更慷慨的福泽 的倾注。 曾经，我急于用我的小手向生命的大掌中掏取一粒粒耀眼的珍宝，但珍宝乍然消失，我抓不到我想要的东西。可是，也在这同时，我知道我被那温暖的大手握住了。手里没有东西，只有那双手掌而已，那掌心温暖厚实安妥，是“未求已应”的生命的触握
    //                 </p><br>
    //                 <button onclick="alert('图片已删除')"><i class="fa fa-trash" aria-hidden="true" ></i> 删除</button>
    //             </div>
    //             <div class="clear"></div>
    //         </div>
    //"<div class = \"pic\" style=\"background-image: url("+path+")\" ></div>";
    html+="                    <!--图片-->\n" +
        //"                    <div class=\"secondsgroup\">\n" +
        "                        <a href=\"./details.html\" onclick='setClickImgId(" +img.imgID+")'>\n" +
        "                           <div class=\"leftPart\" style=\"background-image: url("+path+")\"></div>\n"+
        "                        </a>\n" +
        "                    </div>\n" +
        "                    <div class=\"rightPart\">\n" +
        "                        <br><h3>"+img.title+"</h3>\n" +
        "                        <p>\n" +descri+
        "                        </p><br>\n" +
        "                        <button onclick=\"cancelFavor(" +img.imgID+")\"><i class=\"fa fa-trash\" aria-hidden=\"true\" ></i> 取消收藏</button>" +
        "                    </div>\n" +
        "                    <div class=\"clear\"></div>\n" +
        "                </div>";

    return html;
}

//取消收藏
function cancelFavor(imgID) {
    let userID = getUserID();
    let xml1=$.ajax({
        type: "POST",
        url:'../src/php/cancelFavor.php',
        dataType:'json',
        data:{'imgID':imgID,'userID':userID},

        success:function (ans) {
            console.log("删除完毕");
            getAndShowFavor();//跳到第一页开始重新绘制
        }
    });
}

//页码点击
function changePage(pageI){
    if(pageI==1){
        favorState.pageI = 1;
    }else if(pageI==2){
        favorState.pageI = 2;
    }else if(pageI==3){
        favorState.pageI = 3;
    }else if(pageI==4){
        favorState.pageI = 4;
    }else if(pageI==5){
        favorState.pageI = 5;
    }
    drawCurrentPage();
}