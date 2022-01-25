package com.tongji.service.impl;

import com.tongji.pojo.FriendList;
import com.tongji.pojo.User;
import com.tongji.mapper.UserMapper;
import com.tongji.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService
{
    @Autowired
    private UserMapper userMapper;

    @Override
    public boolean register(User user)
    {
        String userById = userMapper.findUserById(user);
        if(userById!=null)
            return false;
        else{
            userMapper.register(user);
            return true;
        }
    }

    @Override
    public boolean login(String userId, String password)
    {
        User user = new User();
        user.setId(userId);
        user.setPassword(password);

        String login = userMapper.login(user);
        if(login!=null)
            return true;
        return false;
    }

    @Override
    public User getUser(String id)
    {
        User userInfo = userMapper.getUserInfo(id);
        return userInfo;
    }

    @Override
    public List<String> getFriendsId(String id) {
        List<String> friends = userMapper.getFriends(id);
        return friends;
    }

    @Override
    public boolean addFriend(String uid, String fid) {
        //这俩现在不能是朋友
        //往list表加两条数据，双向加好友
        List<String> friends = userMapper.getFriends(uid);
        for(String tmp:friends)
        {
            if(tmp.equals(fid))
                return false;
        }
        FriendList friendList1 =new FriendList(uid,fid);
        FriendList friendList2 =new FriendList(fid,uid);
        userMapper.addRelation(friendList1);
        userMapper.addRelation(friendList2);
        return true;
    }

    @Override
    public boolean updateById(User user) {
        return userMapper.updateById(user);
    }

    @Override
    public boolean deleteFriend(String uid, String fid) {
        String user = userMapper.getUserById(uid);
        String friend = userMapper.getUserById(fid);
        if(user==null||friend==null)
            return false;
        List<String> friends = userMapper.getFriends(uid);
        for(String tmp:friends)
        {
            if(tmp.equals(fid))
            {
                //是朋友才可删除
                FriendList friendList1 =new FriendList(uid,fid);
                FriendList friendList2 =new FriendList(fid,uid);
                userMapper.deleteRelation(friendList1);
                userMapper.deleteRelation(friendList2);
                return true;
            }
        }
        return false;//这俩不是朋友

    }
}
