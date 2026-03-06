---
title: winform注册热键实现截图效果
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: winformzhucerejianshixianjietuxiaoguo
slug: vg1ezlug8gla44y3
docsId: '127779319'
---

## 需求
通过在启动的时候注册热键实现截图效果。

## 操作

### 创建依赖类
首先创建系统API类
> 注意：该类中的Keys来自：System.Windows.Forms

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
然后编写热键管理类，用来注册热键，并保存热键被触发后执行的方法
```csharp
/// <summary>
/// 快捷键注册注销管理
/// </summary>
internal static class HotkeyManage
{
    /// <summary>
    /// 热键消息
    /// </summary>
    private const int WM_HOTKEY = 786;

    /// <summary>
    /// 区分不同的快捷键
    /// </summary>
    private static int keyid = 10;

    /// <summary>
    /// 每一个key对应一个处理函数 key:热键标识 value：热键触发方法
    /// </summary>
    private static readonly Dictionary<int, Action> _keymap = new Dictionary<int, Action>();

    /// <summary>
    /// 注册快捷键
    /// </summary>
    /// <param name="hWnd">持有快捷键窗口的句柄</param>
    /// <param name="fsModifiers">组合键</param>
    /// <param name="vk">快捷键的虚拟键码</param>
    /// <param name="callBack">回调函数</param>
    public static void Regist(IntPtr hWnd, HotkeyModifiers fsModifiers, Keys vk, Action callBack)
    {
        int num = keyid++;
        if (!WindowsAPI.RegisterHotKey(hWnd, num, fsModifiers, vk))
        {
            throw new Exception("点击继续可以使用，但是软件的快捷键将不会生效！");
        }
        _keymap[num] = callBack;
    }

    /// <summary>
    /// 注销快捷键
    /// </summary>
    /// <param name="hWnd">持有快捷键窗口的句柄</param>
    /// <param name="callBack">回调函数</param>
    public static void UnRegist(IntPtr hWnd, Action callBack)
    {
        foreach (KeyValuePair<int, Action> keyValuePair in _keymap)
        {
            if (keyValuePair.Value == callBack)
            {
                WindowsAPI.UnregisterHotKey(hWnd, keyValuePair.Key);
            }
        }
    }

    /// <summary>
    /// 快捷键消息处理
    /// </summary>
    public static void ProcessHotKey(Message m)
    {
        // 如果接受到的消息是热键消息 那么就触发回调函数
        if (m.Msg == WM_HOTKEY)
        {
            int key = m.WParam.ToInt32();
            if (_keymap.TryGetValue(key, out var hotKeyCallBackHanlder))
            {
                hotKeyCallBackHanlder();
            }
        }
    }
}
```

### 创建窗体
创建窗体程序，并在加载的时候注册热键，并配置热键被触发的时候执行方法StartCapture
```csharp
private void Form1_Load(object sender, EventArgs e)
{
    try
    {
        //注册热键 Ctrl+ALT+A 截图
        HotkeyManage.Regist(base.Handle, HotkeyModifiers.MOD_CONTROL_ALT, Keys.A, StartCapture);
    }
    catch
    {
        Console.WriteLine("热键注册失败");
    }
}
```
重写窗口消息用来接收热键消息
```csharp
/// <summary>
/// 覆写窗体消息
/// </summary>
/// <param name="m"></param>
protected override void WndProc(ref Message m)
{
    base.WndProc(ref m);
    // 热键消息触发的操作
    HotkeyManage.ProcessHotKey(m);
}
```
然后会在ProcessHotKey中去调用热键触发的方法，当输入热键的时候就会触发StartCapture方法进行截图操作
```csharp
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

/// <summary>
/// 允许保存的图片类型
/// </summary>
private readonly string[] ImgAllow = new string[] { "jpg", "png", "gif", "peg", "bmp" };

/// <summary>
/// 从剪切板获取图片并识别
/// </summary>
private void ClipboardOCR()
{
    var img = Clipboard.GetImage();

    if (img != null)
    {
        img.Save($"D:\\temp\\{DateTime.Now.ToString("HHmmss")}.png");
        return;
    }

    // 直接复制的图片文件
    var files = Clipboard.GetFileDropList();
    if (files.Count > 0)
    {
        string ext = files[0].ToLower().Substring(files[0].Length - 3);
        if (ImgAllow.Contains(ext))
        {
            //var img = Image.FromFile(files[0]);
        }
    }
}
```
SnippingToolProcess_Exited事件用来实现截图完成后的回调，然后截图成功后实现保存截图的图片。

如果需要将截图的内容显示到窗口上，那么需要让窗口显示出来，可以使用下面代码来显示窗口。
```csharp
WindowsAPI.ShowWindow(this.Handle, 9);
```
最后窗口关闭的时候记得卸载热键
```csharp
/// <summary>
/// 关闭，卸载热键
/// </summary>
/// <param name="sender"></param>
/// <param name="e"></param>
private void Form1_FormClosed(object sender, FormClosedEventArgs e)
{
    try
    {
        HotkeyManage.UnRegist(base.Handle, StartCapture);
    }
    catch
    {
    }
}
```
