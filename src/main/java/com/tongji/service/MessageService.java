package com.tongji.service;

import com.tongji.pojo.HistoryMessage;
import com.tongji.pojo.Message;

import java.util.List;

public interface MessageService {
    boolean addMessage(Message message);

    List<HistoryMessage> getHistory(String uid, String fid);
}