package com.tongji.service;

import com.tongji.pojo.User;

import java.util.List;

public interface UserService
{
    boolean register(User user);

    boolean login(String username, String password);

    User getUser(String id);

    List<String> getFriendsId(String id);

    boolean addFriend(String uid, String fid);

    boolean updateById(User user);

    boolean deleteFriend(String uid, String fid);
}
