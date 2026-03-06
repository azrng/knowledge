---
title: FlaUI自动化
lang: zh-CN
date: 2023-08-11
publish: true
author: azrng
isOriginal: true
category:
  - dotNet
tag:
  - 自动化
filename: flaUIAutomation
---

## 概述

FlaUI是一个.NET库，有助于Windows应用程序（Win32，WinForms，WPF，Store Apps等）的自动化UI测试。它基于 Microsoft 的本机 UI 自动化库，因此有点像它们的包装器。
FlaUI 包装了 UI 自动化库中的几乎所有内容，但也提供了本机对象，以防有人有 FlaUI 尚未涵盖的特殊需求。一些想法是从UIAComWrapper项目或TestStack.White复制的，但从头开始重写以获得干净的代码库。

仓库地址：https://github.com/FlaUI/FlaUI

## 操作

安装nuget包

```xml
  <ItemGroup>
    <PackageReference Include="FlaUI.Core" Version="4.0.0" />
    <PackageReference Include="FlaUI.UIA3" Version="4.0.0" />
  </ItemGroup>
```

### 查找窗口

```c#
var process = Process.GetProcessesByName("WeChatAppEx").FirstOrDefault();
if (process is null)
{
    return;
}

//根据微信进程ID绑定FLAUI
var application = FlaUI.Core.Application.Attach(process.Id);
var automation = new UIA3Automation();
//获取微信window自动化操作对象
var wxWindow = application.GetMainWindow(automation);

if (wxWindow != null)
{
    if (wxWindow.AsWindow().Patterns.Window.PatternOrDefault != null)
    {
        //将微信窗体设置为默认焦点状态
        wxWindow.AsWindow().Patterns.Window.Pattern.SetWindowVisualState(WindowVisualState.Normal);
    }
}
```

### 查询窗口元素

```c#
var classify = wxWindow.FindAllDescendants().FirstOrDefault(s => s.Name == "分类");

var dialog = wxWindow.FindFirstDescendant(cf =>
            cf.ByControlType(ControlType.Window).And(cf.ByClassName("#32770")));
```

## 实践

### 选择文件弹框切换目录并选择文件

```c#
// 找到文件选择对话框窗口
var dialog = wxWindow.FindFirstDescendant(cf =>
    cf.ByControlType(ControlType.Window).And(cf.ByClassName("#32770")));

// 选择指定盘符  D:\temp\images
var selectWin =
    dialog.FindFirstChild(t => t.ByClassName("ReBarWindow32").And(t.ByControlType(ControlType.Pane)));
if (selectWin is null)
{
    "选择窗体未找到".Dump();
    return;
}

var selectPath =
    selectWin.FindFirstChild(t => t.ByClassName("Address Band Root").And(t.ByControlType(ControlType.Pane)));
if (selectPath is null)
{
    "未找到地址栏".Dump();
    return;
}

var progresBar = selectPath.FindFirstChild(t => t.ByClassName("msctls_progress32"));
progresBar.Click();
//在编辑区域输入文本
Keyboard.Type("D:\\temp\\images");
Keyboard.Press(VirtualKeyShort.ENTER);

var treePanl =
    dialog.FindFirstChild(t => t.ByClassName("DUIViewWndClassName").And(t.ByControlType(ControlType.Pane)));
await Task.Delay(1000);
var fileView =
    treePanl.FindFirstChild(t => t.ByClassName("DUIListView").And(t.ByControlType(ControlType.Pane)));
// 找到文件列表视图控件
var fileList = fileView.FindFirstChild(t => t.ByName("项目视图").And(t.ByControlType(ControlType.List)));

// 选择指定的文件
SelectFile(fileList, "D:\\temp\\images\\cy.png");


static void SelectFile(AutomationElement fileList, string filePath)
{
    // 找到文件列表中对应的文件项
    var fileItem = fileList.FindFirstChild(cf => cf.ByText(Path.GetFileName(filePath))
        .And(cf.ByControlType(ControlType.ListItem)));

    // 选中文件项
    fileItem.DoubleClick();
}
```

### 获取微信好友列表

