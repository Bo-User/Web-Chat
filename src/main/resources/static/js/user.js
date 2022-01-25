function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
    }
    return(false);
}

var uid =getQueryVariable("uid");
var rootUrl="http://localhost:8666";

function getInfo(){
    var getInfoUrl=rootUrl+"/user/getUserInfo/"+uid;
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', getInfoUrl, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var json = JSON.parse(httpRequest.responseText);
            if(json.flag===true) {//查询到了
                var message=json.data;//用户信息
                var id=message.id;
                var name=message.name;
                var password=message.password;
                var introduction=message.introduction;
                var image=message.image;
                document.getElementById("userId").value=id;
                document.getElementById("usernameDiv").value=name;
                document.getElementById("passwordDiv").value=password;
                document.getElementById("messageTextArea").value=introduction;
                document.getElementById("avatorImg").src=image;
            }
            else
                alert("未查询到信息！");
        }
    }
}

//返回聊天页面
function backPage(){
    sessionStorage.setItem("userId",uid);
    window.location.href = rootUrl+"/html/homepage.html";
}

//启用修改密码功能
function editPass() {
    document.getElementById("passwordDiv").removeAttribute("readonly");
}

//保存信息
function saveInfos() {
    var id=document.getElementById("userId").value;
    var name=document.getElementById("usernameDiv").value;
    var password=document.getElementById("passwordDiv").value;
    var introduction=document.getElementById("messageTextArea").value;
    var image=document.getElementById("avatorImg").src;

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST',rootUrl+'/user/update', true);
    httpRequest.setRequestHeader("Content-type", "application/json");

    var data ={
        "username":id ,
        "password": password,
        "name":name,
        "introduction":introduction,
        "image":image
    };
    httpRequest.send(JSON.stringify(data));

    httpRequest.onreadystatechange = function ()
    {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
        {
            var json = JSON.parse(httpRequest.responseText);
            if(json.flag===true)
            {
                alert("保存成功，将返回聊天界面!");
                backPage();
            }
            else
                alert("保存失败!");
        }
    };
}

//图片上传
function picSubmitFunction() {
    document.getElementById("submitPicButton").click();//实现一键双击
}

function uploadPicOSS(event){
    if(event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    var formData = new FormData();
    formData.append("file",document.getElementById("picInp").files[0]);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', "http://localhost:8666/oss/fileoss", false);
    httpRequest.contentType=false;
    httpRequest.processData=false;
    httpRequest.onreadystatechange = function ()
    {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
        {
            document.getElementById("avatorImg").src=httpRequest.responseText;
            alert("上传头像成功，请点击保存键进行保存！");
        }
    };
    httpRequest.send(formData);
}

getInfo();