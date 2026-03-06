---
title: 滑块验证码VerificationCode
lang: zh-CN
date: 2022-05-08
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: huakuaiyanzhengmaverificationcode
slug: tiuapo
docsId: '74885814'
---

## 介绍
用户拖动滑块完成时完成校验，支持PC端及移动端。并在后台保存用户校验过程的时间、精度、滑动轨迹等信息。
仓库地址：[https://github.com/eatage/VerificationCode](https://github.com/eatage/VerificationCode)

## 操作
输出的验证码为JSON格式，其中大图片是将原图裁剪成横向10份纵向2分共20张图片随机混淆拼接而成的，原图通过在前端移位还原，混淆信息带在JSON上
JSON格式说明：
    errcode：状态码
    y：裁剪的小图相对左上角的y轴坐标
    array：验证码图片混淆规律
    imgx：验证码图片宽度
    imgy：验证码图片高度
    small：裁剪的小图片
    normal：验证码混淆后的图片
兼容信息：兼容主流浏览器，iPhone端的Safari、QQ内置浏览器、微信内置浏览器、Android端主流浏览器
```csharp
{
  "errcode": 0,
  "y": 189,
  "array": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19",
  "imgx": 300,
  "imgy": 300,
  "small": "data:image/jpg;base64,/...",
  "normal":"data:image/jpg;base64,/..."
}
```
使用示例
```csharp
$("#__Verification").slide({
    imgspec: "200*100",
    successCallBack: function () {
        console.log("success");
        alert('你已通过验证!');
    }
});
```
