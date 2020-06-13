var browserStates ={};
var jsonData ;
var themeData;

window.onload = function () {
    browserStates.imgs = [];
    browserStates.pageN = 1;//表示第一页
    initialize();
    drawUserCenter();
    showAll();

    let select= document.getElementById("selCountry");

    select.onchange=function () {
        let index=-1;
        for(let i=0;i<jsonData.length;i++){
            if(select.value==jsonData[i].iso){
                index = i;
                break;
            }
        }
        let citiesHtmlS;
        let cities = document.getElementById("selCity");
        if(index>=0){
            citiesHtmlS = "<option selected value='notSelected'>--选择城市--</option>";
            for(let i=0;i<jsonData[index].cities.length;i++){
                // console.log("citiesCode="+jsonData[index].citiesCode[i]+"("+jsonData[index].cities[i]);
                citiesHtmlS +="<option value='"+jsonData[index].citiesCode[i]+"'>"+jsonData[index].cities[i]+"</option>";
            }
        }else {
            citiesHtmlS = "<option selected value='notSelected'>--选择城市--</option>";
        }
        cities.innerHTML = citiesHtmlS;
    }
};

function initialize() {
    let isC =false;
    let isT =false;
    let xml1=$.ajax({
        type: "POST",
        url:'../src/php/countryAndCity.php',
        dataType:'json',
        async:false,//异步，必须的
        data:{'getType':"getCountriesCities"},

        success:function (ans) {
            jsonData = ans;
            showInitCCs();
            isC=true;
            if(isC&&isT){
                initSide();
            }
        }
    } );
    let xml2=$.ajax({
        type: "POST",
        url:'../src/php/getThemes.php',
        dataType:'json',
        //async:false,
        data:{'getType':"getThemes"},

        success:function (ans) {
            if(ans.length<6){//主题太少则重复
                let i=0;
                themeData =[];
                while (themeData.length<6){
                    themeData.push(ans[i]);
                    i++;
                    if(i>=ans.length){
                        i=0;
                    }
                }
            }else {
                themeData = ans;
            }
            showInitThemes();
            isT = true;
            if(isC&&isT){
                initSide();
            }
        }
    } );
}

function showInitCCs(){
    let countries = document.getElementById("selCountry");
    let countriesHtmlS="<option selected value='notSelected'>--选择国家--</option>";
    for(let i=0;i<jsonData.length;i++){
        countriesHtmlS+="<option value='"+jsonData[i].iso+"'>"+jsonData[i].country+"</option>";
    }
    countries.innerHTML = countriesHtmlS;
}

function showInitThemes() {
    let themes = document.getElementById("selConcept");
    let themeHtmlS = "<option selected value='notSelected'>--选择主题--</option>";
    for(let i=0;i<themeData.length;i++){
        themeHtmlS+="<option value='"+themeData[i]+"'>"+themeData[i]+"</option>";
    }
    themes.innerHTML = themeHtmlS;
}


