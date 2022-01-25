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
var fid =getQueryVariable("fid");
var rootUrl="http://localhost:8666";

function getInfo(){
    var getInfoUrl=rootUrl+"/user/getUserInfo/"+fid;
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
                var introduction=message.introduction;
                var image=message.image;
                document.getElementById("userId").value=id;
                document.getElementById("usernameDiv").value=name;
                document.getElementById("messageTextArea").value=introduction;
                document.getElementById("avatorImg").src=image;
            }
            else
                alert("未查询到该好友的信息！");
            }
    }
}

function backPage(){
    sessionStorage.setItem("userId",uid);
    window.location.href = rootUrl+"/html/homepage.html";
}

function deleteFriend(){
    var r=confirm("确定删除该好友？");
    if (r==true)
    {
        //调用api删除好友
        var deleteUrl=rootUrl+"/user/deleteFriend/"+uid+"/"+fid;
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', deleteUrl, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                var json = JSON.parse(httpRequest.responseText);
                if(json.flag===true) {//删除成功
                    alert("删除成功，将返回聊天页面!");
                    backPage();
                }else
                    alert("删除失败！")
            }
        };
    }
}

getInfo();