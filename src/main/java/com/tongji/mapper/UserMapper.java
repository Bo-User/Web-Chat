package com.tongji.mapper;

import com.tongji.pojo.FriendList;
import com.tongji.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserMapper
{
    boolean register(User user);

    String login(User user);

    String findUserById(User user);

    User getUserInfo(String id);

    List<String> getFriends(String id);

    String getUserById(String id);

    void addRelation(FriendList friendList);

    boolean updateById(User user);

    void deleteRelation(FriendList friendList);
}
