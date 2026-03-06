---
title: 文件操作
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: wenjianyumulucaozuo
slug: qed2c0
docsId: '64119312'
---

## 概述
System.IO命名空间中有一些可以进行文件和目录操作（例如复制和移动、创建目录，以及设置文件的属性和权限）的实用类型。

## 操作

### File
获取文件的信息
```csharp
string filePath = "C:\\Users\\username\\Documents\\example.txt";
// 获取文件大小（字节）
long fileSize = new FileInfo(filePath).Length;
Console.WriteLine("文件大小（字节）：" + fileSize);

// 获取文件创建时间
DateTime creationTime = File.GetCreationTime(filePath);
Console.WriteLine("文件创建时间：" + creationTime);

// 获取文件最后修改时间
DateTime lastWriteTime = File.GetLastWriteTime(filePath);
Console.WriteLine("文件最后修改时间：" + lastWriteTime);

// 获取文件属性
FileAttributes attributes = File.GetAttributes(filePath);
Console.WriteLine("文件属性：" + attributes);
```

File是一个静态类，方法均接受文件名参数，可以是相对路径也可以是绝对路径。
```csharp
//是否存在
File.Exists("path");
//删除文件
File.Delete("path");//如果文件是只读的，那么删除会抛出UnAuthorizedAccessException
//拷贝文件
File.Copy("老地址", "新地址");
//移动文件
File.Move("老地址", "新地址");//目标存在就抛出异常

//创建文件
File.WriteAllText(Path.Combine(Directory.GetCurrentDirectory(), "greeting.txt"), "Hello World!");

//读取文件
File.ReadAllText("");

//将数据写入文件
File.WriteAllText($"SalesTotals{Path.DirectorySeparatorChar}totals.txt", "内容");

//追加数据到文件
File.AppendAllText($"SalesTotals{Path.DirectorySeparatorChar}totals.txt", "内容");
```

文件是包含各种权限的，比如只读等。
```csharp
//在不影响其他属性的前提下替换其中一个文件的属性
var filePath = "E:\\test.txt";
var fa = File.GetAttributes(filePath);
if ((fa & FileAttributes.ReadOnly) != 0)
{
    fa ^= FileAttributes.ReadOnly;
    File.SetAttributes(filePath, fa);
}
//现在我们可以删除这个文件
File.Delete(filePath);

或

//修改只读标志的方法
new FileInfo("filePath").IsReadOnly = false;
```

获取文件的扩展名和类型等信息
```csharp
string filePath = "C:\\Users\\username\\Documents\\example.txt";
//获取文件的全路径
Console.WriteLine("获取文件的全路径：" + Path.GetFullPath(filePath););
//获取文件所在的目录
Console.WriteLine("获取文件所在的目录：" + Path.GetDirectoryName(filePath));
//获取文件的名称含有后缀  example.txt
Console.WriteLine("获取文件的名称含有后缀：" + Path.GetFileName(filePath));
//获取文件的名称没有后缀 example
Console.WriteLine("获取文件的名称没有后缀：" + Path.GetFileNameWithoutExtension(filePath));
//获取路径的后缀扩展名称（包含点号）  .txt
Console.WriteLine("获取路径的后缀扩展名称：" + Path.GetExtension(filePath));
//获取路径的根目录 C:\
Console.WriteLine("获取路径的根目录：" + Path.GetPathRoot(filePath));

// 获取文件类型（MIME类型）
string mimeType = "application/unknown"; // 默认值
if (!string.IsNullOrEmpty(extension))
{
	Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(extension);
	if (regKey != null && regKey.GetValue("Content Type") != null)
	{
		mimeType = regKey.GetValue("Content Type").ToString();
	}
}
Console.WriteLine("文件类型：" + mimeType);
```

### Directory
是一个操作目录的静态类，获取目录信息
```csharp
string directoryPath = "C:\\Users\\username\\Documents";
// 获取目录下的文件列表
string[] files = Directory.GetFiles(directoryPath);
foreach (string file in files)
{
	Console.WriteLine("文件名：" + Path.GetFileName(file));
	Console.WriteLine("文件大小（字节）：" + new FileInfo(file).Length);
	Console.WriteLine("文件创建时间：" + File.GetCreationTime(file));
}
```


