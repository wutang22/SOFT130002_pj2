window.onload = function () {
    drawUserCenter();
    drawImages("hot");//hot默认热门，刷新random
};

//绘制图片
function drawImages(getType) {
    let xml=$.ajax({
        type: "POST",
        url:'/src/php/selectImages.php',
        dataType:'json',
        async:false,
        data:{'getType':getType},

        success:function (ans) {
            let result = ans;
            console.log("取出热门图片成功");
            drawSingleImage(result);
        }
    } );
}

function drawSingleImage(pictures) {
    let basePath = "/travel-images/medium/";
    for (let i=0;i<6;i++){
        let picture = pictures[i];
        let path = basePath+ picture["path"];
        let n = i+1;
        let element = document.getElementById("img"+n);
        let titleE = document.getElementById("title"+n);
        let describeE =document.getElementById("describe"+n);

        //<a href="src/details.html" id="img1">
        //                 <div class = "pic" style="background-image: url(img/222222.jpg)" ></div>
        //             </a>
        element.innerHTML = "<div class = \"pic\" style=\"background-image: url("+path+")\" ></div>";
        //console.log(path);
        if(picture["title"]==null){
            titleE.innerHTML = "佚名";
        }else{
            titleE.innerHTML =picture["title"];
        }
        if(picture["des"]==null){
            describeE.innerHTML = "暂无简介";
        }else{
            describeE.innerHTML = picture["des"] ;
        }

        element.onclick = function () {
            setClickImgId(picture["imageID"]);
        }
    }
}



