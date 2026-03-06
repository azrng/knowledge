---
title: 事件
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: shijian
slug: gyeoge
docsId: '50046108'
---

## 介绍
在某件时间发生的时候，一个对象可以通过事件去通知另一个对象。关键点就是什么时候，让谁去做。
事件的关键字是event，事件是一种特殊的委托，它是委托组。

## 操作

### 简单示例
```csharp
namespace ConsoleApp3
{
    /// <summary>
    /// 委托
    /// </summary>
    /// <param name="s1"></param>
    /// <param name="s2"></param>
    /// <returns></returns>
    public delegate void ProcessDelegate(object sender, EventArgs e);

    internal class Program
    {
        private static void Main(string[] args)
        {
            /*  第一步执行  */
            Test t = new Test();
            /* 关联事件方法，相当于寻找到了委托人 */
            t.ProcessEvent += new ProcessDelegate(t_ProcessEvent);
            /* 进入Process方法 */
            Console.WriteLine(t.Process());
            Console.Read();
        }
        private static void t_ProcessEvent(object sender, EventArgs e)
        {
            Test t = (Test)sender;
            t.S1 = "Hello";
            t.S2 = "World";
        }
    }

    public class Test
    {
        public string S1 { get; set; }
        public string S2 { get; set; }

        /// <summary>
        /// 事件
        /// </summary>
        public event ProcessDelegate ProcessEvent;

        private void ProcessAction(object sender, EventArgs e)
        {
            if (ProcessEvent == null)

                ProcessEvent += new ProcessDelegate(t_ProcessEvent);

            ProcessEvent(sender, e);
        }

        //如果没有自己指定关联方法，将会调用该方法抛出错误
        private void t_ProcessEvent(object sender, EventArgs e)
        {
            throw new Exception("The method or operation is not implemented.");
        }

        private void OnProcess()
        {
            ProcessAction(this, EventArgs.Empty);
        }

        public string Process()
        {
            OnProcess();

            return S1 + S2;
        }
    }
}
```

### 标准事件模型
规范：

- 委托类型的名称应该以EventHandler结束
- 委托原型返回值为void
- 委托原型有两个参数：sender表示事件触发者，e表示事件参数
- 事件参数的名字以EventArgs结束
```csharp
internal class Program
{
    private static void Main(string[] args)
    {
        //调用事件
        var fileUpload = new FileUpload();
        fileUpload.FileUploaded+=OutPutMessage;
        fileUpload.Upload();
    }

    public static void OutPutMessage(object sender, FileUploadEventArgs e)
    {
        Console.WriteLine(e.FileProgress);
    }
}

/// <summary>
/// 提供一个FileUploadEventArgs类来保存进度信息
/// </summary>
public class FileUploadEventArgs : EventArgs
{
    public int FileProgress { get; set; }
}

/// <summary>
/// 文件传输的进度通知
/// 演示目的：委托是方法的指针
/// </summary>
public class FileUpload
{
    public event EventHandler<FileUploadEventArgs> FileUploaded;

    public void Upload()
    {
        FileUploadEventArgs e = new FileUploadEventArgs { FileProgress=100 };

        while (e.FileProgress>0)
        {
            //传输代码省略
            e.FileProgress--;
            FileUploaded?.Invoke(this, e);
        }
    }
}
```

### 公众号文章推送
```csharp
/// <summary>
/// 公众号
/// </summary>
public class OfficialAccount
{
    /// <summary>
    /// 推送事件
    /// </summary>
    public event Action<object, EventArgs> PushEvent;

    public int Id { get; set; }
    public string Name { get; set; }

    /// <summary>
    /// 发布公众号内容
    /// </summary>
    /// <param name="officlaAccountContent"></param>
    public void Push(OfficialAccountContent officlaAccountContent)
    {
        Console.WriteLine($"公众号: {Name} 发布了新文章");
        PushEvent?.Invoke(this, officlaAccountContent);
        Console.WriteLine("新文章已推送.....");
    }
}

/// <summary>
/// 公众号内容
/// </summary>
public class OfficialAccountContent : EventArgs
{
    public string Name { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public DateTime PublishTime { get; set; }
}

public class EventStandard
{
    private readonly OfficialAccount _offcialAccount;

    public EventStandard(OfficialAccount offcialAccount)
    {
        _offcialAccount = offcialAccount;
    }

    public void PublishShow(OfficialAccountContent officlaAccountContent)
    {
        _offcialAccount.Push(officlaAccountContent);
    }
}

/// <summary>
/// 读者
/// </summary>
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }

    public void Read(object e, EventArgs eventArgs)
    {
        OfficialAccountContent officlaAccountContent = (OfficialAccountContent)eventArgs;

        Console.WriteLine($"接收到新的推送文章{officlaAccountContent.Name}");
        Console.WriteLine($"接收事件{officlaAccountContent.PublishTime}");
    }
}
```
执行示例
```csharp
var officialAccount = new OfficialAccount
{
    Id=123,
    Name="测试公众号"
};

var student = new Student
{
    Id=123,
    Name="测试微信号"
};

officialAccount.PushEvent+=student.Read;

var eventStandard = new EventStandard(officialAccount);

eventStandard.PublishShow(new OfficialAccountContent
{
    Name="测试博客",
    Title="测试博客",
    PublishTime=DateTime.Now,
});
```

## 资料
[https://mp.weixin.qq.com/s/0Fsy_8GFe-CkjsrgREXChg](https://mp.weixin.qq.com/s/0Fsy_8GFe-CkjsrgREXChg) | 事件
[https://mp.weixin.qq.com/s/T4klLX37fc1RH5zqzQOp_A](https://mp.weixin.qq.com/s/T4klLX37fc1RH5zqzQOp_A) | C## 的event的机制深度理解

