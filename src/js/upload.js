var uploadState ={};

window.onload = function () {
    drawUserCenter();

    uploadState.imgId = getEditImg();
    if(uploadState.imgId===-1){//新增
        uploadState.state = "add";
    }else {//修改状态
        uploadState.state = "edit";
    }
    console.log("uploadState.state="+uploadState.state);
    initialize();
    //若是修改状态，则恢复图片信息
    if(uploadState.state=="edit"){
        recoverDraw();
    }
    let select= document.getElementById("selCountry");
    select.onchange=function () {
        console.log("选择国家响应函数:（"+select.value+")");//
        let index=-1;
        index=uploadState.ccMap.get(select.value);//快速查找
        console.log("index="+index);//
        let citiesHtmlS;
        let cities = document.getElementById("selCity");
        console.log("getElementID。");//
        if(index>=0){
            citiesHtmlS = "<option selected value='notSelected'>--选择城市--</option>";
            console.log("开始for循环(城市数组长度"+uploadState.ccs[index].cities.length+")...");//
            for(let i=0;i<uploadState.ccs[index].cities.length;i++){
                // console.log("citiesCode="+jsonData[index].citiesCode[i]+"("+jsonData[index].cities[i]);
                citiesHtmlS +="<option value='"+uploadState.ccs[index].citiesCode[i]+"'>"+uploadState.ccs[index].cities[i]+"</option>";
            }
            console.log("结束for循环");//
        }else {
            citiesHtmlS = "<option selected value='notSelected'>--选择城市--</option>";
        }
        cities.innerHTML = citiesHtmlS;
        console.log("响应结束。");///
    }
};

//选择图片文件路径后
function renderImg() {
    var file =  document.getElementById('chooseImage').files[0];
    var re = new FileReader();
    re.readAsDataURL(file);
    re.onload = function(re){
        var imagediv=document.getElementById("showingImageDiv");
        imagediv.innerHTML=" <img id=\"showingImage\" src=\""+re.target.result+"\" alt=\"图片未加载成功\">";
    };
    //设置文件为有
    let ifhasImgFileE = document.getElementById("ifhasImgFile");
    ifhasImgFileE.value = "true";
    console.log("选择图片成功")
}

//恢复图片信息
function recoverDraw() {
    //imgID
    let xml=$.ajax({
        type: "GET",
        url:'../src/php/uploadImgInfo.php',
        dataType:'json',
        //async:true,
        data:{'imgID':uploadState.imgId},

        success:function (ans) {
            // let result = ans;
            uploadState.img=ans;
            showImgMes();
        }
    } );
}

//加载图片已有信息
function showImgMes() {
    let titleE = document.getElementById("titleName");
    let desE = document.getElementById("imgDes");
    let imgE=document.getElementById("showingImageDiv");
    titleE.value = uploadState.img.title;
    desE.value = uploadState.img.des;
    let path = "../travel-images/medium/" + uploadState.img.path;
    imgE.innerHTML=" <img id=\"showingImage\" src=\""+path+"\" alt=\"图片未加载成功\">";
    let nofileE = document.getElementById("noFilePath");
    nofileE.value = uploadState.img.path;

    //多选项载入
    selectTheme(uploadState.img.theme);
    let index=selectCountry(uploadState.img.countryISO);
    selectCity(uploadState.img.cityCode,index);

    //按钮名称变
    let btn = document.getElementById("submitBtm");
    btn.innerHTML = "<input type=\"submit\" value=\"修改\" onclick=\"return mysubmit();\">";
}
//恢复原有图片的主题
function selectTheme(selectedTheme) {
    let themeE = document.getElementById("selTheme");
    let themes = ["Scenery","City","People","Animal","Building","Wonder","Other"];
    let html = "<option value=\"notSelected\">--选择主题--</option> ";
    for(let i=0;i<themes.length;i++){
        let theme = themes[i];
        let themeValue = theme.toLowerCase();
        if(themeValue==selectedTheme){
            html+="<option selected value=\"" +themeValue+ "\">" +theme+ "</option>";
        }else {
            html+="<option value=\"" +themeValue+ "\">" +theme+ "</option>";
        }
    }
    themeE.innerHTML = html;
}
//恢复原有图片的国家信息
function selectCountry(selectCountryISO) {
    let countries = document.getElementById("selCountry");
    let countriesHtmlS="<option value='notSelected'>--选择国家--</option>";
    let index =0;
    for(let i=0;i<uploadState.ccs.length;i++){
        if(selectCountryISO==uploadState.ccs[i].iso){
            countriesHtmlS+="<option selected value='"+uploadState.ccs[i].iso+"'>"+uploadState.ccs[i].country+"</option>";
            index=i;
        }else {
            countriesHtmlS+="<option value='"+uploadState.ccs[i].iso+"'>"+uploadState.ccs[i].country+"</option>";
        }
    }
    countries.innerHTML = countriesHtmlS;
    return index;
}
//恢复原有图片的城市信息
function selectCity(selectCityCode,index) {
    let cities = document.getElementById("selCity");
    let citiesHtmlS = "<option value='notSelected'>--选择城市--</option>";
    for(let i=0;i<uploadState.ccs[index].cities.length;i++){
        if(selectCityCode==uploadState.ccs[index].citiesCode[i]){
            citiesHtmlS +="<option selected value='"+uploadState.ccs[index].citiesCode[i]+"'>"+uploadState.ccs[index].cities[i]+"</option>";
        }else {
            citiesHtmlS +="<option value='"+uploadState.ccs[index].citiesCode[i]+"'>"+uploadState.ccs[index].cities[i]+"</option>";
        }
    }
    cities.innerHTML = citiesHtmlS;
}

