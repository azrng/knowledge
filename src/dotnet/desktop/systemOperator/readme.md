---
title: 常用操作
lang: zh-CN
date: 2023-09-10
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jitongcaozuo
slug: pl1a1rgaxsi0t6og
docsId: '125506642'
---

## 判断当前程序是否有管理员权限

windows系统

```csharp
[DllImport("shell32.dll",EntryPoint ="#680")]
static extern bool IsAdmin();


// 或者

public static bool IsAdministrator()
{
    var identity = WindowsIdentity.GetCurrent();
    var principal = new WindowsPrincipal(identity);
    return principal.IsInRole(WindowsBuiltInRole.Administrator);
}
```

## 系统截图
点击按钮后调用系统截图并保存
```json
/// <summary>
/// 点击按钮
/// </summary>
/// <param name="sender"></param>
/// <param name="e"></param>
private void button1_Click(object sender, EventArgs e)
{
    StartCapture();
}

/// <summary>
/// 调用系统截图处理
/// </summary>
private void StartCapture()
{
    // 隐藏当前窗口
    this.WindowState = FormWindowState.Minimized;
    this.Hide();

    var psi = new ProcessStartInfo()
    {
        UseShellExecute = true,
        FileName = "ms-screenclip:"
    };
    Process.Start(psi);

    var snippingToolProcess = Process.GetProcessesByName("ScreenClippingHost")[0];
    snippingToolProcess.EnableRaisingEvents = true;
    snippingToolProcess.Exited += SnippingToolProcess_Exited;

    /*
    Process snippingToolProcess = new Process()
    {
        StartInfo = new ProcessStartInfo("C:\\Windows\\system32\\SnippingTool.exe", "/clip"),
        EnableRaisingEvents = true,
    };
    snippingToolProcess.Exited += SnippingToolProcess_Exited;
    snippingToolProcess.Start();
    */
}

/// <summary>
/// 截图完成
/// </summary>
/// <param name="sender"></param>
/// <param name="e"></param>
private void SnippingToolProcess_Exited(object? sender, EventArgs e)
{
    Debug.WriteLine("触发了已经");
    this.BeginInvoke(new Action(() =>
    {
        ClipboardOCR();
    }));
}

private readonly string[] ImgAllow = new string[] { "jpg", "png", "gif", "peg", "bmp" };

/// <summary>
/// 从剪切板获取图片并识别
/// </summary>
private void ClipboardOCR()
{
    var img = Clipboard.GetImage();

    if (img != null)
    {
        img.Save("D:\\temp\\11.png");
        //sqPhoto.Image = img;
        //timeOCR_Start();
        return;
    }

    // 直接复制的图片文件
    var files = Clipboard.GetFileDropList();
    if (files.Count > 0)
    {
        string ext = files[0].ToLower().Substring(files[0].Length - 3);
        if (ImgAllow.Contains(ext))
        {
            var img = Image.FromFile(files[0])
            //sqPhoto.Image = Image.FromFile(files[0]);
            //timeOCR_Start();
        }
    }
}
```

## 窗口置顶
方案一：
把窗体的 ShowInTaskbar 属性设置为 false，把 TopMost 属性设置为 true，也在 load 方法里用代码指定 TopMost=true，三个条件一起满足的情况下，窗体就可以置顶了。
方案二：
使用系统动态库的方法置顶窗体（不用把 ShowInTaskbar 属性设置为 false）：
把窗体的 TopMost 属性设置为 true，同时在代码里加如下内容：
```csharp
// 设置此窗体为活动窗体：
// 将创建指定窗口的线程带到前台并激活该窗口。键盘输入直接指向窗口，并为用户更改各种视觉提示。
// 系统为创建前台窗口的线程分配的优先级略高于其他线程。
[DllImport("user32.dll", EntryPoint = "SetForegroundWindow")]
public static extern bool SetForegroundWindow(IntPtr hWnd);
 
// 设置此窗体为活动窗体：
// 激活窗口。窗口必须附加到调用线程的消息队列。
[DllImport("user32.dll", EntryPoint = "SetActiveWindow")]
public static extern IntPtr SetActiveWindow(IntPtr hWnd);
 
// 设置窗体位置
[DllImport("user32.dll", CharSet = CharSet.Auto)]
private static extern int SetWindowPos(IntPtr hWnd, int hWndInsertAfter, int x, int y, int Width, int Height, int flags);
```
窗体加载事件设置
```csharp
private void Form2_Load(object sender, EventArgs e)
{
    // 设置窗体显示在最上层
    SetWindowPos(this.Handle, -1, 0, 0, 0, 0, 0x0001 | 0x0002 | 0x0010 | 0x0080);
 
    // 设置本窗体为活动窗体
    SetActiveWindow(this.Handle);
    SetForegroundWindow(this.Handle);
 
    // 设置窗体置顶
    this.TopMost = true;
}
```