//----------------五项筛选------------------------
//标题筛选
function titleFlit() {
    let titleE =document.getElementById("text1");
    let title = titleE.value;
    console.log("title="+title);//
    if(title==null||title==""){
        //跳过
    }else {
        let xml=$.ajax({
            type: "POST",
            url:'../src/php/searchImages.php',
            dataType:'json',
            //async:true,
            data:{'searchType':'title','value':title},

            success:function (ans) {
                // let result = ans;
                browserStates.imgs=ans;
                browserStates.pageN=1;
                show();
                clearChoices();
            }
        } );
    }
    show();
    clearChoices();
}
//下拉菜单联动筛选
function choicesFlit() {
    let themes = document.getElementById("selConcept");
    let countries= document.getElementById("selCountry");
    let cities = document.getElementById("selCity");
    let theme = themes.value;
    let country = countries.value;
    let city = cities.value;
    if(theme=='notSelected'&&country=='notSelected'&&city=='notSelected'){
        //无需发送后台
    }else {
        console.log("theme="+theme+";country="+country+";city="+city);
        //和后台交互获得值
        let xml=$.ajax({
            type: "POST",
            url:'../src/php/searchImages.php',
            dataType:'json',
            //async:true,
            data:{'searchType':'choices','value':'value','theme':theme,'country':country,'city':city},

            success:function (ans) {
                // let result = ans;
                browserStates.imgs=ans;
                browserStates.pageN=1;
                show();
                clearChoices();
            }
        } );
    }
    show();
    clearTitle();
}
//左侧栏热门国家筛选
function hotCountryFlit(countryISO) {
    console.log("countryISO="+countryISO);
    //和后台交互获得值
    let xml=$.ajax({
        type: "POST",
        url:'../src/php/searchImages.php',
        dataType:'json',
        //async:true,
        data:{'searchType':'hotCountry','value':countryISO},

        success:function (ans) {
            // let result = ans;
            browserStates.imgs=ans;
            browserStates.pageN=1;
            show();
            // clearChoices();
        }
    } );
    clearTitle();
    clearChoices();
}
//左侧栏热门城市筛选
function hotCityFlit(cityCode) {
    console.log("cityName="+cityCode);
    //和后台交互获得值
    let xml=$.ajax({
        type: "POST",
        url:'../src/php/searchImages.php',
        dataType:'json',
        //async:true,
        data:{'searchType':'hotCity','value':cityCode},

        success:function (ans) {
            // let result = ans;
            browserStates.imgs=ans;
            browserStates.pageN=1;
            show();
            // clearChoices();
        }
    } );
    clearTitle();
    clearChoices();
}
//左侧栏热门主题筛选
function hotThemeFlit(themeName) {
    console.log("themeName="+themeName);
    //和后台交互获得值
    let xml=$.ajax({
        type: "POST",
        url:'../src/php/searchImages.php',
        dataType:'json',
        //async:true,
        data:{'searchType':'hotTheme','value':themeName},

        success:function (ans) {
            // let result = ans;
            browserStates.imgs=ans;
            browserStates.pageN=1;
            show();
            // clearChoices();
        }
    } );
    clearTitle();
    clearChoices();
}

// ---------------显示函数--------------------------
//页面显示
function show() {
    let showDiv = document.getElementById("showDiv");
    let htmlS = "";
    let basePath = "../travel-images/medium/";
    let notEnd = true;
    for(let i=0;i<4&&notEnd;i++){
        htmlS+="<div>";
        for(let j=0;j<4&&notEnd;j++){
            //4行4列
            let index=4*4*(browserStates.pageN-1)+i*4+j;
            if(index>=browserStates.imgs.length){
                notEnd=false;
                break;
            }
            let imgPath = basePath+browserStates.imgs[index].path;
            let imgID = browserStates.imgs[index].ID;
            //<a href="./details.html"><div class="pic" style="background-image: url(../img/222222.jpg)"></div></a>
            let line ="<a href=\"./details.html\"><div class=\"pic\" onclick='setClickImgId("+imgID+")' style=\"background-image: url("+imgPath+")\"></div></a>";
            htmlS+=line;
        }
        htmlS+="</div><br>"
    }
    showDiv.innerHTML=htmlS;
    showPageBtns();
}

//显示所有
function showAll() {
    //和后台交互获得值
    let xml=$.ajax({
        type: "POST",
        url:'../src/php/searchImages.php',
        dataType:'json',
        //async:true,
        data:{'searchType':'all','value':"all"},
        success:function (ans) {
            // let result = ans;
            browserStates.imgs=ans;
            browserStates.pageN=1;
            show();
            clearChoices();
            clearTitle();
        }
    } );
}

//更新页码显示
function showPageBtns() {
    let pageN =Math.ceil(browserStates.imgs.length/16) ;//总页数
    if(pageN===0){pageN =1;}//如果为空，则显示一页空
    if(pageN>5){pageN=5;}//只显示前五页
    let element =document.getElementById("pageBtns");
    let html = "<br><br>\n" +
        "                <label>" +
        "<button type=\"button\" onclick=\"changePage(" +1+")\"><i class=\"fa fa-angle-double-left\" aria-hidden=\"true\"></i></button>\n";
    for(let pageI=1;pageI<pageN+1;pageI++){
        if(browserStates.pageN===pageI){
            html+="<button type=\"button\" onclick=\"changePage(" +pageI+")\" class=\"highlight\">" +pageI+"</button>\n" ;
        }else {
            html+="<button type=\"button\" onclick=\"changePage(" +pageI+")\">" +pageI+"</button>\n" ;
        }

    }
    html+="<button type=\"button\" onclick=\"changePage(" +pageN+")\"><i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i></button>";
    html+='</label>';
    element.innerHTML=html;
}