//上传判断
function mysubmit() {
    console.log("上传按钮被点击！");
    let isFilled=true;
    let errorS ="信息不完整，无法提交！请填写以下信息：\n";
    let titleName = document.getElementById("titleName").value;
    let des = document.getElementById("imgDes").value;
    let themeE = document.getElementById("selTheme");
    let countryE = document.getElementById("selCountry");
    let cityE = document.getElementById("selCity");

    //图片是否上传
    if(uploadState.state=="edit"){
        //跳过检查
    }else {
        let file =  document.getElementById('chooseImage').files[0];
        if(file==null||typeof(file) === undefined){
            isFilled=false;
            errorS+="--选择上传图片文件\n";
            console.log("图片未上传");
        }
    }

    //是否有标题
    if(titleName==null ||titleName==""){
        isFilled =false;
        errorS+="--图片标题\n";
    }
    //是否有描述
    if(des==null||des==""){
        isFilled =false;
        errorS+="--图片描述\n";
    }
    //是否选择主题
    if(themeE.value=="notSelected"){
        isFilled =false;
        errorS +="--选择主题\n";
    }
    //是否选择国家
    if(countryE.value =="notSelected"){
        isFilled =false;
        errorS +="--选择国家\n";
    }
    //是否选择城市
    if(cityE.value =="notSelected"){
        isFilled =false;
        errorS +="--选择城市\n";
    }

    if(isFilled===false){
        alert(errorS);
    }
    console.log("上传图片合理性检查结果是："+isFilled);

    if(isFilled){
        let formData = new FormData($('form')[0]);
        //formData.append('file',$(':file')[0].files[0]);
        //坑点: 无论怎么传数据,console.log(formData)都会显示为空,但其实值是存在的,f12查看Net tab可以看到数据被上传了
        $.ajax({
            url:'../src/php/upload.php',
            type: 'POST',
            data: formData,
            //这两个设置项必填
            contentType: false,
            processData: false,
            success:function(ans){
                console.log("上传结束！");
            }
        });
    }
    console.log("上传结束开始回调");
    console.log(isFilled);
    return isFilled;
}

function initialize() {
    let userE = document.getElementById("userID");
    let imgE = document.getElementById("imgID");//为了表单而设计的隐藏属性
    imgE.value =uploadState.imgId;
    console.log("imgE.value="+imgE.value);
    userE.value = getUserID();

    let xml1=$.ajax({
        type: "POST",
        url:'../src/php/countryAndCity.php',
        dataType:'json',
        async:false,
        data:{'getType':"getCountriesCities"},

        success:function (ans) {
            uploadState.ccs = ans;
            showInitCCs();
        }
    } );
}

function showInitCCs(){
    let ccMap = new Map();//设置map，看能不能加速
    let countries = document.getElementById("selCountry");
    let countriesHtmlS="<option selected value='notSelected'>--选择国家--</option>";
    for(let i=0;i<uploadState.ccs.length;i++){
        ccMap.set(uploadState.ccs[i].iso,i);
        countriesHtmlS+="<option value='"+uploadState.ccs[i].iso+"'>"+uploadState.ccs[i].country+"</option>";
    }
    uploadState.ccMap = ccMap;
    countries.innerHTML = countriesHtmlS;
}
