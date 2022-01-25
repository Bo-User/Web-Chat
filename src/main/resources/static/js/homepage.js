var username;
var toName;
var ws;
window.onload = function ()
{
  username=sessionStorage.getItem("userId");

  document.getElementById("userNameDiv").innerHTML=username;

  var picInp = document.getElementById("picInp");
  var fileInp = document.getElementById("fileInp");

  ShowFriendsList();

  ws = new WebSocket("ws://localhost:8666/chat");
  ws.onopen = function (ev) { };
  ws.onmessage = function (ev) {
    var datastr = ev.data;
    var res = JSON.parse(datastr);
    var str="";
    if(res.type===-1){
        //登录时的未读消息，存在sessionStorage里
        var toRead=res.message;
        if(toRead.length>0)//为0则没有未读信息，跳过此步
        {
            for(var i=0;i<toRead.length;i++)
            {
                if(toRead[i].sender!=username)
                    str="<div class=\"current-chatRoom-person\">"+
                        "<div class=\"current-person-words\">"+
                        "<span class=\"current-person-name\">"+toRead[i].sender+"</span>"+
                        "<span class=\"current-person-message\">: "+toRead[i].info+"</span>"+
                        "</div></div>";
                else
                    str="<div class=\"current-chatRoom-person\">"+
                        "<div class=\"current-my-words\">"+
                        "<span class=\"current-person-name\">"+toRead[i].sender+"</span>"+
                        "<span class=\"current-person-message\">: "+toRead[i].info+"</span>"+
                        "</div></div>";
                var chatdata = sessionStorage.getItem(toRead[i].sender+"---"+username);
                //toRead[i].sender
                if (chatdata != null)
                    str = chatdata + str;
                sessionStorage.setItem(toRead[i].sender+"---"+username,str);
                //toRead[i].sender
            }
        }
    }
    else if(res.type===0||res.type===1||res.type===2) {
        if(res.fromName!=username)
            str = "<div class=\"current-chatRoom-person\">" +
                "<div class=\"current-person-words\">" +
                "<span class=\"current-person-name\">" + res.fromName + "</span>" +
                "<span class=\"current-person-message\">: " + res.message + "</span>" +
                "</div></div>";
        else
            str = "<div class=\"current-chatRoom-person\">" +
                "<div class=\"current-my-words\">" +
                "<span class=\"current-person-name\">" + res.fromName + "</span>" +
                "<span class=\"current-person-message\">: " + res.message + "</span>" +
                "</div></div>";
    }

    if (toName === res.fromName){
        var div = document.createElement("div");
        div.innerHTML=str;
        document.getElementById("chatRoomBox").appendChild(div);
    }
    var chat = sessionStorage.getItem(res.fromName+"---"+username);
    //res.fromName
    if (chat != null)
        str = chat + str;
    sessionStorage.setItem(res.fromName+"---"+username,str);
    //res.fromName
  };
  ws.onclose = function (ev) {
    //不用写东西
  };

  //发送文字消息功能
  document.getElementById("sendMessage").onclick=function(){
      if(toName==null)
          alert("请先选择好友！");
      else{
          var data=document.getElementById("messageTextArea").value;
          document.getElementById("messageTextArea").value="";
          var json = {"sender":username,"receiver": toName ,"messageType": 0 ,"info": data};

          //将数据展示在聊天区
          var str="<div class=\"current-chatRoom-person\">"+
              "<div class=\"current-my-words\">"+
              "<span class=\"current-person-name\">"+username+"</span>"+
              "<span class=\"current-person-message\">: "+data+"</span>"+
              "</div></div>";
          var div = document.createElement("div");
          div.innerHTML=str;
          document.getElementById("chatRoomBox").appendChild(div);

          var chatdata = sessionStorage.getItem(toName+"---"+username);
          //username---toName
          if (chatdata != null)
              str = chatdata + str;

          sessionStorage.setItem(toName+"---"+username,str);
          //发送数据
          ws.send(JSON.stringify(json));

          //这里给数据库存一份，存储数据用
          var httpRequest = new XMLHttpRequest();
          httpRequest.open('POST', rootUrl + addMessageUrl , true);
          httpRequest.setRequestHeader("Content-type", "application/json");

          httpRequest.send(JSON.stringify(json));

          httpRequest.onreadystatechange = function ()
          {
              if (httpRequest.readyState === 4 && httpRequest.status === 200) {}
          };
      }

  };

    document.getElementById("viewHistory").onclick=function(){
        if(toName==null)
            alert("请先选择好友！");
        else
            window.open(rootUrl+"/html/history.html?uid="+username+"&fid="+toName);
    };

    document.getElementById("pictureDiv").onclick=function(){
        if(toName==null)
            alert("请先选择好友！");
        else
            picInp.click();
    };

    document.getElementById("fileDiv").onclick=function(){
        if(toName==null)
            alert("请先选择好友！");
        else
            fileInp.click();
    };

    document.getElementById("addBtn").onclick=function(){
        //搜索fid对应的人，不存在则alert
        //存在则alert提示添加成功
        //表格刷新
        var fid=document.getElementById("searchIn").value;
        document.getElementById("searchIn").value="";

        if(fid===username)
            alert("不能添加你自己为好友！");
        else{
            var existUrl=rootUrl+"/user/getUserInfo/"+fid;
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('GET', existUrl, true);
            httpRequest.setRequestHeader("Content-type", "application/json");
            httpRequest.send();

            httpRequest.onreadystatechange = function ()
            {
                if (httpRequest.readyState === 4 && httpRequest.status === 200)
                {
                    var json = JSON.parse(httpRequest.responseText);
                    if(json.flag===true)
                    {
                        var addUrl=rootUrl+"/user/addFriend/"+username+"/"+fid;
                        var httpRequest1 = new XMLHttpRequest();
                        httpRequest1.open('GET', addUrl, true);
                        httpRequest1.setRequestHeader("Content-type", "application/json");
                        httpRequest1.send();
                        httpRequest1.onreadystatechange = function ()
                        {
                            if (httpRequest1.readyState === 4 && httpRequest1.status === 200)
                            {
                                var json1 = JSON.parse(httpRequest1.responseText);
                                if(json1.flag===true)
                                {
                                    alert("添加好友成功！");
                                    //刷新表格
                                    ShowFriendsList();
                                }
                                else
                                    alert("你们已经是好友，不能重复添加！");
                            }
                        };
                    }
                    else
                        alert("查无此人，添加失败，请重新查找！");
                }
            };
        }
    };
};

