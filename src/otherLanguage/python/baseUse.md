---
title: 基础功能
lang: zh-CN
date: 2021-07-28
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: changyongjichugongneng
slug: ttis7z
docsId: '49965661'
---

## 弹框

### 弹框获取路径

```csharp
import tkinter as tk
from tkinter import filedialog



root =tk.Tk()
root.withdraw()

## folderpath=filedialog.askdirectory()
## print(folderpath) ## 打印文件夹路径 C:/Users/yunpeng.zhang/Documents/WXWork

## filepath=filedialog.askopenfilename();
## print(filepath) ## 打印文件路径 E:/疑问点/Snipaste_2021-04-08_13-58-16.png  
```

### 弹框选择和保存
```csharp
import tkinter as tk 
from tkinter.filedialog import *
from PIL import Image
  
def selectFile():
	global img
	filepath = askopenfilename()  ## 选择打开什么文件，返回文件名
	filename.set(filepath)             ## 设置变量filename的值
	img = Image.open(filename.get())    ## 打开图片

def outputFile():
	outputFilePath = askdirectory()   ## 选择目录，返回目录名
	outputpath.set(outputFilePath)   ## 设置变量outputpath的值

def fileSave():
	filenewpath = asksaveasfilename(defaultextension='.png')   ## 设置保存文件，并返回文件名，指定文件名后缀为.png
	filenewname.set(filenewpath)                                                 ## 设置变量filenewname的值
	img.save(str(filenewname.get()))                                            ## 设置保存图片

root = tk.Tk()
filename = tk.StringVar()
outputpath = tk.StringVar()
filenewname = tk.StringVar()

## 构建“选择文件”这一行的标签、输入框以及启动按钮，同时我们希望当用户选择图片之后能够显示原图的基本信息
tk.Label(root, text='选择文件').grid(row=1, column=0, padx=5, pady=5)
tk.Entry(root, textvariable=filename).grid(row=1, column=1, padx=5, pady=5)
tk.Button(root, text='打开文件', command=selectFile).grid(row=1, column=2, padx=5, pady=5)

## 构建“选择目录”这一行的标签、输入框以及启动按钮
tk.Label(root, text='选择目录').grid(row=2, column=0, padx=5, pady=5)
tk.Entry(root, textvariable=outputpath).grid(row=2, column=1, padx=5, pady=5)
tk.Button(root, text='点击选择', command=outputFile).grid(row=2, column=2, padx=5, pady=5)

## 构建“保存文件”这一行的标签、输入框以及启动按钮
tk.Label(root, text='保存文件').grid(row=3, column=0, padx=5, pady=5)
tk.Entry(root, textvariable=filenewname).grid(row=3, column=1, padx=5, pady=5)
tk.Button(root, text='点击保存', command=fileSave).grid(row=3, column=2, padx=5, pady=5)


root.mainloop()
```

## 退出程序
```csharp
import sys
sys.exit()
sys.exit(0)
sys.exit(1)
```

## API请求

### Form-Data

当参数传入的包含中文，然后python接收到的信息会乱码，这个时候就需要解码一下

```python
# 解码文件名
decoded_filename = urllib.parse.unquote(file.filename)
file.filename = decoded_filename
```

举例c#语言请求示例

```csharp
public Task<UpdateExcelResponse> UpdateExcelAsync(byte[] stream, string fileName)
{
    var requestUrl = _configuration["AnalysisUrl"];
    requestUrl = "http://localhost:8800";

    var completeUrl = $"{requestUrl!.TrimEnd('/')}/upload-excel";

    using var form = new MultipartFormDataContent();

    var fileContent = new ByteArrayContent(stream);
    
    // Encode filename using RFC 5987 encoding
    var encodedFileName = Uri.EscapeDataString(fileName);
    var contentDisposition = new ContentDispositionHeaderValue("form-data")
    {
        Name = "\"file\"",
        FileName = $"\"{encodedFileName}\""
    };
    
    fileContent.Headers.ContentDisposition = contentDisposition;
    fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
    form.Add(fileContent);

    return _httpHelper.PostFormDataAsync<UpdateExcelResponse>(completeUrl, form);
}
```

