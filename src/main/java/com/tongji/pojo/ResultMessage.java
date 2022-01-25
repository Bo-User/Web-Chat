package com.tongji.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//系统返回的消息
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultMessage {
    private boolean isSystem;//判断是不是系统消息是为true
    private String fromName;//若为系统消息则为null,不然则为发送给的用户用户名
    private Object message;//如果是系统消息就是数组
    private int type;//系统消息和文本都是0，1代表图片，2代表文件
}