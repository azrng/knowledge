---
title: 图片格式转换
lang: zh-CN
date: 2022-04-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: tupiangeshizhuaihuan
slug: zmpz4b
docsId: '31541563'
---
将blob:http://localhost:6099/1f24c2e7-0e11-49ff-bb94-5786135476fb格式
转换为base64格式
```csharp
var oFReader = new FileReader();
   var file = document.getElementById('uploaderInput').files[0];//uploaderInput是input file控件的id
   oFReader.readAsDataURL(file);
   oFReader.onloadend = function (oFRevent) {
   var src = oFRevent.target.result;
   $("#HiddenField1").val(src);//此时已经转换为了base64码

```
把base64码保存到指定的路径
```csharp
string all = b;//base64码
            string[] s = all.Split(new char[] { ',' });//把一个字符串分成两个字符串
            string a = s[1];
            string result;
            //图片路径
            string filePath = HttpContext.Current.Server.MapPath("~/images/up/" + @System.Configuration.ConfigurationManager.AppSettings["ImagePath"]);
            byte[] bt = Convert.FromBase64String(a);//获取图片base64
            string fileName = DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString();//年月
            string ImageFilePath = "/images/up/" + fileName;
            if (System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(ImageFilePath)) == false)//如果不存在就创建文件夹
            {
                System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(ImageFilePath));
            }
            string ImagePath = HttpContext.Current.Server.MapPath(ImageFilePath) + "/" + System.DateTime.Now.ToString("yyyyHHddHHmmss");//定义图片名称
            File.WriteAllBytes(ImagePath + ".png", bt); //保存图片到服务器，然后获取路径  
            result = ImagePath + ".png";//获取保存后的路径
```
先压缩图片再进行上传图片  
```csharp
 //压缩图片开始
         var image = new Image();
         image.src = this.result;
         image.onload = function () {
            //创建一个image对象，给canvas绘制使用
            var cvs = document.createElement('canvas');
            var scale = 1;
            if (this.width > 1000 || this.height > 1000) {//1000只是一个例子，根据实际情况去选择
                  if (this.width > this.height) {
                     scale = 1000 / this.width;
                  } else {
                     scale = 1000 / this.height;
                  }
            }
            //计算等比缩小后图片的宽高
            cvs.width = this.width * scale;
            cvs.height = this.height * scale;
            var ctx = cvs.getContext('2d');
            ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
            //重新生成图片  e.type为用户选择的图片类型  比如image/png
            var newImageData = cvs.toDataURL(e.type, 0.8);
            var sendData = newImageData.replace("data:" + e.type + ";base64,", '');
            //上传保存图片
            上传图片，图片的bse64码是sendData ，传给一般处理程序
            //上传保存图片结束
         }
         //压缩图片结束

```
