package com.tongji.controller;

import com.tongji.service.OssService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/oss/fileoss")
@CrossOrigin
public class OssController {
    @Autowired
    OssService ossService;

    @PostMapping
    public String uploadPic(MultipartFile file)
    {
        String url = ossService.uploadFilePic(file);
        return url;
    }
}