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

var historyMessages=document.getElementById("historyMessages");
var uid =getQueryVariable("uid");
var fid =getQueryVariable("fid");

function getMessages()
{
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', rootUrl + historyMessageUrl+"/"+uid+"/"+fid, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.onreadystatechange = function ()
    {
        if (httpRequest.readyState === 4 && httpRequest.status === 200)
        {
            var json = JSON.parse(httpRequest.responseText);
            if(json.flag===true)
            {
                var messages=json.data;
                for(var i=0;i<messages.length;i++){
                    var li = document.createElement("li");
                    li.innerHTML="<div style='overflow-x:scroll; overflow:hidden;'>" + messages[i].createTime+"-用户"+
                        messages[i].sender+"发送了:"+messages[i].info + "</div>";
                    historyMessages.appendChild(li);
                }
            }
            else{}
        }
    };
    httpRequest.send();
}
getMessages();