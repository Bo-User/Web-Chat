package com.tongji.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable
{
    private String id;
    private String password;
    private String name;
    private String introduction;
    private String image;

    public User(String id, String password) {
        this.id = id;
        this.password = password;
    }
}
