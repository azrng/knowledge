---
title: 阿里云OSS
lang: zh-CN
date: 2022-04-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: aliyunoss
slug: sf93yp
docsId: '49602143'
---

## 介绍
图片上传功能是web开发必不可少的功能。图片上传到哪里其实都是一个非常头疼的事情，多个文件源各种地址组合，经常会出现图片地址错误问题。自从前后端分离、小程序、app成为流行后，大家一般都会将文件、图片等静态资源存储在独立的一个源，公司可以自己搭建一个文件中心，更多的是将这些静态资源存放在像阿里云oss，七牛云等专业的文件资源存储。

## 操作

### 开发和配置

- 开发环境：.NetCore3.1,Net5
- 提前申请好阿里云OSS，拿到endpoint，AccessKeyID，AccessKeySecret，Bucket和Domain这些配置参数。
- 项目Nuget添加包：Aliyun.OSS

### 封装底层代码
```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Aliyun.OSS;
using Microsoft.AspNetCore.Http;

/// <summary>
    /// 沐雪多租宝SaaS多租户商城系统，阿里云上传帮助类。
    /// </summary>
    public class AliYunOSSHelper
    {
        private ILogger _logger;
       

        /// <summary>
        /// 阿里云帮助类
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="configHelper"></param>
        public AliYunOSSHelper(ILogger<AliYunOSSHelper> logger, MuXueConfigHelper configHelper)
        {

            _logger = logger;
             
        }


        /// <summary>
        /// 阿里云上传底层方法，文件为base64
        /// </summary>
        /// <param name="fileList"></param>
        /// <returns></returns>
        public async Task<Result<List<UplpadPictureResp>>> AliYunUpLoad(List<AliyunUploadModel> fileList)
        {

            Result<List<UplpadPictureResp>> result = new Result<List<UplpadPictureResp>>();
            List<UplpadPictureResp> list = new List<UplpadPictureResp>();

            try
            {

                //阿里云oss相关参数,请自行补齐 
                var endpoint = "";
                var accessKeyId = "";
                var accessKeySecret = "";
                var bucket = "";
                var imageUrl = "";
                
                var write_client = new OssClient(endpoint, accessKeyId, accessKeySecret);
                var read_client = new OssClient(endpoint, accessKeyId, accessKeySecret);
                  
                for (int i = 0; i < fileList.Count; i++)
                {

                    using (var stream = new MemoryStream(fileList[i].bytes))
                    {
                        write_client.PutObject(bucket, fileList[i].ossFileName, stream);
                    }
                    DateTime expiration = DateTime.Now.AddYears(20);
                    var url = read_client.GeneratePresignedUri(bucket, fileList[i].ossFileName, expiration);
                    string urlstring = imageUrl + url.AbsolutePath;

                    list.Add(new UplpadPictureResp { 
                        imageuri = urlstring,
                        imageuri_name = fileList[i].fileName, 
                        image_bytes = fileList[i].bytes.Length / 1024, 
                        group_id = fileList[i].g_id,
                        imageuri_chicun= fileList[i].imageuri_chicun
                    });

                }
                if (list != null && list.Count > 0)
                {
                    result.code = StatusCodeEnum.Success;
                    result.data = list;
                }
                else
                {
                    _logger.LogError("阿里云图片上传失败,请联系管理员（110-1）。");
                    result.code = StatusCodeEnum.Error;
                    result.msg = "阿里云上传失败";
                }
            }
            catch (Exception ex)
            {
                result.code = StatusCodeEnum.Error;
                result.msg = ex.Message;
                _logger.LogError(ex, "阿里云图片上传失败,ex=" + ex.Message);
                throw;
            }

            return result;
        }


        /// <summary>
        /// 阿里云上传底层方法，文件为IFormFile
        /// </summary>
        /// <param name="shop_code"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public async Task<List<string>> AliYunUpLoad(  List<IFormFile> files)
        { 
            List<string> ossfilesNameList = new List<string>();
            try
            {

                //阿里云oss相关参数,请自行补齐 
                var endpoint = "";
                var accessKeyId = "";
                var accessKeySecret = "";
                var bucket = "";
                var imageUrl = "";

                var write_client = new OssClient(endpoint, accessKeyId, accessKeySecret);
                var read_client = new OssClient(endpoint, accessKeyId, accessKeySecret);
               
                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    var fname =  DateTime.Now.ToString("yyyyMMddHHmmssffffff") + i + Path.GetExtension(file.FileName);
                    using (var stream = file.OpenReadStream())
                    {
                        write_client.PutObject(bucket, fname, stream);
                    }
                    DateTime expiration = DateTime.Now.AddYears(20);
                    var url = read_client.GeneratePresignedUri(bucket, fname, expiration);
                    string urlstring = imageUrl + url.AbsolutePath;
                    ossfilesNameList.Add(urlstring);
                }
                
            }
            catch (Exception ex)
            {
               
                _logger.LogError(ex, "阿里云图片上传失败,ex=" + ex.Message);
                throw;
            }

            return ossfilesNameList;
        }

    }
```
一个的入参的文件为base64，一个为IFormFile，这2种基本上足够用了。文件的有限期设置为20年。

### 依赖注入
```csharp
  services.AddScoped<AliYunOSSHelper>();
```

### 使用
```csharp

 private readonly ILogger<TenantCommonController> _logger;
       
        private AliYunOSSHelper _oSSHelper;
          
        public TenantCommonController(ILogger<TenantCommonController> logger,   AliYunOSSHelper oSSHelper )
        {
            _logger = logger;
            
            _oSSHelper = oSSHelper; 

        }

/// <summary>
        /// 通用的图片上传,支持多图片上传 
        /// </summary>
        /// <param name="files"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> UploadPic(List<IFormFile> files)
        {
            //15M
            var maxRequestLength = 1024 * 1024 * 15;
            List<string> filesName = new List<string>();
            if (files.Count == 0) return Content("NoFile", "text/html");
            else
            {
                List<AliyunUploadModel> fileList = new List<AliyunUploadModel>();

                for (var i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    if (null == file || file.Length <= 0) return Content("格式不正确！", "text/html");
                    if (file.Length > maxRequestLength)
                    {
                        return Content("文件大小超出限制！", "text/html");
                    }

                    var fname = DateTime.Now.ToString("yyyyMMddHHmmssffffff") + i + Path.GetExtension(file.FileName);

                    if (!FileExtensionFun.CheckImageFileType(fname))
                    {
                        return Content("上传的图片格式不正确", "text/html");
                    }

                }
                filesName = await _oSSHelper.AliYunUpLoad(files);

            }
            return Content(string.Join(",", filesName), "text/html");
        }
```

## 参考文档
> [https://mp.weixin.qq.com/s/QDzsf81NuuIwJADyZUgOFg](https://mp.weixin.qq.com/s/QDzsf81NuuIwJADyZUgOFg)

