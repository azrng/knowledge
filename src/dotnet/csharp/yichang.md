---
title: 异常
lang: zh-CN
date: 2023-10-25
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: yichang
slug: cor3vlhlu5yzwu8o
docsId: '124494747'
---

## 概述
异常的处理

## 异常类
xxx

## 捕获异常
xxx

## 自定义异常
我们可以通过继承自Exception来编写自定义异常
```csharp
[Serializable]
public class BaseCustomerException : Exception
{
    public BaseCustomerException() { }

    public BaseCustomerException(string message)
        : base(message) { }

    public BaseCustomerException(string code, string message)
        : base(message)
    {
        ErrorCode = code;
    }

    public BaseCustomerException(string message, Exception innerException)
        : base(message, innerException) { }

    public virtual HttpStatusCode HttpCode { get; set; } = HttpStatusCode.InternalServerError;

    /// <summary>
    /// 异常编码
    /// </summary>
    public string ErrorCode { get; }
}
```

我们编写单元测试，进行深拷贝查看前后的对比
```csharp
[Fact]
public void BaseCustomerException_Equal_ReturnOk()
{
    // arrange
    var orignalException = new BaseCustomerException("Hi", "1000");
    var bf = new BinaryFormatter();
    var ms = new MemoryStream();

    // act
#pragma warning disable SYSLIB0011 // 类型或成员已过时
    bf.Serialize(ms, orignalException);
#pragma warning restore SYSLIB0011 // 类型或成员已过时
    ms.Seek(0, 0);
#pragma warning disable SYSLIB0011 // 类型或成员已过时
    var newException = bf.Deserialize(ms) as BaseCustomerException;
#pragma warning restore SYSLIB0011 // 类型或成员已过时

    // assert
    Assert.Equal(orignalException.Message, newException.Message);
    Assert.Equal(orignalException.ErrorCode, newException.ErrorCode);
}
```

结果运行单元测试居然失败，所以只好按照微软 guideline 进行编写，在序列化构造器的上调用 base 的构造器。并且 override 基类的 GetObjectData 方法，最后效果如下
```csharp
/// <summary>
/// 基础自定义错误信息
/// </summary>
[Serializable]
public class BaseCustomerException : Exception
{
    public BaseCustomerException() { }

    public BaseCustomerException(string message)
        : base(message) { }

    public BaseCustomerException(string code, string message)
        : base(message)
    {
        ErrorCode = code;
    }

    public BaseCustomerException(string message, Exception innerException)
        : base(message, innerException) { }

    public virtual HttpStatusCode HttpCode { get; set; } = HttpStatusCode.InternalServerError;

    /// <summary>
    /// 异常编码
    /// </summary>
    public string ErrorCode { get; }

    protected BaseCustomerException(SerializationInfo info, StreamingContext context)
        : base(info, context)
    {
        ErrorCode = info.GetString("ErrorCode");
    }

    public override void GetObjectData(SerializationInfo info, StreamingContext context)
    {
        if (!string.IsNullOrEmpty(ErrorCode))
        {
            info.AddValue("ErrorCode", ErrorCode);
        }
        base.GetObjectData(info, context);
    }
}
```

## 调用者信息
xxx

## 操作

### 对比
throw ex会丢失原本的堆栈，但是可以自己重定义异常信息
```csharp
try
{

}
catch (Exception ex)
{
    throw ex;
}
```
throw 不会丢失原本的堆栈信息，但是你没法重新定义异常信息
```csharp
try
{

}
catch (Exception ex)
{
    throw;
}
```
throw ex+Capture 既能够自定义异常消息，还不丢失堆栈。
```csharp
try
{

}
catch (Exception ex)
{
    ExceptionDispatchInfo.Capture(ex).Throw();
}
```

## 优化

异常也是现代语言的典型特征。与传统检查错误码的方式相比，异常是强制性的（不依赖于是否忘记了编写检查错误码的代码）、强类型的、并带有丰富的异常信息（例如调用栈）。

### 不要吃掉异常★

关于异常处理的最重要原则就是：不要吃掉异常。这个问题与性能无关，但对于编写健壮和易于排错的程序非常重要。这个原则换一种说法，就是不要捕获那些你不能处理的异常。



吃掉异常是极不好的习惯，因为你消除了解决问题的线索。一旦出现错误，定位问题将非常困难。除了这种完全吃掉异常的方式外，只将异常信息写入日志文件但并不做更多处理的做法也同样不妥。

### 不要吃掉异常信息★

有些代码虽然抛出了异常，但却把异常信息吃掉了。

为异常披露详尽的信息是程序员的职责所在。如果不能在保留原始异常信息含义的前提下附加更丰富和更人性化的内容，那么让原始的异常信息直接展示也要强得多。千万不要吃掉异常。

### 避免不必要的抛出异常

抛出异常和捕获异常属于消耗比较大的操作，在可能的情况下，应通过完善程序逻辑避免抛出不必要不必要的异常。与此相关的一个倾向是利用异常来控制处理逻辑。尽管对于极少数的情况，这可能获得更为优雅的解决方案，但通常而言应该避免。

### 避免不必要的重新抛出异常

如果是为了包装异常的目的（即加入更多信息后包装成新异常），那么是合理的。但是有不少代码，捕获异常没有做任何处理就再次抛出，这将无谓地增加一次捕获异常和抛出异常的消耗，对性能有伤害。

## 资料

异常处理
[https://timdeschryver.dev/blog/translating-exceptions-into-problem-details-responses#default-api-behavior](https://timdeschryver.dev/blog/translating-exceptions-into-problem-details-responses#default-api-behavior)

[https://mp.weixin.qq.com/s/-vRX1XlI_RWy9RG47M9C8A](https://mp.weixin.qq.com/s/-vRX1XlI_RWy9RG47M9C8A) | 每个.NET开发都应掌握的C#异常处理知识点
