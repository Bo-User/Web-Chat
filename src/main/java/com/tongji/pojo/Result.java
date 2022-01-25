package com.tongji.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//用于登录响应回给浏览器的数据
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    private boolean flag;//登录成功还是失败
    private  String message;//登录结果提示
}
