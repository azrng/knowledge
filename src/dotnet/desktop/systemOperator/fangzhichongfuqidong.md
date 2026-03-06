---
title: 防止重复启动
lang: zh-CN
date: 2021-03-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fangzhichongfuqidong
slug: ei99zk
docsId: '33264338'
---

## 描述
不想让一个exe文件重复启动多次，防止程序被多次运行。

## 实现思路
程序只能运行一次，意思也就是该程序进程只能是唯一的，所以就要保证程序进程只有一个，我们要判断下该程序进程是否已经在自己的操作系统上运行了，如果已经存在一个进程，那么我们不是再开启该程序进程，而是弹框提示用户该程序已经运行，然后退出。

## 操作

### 使用互斥量Mutex
为该程序进程创建一个互斥量Mutex对象变量，当运行该程序时候，该程序进程就具有了这个互斥的Mutex变量，如果再次运行就检测该变量是否存在
```csharp
using System;
using System.Threading;
using System.Windows.Forms;

namespace OnlyInstanceRunning
{
  static class Program
  {
    /// <summary>
    /// 应用程序的主入口点。
    /// </summary>
    [STAThread]
    static void Main()
    {
      #region 方法一:使用互斥量
      bool createNew;

      // createdNew:
      // 在此方法返回时，如果创建了局部互斥体（即，如果 name 为 null 或空字符串）或指定的命名系统互斥体，则包含布尔值 true；
      // 如果指定的命名系统互斥体已存在，则为false
      using (Mutex mutex = new Mutex(true, Application.ProductName, out createNew))
      {
        if (createNew)
        {
          Application.EnableVisualStyles();
          Application.SetCompatibleTextRenderingDefault(false);
          Application.Run(new Form1());
        }
        // 程序已经运行的情况，则弹出消息提示并终止此次运行
        else
        {
          MessageBox.Show("应用程序已经在运行中...");
          System.Threading.Thread.Sleep(1000);

          // 终止此进程并为基础操作系统提供指定的退出代码。
          System.Environment.Exit(1);
        }
      }

      #endregion
    }
  }
}

```

### 直接判断进程是否存在

#### 判断进程数量的方式
```csharp
#region 方法二:使用进程名
      Process[] processcollection = Process.GetProcessesByName(Application.CompanyName);
      // 如果该程序进程数量大于，则说明该程序已经运行，则弹出提示信息并提出本次操作，否则就创建该程序
      if (processcollection.Length >= 1)
      {
        MessageBox.Show("应用程序已经在运行中。。");
        Thread.Sleep(1000);
        System.Environment.Exit(1);
      }
      else
      {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        // 运行该应用程序
        Application.Run(new Form1());
      }
      #endregion 
```

#### 直接判断程序进程是否存在的方式
```csharp
using System;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Way3
{
  static class Program
  {
    #region 方法三：使用的Win32函数的声明
    /// <summary>
    /// 设置窗口的显示状态
    /// Win32 函数定义为：http://msdn.microsoft.com/en-us/library/windows/desktop/ms633548(v=vs.85).aspx
    /// </summary>
    /// <param name="hWnd">窗口句柄</param>
    /// <param name="cmdShow">指示窗口如何被显示</param>
    /// <returns>如果窗体之前是可见，返回值为非零；如果窗体之前被隐藏，返回值为零</returns>
    [DllImport("User32.dll")]
    private static extern bool ShowWindow(IntPtr hWnd, int cmdShow);

    /// <summary>
    /// 创建指定窗口的线程设置到前台，并且激活该窗口。键盘输入转向该窗口，并为用户改变各种可视的记号。
    /// 系统给创建前台窗口的线程分配的权限稍高于其他线程。
    /// </summary>
    /// <param name="hWnd">将被激活并被调入前台的窗口句柄</param>
    /// <returns>如果窗口设入了前台，返回值为非零；如果窗口未被设入前台，返回值为零</returns>
    [DllImport("User32.dll")]
    private static extern bool SetForegroundWindow(IntPtr hWnd);

    // 指示窗口为普通显示
    private const int WS_SHOWNORMAL = 1;
    #endregion

    /// <summary>
    /// 应用程序的主入口点。
    /// </summary>
    [STAThread]
    static void Main()
    {
      #region 方法三：调用Win32 API,并激活运行程序的窗口显示在最前端
      // 这种方式在VS调用的情况不成立的，因为在VS中按F5运行的进程为OnlyInstanceRunning.vshost,从这个进程的命名就可以看出，该进程为OnlyInstanceRunning进程的宿主进程
      // 关于这个进程的更多内容可以查看：http://msdn.microsoft.com/zh-cn/library/ms185331(v=vs.100).aspx
      // 而直接点OnlyInstanceRunning.exe运行的程序进程为OnlyInstanceRunning,
      // 但是我们可以一些小的修改，即currentProcess.ProcessName.Replace(".vshose","")此时无论如何都为 OnlyInstanceRunning

      // 获得正在运行的程序，如果没有相同的程序，则运行该程序
      Process process = RunningInstance();
      if (process == null)
      {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new Form1());
      }
      else
      {
        // 已经运行该程序，显示信息并使程序显示在前端
        MessageBox.Show("应用程序已经在运行中......");
        HandleRunningInstance(process);
      }
      #endregion 
    }

    #region 方法三定义的方法
    /// <summary>
    /// 获取正在运行的程序，没有运行的程序则返回null
    /// </summary>
    /// <returns></returns>
    private static Process RunningInstance()
    {
      // 获取当前活动的进程
      Process currentProcess = Process.GetCurrentProcess();

      // 根据当前进程的进程名获得进程集合
      // 如果该程序运行，进程的数量大于1
      Process[] processcollection = Process.GetProcessesByName(currentProcess.ProcessName.Replace(".vshost", ""));
      foreach (Process process in processcollection)
      {
        // 如果进程ID不等于当前运行进程的ID以及运行进程的文件路径等于当前进程的文件路径
        // 则说明同一个该程序已经运行了，此时将返回已经运行的进程
        if (process.Id != currentProcess.Id)
        {
          if (Assembly.GetExecutingAssembly().Location.Replace("/", "\\") == process.MainModule.FileName)
          {
            return process;
          }
        }
      }

      return null;
    }

    /// <summary>
    /// 显示已运行的程序
    /// </summary>
    /// <param name="instance"></param>
    private static void HandleRunningInstance(Process instance)
    {
      // 显示窗口
      ShowWindow(instance.MainWindowHandle, WS_SHOWNORMAL);

      // 把窗体放在前端
      SetForegroundWindow(instance.MainWindowHandle);
    }

    #endregion
  }
}
```