还提供了一系列方法来检查目录是否存在(Exists)、移动目录(Move)、删除目录(Delete),获取/设置创建时间或者设置最后访问时间以及获取/设置目录的安全权限。

还包含以下静态方法
```csharp
// 创建目录
Directory.CreateDirectory("path/to/directory");

// 删除目录
Directory.Delete("path/to/directory", true); // 第二个参数表示是否递归删除子目录和文件

//获取当前目录
Console.WriteLine(Directory.GetCurrentDirectory());

//获取目录的文件
var files = Directory.GetFiles("path");

//列出所有目录
IEnumerable<string> listOfDirectories = Directory.EnumerateDirectories("stores");

//列出目录中所有文件的名称
IEnumerable<string> files = Directory.EnumerateFiles("stores");

//列出目录和所有子目录中的所有内容
IEnumerable<string> allFilesInAllFolders = Directory.EnumerateFiles("stores", "*.txt", SearchOption.AllDirectories);

//创建目录 在“201”文件夹内创建一个名为“newDir”的新文件夹
Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "stores","201","newDir")); 

//确保目录存在
bool doesDirectoryExist = Directory.Exists(filePath);
```

### FileInfo

- 适合针对一个项目进行一系列调用，使用这两个对象模型更加适合。
- FileInfo类以实力成员的形式提供了File类型静态方法的大部分功能，还包含一些额外的属性，比如Extensions、Length、IsReadOnly以及Directory
```csharp
var fi = new FileInfo("e:\\test.txt");
Console.WriteLine(fi.Exists);

using (TextWriter w = fi.CreateText())
    w.Write("Sone text");

Console.WriteLine(fi.Exists);
fi.Refresh();
Console.WriteLine(fi.Exists);

Console.WriteLine(fi.Name);
Console.WriteLine(fi.FullName);
Console.WriteLine(fi.DirectoryName);
Console.WriteLine(fi.Directory.Name);
Console.WriteLine(fi.Extension);
Console.WriteLine(fi.Length);
fi.Encrypt();
fi.Attributes ^= FileAttributes.Hidden;
fi.IsReadOnly = true;
Console.WriteLine(fi.Attributes);
Console.WriteLine(fi.CreationTime);
fi.MoveTo("e://bb.txt");
DirectoryInfo di = fi.Directory;
Console.WriteLine(di.Name);
Console.WriteLine(di.FullName);
Console.WriteLine(di.Parent.FullName);
di.CreateSubdirectory("SubFolder");
```

使用FileInfo获取文件各种信息
```csharp
string filePath = "C:\\Users\\username\\Documents\\example.txt";
FileInfo fileInfo = new FileInfo(filePath);

Console.WriteLine("文件名称：" + fileInfo.Name);
Console.WriteLine("文件全路径：" + fileInfo.FullName);
Console.WriteLine("文件大小（字节）：" + fileInfo.Length);
Console.WriteLine("文件创建时间：" + fileInfo.CreationTime);
Console.WriteLine("文件最后修改时间：" + fileInfo.LastWriteTime);
```

### Path

- 不操作文件或目录，但是它可以处理文件名称或者目录路径字符串。
- Path的Combine方法可以在不需要检查名称后面是否有反斜杠的情况下组合目录和文件名，或者组合两个目录。
- GetFullPath可以将一个相对于当前目录的路径转换为一个绝对路径。
```csharp
//连接路径
Console.WriteLine(Path.Combine("stores","201")); // outputs: stores/201

//获取文件夹扩展名
Console.WriteLine(Path.GetExtension("sales.json")); // outputs: .json
```

#### 扩展名

文件的扩展名或类型（MIME类型）等，可以使用`Path`类的一些静态方法

