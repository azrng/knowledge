---
title: 文件上传
lang: zh-CN
date: 2021-09-03
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: wenjianshangchuan
slug: tb3g9h
docsId: '31541433'
---
 
1.fine-uploader上传
可以添加不同的上传样式模板，是一个纯javascript基于浏览器的文件上传库，目前不知道该如何自定义模板。
插件地址：[https://fineuploader.com/](https://fineuploader.com/) 
2.html5上传
使用jQuery.upload.min.js然后采用base64进行上传，自带的上传不用弄，有bug，所以暂时只能base64上传
3.js上传
页面可能比较简陋
4.原生js压缩图片上传
5.利用KindEditor富文本编辑器自带的上传进行上传图片
6.利用layui的上传接口进行上传
7.webuploader上传，百度团队开发的，兼容ie6  推荐
地址：[http://fex.baidu.com/webuploader/](http://fex.baidu.com/webuploader/)
[大文件分片上传断网续传秒传](https://www.cnblogs.com/xiongze520/p/10412693.html)
8.利用bootstrap的fileinput上传
插件地址：[https://github.com/kartik-v/bootstrap-fileinput](https://github.com/kartik-v/bootstrap-fileinput)
9.Filepond上传图片
没有研究透，还不能用
对于ie方面，要求ie11，并且需要安装[filepond-polyfill](https://github.com/pqina/filepond-polyfill/tree/master/dist)文件。
插件地址：[http://f2ex.cn/filepond-javascript-file-upload-library/](http://f2ex.cn/filepond-javascript-file-upload-library/)
[https://pqina.nl/filepond/](https://pqina.nl/filepond/)
10.ajaxfileupload.js上传图片
参考：[https://www.cnblogs.com/linjiqin/p/3530848.html](https://www.cnblogs.com/linjiqin/p/3530848.html)
jQuery图片预览插件imgPreview 、拖拽上传与图像预览插件Dropzone.js
 
 
一般处理程序
```csharp
public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            try
            {
                //如果报 接口请求上传接口异常错误  那么是这个页面没有返回值
                HttpFileCollection file = context.Request.Files;//获取选中文件
                for (int i = 0; i < file.Count; i++)
                {
                    if (file == null || string.IsNullOrEmpty(file[i].FileName) || file[i].ContentLength == 0)
                    {
                        //不存在的情况
                       context.Response.Write("0");
                    }
                    string local = "images\\up\\" + DateTime.Now.ToString("yyyyMMdd");
                    string localPath = Path.Combine(HttpRuntime.AppDomainAppPath, local);
                    //判断目录是否存在
                    if (!System.IO.Directory.Exists(localPath))//判断目录是否存在
                    {
                       System.IO.Directory.CreateDirectory(localPath);
                    }
                    string filePathName = string.Empty;
                    //文件的物理路径
                    string tmpName = System.Web.HttpContext.Current.Server.MapPath("~/images/up/" + DateTime.Now.ToString("yyyyMMdd"));
                    //判断文件是否存在
                    string tmp = DateTime.Now.ToString("yyyyMMddHHmmss") + i;
                    while (System.IO.File.Exists(tmpName + tmp))
                    {
                        tmp = tmp + "_";
                    }
                    //不带路径的最终文件名
                    filePathName = tmp + ".jpg";
                   file[i].SaveAs(Path.Combine(localPath, filePathName));//保存图片
                   context.Response.Write("1");
                }
            }
            finally
            {
 
            }
 
        }
```
 对上传的文件生成唯一Md5码
```csharp
HttpPostedFile file = HttpContext.Current.Request.Files["file"];//接收
                string ext = Path.GetExtension(file.FileName);//文件后缀名
                Stream s = file.InputStream;//文件流
                MD5 md5 = new MD5CryptoServiceProvider();
                byte[] retVal = md5.ComputeHash(s);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < retVal.Length; i++)
                {
                   sb.Append(retVal[i].ToString("x2"));
                }
                string Md5res = sb.ToString();//上面的代码是为了生成文件唯一的MD5码
```
 
 
 
 
 
 
 
 
