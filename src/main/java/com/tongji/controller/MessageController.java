package com.tongji.controller;

/**
 * @ program: demo
 * @ description:
 * @ author: ShenBo
 * @ date: 2021-12-06 16:18:43
 */

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tongji.pojo.HistoryMessage;
import com.tongji.pojo.Message;
import com.tongji.pojo.ResultInformation;
import com.tongji.pojo.User;
import com.tongji.service.MessageService;
import com.tongji.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = {"/message"})
@CrossOrigin
public class MessageController {
    @Autowired
    MessageService messageService;

    @Autowired
    UserService userService;

    @RequestMapping("add")
    public void addMessage(@RequestBody Map<String, Object> map, ModelMap modelMap , HttpSession session) throws JsonProcessingException
    {
        //var json = {"sender":username,"receiver": toName ,"type": 0 ,"info": data};
        Message message=new Message();
        message.setSender((String) map.get("sender"));
        message.setInfo((String) map.get("info"));
        message.setReceiver((String) map.get("receiver"));
        message.setMessageType((int) map.get("messageType"));
        java.util.Date date = new java.util.Date();
        Timestamp timeStamp = new Timestamp(date.getTime());
        message.setCreateTime(timeStamp);
        messageService.addMessage(message);
    }

    @GetMapping("/history/{uid}/{fid}")
    public Object getHistory(@PathVariable String uid,
                             @PathVariable String fid) throws JsonProcessingException {
        ResultInformation information = new ResultInformation();
        ObjectMapper mapper = new ObjectMapper();
        //判断uid、fid都正确且他们是朋友
        User user1 = userService.getUser(uid);
        User user2 = userService.getUser(fid);

        if(user1==null||user2==null)
        {
            information.setFlag(false);
            return mapper.writeValueAsString(information);
        }
        else{
            List<String> IdList = userService.getFriendsId(uid);
            for(String tmp:IdList){
                if(tmp.equals(fid))
                {
                    List<HistoryMessage> messages = messageService.getHistory(uid,fid);
                    information.setFlag(true);
                    information.setData(messages);
                    return mapper.writeValueAsString(information);
                }
            }
            information.setFlag(false);
            return mapper.writeValueAsString(information);
        }
    }
}
