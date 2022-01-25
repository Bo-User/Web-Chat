package com.tongji.mapper;

import com.tongji.pojo.FriendList;
import com.tongji.pojo.HistoryMessage;
import com.tongji.pojo.Message;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MessageMapper {
    boolean addMessage(Message message);

    List<HistoryMessage> getHistory(FriendList friendList);
}