```c#
string filePath = "C:\\Users\\username\\Documents\\example.txt";
//获取文件的全路径
Console.WriteLine("获取文件的全路径：" + Path.GetFullPath(filePath););
//获取文件所在的目录
Console.WriteLine("获取文件所在的目录：" + Path.GetDirectoryName(filePath));
//获取文件的名称含有后缀  example.txt
Console.WriteLine("获取文件的名称含有后缀：" + Path.GetFileName(filePath));
 //获取文件的名称没有后缀 example
Console.WriteLine("获取文件的名称没有后缀：" + Path.GetFileNameWithoutExtension(filePath));
//获取路径的后缀扩展名称（包含点号）  .txt
Console.WriteLine("获取路径的后缀扩展名称：" + Path.GetExtension(filePath));
//获取路径的根目录 C:\
Console.WriteLine("获取路径的根目录：" + Path.GetPathRoot(filePath));

// 获取文件类型（MIME类型）
string mimeType = "application/unknown"; // 默认值
if (!string.IsNullOrEmpty(extension))
{
    Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(extension);
    if (regKey != null && regKey.GetValue("Content Type") != null)
    {
        mimeType = regKey.GetValue("Content Type").ToString();
    }
}
Console.WriteLine("文件类型：" + mimeType);
```

### 特殊文件夹

Path和Directory类型并不具备查找特殊文件夹的功能。这些特殊文件夹包括My Document、Program Files、ApplicationData等。该功能是由System.Environment类的GetFolderPath方法提供的。
```csharp
//System.Environment.SpecialFolder 枚举指定用于检索特殊系统文件夹路径的常量。

string myDocPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
Console.WriteLine(myDocPath);
```

- ApplicationData。该目录可用于存储一些设置，但是它会随着用户的网络位置变化而变化

### 查询卷信息

- DriveInfo类来查询计算机驱动器相关的信息
- 静态方法GetDrives会返回所有映射的驱动器，包括CD-ROM、内存卡和网络连接

### 捕获文件系统事件

- FileSystemWatcher类可以监控一个目录（或者子目录）的活动。
- FileSystemWatcher是在一个独立线程上接收事件的，因此所有事件处理代码必须使用异常处理语句，防止发生错误而令应用程序崩溃。
   - Changed：文件内容变更通知
   - Created：文件创建变更通知
   - Deleted：文件删除变更通知
   - Renamed：文件重命名通知

