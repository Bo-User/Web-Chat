package com.tongji.pojo;

import lombok.Data;

import java.io.Serializable;

@Data
public class HistoryMessage implements Serializable {
    private int id;
    private String sender;
    private String receiver;
    private int messageType;
    private String info;
    private String createTime;
}
