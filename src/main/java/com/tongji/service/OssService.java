package com.tongji.service;

import org.springframework.web.multipart.MultipartFile;

public interface OssService {
    String uploadFilePic(MultipartFile file);
}