//跳转页面 从1开始 pageN可能是字符串
function changePage(pageN) {
    console.log("我跳转啦");
    console.log("现在的Page是："+pageN);
    if(pageN==1){
        browserStates.pageN = 1;
    }else if(pageN==2){
        browserStates.pageN = 2;
    }else if(pageN==3){
        browserStates.pageN = 3;
    }else if(pageN==4){
        browserStates.pageN = 4;
    }else if(pageN==5){
        browserStates.pageN = 5;
    }
    show();
}

//初始化侧边栏 已经确保jsonData有城市和国家，themeData有主题
function initSide() {
    let countries=[];
    let cities=[];
    let themes=[];
    let cISOs = [];
    let cityCodes =[];
    //注意每个数组长度保证是7
    for (let i=0,j=0;i<7;i++,j++){
        if(i>=jsonData.length){i=0;}
        countries.push(jsonData[i].country);
        cISOs.push(jsonData[i].iso);
        cities.push(jsonData[i].cities[0]);//取每个国家第一个城市
        cityCodes.push(jsonData[i].citiesCode[0]);
        // jsonData[index].citiesCode[i]+"'>"+jsonData[index].cities[i]
        if(j>=themeData.length){j=0;}
        themes.push(themeData[j]);
    }
    // countries = ["中国","日本","韩国","美国","英国","法国","印度"];
    // cities = ["北京","东京","首尔","纽约","伦敦","巴黎","孟买"];
    // themes = ["风景","城市","人文","动物","建筑","特色","奇迹"];
    sideShow(countries,cities,themes,cISOs,cityCodes);
}

//侧边栏显示
function sideShow(countries,cities,themes,cISOs,cityCodes) {
    let countryE = document.getElementById("hotCountries");
    let cityE = document.getElementById("hotCities");
    let themeE = document.getElementById("hotThemes");

    let html ="";
    for(let i=0;i<countries.length-1;i++){
        html +="<li><a onclick=\"hotCountryFlit('" +cISOs[i] +"')\">" +countries[i] +"</a></li>";
    }
    html+="<li><a onclick=\"hotCountryFlit('" +cISOs[countries.length-1] +"')\" class=\"last\">" +countries[countries.length-1] +"</a></li>";
    countryE.innerHTML = html;

    html="";
    for(let i=0;i<cities.length-1;i++){
        html +="<li><a onclick=\"hotCityFlit('" +cityCodes[i] +"')\">" +cities[i] +"</a></li>";
    }
    html+="<li><a onclick=\"hotCityFlit('" +cityCodes[cities.length-1] +"')\" class=\"last\">" +cities[cities.length-1] +"</a></li>";
    cityE.innerHTML = html;
    html="";
    for(let i=0;i<themes.length-1;i++){
        html +="<li><a onclick=\"hotThemeFlit('" +themes[i] +"')\">" +themes[i] +"</a></li>";
    }
    html+="<li><a onclick=\"hotThemeFlit('" +themes[themes.length-1] +"')\" class=\"last\">" + cities[cities.length-1] +"</a></li>";
    themeE.innerHTML = html;
}

// --------------清空其他过滤器------------------------
//清空标题搜索
function clearTitle() {
    let titleE =document.getElementById("text1");
    titleE.value=null;
}
//清空下拉选项多级联动
function clearChoices() {
    let themes = document.getElementById("selConcept");
    let themeHtmlS = "<option selected value='notSelected'>--选择主题--</option>";
    for(let i=0;i<themeData.length;i++){
        themeHtmlS+="<option value='"+themeData[i]+"'>"+themeData[i]+"</option>";
    }
    themes.innerHTML = themeHtmlS;
    let countries= document.getElementById("selCountry");
    let countriesHtmlS="<option selected value='notSelected'>--选择国家--</option>";
    for(let i=0;i<jsonData.length;i++){
        countriesHtmlS+="<option value='"+jsonData[i].iso+"'>"+jsonData[i].country+"</option>";
    }
    countries.innerHTML = countriesHtmlS;
    let cities = document.getElementById("selCity");
    cities.innerHTML = "<option selected value='notSelected'>--选择城市--</option>";
}