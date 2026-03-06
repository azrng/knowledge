---
title: 管理员方式启动并且带全局拦截
lang: zh-CN
date: 2023-05-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guanliyuanfangshiqidongbingjudaiquanjulanjie
slug: ge35mzv8gi1tu3xf
docsId: '122645426'
---

## 概述
包含让程序以管理员的方式启动以及包含全局错误日志拦截

## 操作
引用nuget包
```csharp
<PackageReference Include="Common.Windows.Core" Version="0.0.1" />
```
> 使用到里面的记录日志功能


### 异常拦截
```csharp
internal static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    private static void Main()
    {
        try
        {
            //设置应用程序处理异常方式：ThreadException处理
            Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
            //UI线程的未处理异常捕获
            Application.ThreadException += Application_ThreadException;
            //非UI线程的未处理异常捕获
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();

            var loginForm = new LoginForm();
            if (loginForm.ShowDialog() == DialogResult.OK)
            {
                Application.Run(new IndexForm());
            }
        }
        catch (Exception ex)
        {
            WriteException(ex, "主线程");
            MessageBox.Show("系统错误", "异常", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    /// <summary>
    /// UI线程未捕获异常处理函数
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="ex"></param>
    private static void Application_ThreadException(object sender, ThreadExceptionEventArgs ex)
    {
        LocalLogHelper.WriteMyLogs("system", $"Application_ThreadException  message:{ex.Exception.Message} ");
        MessageBox.Show("系统错误", "异常", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }

    /// <summary>
    /// 非UI线程未捕获异常处理函数
    /// </summary>
    private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        if (e.ExceptionObject is Exception ex)
        {
            WriteException(ex, "非UI线程");
        }
        else
        {
            LocalLogHelper.WriteMyLogs("system", $"发生了一个错误！信息:{e.ExceptionObject}");
        }
        MessageBox.Show("系统错误", "异常", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }

    /// <summary>
    /// 提取异常信息
    /// </summary>
    private static void WriteException(Exception ex, string info)
    {
        var str = new StringBuilder($"{DateTime.Now}, {info}发生了一个错误！{Environment.NewLine}");
        if (ex.InnerException == null)
        {
            str.Append($"【对象名称】：{ex.Source}{Environment.NewLine}");
            str.Append($"【异常类型】：{ex.GetType().Name}{Environment.NewLine}");
#if DEBUG
            str.Append($"【详细信息】：{ex.Message}{Environment.NewLine}");
            str.Append($"【堆栈调用】：{ex.StackTrace}");
#endif
        }
        else
        {
            str.Append($"【对象名称】：{ex.InnerException.Source}{Environment.NewLine}");
            str.Append($"【异常类型】：{ex.InnerException.GetType().Name}{Environment.NewLine}");
#if DEBUG
            str.Append($"【详细信息】：{ex.InnerException.Message}{Environment.NewLine}");
            str.Append($"【堆栈调用】：{ex.InnerException.StackTrace}");
#endif
        }
        LocalLogHelper.WriteMyLogs("system", str.ToString());
        Console.WriteLine(str);
    }
}
```

### 管理员启动加异常拦截
```csharp
internal static class Program
{
    /// <summary>
    /// 检查是否是管理员方式启动
    /// </summary>
    /// <returns></returns>
    public static bool IsAdministrator()
    {
        var identity = WindowsIdentity.GetCurrent();
        var principal = new WindowsPrincipal(identity);
        return principal.IsInRole(WindowsBuiltInRole.Administrator);
    }

    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    private static void Main()
    {
        try
        {
            //设置应用程序处理异常方式：ThreadException处理
            Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
            //UI线程的未处理异常捕获
            Application.ThreadException += Application_ThreadException;
            //非UI线程的未处理异常捕获
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            ApplicationConfiguration.Initialize();

            //判断当前登录用户是否为管理员
            if (IsAdministrator())
            {
                // 记录日志
                //LogFactory.WriteInfoLog("start");

                //如果是管理员，则直接运行
                Application.Run(new Form1());
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
                //LogFactory.WriteInfoLog("start");
                Process.Start(startInfo);
            }
            catch
            {
                return;
            }

            //退出
            Application.Exit();
        }
        catch (Exception ex)
        {
            WriteException(ex, "主线程");
            MessageBox.Show("系统错误", "异常", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    /// <summary>
    /// UI线程未捕获异常处理函数
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="ex"></param>
    private static void Application_ThreadException(object sender, ThreadExceptionEventArgs ex)
    {
        //LogFactory.WriteErrorLog($"Application_ThreadException  message:{ex.Exception.Message} ");
        Console.WriteLine($"Application_ThreadException  message:{ex.Exception.Message} ");
        MessageBox.Show("系统错误", "异常", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }

    /// <summary>
    /// 非UI线程未捕获异常处理函数
    /// </summary>
    private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        if (e.ExceptionObject is Exception ex)
        {
            WriteException(ex, "非UI线程");
        }
        else
        {
            //LogFactory.WriteErrorLog($"发生了一个错误！信息:{e.ExceptionObject}");
            Console.WriteLine($"发生了一个错误！信息:{e.ExceptionObject}");
        }
        MessageBox.Show("系统错误", "异常", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }

    /// <summary>
    /// 提取异常信息
    /// </summary>
    private static void WriteException(Exception ex, string info)
    {
        var str = new StringBuilder($"{DateTime.Now}, {info}发生了一个错误！{Environment.NewLine}");
        if (ex.InnerException == null)
        {
            str.Append($"【对象名称】：{ex.Source}{Environment.NewLine}");
            str.Append($"【异常类型】：{ex.GetType().Name}{Environment.NewLine}");
#if DEBUG
            str.Append($"【详细信息】：{ex.Message}{Environment.NewLine}");
            str.Append($"【堆栈调用】：{ex.StackTrace}");
#endif
        }
        else
        {
            str.Append($"【对象名称】：{ex.InnerException.Source}{Environment.NewLine}");
            str.Append($"【异常类型】：{ex.InnerException.GetType().Name}{Environment.NewLine}");
#if DEBUG
            str.Append($"【详细信息】：{ex.InnerException.Message}{Environment.NewLine}");
            str.Append($"【堆栈调用】：{ex.InnerException.StackTrace}");
#endif
        }
        //LogFactory.WriteErrorLog(str);
        Console.WriteLine(str);
    }
}
```

