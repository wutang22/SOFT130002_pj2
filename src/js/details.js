var detailState = {};

window.onload = function () {
    drawUserCenter();
    detailState.img={};

    //通过后台读取图片详情
    let imgID = getClickImgId();
    console.log("通过后台读取图片详情...");//
    let xml1 = $.ajax({
        type: "POST",
        url: '/src/php/imageInfo.php',
        dataType: 'json',
        async: true,
        data: {'imgID': imgID},

        success: function (ans) {
            detailState.img = ans;
            draw();
        }
    });
};

function draw() {
    let titleE = document.getElementById("title");
    if(detailState.img.title==null){
        titleE.innerHTML = "佚名";
    }
    else {
        titleE.innerHTML = detailState.img.title;
    }

    let ownerE = document.getElementById("owner");
    ownerE.innerHTML = "by "+detailState.img.ownerName;
    let imgE =document.getElementById("img");
    let path = "/travel-images/medium/"+detailState.img.path;
    console.log(path);
    imgE.innerHTML = "<div class=\"leftPart\" style=\"background-image: url("+path+")\"></div>";

    drawFavorIcon();//渲染收藏

    //填充theme，国家名，城市名,des
    let themeE = document.getElementById("theme");
    themeE.innerHTML = "主题: "+detailState.img.theme;

    let countryE = document.getElementById("country");
    countryE.innerHTML = "拍摄国家： "+detailState.img.countryName;

    let cityE = document.getElementById("city");
    cityE.innerHTML = "拍摄城市： "+detailState.img.cityName;

    let desE = document.getElementById("des");
    if(detailState.img.des==null){
        desE.innerHTML = "暂无描述";
    }else{
        desE.innerHTML = detailState.img.des;
    }
}

//渲染收藏
function drawFavorIcon() {
    let favorBtnE = document.getElementById("favorBtn");
    let favorNumE = document.getElementById("favorNum");
    favorNumE.innerHTML = detailState.img.favorNum;
    //判断是否登录
    if(isUserLogin()){
        //已登录
        detailState.userID = getUserID();
        //判断是否已经收藏
        let xml1 = $.ajax({
            type: "POST",
            url: '/src/php/haveFavored.php',
            dataType: 'json',
            async: false,
            data: {'userID': detailState.userID,'imgID':detailState.img.imgID},

            success: function (ans) {
                showFavor(ans);
            }
        });
    }else {
        //未登录
        favorBtnE.onclick = function () {
            alert("您未登录，请登录后再操作！");
        };
        favorBtnE.innerHTML = "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i> 收藏";
    }
}

//显示收藏/未收藏
function showFavor(isFavor) {
    let favorBtnE = document.getElementById("favorBtn");
    let favorNumE = document.getElementById("favorNum");
    favorNumE.innerHTML = detailState.img.favorNum;
    if(isFavor){
        favorBtnE.innerHTML = "<i class=\"fa fa-heart\" aria-hidden=\"true\"></i> 取消收藏";
        favorBtnE.onclick = function(){
            cancelFavor();
        };
    }else {
        favorBtnE.innerHTML = "<i class=\"fa fa-heart-o\" aria-hidden=\"true\"></i> 收藏";
        favorBtnE.onclick = function(){
            addFavor();
        };
    }
}


// 添加收藏
function addFavor() {
    detailState.img.favorNum++;
    let xml1 = $.ajax({
        type: "POST",
        url: '/src/php/addFavor.php',
        dataType: 'json',
        async: false,
        data: {'userID': detailState.userID,'imgID':detailState.img.imgID},

        success: function (ans) {
            showFavor(true);
        }
    });
}

// 取消收藏
function cancelFavor() {
    detailState.img.favorNum--;
    console.log("取消收藏,发起后台");
    let xml1 = $.ajax({
        type: "POST",
        url: '/src/php/cancelFavor.php',
        dataType: 'json',
        async: false,
        data: {'userID': detailState.userID,'imgID':detailState.img.imgID},

        success: function (ans) {
            showFavor(false);
        }
    });
}