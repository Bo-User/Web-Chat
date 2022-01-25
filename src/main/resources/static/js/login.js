window.onload = function ()
{
    document.getElementById("submit").onclick = function ()
    {
        var success = checkUsername() && checkPassword();
        if (!success) return false;

        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', rootUrl + loginUrl, true);
        httpRequest.setRequestHeader("Content-type", "application/json");

        var data ={
                "username": document.getElementById("username").value,
                "password": document.getElementById("password").value
            };
        httpRequest.send(JSON.stringify(data));

        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4 && httpRequest.status === 200)
            {
                var json = JSON.parse(httpRequest.responseText);
                if(json.flag===true)
                {
                    sessionStorage.setItem("userId",json.data);
                    window.location.href = 'html/homepage.html';
                }
                else
                {
                    alert("账号或密码错误,请重新登录!");
                }
            }
        };
    };
    //失去焦点时也校验
    document.getElementById("username").onblur = checkUsername;
    document.getElementById("password").onblur = checkPassword;
};

//校验账号
function checkUsername()
{
    var usernameVal = document.getElementById("username").value;
    var usernameMsg = document.getElementById("usernameMsg");
    var regUsername = /^\w{3,12}$/;
    var flag = regUsername.test(usernameVal);
    if (flag)
    {
        usernameMsg.innerHTML = "";
    } else
    {
        usernameMsg.innerHTML = "账号必须在3-12位之间!";
    }
    return flag;
}

//校验密码
function checkPassword()
{
    var passwordVal = document.getElementById("password").value;
    var passwordMsg = document.getElementById("passwordMsg");
    var regPassword = /^\w{6,12}$/;
    var flag = regPassword.test(passwordVal);
    if (flag)
    {
        passwordMsg.innerHTML = "";
    } else
    {
        passwordMsg.innerHTML = "密码必须在6-12位之间!";
    }
    return flag;
}