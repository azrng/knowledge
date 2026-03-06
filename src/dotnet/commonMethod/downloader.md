---
title: HTTP简易下载器
lang: zh-CN
date: 2023-11-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 下载
  - httpClient
---

## 概述

通过HttpClient请求远程文件并实现下载的功能

## 操作

```c#
var url = "http://lg-hkg.fdcservers.net/10MBtest.zip";
var task = new DownLoadTask();
await task.StartAsync(url, "D:\\Downloads");

/// <summary>
/// 一个下载任务类
/// </summary>
public class DownLoadTask
{
    public async Task StartAsync(string url, string saveFolderPath)
    {
        try
        {
            using var client = new HttpClient();
            // 1.1.某些网站会反爬，所以我们需要设置一些参数
            client.DefaultRequestHeaders.Add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61");

            // 2.进行异步请求
            await using var stream = await client.GetStreamAsync(url);

            var suffix = GetFileType("zip");
            var filePath = Path.Combine(saveFolderPath, Random.Shared.Next(10, 10000) + suffix);
            await using var fileStream = File.Create(filePath);
            await stream.CopyToAsync(fileStream);
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine($"请求下载失败：{e.Message}");
        }
    }

    /// <summary>
    /// 检测文件的类型
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    private string GetFileType(string type)
    {
        var suffix = "";
        if (type.Contains("jpeg"))
        {
            suffix = ".jpg";
        }
        else if (type.Contains("zip"))
        {
            suffix = ".zip";
        }
        else if (type.Contains("application/octet-stream"))
        {
            suffix = ".exe";
        }
        else if (type.Contains("png"))
        {
            suffix = ".png";
        }
        else if (type.Contains("mp4"))
        {
            suffix = ".mp4";
        }
        else if (type.Contains("avi"))
        {
            suffix = ".avi";
        }
        else if (type.Contains("mp3"))
        {
            suffix = ".mp3";
        }
        else if (type.Contains("mpeg"))
        {
            suffix = ".m4a";
        }

        return suffix;
    }
}
```

还可以手动处理缓冲区的大小，并使用 `List<byte>` 作为一个动态缓冲区，每次读取数据后将其添加到列表中。这种方式可以灵活地控制缓冲区的大小，以便更好地适应特定需求，比如下载进度通知等

```c#
var response = await client.GetAsync(url);
// 3.请求成功
if (!response.IsSuccessStatusCode)
{
    // 4.请求失败
    Console.WriteLine("请求下载失败");
    return;
}

// 3.1.读取文件的类型
var type = response.Content.Headers.ContentType?.MediaType;
// 3.2.文件的总大小
var totalSize = response.Content.Headers.ContentLength;

// 3.3.获取文件流
// 当前下载的大小
long downloadSize = 0;

await using var stream = await response.Content.ReadAsStreamAsync();

// 缓冲区大小 0.5KB
var bufferSize = new byte[512];
var targetBuffer = new List<byte>();
var suffix = GetFileType(type);
int length;
while ((length = await stream.ReadAsync(bufferSize)) != 0)
{
    downloadSize += length;
    var progress = downloadSize * 100 / totalSize;
    targetBuffer.AddRange(bufferSize.Take(length));
    await Console.Out.WriteLineAsync($"\r下载中{progress}%");
}

await Console.Out.WriteLineAsync();
var filePath = Path.Combine(saveFolderPath, Random.Shared.Next(10, 10000) + suffix);
await File.WriteAllBytesAsync(filePath, targetBuffer.ToArray());
```

## 测速文件