//展示该好友的聊天界面
showChat = function(name,username){
  document.getElementById("chatRoomBox").innerHTML="";
  //姓名
  document.getElementById("chatingToName").innerHTML=name;
  //消息
  var chatdata = sessionStorage.getItem(name+"---"+username);
  //
  if (chatdata != null){
      var div = document.createElement("div");
      div.innerHTML=chatdata;
      document.getElementById("chatRoomBox").appendChild(div);
  }
};

//展示好友列表
function ShowFriendsList(){
    document.getElementById("contentTable1").innerHTML="";
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('Get', rootUrl + getFriendsUrl +"/"+ username, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send();
    httpRequest.onreadystatechange = function ()
    {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
        {
            var json = JSON.parse(httpRequest.responseText);
            if(json.flag===true)
            {
                //写到表格里
                var str="";
                for(var i=0;i<json.data.length;i++)
                {
                    str+="<tr><td>"+
                        "<img id=\"AvaPic"+i+"\" class=\"avator\" src=\""+json.data[i].image+"\" " +
                        "alt=\"头像\"  style=\"cursor:pointer\" name=\""+ json.data[i].id +"\" >" +"</td>" +
                        "<td id=\""+"line"+i+"\" style=\"cursor:pointer\">"+json.data[i].id+"</td></tr>";
                }
                document.getElementById("contentTable1").innerHTML=str;
                for(var i=0;i<json.data.length;i++)
                {
                    //点击头像查看信息
                    document.getElementById("AvaPic"+i).onclick=function(){
                        //打开信息页面
                        window.location.href = rootUrl+"/html/friendInfo.html?uid="+username+"&fid="+this.name;
                    };

                    //点击姓名查看
                    document.getElementById("line"+i).onclick=function(){
                        toName=this.innerHTML;
                        showChat(toName,username);
                    }
                }
            }
            else
                alert("请重新登录!");
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
            PicFile(httpRequest.responseText,1);
            alert("发送图片成功");
        }
    };
    httpRequest.send(formData);
}

//文件上传
function fileSubmitFunction(){
    document.getElementById("submitFileButton").click();
}
function uploadFileOSS(event){
    if(event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    var formData = new FormData();
    formData.append("file",document.getElementById("fileInp").files[0]);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', "http://localhost:8666/oss/fileoss", false);
    httpRequest.contentType=false;
    httpRequest.processData=false;
    httpRequest.onreadystatechange = function ()
    {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
        {
            PicFile(httpRequest.responseText,2);
            alert("发送文件成功");
        }
    };
    httpRequest.send(formData);
}

//个人信息
function viewMyInfo() {
    //跳转到个人信息页面，可以进行修改
    window.location.href=rootUrl+"/html/user.html?uid="+username;
}

//退出系统
function exitSystem() {
    var r=confirm("确定退出系统？");
    if (r==true)
        window.location.href = '../';
}

//把图片和文件信息展示在聊天界面
PicFile = function(data,type){
    //存在session里
   if(type===1)
       data=" 图片消息: "+data;
   else if(type===2)
       data=" 文件消息: "+data;
    var json = {"sender":username,"receiver": toName ,"messageType": type ,"info": data};

    //将数据展示在聊天区
    var str="<div class=\"current-chatRoom-person\">"+
        "<div class=\"current-my-words\">"+
        "<span class=\"current-person-name\">"+username+"</span>"+
        "<span class=\"current-person-message\">: "+data+"</span>"+
        "</div></div>";
    var div = document.createElement("div");
    div.innerHTML=str;
    document.getElementById("chatRoomBox").appendChild(div);

    var chatdata = sessionStorage.getItem(toName+"---"+username);

    if (chatdata != null)
        str = chatdata + str;

    sessionStorage.setItem(toName+"---"+username,str);
    //发送数据
    ws.send(JSON.stringify(json));

    //这里给数据库存一份，存储数据用
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', rootUrl + addMessageUrl , true);
    httpRequest.setRequestHeader("Content-type", "application/json");

    httpRequest.send(JSON.stringify(json));

    httpRequest.onreadystatechange = function ()
    {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {}
    };
};