## 获取系统最近使用记录
当我们浏览文件时,它会自动的以快捷的方式存储历史记录,Windows会自动添加到该文件夹下记录系统最近使用的文件或文件夹,同样Office、Cookies等都有相对应的Recent.我们可以通过Environment.GetFolderPath(Environment.SpecialFolder.Recent)获取Windows的Recent最近历史记录的位置,我电脑中recent的路径为 "C:\Users\dell\AppData\Roaming\Microsoft\Windows\Recent".
同时由于该获取较简单,就不详细叙述.补充C#获取桌面、Recent、我的文档、我的音乐、Cookies等路径参考文章[http://hi.baidu.com/ysuhy/item/b12a57d3660ccc90270ae7f9](http://hi.baidu.com/ysuhy/item/b12a57d3660ccc90270ae7f9)

获取文件原始路径
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;              //Directory 目录 
using System.Reflection;      //BindingFlags 枚举
 
namespace GetPathRecent
{
    public class RecentlyFileHelper
    {
        public static string GetShortcutTargetFile(string shortcutFilename)
        {
            var type = Type.GetTypeFromProgID("WScript.Shell");  //获取WScript.Shell类型
            object instance = Activator.CreateInstance(type);    //创建该类型实例
            var result = type.InvokeMember("CreateShortCut", BindingFlags.InvokeMethod, null, instance, new object[] { shortcutFilename });
            var targetFile = result.GetType().InvokeMember("TargetPath", BindingFlags.GetProperty, null, result, null) as string;
            return targetFile;
        }
 
        public static IEnumerable<string> GetRecentlyFiles()
        {
            var recentFolder = Environment.GetFolderPath(Environment.SpecialFolder.Recent);  //获取Recent路径
            return from file in Directory.EnumerateFiles(recentFolder)
                   where Path.GetExtension(file) == ".lnk"
                   select GetShortcutTargetFile(file);
        }
    }
}
```

向Form中添加控件listBox和fileSystemWatcher(监控文件系统更改通知,并在目录或文件更改时引发事件).具体代码如下:
```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
 
namespace GetPathRecent
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
 
        //载入Form 
        private void Form1_Load(object sender, EventArgs e)
        {
            listBox1.Items.Clear();            
            foreach (var file in RecentlyFileHelper.GetRecentlyFiles())
            {
                listBox1.Items.Add(file);
            }
 
            //获取recent路径
            var recentFolder = Environment.GetFolderPath(Environment.SpecialFolder.Recent);
            fileSystemWatcher1.Path = recentFolder;
            fileSystemWatcher1.Created += new System.IO.FileSystemEventHandler(fileSystemWatcher1_Created);
        }
 
        //当在指定Path(即recent路径)中创建文件和目录时增加ShortCut
        private void fileSystemWatcher1_Created(object sender, System.IO.FileSystemEventArgs e)
        {
            listBox1.Items.Add(RecentlyFileHelper.GetShortcutTargetFile(e.FullPath));
        }
    }
}
```
资料来源：[https://blog.csdn.net/eastmount/article/details/18474655/](https://blog.csdn.net/eastmount/article/details/18474655/)

## 获取屏幕并指定屏幕显示

首先获取屏幕信息，然后指定在某一个屏幕上显示。

```csharp
var form = new Form1();
// 获取所有屏幕信息
var screens = Screen.AllScreens;
// 如果有两个屏幕，则在第二个屏幕上显示窗体
if (screens.Length > 1)
{
    // 获取第二个屏幕的信息
    var secondScreen = screens[1];

    // 设置在第二个屏幕上显示并且最大化
    form.StartPosition = FormStartPosition.Manual;
    form.Location = secondScreen.Bounds.Location;
    form.WindowState = FormWindowState.Maximized;
}

