package com.tongji.ws;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tongji.controller.UserController;
import com.tongji.mapper.MessageMapper;
import com.tongji.pojo.Message;
import com.tongji.utils.MessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.sql.Timestamp;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@ServerEndpoint(value = "/chat",configurator = GetHttpSessionConfigurator.class)
@Component
public class ChatEndpoint {
    //用来存储每个用户客户端对象的ChatEndpoint对象
    private static Map<String,ChatEndpoint> onlineUsers = new ConcurrentHashMap<>();

    //声明session对象，通过对象可以发送消息给指定的用户
    private Session session;

    //声明HttpSession对象，之前在HttpSession对象中存储了用户名
    private HttpSession httpSession;

    //当前用户id
    private String userId;

    private static List<Message> messages=new LinkedList<>();

    //连接建立
    @OnOpen
    public void onOpen(Session session, EndpointConfig config){
        this.session = session;
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        this.httpSession = httpSession;
        //存储登陆的对象
        this.userId = (String)httpSession.getAttribute("userId");
        onlineUsers.put(this.userId,this);
        //用户每次登录，先看messages里是否存了未读数据,按时间先后顺次读取出来发给前端
        List<Message> toRead=new LinkedList<Message>();

        for(int i=0;i<messages.size();i++)
        {
            if((this.userId).equals(messages.get(i).getReceiver()))
                toRead.add(messages.get(i));
        }
        for(int i=0;i<messages.size();i++)
        {
            if((this.userId).equals(messages.get(i).getReceiver()))
                messages.remove(i);
        }

        String unRead = MessageUtils.getMessage(false, null,toRead,-1 );
        try {
            this.session.getBasicRemote().sendText(unRead);
        }catch(Exception e) {
            e.printStackTrace();
        }
    }

    //收到消息
    @OnMessage
    public void onMessage(String message, Session session){
            //将数据转换成对象
            try {
            ObjectMapper mapper =new ObjectMapper();
            Message mess = mapper.readValue(message, Message.class);
            String toName = mess.getReceiver();
            String data = mess.getInfo();
            int type=mess.getMessageType();
            String fromName=this.userId;

            String resultMessage = MessageUtils.getMessage(false, fromName, data,type);
            //对方可能不在线，需要存一下
            java.util.Date date = new java.util.Date();
            Timestamp timeStamp = new Timestamp(date.getTime());
            mess.setCreateTime(timeStamp);
            System.out.println(mess);
            if(toName!=null){
                if(onlineUsers.get(toName)!=null)
                    onlineUsers.get(toName).session.getBasicRemote().sendText(resultMessage);
                else
                    //存储离线数据
                    messages.add(mess);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //关闭
    @OnClose
    public void onClose(Session session) {
        //从容器中删除指定的用户
        onlineUsers.remove(this.userId);
    }
}