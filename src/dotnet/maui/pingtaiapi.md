---
title: 平台API
lang: zh-CN
date: 2023-03-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: pingtaiapi
slug: agzb102dumox5mho
docsId: '118128328'
---

## 电话
**Microsoft.Maui.ApplicationModel.Communication**命名空间中的PhoneDialer类为 Windows、Android、iOS（和 iPadOS）和 macOS 平台提供电话拨号功能（和其他）的抽象**。**静态**Open**方法尝试使用电话拨号器呼叫作为参数提供的号码。
```csharp
try
{
    if (PhoneDialer.Default.IsSupported)
        PhoneDialer.Default.Open(translatedNumber);
}
catch (ArgumentNullException)
{
    await DisplayAlert("无法拨号", "手机号码无效", "确定");
}
catch (Exception)
{
    // Other error has occurred.
    await DisplayAlert("Unable to dial", "电话拨号失败.", "确定");
}
```
还需要更新对应平台的引用程序清单才能使用电话拨号器，比如安卓应用，我们应该展开Platforms文件夹，展开Android文件夹，然后打开此文件夹中的AndroidManifest.xml文件。然后再清单节点中增加下面xml片段
```csharp
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    ...
    <queries>
        <intent>
            <action android:name="android.intent.action.DIAL" />
            <data android:scheme="tel"/>
        </intent>
    </queries>
</manifest>
```
然后就可以正常调起安卓的拨号器了。

## 定位
前端界面展示，创建一个label和一个button，点击按钮的时候获取定位经纬度
```csharp
<Label x:Name="locationLab" Text="定位"></Label>
<Button x:Name="LocationBtn" Text="获取定位" Clicked="LocationBtn_Clicked"></Button>
```
点击按钮后触发事件进行定位
```csharp
private async void LocationBtn_Clicked(object sender, EventArgs e)
{
    locationLab.Text = await GetLocationAsync();
}
```
定位方法
```csharp
/// <summary>
/// 获取定位
/// </summary>
/// <returns></returns>
private async Task<string> GetLocationAsync()
{
    try
    {
        var location = await Geolocation.GetLastKnownLocationAsync();
        if (location == null)
        {
            location = await Geolocation.GetLocationAsync(new GeolocationRequest()
            {
                DesiredAccuracy = GeolocationAccuracy.High,
                Timeout = TimeSpan.FromSeconds(30)
            });
        }

        if (location == null)
        {
            return "无法显示定位.";
        }
        else
        {
            return $"我的经纬度是: {location.Latitude}, {location.Longitude}";
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return "获取定位失败";
    }
}
```
也需要修改授权的文件，安卓的如下，修改AndroidManifest.xml（位于 Platforms/Android）添加 android 权限以启用设备的位置访问。将它们放在 `<manifest>` 中。
```csharp
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```
然后运行服务就可以获取到经纬度信息了。