```
举例香港的地址

100mb
http://lg-hkg.fdcservers.net/100MBtest.zip

1gb
http://lg-hkg.fdcservers.net/1GBtest.zip


阿姆斯特丹AMS-01数据中心
http://mirror.nl.leaseweb.net/speedtest/10000mb.bin
达拉斯DAL-10数据中心
http://mirror.dal10.us.leaseweb.net/speedtest/10000mb.bin
香港HKG-10数据中心
http://mirror.hk.leaseweb.net/speedtest/10000mb.bin
旧金山SFO-12数据中心
http://mirror.sfo12.us.leaseweb.net/speedtest/10000mb.bin
美因河畔法兰克福FRA-10数据中心
http://mirror.de.leaseweb.net/speedtest/10000mb.bin
悉尼SYD-10数据中心
http://mirror.syd10.au.leaseweb.net/speedtest/10000mb.bin
华盛顿WDC-01数据中心
http://mirror.wdc1.us.leaseweb.net/speedtest/10000mb.bin
华盛顿WDC-02数据中心
http://mirror.wdc1.us.leaseweb.net/speedtest/10000mb.bin
hetztner德国（https://speed.hetzner.de/）：
https://speed.hetzner.de/10GB.bin
http://proof.ovh.net/files/
ovh法国：
http://proof.ovh.net/files/10Gio.dat
https://www.fdcservers.net/looking-glass
新加坡：
http://lg-sin.fdcservers.net/10GBtest.zip
日本东京：
http://lg-tok.fdcservers.net/10GBtest.zip
香港：
http://lg-hkg.fdcservers.net/10GBtest.zip
亚特兰大：
http://lg-atl.fdcservers.net/10GBtest.zip
芝加哥：
http://lg-chie.fdcservers.net/10GBtest.zip
丹佛：
http://lg-dene.fdcservers.net/10GBtest.zip
休斯顿：
http://lg-hou.fdcservers.net/10GBtest.zip
洛杉矶：
http://lg-lax.fdcservers.net/10GBtest.zip
迈阿密：
http://lg-mia.fdcservers.net/10GBtest.zip
明尼苏达州：
http://lg-minn.fdcservers.net/10GBtest.zip
纽约：
http://lg-nyc.fdcservers.net/10GBtest.zip
西雅图：
http://lg-sea.fdcservers.net/10GBtest.zip
多伦多（加拿大）：
http://lg-tor.fdcservers.net/10GBtest.zip
巴西圣保罗：
http://lg-spb.fdcservers.net/10GBtest.zip
荷兰阿姆斯特丹：
http://lg-ams.fdcservers.net/10GBtest.zip
爱尔兰都柏林：
http://lg-dub.fdcservers.net/10GBtest.zip
德国法兰克福：
http://lg-fra.fdcservers.net/10GBtest.zip
芬兰赫尔辛基：
http://lg-hel.fdcservers.net/10GBtest.zip
乌克兰基辅：
http://lg-kie.fdcservers.net/10GBtest.zip
葡萄牙里斯本：
http://lg-lis.fdcservers.net/10GBtest.zip
英国伦敦：
http://lg-lon.fdcservers.net/10GBtest.zip
西班牙马德里：
http://lg-mad.fdcservers.net/10GBtest.zip
法国巴黎：
http://lg-par2.fdcservers.net/10GBtest.zip
保加利亚索非亚
http://lg-sof.fdcservers.net/10GBtest.zip
芬兰斯德哥尔摩：
http://lg-sto.fdcservers.net/10GBtest.zip
奥地利维也纳：
http://lg-vie.fdcservers.net/10GBtest.zip
波兰华沙：
http://lg-war.fdcservers.net/10GBtest.zip
瑞士苏黎世：
http://lg-zur.fdcservers.net/10GBtest.zip
https://www.turnkeyinternet.net/speed-test/
turnkeyinternet加利福尼亚：
http://speedtest-ca.turnkeyinternet.net/10000mb.bin
turnkeyinternet纽约：
http://speedtest-ny.turnkeyinternet.net/10000mb.bin
https://www.hostwinds.com/company/datacenters
hostwinds西雅图：
http://sea-repo.hostwinds.net/tests/10gb.zip
hostwinds达拉斯：
http://dal-repo.hostwinds.net/tests/10gb.zip
hostwinds阿姆斯特丹：
http://ams-repo.hostwinds.net/tests/10gb.zip
http://speedtest.tele2.net/
tele2克罗地亚，萨格勒布
http://zgb-speedtest-1.tele2.net/10GB.zip
http://zgb-speedtest-1.tele2.net/50GB.zip
http://zgb-speedtest-1.tele2.net/100GB.zip
http://zgb-speedtest-1.tele2.net/1000GB.zip
tele2德国，法兰克福
http://fra36-speedtest-1.tele2.net/10GB.zip
http://fra36-speedtest-1.tele2.net/50GB.zip
http://fra36-speedtest-1.tele2.net/100GB.zip
http://fra36-speedtest-1.tele2.net/1000GB.zip
tele2拉脱维亚，里加
http://bks4-speedtest-1.tele2.net/10GB.zip
http://bks4-speedtest-1.tele2.net/50GB.zip
http://bks4-speedtest-1.tele2.net/100GB.zip
http://bks4-speedtest-1.tele2.net/1000GB.zip
tele2立陶宛，维尔纽斯
http://vln038-speedtest-1.tele2.net/10GB.zip
http://vln038-speedtest-1.tele2.net/50GB.zip
http://vln038-speedtest-1.tele2.net/100GB.zip
http://vln038-speedtest-1.tele2.net/1000GB.zip
tele2荷兰，阿姆斯特丹
http://ams-speedtest-1.tele2.net/10GB.zip
http://ams-speedtest-1.tele2.net/50GB.zip
http://ams-speedtest-1.tele2.net/100GB.zip
http://ams-speedtest-1.tele2.net/1000GB.zip
tele2瑞典，哥德堡
http://bck-speedtest-1.tele2.net/10GB.zip
http://bck-speedtest-1.tele2.net/50GB.zip
http://bck-speedtest-1.tele2.net/100GB.zip
http://bck-speedtest-1.tele2.net/1000GB.zip
tele2瑞典，斯德哥尔摩
http://hgd-speedtest-1.tele2.net/10GB.zip
http://hgd-speedtest-1.tele2.net/50GB.zip
http://hgd-speedtest-1.tele2.net/100GB.zip
http://hgd-speedtest-1.tele2.net/1000GB.zip
```