#### 解决上一种实现方式问题
解决上一种方案的问题——只能是最小化的窗体显示出来，如果隐藏到托盘中则不能把运行的程序显示出来
```csharp
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Way4
{
  static class Program
  {

    #region 方法四：使用的Win32函数的声明

    /// <summary>
    /// 找到某个窗口与给出的类别名和窗口名相同窗口
    /// 非托管定义为：http://msdn.microsoft.com/en-us/library/windows/desktop/ms633499(v=vs.85).aspx
    /// </summary>
    /// <param name="lpClassName">类别名</param>
    /// <param name="lpWindowName">窗口名</param>
    /// <returns>成功找到返回窗口句柄,否则返回null</returns>
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    /// <summary>
    /// 切换到窗口并把窗口设入前台,类似 SetForegroundWindow方法的功能
    /// </summary>
    /// <param name="hWnd">窗口句柄</param>
    /// <param name="fAltTab">True代表窗口正在通过Alt/Ctrl +Tab被切换</param>
    [DllImport("user32.dll ", SetLastError = true)]
    static extern void SwitchToThisWindow(IntPtr hWnd, bool fAltTab);

    ///// <summary>
    ///// 设置窗口的显示状态
    ///// Win32 函数定义为：http://msdn.microsoft.com/en-us/library/windows/desktop/ms633548(v=vs.85).aspx
    ///// </summary>
    ///// <param name="hWnd">窗口句柄</param>
    ///// <param name="cmdShow">指示窗口如何被显示</param>
    ///// <returns>如果窗体之前是可见，返回值为非零；如果窗体之前被隐藏，返回值为零</returns>
    [DllImport("user32.dll", EntryPoint = "ShowWindow", CharSet = CharSet.Auto)]
    public static extern int ShowWindow(IntPtr hwnd, int nCmdShow);
    public const int SW_RESTORE = 9;
    public static IntPtr formhwnd;
    #endregion

    /// <summary>
    /// 应用程序的主入口点。
    /// </summary>
    [STAThread]
    static void Main()
    {
      #region 方法四: 可以是托盘中的隐藏程序显示出来
      // 方法四相对于方法三而言应该可以说是一个改进，
      // 因为方法三只能是最小化的窗体显示出来，如果隐藏到托盘中则不能把运行的程序显示出来
      // 具体问题可以看这个帖子：http://social.msdn.microsoft.com/Forums/zh-CN/6398fb10-ecc2-4c03-ab25-d03544f5fcc9
      Process currentproc = Process.GetCurrentProcess();
      Process[] processcollection = Process.GetProcessesByName(currentproc.ProcessName.Replace(".vshost", string.Empty));
      // 该程序已经运行，
      if (processcollection.Length >= 1)
      {
        foreach (Process process in processcollection)
        {
          if (process.Id != currentproc.Id)
          {
            // 如果进程的句柄为0，即代表没有找到该窗体，即该窗体隐藏的情况时
            if (process.MainWindowHandle.ToInt32() == 0)
            {
              // 获得窗体句柄
              formhwnd = FindWindow(null, "Form1");
              // 重新显示该窗体并切换到带入到前台
              ShowWindow(formhwnd, SW_RESTORE);
              SwitchToThisWindow(formhwnd, true);
            }
            else
            {
              // 如果窗体没有隐藏，就直接切换到该窗体并带入到前台
              // 因为窗体除了隐藏到托盘，还可以最小化
              SwitchToThisWindow(process.MainWindowHandle, true);
            }
          }
        }
      }
      else
      {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new Form1());
      }
      #endregion
    }
  }
}
```

## 参考文档
> [https://mp.weixin.qq.com/s/RdOS81Hoiij2JJ6aMTJ30g](https://mp.weixin.qq.com/s/RdOS81Hoiij2JJ6aMTJ30g)

