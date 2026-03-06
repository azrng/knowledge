---
title: 热键
lang: zh-CN
date: 2023-06-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: rejian
slug: eb8pul3qv848v42c
docsId: '127675207'
---

## 概述
通过代码来注册热键和取消热键

## 操作
```csharp
/// <summary>
/// 系统 api
/// </summary>
internal class WindowsAPI
{
    /// <summary>
    /// 设置指定窗口的显示状态
    /// </summary>
    /// <param name="hWnd"></param>
    /// <param name="nCmdShow"></param>
    /// <returns></returns>
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    /// <summary>
    /// 注册热键
    /// </summary>
    /// <param name="hWnd">要定义热键的窗口的句柄</param>
    /// <param name="id">定义热键ID（不能与其它ID重复）</param>
    /// <param name="fsModifiers">标识热键是否在按Alt、Ctrl、Shift、Windows等键时才会生效</param>
    /// <param name="vk">定义热键的内容</param>
    /// <returns></returns>
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool RegisterHotKey(IntPtr hWnd, int id, HotkeyModifiers fsModifiers, Keys vk);

    /// <summary>
    /// 释放热键
    /// </summary>
    /// <param name="hWnd">要取消热键的窗口的句柄</param>
    /// <param name="id">要取消热键的ID</param>
    /// <returns></returns>
    [DllImport("user32.dll")]
    public static extern bool UnregisterHotKey(IntPtr hWnd, int id);
}

/// <summary>
/// 组合控制键
/// </summary>
public enum HotkeyModifiers
{
    MOD_ALT = 1,
    MOD_CONTROL,
    MOD_SHIFT = 4,
    MOD_WIN = 8,
    /// <summary>
    /// Ctrl+ALT
    /// </summary>
    MOD_CONTROL_ALT = 3
}
```
