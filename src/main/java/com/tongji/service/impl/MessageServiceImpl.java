package com.tongji.service.impl;

import com.tongji.mapper.MessageMapper;
import com.tongji.pojo.FriendList;
import com.tongji.pojo.HistoryMessage;
import com.tongji.pojo.Message;
import com.tongji.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MessageMapper messageMapper;

    @Override
    public boolean addMessage(Message message) {
        return messageMapper.addMessage(message);
    }

    @Override
    public List<HistoryMessage> getHistory(String uid, String fid) {
        //两位相互发送的消息都要查出来，按时间排好序
        FriendList friendList =new FriendList(uid,fid);
        return messageMapper.getHistory(friendList);
    }
}