## 场景

### 办公

#### PDF转图片

小型自动化脚本可以方便地获取整个 PDF 页面并将它们转换为图像。该脚本使用流行的 PyMuPDF 模块，该模块以其 PDF 文本提取而闻名。

```python
## PDF to Images
## pip install PyMuPDF
import fitz
def pdf_to_images(pdf_file):
    doc = fitz.open(pdf_file)
    for p in doc:
        pix = p.get_pixmap()
        output = f"page{p.number}.png"
        pix.writePNG(output)
pdf_to_images("test.pdf")
```

### 下载

#### 互联网下载器

可能使用下载软件从 Internet 下载照片或视频，但现在你可以使用 Python IDM 模块创建自己的下载器。

```python
## Python Downloader
## pip install internetdownloadmanager
import internetdownloadmanager as idm
def Downloader(url, output):
    pydownloader = idm.Downloader(worker=20,
                                part_size=1024*1024*10,
                                resumable=True,)

    pydownloader .download(url, output)
Downloader("Link url", "image.jpg")
Downloader("Link url", "video.mp4")
```

### 图片做素描图

pip安装包

```csharp
pip install opencv-python
```

源码

```csharp
import cv2

'''第一种'''
## '''读入图片转化为灰度图'''
## img_rgb = cv2.imread('110.jpg')
## img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
## img_gray = cv2.medianBlur(img_gray, 5)
## '''二值化操作'''
## img_edge = cv2.adaptiveThreshold(img_gray, 255,
##                                  cv2.ADAPTIVE_THRESH_MEAN_C,
##                                  cv2.THRESH_BINARY, blockSize=3, C=2)

## '''保存图片'''
## cv2.imwrite('120.jpg', img_edge)

'''第二种 使用这个 '''
'''读入图片转化为灰度图'''
img_rgb = cv2.imread('e://p.jpg')
img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
img_gray = cv2.medianBlur(img_gray, 5)
img_blur = cv2.GaussianBlur(img_gray, ksize=(21, 21),
                            sigmaX=0, sigmaY=0)
img_blur = cv2.divide(img_gray, img_blur, scale=255)

'''保存图片'''
cv2.imwrite('e://pp.png',img_blur)
```

### 漫画显示网站

```python
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="format-detection" content="telephone=no">
    <meta charset="UTF-8">
    <title>测试</title>
    <style>
        html {
            height: 100%;
        }
        body {
            font-family: 'Microsoft YaHei';
        }
        .view-main-1 {
            font-size: 0;
        }
        .view-main-1 img {
            width: 100%;
        }
    </style>
</head>
<body class="viewbody">
    <h1 style="text-align: center;">第一话</h1>
    <br>
    <div class="view-main-1 readForm" id="cp_img">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
        <img class="lazy" src="images/432334.jpg">
    </div>
    <br>
</body>

</html>
```

### 爬取指定网页图片

```python
import requests
import io

url = "http://funny.wongxy.com/xxoo"
num = 100
i = 1
while i < num:
    try:
        cont = requests.get(url, timeout=10).content
        path = "d://ceshi/"+str(i)+".jpg"
        with open(path, 'wb') as f:
            f.write(cont)
            i += 1
        print("成功" + str(i))
    except:
        print("错误")
    pass

```

### 爬vmgirls网站图片