Application.Run(form);
```

## 获取本机IP

```csharp
string ip = "";
var localIPs = Dns.GetHostAddresses(Dns.GetHostName());
foreach (var addr in localIPs)
{
    if (addr.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
    {
         ip = addr.ToString();
        // 处理您需要的IP地址
        break;
    }
}
```

## 硬件信息

### 机器信息MachineInfo

Nuget包：NewLife.Core
源码：[https://github.com/NewLifeX/X/blob/master/NewLife.Core/Common/MachineInfo.cs](https://github.com/NewLifeX/X/blob/master/NewLife.Core/Common/MachineInfo.cs)

获取机器信息

```csharp
var info = MachineInfo.GetCurrent();
info.Dump();
```

资料：[https://newlifex.com/core/machine_info](https://newlifex.com/core/machine_info)

### 获取机器名

```csharp
/// <summary>
/// 取机器名
/// </summary>
/// <returns></returns>
public string GetHostName()
{
    return System.Net.Dns.GetHostName();
}
```

### 获取CPU编号

```csharp
/// <summary>
/// 取CPU编号
/// </summary>
/// <returns></returns>
public string GetCpuID()
{
    try
    {
        var mc = new ManagementClass("Win32_Processor");
        using var moc = mc.GetInstances();
        string strCpuID = null;
        foreach (ManagementObject mo in moc)
        {
            strCpuID = mo.Properties["ProcessorId"].Value.ToString();
            break;
        }
        return null;
    }
    catch
    {
        return "";
    }
}
```

或者使用

```csharp
public string FindComputerCPU_ID()
{
    try
    {
        ManagementScope ms = new ManagementScope("root\\cimv2");
        ms.Connect();
        ManagementObjectSearcher sysinfo = new ManagementObjectSearcher(ms, new SelectQuery("Win32_Processor"));
        string cpuId = "";
        foreach (ManagementObject sys in sysinfo.Get())
        {
            cpuId = sys["ProcessorId"].ToString();
        }

        return cpuId;
    }
    catch
    {
        return null;
    }
}
```

### 获取第一块硬盘编号

```csharp
/// <summary>
/// 取第一块硬盘编号
/// </summary>
/// <returns></returns>
public String GetHardDiskID()
{
    try
    {
        var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_PhysicalMedia");
        string strHardDiskID = null;
        foreach (ManagementObject mo in searcher.Get())
        {
            strHardDiskID = mo["SerialNumber"].ToString().Trim();
            break;
        }
        return strHardDiskID;
    }
    catch
    {
        return "";
    }
}
```

### 不同系统获取硬件信息

[如何通过 .NETCore 获取 Linux,Mac 的硬件信息？](https://mp.weixin.qq.com/s/N_WUX-Qayocfq0Me7xQpVA)

#### windows

windows 上我可以通过 System.Management 下 WMI Query获取信息

```csharp
ManagementObjectSearcher searcher = new ManagementObjectSearcher("select * from Win32_Processor");
```

#### Linux

可以先看看如果用 bash 命令获取 Process Id, Machine id, version 等等，比如下面这些。

1. "LinuxModel": "cat /sys/class/dmi/id/product_name"
2. "LinuxModelVersion": "cat /sys/class/dmi/id/product_version"
3. "LinuxProcessorId": "dmidecode -t processor | grep -E ID | sed 's/.*: //' | head -n 1"
4. "LinuxFirmwareVersion": "cat /sys/class/dmi/id/bios_version",
5. "LinuxMachineId": "cat /var/lib/dbus/machine-id"

接下来写一个 扩展方法 来搞定。

```csharp
public static string Bash(this string cmd)
{
    string result = String.Empty;

    try
    {
        var escapedArgs = cmd.Replace("\"", "\\\"");

        using (Process process = new Process())
        {
            process.StartInfo = new ProcessStartInfo
            {
                FileName = "/bin/bash",
                Arguments = $"-c \"{escapedArgs}\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            process.Start();
            result = process.StandardOutput.ReadToEnd();
            process.WaitForExit(1500);
            process.Kill();
        };
    }
    catch (Exception ex)
    {
        //Logger.ErrorFormat(ex.Message, ex);
    }
    return result;
}
```

然后你就可以这样使用。

```csharp
var output = "ps aux".Bash();
```

#### Mac

借助 ManagementClass 类去获取，参考如下代码：

```csharp
public static void Main(string[] args)
{
	System.Management.ManagementClass mc = default(System.Management.ManagementClass);

	ManagementObject mo = default(ManagementObject);

	mc = new ManagementClass("Win32_NetworkAdapterConfiguration");

	ManagementObjectCollection moc = mc.GetInstances();

	foreach (var mo in moc)
	{
		if (mo.Item("IPEnabled") == true)
		{
			Adapter.Items.Add("MAC " + mo.Item("MacAddress").ToString());
		}
	}
}
```

## 注册表操作

[.NET使用P/Invoke来实现注册表的增、删、改、查功能](https://www.cnblogs.com/weskynet/p/18191869)

## 跳转打开外链

```yaml
 System.Diagnostics.Process.Start("http://www.mycodes.net");
```

## 是否安装某个软件
检测是否安装并返回卸载地址
```csharp
/// <summary>
/// windows 操作
/// </summary>
public static class WindowsHardwareOperation
{
    /// <summary>
    /// 检测是否安装某个软件，并返回软件的卸载安装路径
    /// </summary>
    /// <param name="softName"></param>
    /// <param name="str_exe"></param>
    /// <param name="installPath"></param>
    /// <returns></returns>
    public static bool CheckInstall(string softName, string str_exe, out string installPath)
    {
        //即时刷新注册表
        SHChangeNotify(0x8000000, 0, IntPtr.Zero, IntPtr.Zero);

        installPath = string.Empty;

        var isFind = false;
        var uninstallNode = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall", false);
        if (uninstallNode != null)
        {
            //LocalMachine_64
            using (uninstallNode)
            {
                foreach (var subKeyName in uninstallNode.GetSubKeyNames())
                {
                    var subKey = uninstallNode.OpenSubKey(subKeyName);

                    var displayName = (subKey?.GetValue("DisplayName") ?? string.Empty).ToString();
                    if (string.IsNullOrWhiteSpace(displayName))
                        continue;

                    // 卸载路径
                    var path = (subKey.GetValue("UninstallString") ?? string.Empty).ToString();
                    Console.WriteLine($"文件{displayName} 卸载路径{path} ");
                    if (displayName.Contains(softName) && !string.IsNullOrWhiteSpace(path))
                    {
                        installPath = Path.Combine(Path.GetDirectoryName(path), str_exe);
                        if (File.Exists(installPath))
                        {
                            isFind = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!isFind)
        {
            //LocalMachine_32
            uninstallNode = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall", false);
            using (uninstallNode)
            {
                foreach (var subKeyName in uninstallNode.GetSubKeyNames())
                {
                    var subKey = uninstallNode.OpenSubKey(subKeyName);
                    var displayName = (subKey.GetValue("DisplayName") ?? string.Empty).ToString();
                    var path = (subKey.GetValue("UninstallString") ?? string.Empty).ToString();
                    Console.WriteLine(displayName);
                    if (displayName.Contains(softName) && !string.IsNullOrWhiteSpace(path))
                    {
                        installPath = Path.Combine(Path.GetDirectoryName(path), str_exe);
                        if (File.Exists(installPath))
                        {
                            isFind = true;
                            break;
                        }
                    }
                }
            }
        }
        return isFind;
    }

    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
```
返回是否安装并返回安装地址
```csharp
/// <summary>
/// windows 操作
/// </summary>
public static class WindowsHardwareOperation
{
    /// <summary>
    /// 检测是否安装某个软件，并返回软件的卸载安装路径
    /// </summary>
    /// <param name="softName">软件名</param>
    /// <param name="strExe">安装目录下启动服务地址</param>
    /// <param name="installPath"></param>
    /// <returns></returns>
    public static bool CheckInstall(string softName, string strExe, out string installPath)
    {
        //即时刷新注册表
        SHChangeNotify(0x8000000, 0, IntPtr.Zero, IntPtr.Zero);

        installPath = string.Empty;

        var isFind = false;
        var uninstallNode = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall", false);
        if (uninstallNode != null)
        {
            //LocalMachine_64
            using (uninstallNode)
            {
                foreach (var subKeyName in uninstallNode.GetSubKeyNames())
                {
                    var subKey = uninstallNode.OpenSubKey(subKeyName);

                    var displayName = (subKey?.GetValue("DisplayName") ?? string.Empty).ToString();
                    if (string.IsNullOrWhiteSpace(displayName))
                        continue;

                    // 安装路径
                    var path = (subKey.GetValue("InstallLocation") ?? string.Empty).ToString();
                    //Console.WriteLine($"文件{displayName} 路径{path} ");
                    if (displayName.Contains(softName, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(path))
                    {
                        installPath = Path.Combine(Path.GetDirectoryName(path), strExe);
                        if (File.Exists(installPath))
                        {
                            isFind = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!isFind)
        {
            //LocalMachine_32
            uninstallNode = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall", false);
            using (uninstallNode)
            {
                foreach (var subKeyName in uninstallNode.GetSubKeyNames())
                {
                    var subKey = uninstallNode.OpenSubKey(subKeyName);
                    var displayName = (subKey.GetValue("DisplayName") ?? string.Empty).ToString();
                    var path = (subKey.GetValue("InstallLocation") ?? string.Empty).ToString();
                    //Console.WriteLine(displayName);
                    if (displayName.Contains(softName, StringComparison.OrdinalIgnoreCase) && !string.IsNullOrWhiteSpace(path))
                    {
                        installPath = Path.Combine(Path.GetDirectoryName(path), strExe);
                        if (File.Exists(installPath))
                        {
                            isFind = true;
                            break;
                        }
                    }
                }
            }
        }
        return isFind;
    }

    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
```
使用
```csharp
WindowsHardwareOperation.CheckInstall("Tim", "Bin\\QQScLauncher.exe", out var aa);
```

## 自定义后缀文件绑定exe启动程序打开

- 实现：修改注册表
- 绑定class.cs如下
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Win32;

namespace ALO_Platform
{
    class FileHelper
    {
        public static void RegisterFileType(string typeName, string fileType, string fileContent, string app, string ico)
        {
            //工具启动路径
            string toolPath = app;

            string extension = typeName;

            //fileType = "自定义文件类型";

            //fileContent = "AAAA";
            //获取信息
            RegistryKey registryKey = Registry.ClassesRoot.OpenSubKey(extension);

            if (registryKey != null)
            {
                try
                {
                    RegistryKey _Regkey = Registry.ClassesRoot.OpenSubKey("", true);

                    RegistryKey _VRPkey = _Regkey.OpenSubKey(extension);
                    if (_VRPkey != null) _Regkey.DeleteSubKeyTree(extension, true);
                    if (_VRPkey != null) _Regkey.DeleteSubKeyTree("Exec");
                }
                catch (Exception e)
                {
                   
                }
            }

            if (registryKey != null && registryKey.OpenSubKey("shell") != null && registryKey.OpenSubKey("shell").OpenSubKey("open") != null &&
                registryKey.OpenSubKey("shell").OpenSubKey("open").OpenSubKey("command") != null)
            {
                var varSub = registryKey.OpenSubKey("shell").OpenSubKey("open").OpenSubKey("command");
                var varValue = varSub.GetValue("");

                if (Equals(varValue, toolPath + " \"%1\""))
                {
                    return;
                }
            }

            //文件注册
            registryKey = Registry.ClassesRoot.CreateSubKey(extension);
            registryKey.SetValue("", fileType);
            registryKey.SetValue("Content Type", fileContent);
            //设置默认图标
            RegistryKey iconKey = registryKey.CreateSubKey("DefaultIcon");
            iconKey.SetValue("", Application.StartupPath + $"\\{ico}.ico");
            iconKey.Close();
            //设置默认打开程序路径
            registryKey = registryKey.CreateSubKey("shell\\open\\command");
            registryKey.SetValue("", toolPath + " \"%1\"");
            //关闭
            registryKey.Close();

            SHChangeNotify(0x8000000, 0, IntPtr.Zero, IntPtr.Zero);
        }

        [DllImport("shell32.dll")]
        public static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);
    }
}

```
调用
```csharp
FileHelper.RegisterFileType(".dfx", "资源文件", ".DFX",
                            System.Windows.Forms.Application.ExecutablePath, "app");
```

## 获取打开的所有窗口标题
```csharp
/// <summary>
/// 包含枚举当前用户空间下所有窗口的方法。
/// </summary>
public class WindowEnumerator
{
    /// <summary>
    /// 查找当前用户空间下所有符合条件的窗口。如果不指定条件，将仅查找可见窗口。
    /// </summary>
    /// <param name="match">过滤窗口的条件。如果设置为 null，将仅查找可见窗口。</param>
    /// <returns>找到的所有窗口信息。</returns>
    public static IReadOnlyList<WindowInfo> FindAll(Predicate<WindowInfo> match = null)
    {
        var windowList = new List<WindowInfo>();
        EnumWindows(OnWindowEnum, 0);
        return windowList.FindAll(match ?? DefaultPredicate);
        bool OnWindowEnum(IntPtr hWnd, int lparam)
        {
            // 仅查找顶层窗口。
            if (GetParent(hWnd) == IntPtr.Zero)
            {
                // 获取窗口类名。
                var lpString = new StringBuilder(512);
                GetClassName(hWnd, lpString, lpString.Capacity);
                var className = lpString.ToString();
                // 获取窗口标题。
                var lptrString = new StringBuilder(512);
                GetWindowText(hWnd, lptrString, lptrString.Capacity);
                var title = lptrString.ToString().Trim();
                // 获取窗口可见性。
                var isVisible = IsWindowVisible(hWnd);
                // 获取窗口位置和尺寸。
                LPRECT rect = default;
                GetWindowRect(hWnd, ref rect);
                var bounds = new Rectangle(rect.Left, rect.Top, rect.Right - rect.Left, rect.Bottom - rect.Top);
                // 添加到已找到的窗口列表。
                windowList.Add(new WindowInfo(hWnd, className, title, isVisible, bounds));
            }
            return true;
        }
    }

    /// <summary>
    /// 默认的查找窗口的过滤条件。可见 + 非最小化 + 包含窗口标题。
    /// </summary>
    private static readonly Predicate<WindowInfo> DefaultPredicate = x => x.IsVisible && !x.IsMinimized && x.Title.Length > 0;

    private delegate bool WndEnumProc(IntPtr hWnd, int lParam);

    [DllImport("user32")]
    private static extern bool EnumWindows(WndEnumProc lpEnumFunc, int lParam);

    [DllImport("user32")]
    private static extern IntPtr GetParent(IntPtr hWnd);

    [DllImport("user32")]
    private static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32")]
    private static extern int GetWindowText(IntPtr hWnd, StringBuilder lptrString, int nMaxCount);

    [DllImport("user32")]
    private static extern int GetClassName(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32")]
    private static extern void SwitchToThisWindow(IntPtr hWnd, bool fAltTab);

    [DllImport("user32")]
    private static extern bool GetWindowRect(IntPtr hWnd, ref LPRECT rect);

    [StructLayout(LayoutKind.Sequential)]
    private readonly struct LPRECT
    {
        public readonly int Left;
        public readonly int Top;
        public readonly int Right;
        public readonly int Bottom;
    }
}

/// <summary>
/// 获取 Win32 窗口的一些基本信息。
/// </summary>
public readonly struct WindowInfo
{
    public WindowInfo(IntPtr hWnd, string className, string title, bool isVisible, Rectangle bounds) : this()
    {
        Hwnd = hWnd;
        ClassName = className;
        Title = title;
        IsVisible = isVisible;
        Bounds = bounds;
    }

    /// <summary>
    /// 获取窗口句柄。
    /// </summary>
    public IntPtr Hwnd { get; }

    /// <summary>
    /// 获取窗口类名。
    /// </summary>
    public string ClassName { get; }

    /// <summary>
    /// 获取窗口标题。
    /// </summary>
    public string Title { get; }

    /// <summary>
    /// 获取当前窗口是否可见。
    /// </summary>
    public bool IsVisible { get; }

    /// <summary>
    /// 获取窗口当前的位置和尺寸。
    /// </summary>
    public Rectangle Bounds { get; }

    /// <summary>
    /// 获取窗口当前是否是最小化的。
    /// </summary>
    public bool IsMinimized => Bounds.Left == -32000 && Bounds.Top == -32000;
}
```
操作
```csharp
var windows = WindowEnumerator.FindAll();
for (int i = 0; i < windows.Count; i++)
{
    var window = windows[i];
    Console.WriteLine($@"{i.ToString().PadLeft(3, ' ')}. {window.Title}
     {window.Bounds.X}, {window.Bounds.Y}, {window.Bounds.Width}, {window.Bounds.Height}");
}
```