```c#
void Main()
{
	var process = Process.GetProcessesByName("WeChat").FirstOrDefault();
	if (process is null)
	{
		return;
	}

	//根据微信进程ID绑定FLAUI
	var application = FlaUI.Core.Application.Attach(process.Id);
	var automation = new UIA3Automation();

	//获取微信window自动化操作对象
	var wxWindow = application.GetMainWindow(automation);

	if (wxWindow != null)
	{
		if (wxWindow.AsWindow().Patterns.Window.PatternOrDefault != null)
		{
			//将微信窗体设置为默认焦点状态
			wxWindow.AsWindow().Patterns.Window.Pattern.SetWindowVisualState(WindowVisualState.Normal);
		}
	}
	wxWindow.FindAllDescendants().Where(s => s.Name == "通讯录").FirstOrDefault().Click(false);
	wxWindow.FindAllDescendants().Where(s => s.Name == "新的朋友").FirstOrDefault()?.Click(false);
	string LastName = string.Empty;
	var list = new List<AutomationElement>();
	var sync = SynchronizationContext.Current;
	Task.Run(() =>
	{
		while (true)
		{
			if (GetFriendCancellationToken.IsCancellationRequested)
			{
				break;
			}
			var all = wxWindow.FindAllDescendants();
			var allItem = all.Where(s => s.Parent != null && s.Parent.Name == "联系人").ToList();
			var sss = all.Where(s => s.ControlType == ControlType.Text && !string.IsNullOrWhiteSpace(s.Name)).ToList();
			foreach (var item in allItem)
			{
				if (item.Name != null && item.ControlType == ControlType.ListItem && !string.IsNullOrWhiteSpace(item.Name) && !listBox1.Items.Contains(item.Name.ToString()))
				{
					sync.Post(s =>
					{
						listBox1.Items.Add(s);
					}, item.Name);
				}
			}
			Scroll(-700);
		}
	});
}
```

这里的Scroll代码如下

```c#
#region Scroll Event

private void Scroll(int scroll)
{
    INPUT[] inputs = new INPUT[1];

    // 设置鼠标滚动事件
    inputs[0].type = InputType.INPUT_MOUSE;
    inputs[0].mi.dwFlags = MouseEventFlags.MOUSEEVENTF_WHEEL;
    inputs[0].mi.mouseData = (uint)scroll;

    // 发送输入事件
    SendInput(1, inputs, Marshal.SizeOf(typeof(INPUT)));
}

public struct INPUT
{
    public InputType type;
    public MouseInput mi;
}

// 输入类型
public enum InputType : uint
{
    INPUT_MOUSE = 0x0000,
    INPUT_KEYBOARD = 0x0001,
    INPUT_HARDWARE = 0x0002
}

// 鼠标输入结构体
public struct MouseInput
{
    public int dx;
    public int dy;
    public uint mouseData;
    public MouseEventFlags dwFlags;
    public uint time;
    public IntPtr dwExtraInfo;
}

// 鼠标事件标志位
[Flags]
public enum MouseEventFlags : uint
{
    MOUSEEVENTF_MOVE = 0x0001,
    MOUSEEVENTF_LEFTDOWN = 0x0002,
    MOUSEEVENTF_LEFTUP = 0x0004,
    MOUSEEVENTF_RIGHTDOWN = 0x0008,
    MOUSEEVENTF_RIGHTUP = 0x0010,
    MOUSEEVENTF_MIDDLEDOWN = 0x0020,
    MOUSEEVENTF_MIDDLEUP = 0x0040,
    MOUSEEVENTF_XDOWN = 0x0080,
    MOUSEEVENTF_XUP = 0x0100,
    MOUSEEVENTF_WHEEL = 0x0800,
    MOUSEEVENTF_HWHEEL = 0x1000,
    MOUSEEVENTF_MOVE_NOCOALESCE = 0x2000,
    MOUSEEVENTF_VIRTUALDESK = 0x4000,
    MOUSEEVENTF_ABSOLUTE = 0x8000
}

private const int MOUSEEVENTF_WHEEL = 0x800;

#endregion
```

## 资料

SendInput function：https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendinput

使用c#实现微信自动化：https://mp.weixin.qq.com/s/YM2lR2mL2zclgLySEPnKCQ

使用说明：https://blog.csdn.net/u011234288/article/details/130429511