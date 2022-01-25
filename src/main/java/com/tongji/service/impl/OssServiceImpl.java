package com.tongji.service.impl;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.ObjectMetadata;
import com.tongji.service.OssService;
import com.tongji.utils.ConstantPropertiesUtils;
import org.joda.time.DateTime;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.UUID;

@Service
public class OssServiceImpl implements OssService {

    public String uploadFilePic(MultipartFile file) {
        // 工具类获取值
        String endpoint = ConstantPropertiesUtils.END_POIND;
        String accessKeyId = ConstantPropertiesUtils.ACCESS_KEY_ID;
        String accessKeySecret = ConstantPropertiesUtils.ACCESS_KEY_SECRET;
        String bucketName = ConstantPropertiesUtils.BUCKET_NAME;

        try {
            OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

            String fileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString().replaceAll("-","");
            fileName = uuid+fileName;

            //获取当前日期
            String datePath = new DateTime().toString("yyyy/MM/dd");
            //拼接
            fileName = datePath+"/"+fileName;

            ObjectMetadata objectMetadata = new ObjectMetadata();
            String FilenameExtension=fileName.substring(fileName.lastIndexOf("."));
            if(FilenameExtension.equalsIgnoreCase(".jpeg")||
                    FilenameExtension.equalsIgnoreCase(".jpg") ||
                    FilenameExtension.equalsIgnoreCase(".png"))
                objectMetadata.setContentType("image/jpg");
            else if(FilenameExtension.equalsIgnoreCase(".html"))
                objectMetadata.setContentType("text/html");
            else if (FilenameExtension.equalsIgnoreCase(".txt"))
                objectMetadata.setContentType("text/plain");
            else if (FilenameExtension.equalsIgnoreCase(".pptx") ||
                    FilenameExtension.equalsIgnoreCase(".ppt"))
                objectMetadata.setContentType("application/vnd.ms-powerpoint");
            else if (FilenameExtension.equalsIgnoreCase(".docx") ||
                    FilenameExtension.equalsIgnoreCase(".doc"))
                objectMetadata.setContentType("application/msword");
            else if (FilenameExtension.equalsIgnoreCase(".xml"))
                objectMetadata.setContentType("text/xml");

            //调用oss方法实现上传
            //第一个参数  Bucket名称
            //第二个参数  上传到oss文件路径和文件名称   aa/bb/1.jpg
            //第三个参数  上传文件输入流
            ossClient.putObject(bucketName,fileName , new ByteArrayInputStream(file.getBytes()),objectMetadata);

            // 关闭OSSClient。
            ossClient.shutdown();

            String url = "https://"+bucketName+"."+endpoint+"/"+fileName;
            return url;
        }catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
