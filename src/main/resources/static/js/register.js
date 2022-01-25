window.onload = function ()
{
    document.getElementById("submit").onclick = function ()
    {
        //校验
        var success=checkUsername() && checkPassword() && checkConfirmPassword();
         if(!success) return false;

        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST',  rootUrl + registerUrl, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        //发送请求
        var data ={
                "username": document.getElementById("username").value,
                "password": document.getElementById("password").value,
            };
        httpRequest.send(JSON.stringify(data));
        //获取结果
        httpRequest.onreadystatechange = function ()
        {
            if (httpRequest.readyState === 4 && httpRequest.status === 200)
            {
                var json = JSON.parse(httpRequest.responseText);
                if(json.flag===true)
                {
                    window.location.href = '../';
                    alert("注册成功,将跳转到登录界面!");
                }
                else
                    alert("注册失败,账号已存在!");
            }
        };
    
    };
    //失去焦点时触发校验
    document.getElementById("username").onblur = checkUsername;
    document.getElementById("password").onblur = checkPassword;
    document.getElementById("confirmPassword").onblur = checkConfirmPassword;
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

//校验确认密码
function checkConfirmPassword()
{
    var confirmPasswordVal = document.getElementById("confirmPassword").value;
    var confirmPasswordMsg = document.getElementById("confirmPasswordMsg");
    var regConfirmPassword = document.getElementById("password").value;
    var flag = (regConfirmPassword === confirmPasswordVal);
    if (flag)
    {
        confirmPasswordMsg.innerHTML = "";
    } else
    {
        confirmPasswordMsg.innerHTML = "两次输入的密码不同!";
    }
    return flag;
}