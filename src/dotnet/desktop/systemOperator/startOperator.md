---
title: 启动操作
lang: zh-CN
date: 2023-08-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qidongcaozuo
slug: yuwigg
docsId: '32420099'
---

## 程序开机自启
通过写入注册表实现开机自启
```csharp
using Microsoft.Win32;

public static class Autostart
{
    private const string Key = "EarthLiveSharp";

    public static bool Set(bool enabled)
    {
        RegistryKey runKey = null;
        try
        {
            runKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run", true);
            if (enabled)
            {
                runKey?.SetValue(Key, Application.ExecutablePath);
            }
            else
            {
                runKey?.DeleteValue(Key, false);
            }
            return true;
        }
        catch (Exception e)
        {
            Trace.WriteLine(e.Message);
            return false;
        }
        finally
        {
            runKey?.Close();
        }
    }
}
```

## 管理员模式启动
```csharp
public static bool IsAdministrator()
{
    var identity = WindowsIdentity.GetCurrent();
    var principal = new WindowsPrincipal(identity);
    return principal.IsInRole(WindowsBuiltInRole.Administrator);
}

//判断当前登录用户是否为管理员
if (IsAdministrator())
{
    LogFactory.WriteInfoLog("start");
    //如果是管理员，则直接运行
    Application.Run(new MainForm());
    return;
}

//创建启动对象
var startInfo = new ProcessStartInfo
{
    UseShellExecute = true,
    WorkingDirectory = Environment.CurrentDirectory,
    FileName = Application.ExecutablePath,
    //设置启动动作,确保以管理员身份运行
    Verb = "runas"
};
try
{
    LogFactory.WriteInfoLog("start");
    Process.Start(startInfo);
}
catch
{
    return;
}

//退出
Application.Exit();
```

### Windows API方式

你可以使用Windows API中的`ShellExecute`函数来以管理员权限启动应用程序。

```csharp
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

class Program
{
    [DllImport("shell32.dll", SetLastError = true)]
    private static extern bool ShellExecuteEx(ref SHELLEXECUTEINFO lpExecInfo);

    private const int SW_SHOWNORMAL = 1;

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct SHELLEXECUTEINFO
    {
        public int cbSize;
        public uint fMask;
        public IntPtr hwnd;
        public string lpVerb;
        public string lpFile;
        public string lpParameters;
        public string lpDirectory;
        public int nShow;
        public IntPtr hInstApp;
        public IntPtr lpIDList;
        public string lpClass;
        public IntPtr hkeyClass;
        public uint dwHotKey;
        public IntPtr hIcon;
        public IntPtr hProcess;
    }

    static void Main()
    {
        SHELLEXECUTEINFO sei = new SHELLEXECUTEINFO();
        sei.cbSize = Marshal.SizeOf(typeof(SHELLEXECUTEINFO));
        sei.fMask = 0x00000010; // SEE_MASK_NOCLOSEPROCESS
        sei.hwnd = IntPtr.Zero;
        sei.lpVerb = "runas"; // 以管理员权限运行
        sei.lpFile = "notepad.exe"; // 这里替换成你的应用程序路径
        sei.nShow = SW_SHOWNORMAL;
        if (!ShellExecuteEx(ref sei))
        {
            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
        }
    }
}
```

### ProcessStartInfo方式

你可以使用`ProcessStartInfo`来设置需要以管理员权限启动的进程。

```csharp
using System;
using System.Diagnostics;

class Program
{
    static void Main()
    {
        ProcessStartInfo processInfo = new ProcessStartInfo();
        processInfo.UseShellExecute = true;
        processInfo.WorkingDirectory = Environment.CurrentDirectory;
        processInfo.FileName = "notepad.exe"; // 这里替换成你的应用程序路径
        processInfo.Verb = "runas"; // 使用"runas"动词以管理员权限运行

        try
        {
            Process.Start(processInfo);
        }
        catch (System.ComponentModel.Win32Exception)
        {
            Console.WriteLine("没有权限启动该程序。");
        }
    }
}
```

### 提示用户使用UAC（用户账户控制）

如果你的应用程序需要以管理员权限运行，但不想使用API调用，你可以提示用户通过UAC对话框手动授权。

```csharp
using System.Diagnostics;

ProcessStartInfo processInfo = new ProcessStartInfo();
processInfo.UseShellExecute = true;
processInfo.Verb = "runas";
processInfo.FileName = Assembly.GetEntryAssembly().Location;

try
{
    Process.Start(processInfo);
}
catch
{
    // Handle exception if user does not grant permission
}
```

注意事项
\- 使用`runas`动词时，用户将看到一个UAC（用户账户控制）对话框，提示他们是否允许应用程序以管理员权限运行。
\- 如果应用程序已经以管理员权限运行，使用`runas`将不会再次请求权限。
\- 确保你的应用程序在需要管理员权限时才请求这些权限，以避免不必要的UAC提示，这可能会影响用户体验。

