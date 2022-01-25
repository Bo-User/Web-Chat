package com.tongji.pojo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

//用户发送的消息
@Data
public class Message implements Serializable {
    private int id;
    private String sender;
    private String receiver;
    private int messageType;
    private String info;
    private Date createTime;
}