```python
import io
import os
import random
import re
import time
import requests
## 爬取妹子图  https://www.vmgirls.com/14604.html
url = "https://www.vmgirls.com/14604.html"
"""
请求网页
"""
## 告诉自己的身份
user_agent_list = ["Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
                   "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
                   "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
                   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36",
                   "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
                   "Mozilla/4.0 (compatible; MSIE 7.0; Wjindows NT 6.0)",
                   "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.5; en-US; rv:1.9.2.15) Gecko/20110303 Firefox/3.6.15",
                   ]
headers = {
    "user-agent": random.choice(user_agent_list)
}
con = requests.get(url, headers=headers)
## print(con.text)
"""
解析网页
"""
dir_name = re.findall('<h1 class="post-title h1">(.*?)</h1>', con.text)[-1]
if not os.path.exists(dir_name):
    os.mkdir(dir_name)
urls = re.findall('<a href="(.*?)" alt=".*?" title=".*?"></a>', con.text)
## print(urls)
#保存图片
for url in urls:
    url = "https://www.vmgirls.com/"+url
    file_name = url.split("/")[-1]
    time.sleep(1)
    response = requests.get(url, headers=headers)
    with open(dir_name+"/"+file_name, 'wb') as f:
        f.write(response.content)
    print(url)

```

### 爬取TP8Img

```python
import io
import os
import random
import re
import time
from lxml import etree
import requests

url = "https://www.tp8.com/yule/rentiyishu/"
## 请求网页
user_agent_list = ["Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
                   "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
                   "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
                   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36",
                   "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
                   "Mozilla/4.0 (compatible; MSIE 7.0; Wjindows NT 6.0)",
                   "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.5; en-US; rv:1.9.2.15) Gecko/20110303 Firefox/3.6.15",
                   ]
headers = {
    "user-agent": random.choice(user_agent_list),
    "Referer": "https://www.tp8.com/"
}
imageUrl = ''
pageNumber = 1
baseUrl = 'https://www.tp8.com'

def PullPage(page, title):
    if not os.path.exists(title):
        os.mkdir(title)
    print("开始下载"+"    "+title)
    response = requests.get(page, headers=headers)
    if response.status_code == 200:
        ## 操作
        pageHtml = re.findall('<h1>(.*?)</h1>', response.text)[-1].split("/")
        pageNumber = int(pageHtml[1].replace(')', ''))
        taotuResponse = re.findall(
            '<a href="(.*?)" title="下一页"><img src="(.*?)" alt=".*?"></a>', response.text)
        pageUrl = baseUrl + taotuResponse[0][0]
        ## 保存套图的第一个图片
        ## time.sleep(1)
        response = requests.get(taotuResponse[0][1], headers=headers)
        if response.status_code == 200:
            with open(title+"/"+"1.jpg", 'wb') as f:
                f.write(response.content)
            print(title+"第1张保存成功")
        else:
            print("请求详情页出错")
            return
        ## 保存套图的第二章到最后一张
        currNumber = 2
        while currNumber < pageNumber:
            detailsUrl = pageUrl.split(
                '_')[0].replace(".html", "")+"_" + str(currNumber)+".html"
            time.sleep(1)
            response = requests.get(detailsUrl, headers=headers)
            if response.status_code == 200:
                imageUrl = re.findall(
                    '<a href="(.*?)" title=".*?"><img src="(.*?)" alt=".*?"></a>', response.text)
                time.sleep(2)
                response = requests.get(imageUrl[0][1], headers=headers)
                with open(title+"/"+str(currNumber)+".jpg", 'wb') as f:
                    f.write(response.content)
                print(title+"第"+str(currNumber)+"张保存成功")
            currNumber += 1
        else:
            print("请求详情页出错")
            return
    else:
        print(page + "出错")

i = 1
while i < 172:
    pageUrl = "https://www.tp8.com/yule/rentiyishu/list_"+str(i)+".html"
    response = requests.get(pageUrl, headers=headers)
    if response.status_code == 200:
        html = etree.HTML(response.text)
        html_data = html.xpath('//div[@class="m-list ml1"]/ul/li/a')
        for page in html_data:
            PullPage(baseUrl+page.attrib["href"], page.attrib["title"])
        else:
            print("页数出错")

```

### 示例集合

