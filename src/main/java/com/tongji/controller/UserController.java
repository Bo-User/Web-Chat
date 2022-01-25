package com.tongji.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tongji.pojo.ResultInformation;
import com.tongji.pojo.User;
import com.tongji.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = {"/user"}, method = {RequestMethod.POST, RequestMethod.GET})
@CrossOrigin
public class UserController
{
    @Autowired
    UserService userService;

    @RequestMapping({"/register"})
    public Object register(@RequestBody Map<String, Object> map, ModelMap modelMap) throws JsonProcessingException
    {
        //响应结果
        ResultInformation information = new ResultInformation();
        User user = new User((String) map.get("username"), (String) map.get("password"));
        information.setFlag(userService.register(user));

        //返回json数据
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }

    @RequestMapping({"/login"})
    public Object login(@RequestBody Map<String, Object> map, ModelMap modelMap , HttpSession session) throws JsonProcessingException
    {
        ResultInformation information = new ResultInformation();
        String userId = (String) map.get("username");
        String password = (String) map.get("password");
        boolean flag= userService.login(userId,password);
        if(flag)
        {
            information.setFlag(true);
            information.setData(userId);
        }
        session.setAttribute("userId",userId);
        //返回json数据
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }

    @GetMapping("/getUserList/{id}")
    public Object getUserList(@PathVariable String id) throws JsonProcessingException
    {
        ResultInformation information = new ResultInformation();

        List<String> IdList = userService.getFriendsId(id);
        List<User> userList=new ArrayList<>();
        for(String tmp:IdList){
            User user = userService.getUser(tmp);
            userList.add(user);
        }
        information.setFlag(true);
        information.setData(userList);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }

    @GetMapping("addFriend/{uid}/{fid}")
    public Object addFriend(@PathVariable String uid,
                            @PathVariable String fid) throws JsonProcessingException
    {
        ResultInformation information = new ResultInformation();
        boolean flag = userService.addFriend(uid, fid);
        information.setFlag(flag);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }

    @RequestMapping("deleteFriend/{uid}/{fid}")
    public Object deleteFriend(@PathVariable String uid,
                            @PathVariable String fid) throws JsonProcessingException
    {
        ResultInformation information = new ResultInformation();
        boolean flag = userService.deleteFriend(uid, fid);
        information.setFlag(flag);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }

    @GetMapping("/getUserInfo/{id}")
    public Object getUserInfo(@PathVariable String id) throws JsonProcessingException {
        ResultInformation information = new ResultInformation();
        User user=userService.getUser(id);
        if(user==null)
            information.setFlag(false);
        else
            information.setFlag(true);
        information.setData(user);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }

    @PostMapping("/update")
    public Object updateUserInfo(@RequestBody Map<String, Object> map, ModelMap modelMap , HttpSession session) throws JsonProcessingException {
        ResultInformation information = new ResultInformation();
        String userId = (String) map.get("username");
        String password = (String) map.get("password");
        String name = (String) map.get("name");
        String introduction = (String) map.get("introduction");
        String image = (String) map.get("image");
        User user=new User(userId,password,name,introduction,image);
        boolean flag = userService.updateById(user);
        information.setFlag(flag);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(information);
    }
}