下面代码就是用来监控D:\test目录下所有的txt文件
```csharp
class Program
{
	static void Main(string[] args)
	{
		CreateFileWatcher(@"D:\test");

		Console.ReadLine();
	}

	public static void CreateFileWatcher(string path)
	{
		// Create a new FileSystemWatcher and set its properties.
		FileSystemWatcher watcher = new FileSystemWatcher();
		watcher.Path = path;
		/* Watch for changes in LastAccess and LastWrite times, and 
		   the renaming of files or directories. */
		watcher.NotifyFilter = NotifyFilters.LastAccess | NotifyFilters.LastWrite
		   | NotifyFilters.FileName | NotifyFilters.DirectoryName;
		// Only watch text files.
		watcher.Filter = "*.txt";

		// Add event handlers.
		watcher.Changed += new FileSystemEventHandler(OnChanged);
		watcher.Created += new FileSystemEventHandler(OnChanged);
		watcher.Deleted += new FileSystemEventHandler(OnChanged);
		watcher.Renamed += new RenamedEventHandler(OnRenamed);

		// Begin watching.
		watcher.EnableRaisingEvents = true;
	}

	// Define the event handlers.
	private static void OnChanged(object source, FileSystemEventArgs e)
	{
		// Specify what is done when a file is changed, created, or deleted.
		Console.WriteLine("File: " + e.FullPath + " " + e.ChangeType);
	}

	private static void OnRenamed(object source, RenamedEventArgs e)
	{
		// Specify what is done when a file is renamed.
		Console.WriteLine("File: {0} renamed to {1}", e.OldFullPath, e.FullPath);
	}
}
```
当然如何你想监控 D:\test 下包括子目录的 txt 文件，可以配置 IncludeSubdirectories 属性，参考如下代码：
```csharp
 watcher.IncludeSubdirectories = true;
```
FileSystemWatcher 非常强大，在 .NETCore 中实现对 appsettings 的监控，用的就是它作为底层实现。
> 资料来源：[https://mp.weixin.qq.com/s/I5wbbd4GN7JmNGpob8NhMg](https://mp.weixin.qq.com/s/I5wbbd4GN7JmNGpob8NhMg)


监控指定目录示例
```plsql
using System.IO;
using static System.Console;
using static System.ConsoleColor;
 
namespace jhrs.com
{
    class Program
    {
        static void Main(string[] args)
        {
            //实例化一个FileSystemWatcher对象
            var fileSystemWatcher = new FileSystemWatcher();
 
            //订阅事件，创建，更改，删除，重命名
            fileSystemWatcher.Created += FileSystemWatcher_Created;
            fileSystemWatcher.Changed += FileSystemWatcher_Changed;
            fileSystemWatcher.Deleted += FileSystemWatcher_Deleted;
            fileSystemWatcher.Renamed += FileSystemWatcher_Renamed;
 
            //指定监控目录
            fileSystemWatcher.Path = @"C:UsersJeremyPicturesScreenshots";
 
            //启用监控.
            fileSystemWatcher.EnableRaisingEvents = true;
 
            WriteLine("Listening...");
            WriteLine("(Press any key to exit.)");
            
            ReadLine();
        }
 
        private static void FileSystemWatcher_Renamed(object sender, RenamedEventArgs e)
        {
            ForegroundColor = Yellow;
            WriteLine($"A new file has been renamed from {e.OldName} to {e.Name}");
        }
 
        private static void FileSystemWatcher_Deleted(object sender, FileSystemEventArgs e)
        {
            ForegroundColor = Red;
            WriteLine($"A new file has been deleted - {e.Name}");
        }
 
        private static void FileSystemWatcher_Changed(object sender, FileSystemEventArgs e)
        {
            ForegroundColor = Green;
            WriteLine($"A new file has been changed - {e.Name}");
        }
 
        private static void FileSystemWatcher_Created(object sender, FileSystemEventArgs e)
        {
            ForegroundColor = Blue;
            WriteLine($"A new file has been created - {e.Name}");
        }
    }
}
```
资料来源：[https://jhrs.com/2019/33547.html](https://jhrs.com/2019/33547.html)

### 获取程序路径

通过一个WebApi程序举例

```c#
// 获取所有程序集
var allassembliy = AppDomain.CurrentDomain.GetAssemblies();

// 获取程序的基目录。
System.AppDomain.CurrentDomain.BaseDirectory
输出结果：E:\Test\WebApplication9\WebApplication9\bin\Debug\net5.0\

// 获取模块的完整路径，包含文件名
System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName
输出结果：E:\Test\WebApplication9\WebApplication9\bin\Debug\net5.0\WebApplication9.exe

// 获取和设置当前目录(该进程从中启动的目录)的完全限定目录。
System.Environment.CurrentDirectory
输出结果：E:\Test\WebApplication9\WebApplication9

// 获取应用程序的当前工作目录，注意工作目录是可以改变的，而不限定在程序所在目录。
System.IO.Directory.GetCurrentDirectory()
输出结果：E:\Test\WebApplication9\WebApplication9

// 获取和设置包括该应用程序的目录的名称。
System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase
输出结果：E:\Test\WebApplication9\WebApplication9\bin\Debug\net5.0\

//获取程序集解析程序用于探测程序集的基目录的文件路径。
System.AppContext.BaseDirectory
输出结果：E:\Test\WebApplication9\WebApplication9\bin\Debug\net5.0\

//获取当前应用程序所针对的框架版本的名称。
System.AppContext.TargetFrameworkName
输出结果：.NETCoreApp,Version=v5.0
```

参考文档：[https://docs.microsoft.com/zh-cn/dotnet/api/system?view=netcore-3.1](https://docs.microsoft.com/zh-cn/dotnet/api/system?view=netcore-3.1)

## 参考资料

c#获取we你按信息大全：[https://mp.weixin.qq.com/s/HYUJAvXchZywWQRtr_Aj9g](https://mp.weixin.qq.com/s/HYUJAvXchZywWQRtr_Aj9g)