**Python爬虫**
[QQ音乐评论爬取](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483775&idx=1&sn=81b2e3d4be6d9af567f517b2165acf5c&chksm=fdcb3659cabcbf4f6851a74492c1c041ab3873e66af7e99ac528e46beac135956bb69ef62af9&scene=21#wechat_redirect)
[新浪微博评论爬取。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484897&idx=1&sn=89cf07ee9d72fcfc774f0a0f47af8e88&chksm=fdcb32c7cabcbbd1a6ddef98ed0fa41eeb365f6867f120fd9c25d7dc03b9342cb49870a3ef05&scene=21#wechat_redirect)
[英雄联盟皮肤大拼图](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483738&idx=1&sn=02fc30824ba5cf4ab79cdf6b39c10b52&chksm=fdcb367ccabcbf6a4063c714e815b12e41e794c864f3a037b4d2690edbae5cc5dd6610e14d16&scene=21#wechat_redirect)
[网易云音乐评论爬取。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484939&idx=1&sn=42cad0b74b4bec48550d09af3694925e&chksm=fdcb312dcabcb83b6b9e3c9cc7d0d1e151195fc6444208c7a035af1e7b13c2aee07d650bef8e&scene=21#wechat_redirect)
[Python爬虫-MongoDB](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483815&idx=1&sn=d0fa59b73134a203262054f13499a578&chksm=fdcb3681cabcbf979c02d8e66fd2d4171c420d4545ac9f04df084ac90df01d19ba851b300cf2&scene=21#wechat_redirect)
[Ajax爬取今日头条街拍美图](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483695&idx=1&sn=e3814037f90ccdb1369c335c41e1f36a&chksm=fdcb3609cabcbf1f6afef9f6ffc3fd90539cad584375f74ab2bc68eb410d3104382be955795d&scene=21#wechat_redirect)
[用Python下载抖音无水印视频！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485653&idx=1&sn=09fa89f47e043797535b733cc599f797&chksm=fdcb3ff3cabcb6e5fbd30254b324afc687fc757c288abd17a6f1d9a0475e006ef07fb3b6e4ec&scene=21#wechat_redirect)
[用Python全自动下载抖音视频！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484095&idx=1&sn=a284ba324550829c969fa2cda0da723c&chksm=fdcb3599cabcbc8f96df521eb5ce50910da152de627e47a69b26e9f2da5920dc6afe4ad2642f&scene=21#wechat_redirect)
[用Python搭建一个简单的代理池](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483955&idx=1&sn=0eff5eab6c2ea79d26318b6a50de3f4a&chksm=fdcb3515cabcbc03a8c646df13fd7e72d696503d58f6bb235b7a306a9e106c01ca13b2dbb0a3&scene=21#wechat_redirect)
[用Python模拟登陆GitHub并获取信息](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484004&idx=1&sn=dfb2684e577017694d55513a3896ff06&chksm=fdcb3542cabcbc54e096e314dcf5504be2e9187aba8211a40b9dd5f7dd7556fd99652afdf5e7&scene=21#wechat_redirect)
[用Python识别图形验证码，实现自动登陆！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483889&idx=1&sn=26a1b009b629fae203abaec81e24ea77&chksm=fdcb36d7cabcbfc13b30138e26859c30af32df2fc45101fa0c709dba72e3de80809fd55cf698&scene=21#wechat_redirect)
[用Python实现手机抓包，获取当当图书差评数据！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484039&idx=1&sn=7087a9f65b9d4d9cd99cbb7f3c8dfd23&chksm=fdcb35a1cabcbcb79fc45eecd483063ca8798e44083b45a03bda85e28804ae5efa56de8bb713&scene=21#wechat_redirect)
[用Python爬取自主品牌汽车，看看国产汽车究竟长什么样？(上)](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483913&idx=1&sn=98640e15f5355e95da8d3a14a9d83b15&chksm=fdcb352fcabcbc398b6692021efb1d3be9cedf3c1d6c8defff890b47994c1dbe97489347948c&scene=21#wechat_redirect)
[用Python爬取自主品牌汽车，看看国产汽车究竟长什么样？(下)](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483916&idx=1&sn=6fb146f2069915c79a11f0d3ab5a7258&chksm=fdcb352acabcbc3c572130858389a57b5cc59600537afc698bc2db208bffc1550b6dd656745e&scene=21#wechat_redirect)


**Python数据分析与可视化**
[网络暴力有多可怕？](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485064&idx=1&sn=90e84281cdca9c4a6d817c6d230e91a9&chksm=fdcb31aecabcb8b8a1e4ebd84d764dbb5feb59d522b7626913183e69ba04f1a6c9c6bab5fac3&scene=21#wechat_redirect)
[破冰行动：敢拍好看。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485308&idx=1&sn=7748b29b749cb265d5339ca35f090158&chksm=fdcb305acabcb94c5b5d5d60ad23ecc78b787f6b31497823869f996dd6a6ab9c0adff94f84aa&scene=21#wechat_redirect)
[微信公众号数据分析。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484999&idx=1&sn=714f7112d0dd15ca446e4bb06cb5f864&chksm=fdcb3161cabcb877ced00eb1cd8d634b8d11aff28c62c26777a0076f3cc82191e8d374738095&scene=21#wechat_redirect)
[Python爬虫-selenium](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483843&idx=1&sn=549b528ecfd45c63365e5b88b389db8b&chksm=fdcb36e5cabcbff35f8ed428231a1a20176e7e330cb81df3dd26afa2191ea59678d244a0e76a&scene=21#wechat_redirect)
[谁才是权游的真正主角。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485250&idx=1&sn=03722205a95e5e80249bbee2e23b46b6&chksm=fdcb3064cabcb972c025a19af1350835e0fdef7d6d7646e715fa0fd4f9168a744a5cc6c97292&scene=21#wechat_redirect)
[NBA球员投篮数据可视化。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485439&idx=1&sn=9a142ff060d744102083e7ce4a1fb307&chksm=fdcb30d9cabcb9cf24cc7148c10aceb227a5f828d69815a14ec7f8edfc4b69e9159b56efe76f&scene=21#wechat_redirect)
[大江大河，一代人的缩影。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484713&idx=1&sn=5a5cf547318d9eddc707833a7a97dd08&chksm=fdcb320fcabcbb19782568b6d9616ba8f399ebd88aba564ce1937a7eb830a51e96c63868bac0&scene=21#wechat_redirect)
[世界72亿人，都在干什么？](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485382&idx=1&sn=a5bb58fc710cd4cff2993cf514ba97b4&chksm=fdcb30e0cabcb9f653498fcdd1cfd4eaaeb6826e75f01da2f34ba2a6dee40b987040093f4558&scene=21#wechat_redirect)
[奥斯卡，究竟谁一直在陪跑。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484762&idx=1&sn=7eaf07fca7517d5e2657400b4930dd9b&chksm=fdcb327ccabcbb6a20c7b50022f140f49763abd0faeb516add3686aa777c1a228ef4ac997fad&scene=21#wechat_redirect)
[10年漫威，到底有多少角色。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485185&idx=1&sn=82a33504a67563f3bb72b03a880235b6&chksm=fdcb3027cabcb93112d602615e185714869b5c1cae3b8809b2d6a64aa36338b6f6867edb7570&scene=21#wechat_redirect)
[现在的房租有多高（杭州）？](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483715&idx=1&sn=c1e15e6bf198cf95b4c720c3426ad9d1&chksm=fdcb3665cabcbf73bc532f6f31ff59bbcb1cb324059a8c8d67884d420fe9cf79f0f3d4b356ea&scene=21#wechat_redirect)
[Python数据可视化：啥是佩奇](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484496&idx=1&sn=933db4713fa0c41789fd908b1fca282a&chksm=fdcb3376cabcba600f445afbfcd70df0ababce4cd23aa41fd8e85708e6041e85acdcd3b0e1ec&scene=21#wechat_redirect)
[人物社交网络分析—平凡的世界](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484598&idx=1&sn=345d1a4ffeb322107406a99826346740&chksm=fdcb3390cabcba8684fc4a3d617a9aeda775a43d832478881000dfc37799640174396d2ab7fe&scene=21#wechat_redirect)
[Python数据可视化：平凡的世界](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484583&idx=1&sn=87772e18bbc3b2ac6ec714f5d69a0b75&chksm=fdcb3381cabcba97d28718ad426dbd72ea878ca431d90f0049f7d1a6f87a15ffa680857e0dcd&scene=21#wechat_redirect)
[细数那些曾效力过NBA的中国球员。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485544&idx=1&sn=87fc3c350ba4f28c8ee541d63a6fd117&chksm=fdcb3f4ecabcb65808bfa2f9c9c97fe907b093c32a40c843ff93f31f0e376c8b7a07bc8a12b4&scene=21#wechat_redirect)
[火箭五年四遇勇士，终究还是败了。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485217&idx=1&sn=0148f1fd35b00f9392cc5bcca434adf7&chksm=fdcb3007cabcb91103a2680a81316fa6faf06d67d3476339a28480f6f07ba0ee8058c18102e8&scene=21#wechat_redirect)
[Python数据可视化：网易云音乐歌单](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484341&idx=1&sn=93520cbad09a524b5817919d4fe18e5c&chksm=fdcb3493cabcbd858315cb462ee5690d9122cf0f2b0750e830e1df2c3af1a6b2e4b9a4c73453&scene=21#wechat_redirect)
[Python数据可视化：25年GDP之变](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484263&idx=1&sn=ac3d403ce3ced53f8656c60f65924b3f&chksm=fdcb3441cabcbd5750bc760511252bba6003d9ec5601fab7c211e1c0df8532891cb193bef5a3&scene=21#wechat_redirect)
[Python数据可视化：浅谈数据分析岗](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484076&idx=1&sn=fac8b75e2fbdb8eecff16b1faa4dc7f2&chksm=fdcb358acabcbc9c20769d3800f77f7cafb16844486e2c3fd35b0d567923eeac352189cc6285&scene=21#wechat_redirect)
[Python数据可视化：浅谈数据挖掘岗](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484210&idx=1&sn=1ed6531ab2bfe2aae53b2966e7e217c9&chksm=fdcb3414cabcbd02150a2d9f2d05f504e600be953e3135a036664bce10d94f9248b9fd142cdd&scene=21#wechat_redirect)
[Python数据可视化：2018年电影分析](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483946&idx=1&sn=461d716729db0d7d082afd2fce3c05de&chksm=fdcb350ccabcbc1a965d506898767ffbd8bc49a4f19f38e2a62968d0f878d443892ff0937b0b&scene=21#wechat_redirect)
[神器种草 | 一款免费的数据可视化工具](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484484&idx=1&sn=84c84ccac8c6285c3392d4f768055100&chksm=fdcb3362cabcba74934a78966ee64f4ec9cab2cc41a8b6a67666635acec6e3c7549f35b2ead1&scene=21#wechat_redirect)
[Python数据可视化：豆瓣电影TOP250](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484115&idx=1&sn=447d90d9e9d17b963c6dc76f7d691735&chksm=fdcb35f5cabcbce3bb4318fa7271a367a2beca95e6aaa02670a61844c6497b6aa2a258588b90&scene=21#wechat_redirect)
[《爱情公寓》电影版，十年一瞬间（上）](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483675&idx=1&sn=cee377b79191ef0a911094f9b873f7e8&chksm=fdcb363dcabcbf2b43d48c949617fccb41eac3af8e982edf4388dece0c14bd5c58c3767984fe&scene=21#wechat_redirect)
[《爱情公寓》电影版，十年一瞬间（下）](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483675&idx=2&sn=992cf0a8a89f8573923a53779589cfc6&chksm=fdcb363dcabcbf2b7b020e025039f9e425db7f1f691d763f03a066decd8163ea90b3e5bb2c06&scene=21#wechat_redirect)
[Python数据可视化：Python大佬有哪些？](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484021&idx=1&sn=1f86b4c180fcc95b41cdfa7d3dc6cb6d&chksm=fdcb3553cabcbc45fb95a594d1da9a66310878e1b2ac7eb922c95e1bdea11d29d4a6e4be027d&scene=21#wechat_redirect)
[用数据分析大家最喜欢什么类型的抖音视频。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485087&idx=1&sn=88970497ecb2ee883f00dbed60ebdfdb&chksm=fdcb31b9cabcb8af03f855a60c98501341cf4adbf18509b442a30efd7c90096b304ae87296b5&scene=21#wechat_redirect)
[582个专业，1281个本科院校，你会如何选择？](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485403&idx=1&sn=c75a700db5113c06a61ff65183eb6109&chksm=fdcb30fdcabcb9eb51c1a0cbb7f7ced9f93ea6359dd5e4128c1c876861321f9950636d32cf98&scene=21#wechat_redirect)
[Python数据可视化：2018年北上广深空气质量分析](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247483989&idx=1&sn=e61e3b1328a553294ecea25dcdcd0cdc&chksm=fdcb3573cabcbc6516fb09db4632332b1462dcb27cfed8cff34d814dcc6eeecf5c29f21f065b&scene=21#wechat_redirect)
[S1到S9，545名职业选手，有多少人折戟全球总决赛？](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485573&idx=1&sn=1b4997ad06760e55d6a8ecc3ea76cfa4&chksm=fdcb3fa3cabcb6b512e0152aa6da7b875f3bdb4dbbecfb0126b913bc15785297f7e1f66ae015&scene=21#wechat_redirect)
[183条地铁线路，3034个地铁站，发现中国地铁名字的秘密。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485151&idx=1&sn=fd1dea66d9e352699eb19384452a51d5&chksm=fdcb31f9cabcb8ef890b8c4b5068b39a1fc67a1771053e7655a4ec8ad12ed45c69c249ff7a07&scene=21#wechat_redirect)

 

**Python数据科学**
[数据整合与数据清洗。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484981&idx=1&sn=12c67a216ca4741f102fefd562187a4c&chksm=fdcb3113cabcb805040bb10ab655a36bc48dc8a495c85e6981f2067f1d5ef012f4f20bdd21cf&scene=21#wechat_redirect)
[Python数据科学：决策树](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485104&idx=1&sn=57bd5aba5efdba901a90b853ad7f5ce7&chksm=fdcb3196cabcb88074e69bcaf0b0aaedea8c64a2f02ec9d396511ecc3717700f0e6e21eca6d7&scene=21#wechat_redirect)
[Python数据科学：神经网络](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485162&idx=1&sn=049cacbcd375bf1239c6bb1ec83084bb&chksm=fdcb31cccabcb8daf6f72361fa3aedbcac1e8ca807549a5d6be07df6bb94e355a7689284c144&scene=21#wechat_redirect)
[Python数据科学：相关分析](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484147&idx=1&sn=7b1fde446a98a9efadc4f46464f172cf&chksm=fdcb35d5cabcbcc3d752237d9a4cfec2aaa351b92fad7d3c05768b3b2e121c53b6f07c064fca&scene=21#wechat_redirect)
[Python数据科学：线性回归](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484227&idx=1&sn=4e383b99c85c46841cc65c4f5b298d30&chksm=fdcb3465cabcbd73b0080cc8550c5d0118b06db091d099cde6b99c9dceea7cf48b828075ecf8&scene=21#wechat_redirect)
[Python数据科学：卡方检验](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484181&idx=1&sn=9a4d28d6d0c7ee5aceadc99c8c25c4ea&chksm=fdcb3433cabcbd25391b1bcac68b0cea697ffdac3064ceb4257594c5b82e2f031f0f31fcb95b&scene=21#wechat_redirect)
[Python数据科学：方差分析](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484173&idx=1&sn=5561010699b3bdb84af6e84cb4024a12&chksm=fdcb342bcabcbd3d620302e198a07970748a700e030293360e985a683c83ece4f5dd1d56c5e9&scene=21#wechat_redirect)
[Python数据科学：正则化方法](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484447&idx=1&sn=14ebf9992fddac39bfef288496b03e12&chksm=fdcb3339cabcba2f2c054ccb3604d5b43558acc364e7ce6a701d1689cb048d6514deb5a99020&scene=21#wechat_redirect)
[Python数据科学：Logistic回归](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484735&idx=1&sn=8c121c021442827211aa9612f74f5068&chksm=fdcb3219cabcbb0f34c95c38579bcde42cfc386d7fe36ea1d0d2a4c5b9a5c2d05ae02a37b333&scene=21#wechat_redirect)
[Python数据科学：线性回归诊断](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484309&idx=1&sn=156ca4967d967a164abeab7009faab20&chksm=fdcb34b3cabcbda503c751f67e3bae1df80dbd6f94c8b8ac615345a33ba1d7859449c6508a05&scene=21#wechat_redirect)
[Python数据科学：正态分布与t检验](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484158&idx=1&sn=b9c858b097da3a6ecba54546a25fa6b8&chksm=fdcb35d8cabcbcce5e44e3cc6b6d5e259a7ab48cd61c01163b641321d289f23ceea49ffde984&scene=21#wechat_redirect)

**Python小操作**
[用Python将HTML转为PDF。](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247485013&idx=1&sn=bfa2eaf670ca6b5f6080680ca5c7179a&chksm=fdcb3173cabcb865fe6a8286b0dee317ef0633f8da64284c22b7372b000045a2c47ad6eba911&scene=21#wechat_redirect)
[用Python生成抖音字符视频！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484823&idx=1&sn=2c6af97de9fda01fdcd056ebe0e471f3&chksm=fdcb32b1cabcbba7fcf3357cf51d420f286bd6647464918d1b390654f90eceb20075b389d552&scene=21#wechat_redirect)
[用Python自动化生成爱豆日历](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484524&idx=1&sn=a2e0928c535beb0981c7d5dae88c4d10&chksm=fdcb334acabcba5c93dfed4b442a0b5d0e682d6bd6ab3e319dd45d90623f3a652337a83bf2d8&scene=21#wechat_redirect)
[用Python自动化生成倒计时图片](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484407&idx=1&sn=9acd63a7ac5a5688ada51d490d61ae27&chksm=fdcb34d1cabcbdc78d4e6a34d9293353fd73ad02cbda36da63634f5cea49cebbebe6cbc18dd5&scene=21#wechat_redirect)
[用Python清除文件夹中的重复视频](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484246&idx=1&sn=05948face799ea1a2eeacc7824ec2734&chksm=fdcb3470cabcbd660d0a8dd40246511fe4dbca76369e43967413c5c1299c87d44e6a6ac16cd2&scene=21#wechat_redirect)
[Python表白？别傻了，女神是拿来撩的！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484671&idx=1&sn=6f77940662b206f3300032dc99e9433e&chksm=fdcb33d9cabcbacf889badeb20c5bf6eb3ce48cb3bdfa3df0cc2d5716f9a5383d90e820df8fa&scene=21#wechat_redirect)
[女神节送什么礼物好，用Python告诉你！](http://mp.weixin.qq.com/s?__biz=MzU4OTYzNjE2OQ==&mid=2247484880&idx=1&sn=f9ede9e82dade9e3ce2114803c62f413&chksm=fdcb32f6cabcbbe0f048c9d4c05b8b03e4e47b61983b094595fb579f3fd923e1d589a9adef6e&scene=21#wechat_redirect)

## 安测

第一步，使用burpsuite抓取数据包

第二步，使用sqlmap工具进行测试

