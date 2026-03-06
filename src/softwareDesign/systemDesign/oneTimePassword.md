---
title: 一次性密码
lang: zh-CN
date: 2024-01-06
publish: true
author: Catcher Wong
isOriginal: true
category:
  - 软件设计
tag:
  - 一次性密码
---

## 背景

一次性密码（One Time Password，简称OTP），又称动态密码或单次有效密码，是指计算器系统或其他数字设备上只能使用一次的密码，有效期为只有一次登录会话或交易。

最常见的场景应该就是 2FA（双因素身份验证），例如 Github 的 2FA，云账号的 MFA等，以及一些需要动态密码的场景，例如动态口令牌等

它有两种比较常见的实现有 HOTP（HMAC-Based One-Time Password） 和 TOTP（Time-Based One-Time Password）

## HOTP和TOTP

HOTP 是基于 HMAC 的一次性密码，其工作原理：`HOTP(S,C) = Truncate(HMAC-SHA-1(S,C))`

关键步骤说明：

- Truncate：把HMAC-SHA-1哈希结果20个字节转换成6-8位的数字；
- S: Secret，客户端和服务器事先协商好的共享密钥;
- C: Counter，客户端和服务器保持同步的计数器；

原理的公式上写的是 sha1，不过很多类库在实现上还支持了 sha128、sha512 这些。

TOTP 是基于时间的一次性密码，它的工作原理：`TOTP = HOTP(K, T)`

严格上是 HOTP 的一个变种，出现演变，肯定是有一些不太好处理的东西，因为 HOTP 除了要共享一个密钥之外，还要同步一个计数器。

关于计数器这一块，如果客户端误操作或者其他原因连续多次生成，但是只给最后一次生成的给服务端校验，那么这个时候服务端肯定没办法校验成功，因为客户端计数器变化了，但是服务端并不知道客户端发生了变化。这就导致两边的不一致，需要及时同步才可以解决这个问题。

时间，大部分情况下，客户端和服务端是保持一致，所以在这种考量下，用时间来作为计数器就可以一定程度上避免计数器的同步了。

当然，基于时间来做计数器也不是万能的，因为会出现网络延迟，这就导致两边计算的时间不一致，这也会导致失败。

TOTP 的计数器在设计上是支持了这种情况的，下面具体来看看：

- `T = (Current Unix time - T0) / X`
- Current Unix Time：当前的Unix时间;
- T0：开始计步初始化时间，默认为0，即Unix Epoch;
- X : 步长，默认情况下为30s，可以理解为每个生成的密码的默认有效时间为30秒

从上面可以看出客户端和服务端之间的时间是有一个误差允许范围的。

## Otp.Net

在 C# 里面，关于上述 OTP 的两种实现中，用得比较多的是 https://github.com/kspearrin/Otp.NET 。

下面也简单介绍一下它的使用：首先是 HOTP

```c#
var secretKey = Encoding.UTF8.GetBytes("123456");
var hotp = new Hotp(secretKey, OtpHashMode.Sha512);

var h1 = hotp.ComputeHOTP(123456);
var h2 = hotp.ComputeHOTP(654321);
Console.WriteLine($"h1:{h1} h2:{h2}");
Console.WriteLine($"v1:{hotp.VerifyHotp(h1, 123456)} {hotp.VerifyHotp(h1, 654321)}");
Console.WriteLine($"v2: {hotp.VerifyHotp(h2, 654321)}");

// 运行结果
h1:767612 h2:211792
v1:True False
v2: True 
```

其中 OtpHashMode 是一个枚举，有 sha1 sha256 sha512 三个选择。

ComputeHOTP 就是根据计数器来生成密码，示例上面用了 1 和 2。

VerifyHotp 则是根据计数器来验证密码，示例有两个成功和一个失败，失败的是因为生成 h1 的计数器是 1，校验的时候是 2，计数器不一致导致的验证失败。



再有就是 TOTP，这里的用法就会比较多了。

先看看常规的用法：

```c#
using System.Text;
using OtpNet;

var secretKey = Encoding.UTF8.GetBytes("123456");
var (code, sec) = Gen();
Console.WriteLine($"code:{code} remaining:{sec}");

var res = Check(code);
Console.WriteLine(res);

// 在指定时间后，code过期
Thread.Sleep(sec * 1000);

res = Check(code);
Console.WriteLine(res);

(string code, int sec) Gen()
{
    var totp = new Totp(secretKey: secretKey, mode: OtpHashMode.Sha512);
    var computeTotp = totp.ComputeTotp();
    var remainingSeconds = totp.RemainingSeconds();
    return (computeTotp, remainingSeconds);
}

bool Check(string code)
{
    var totp = new Totp(secretKey: secretKey, mode: OtpHashMode.Sha512);
    return totp.VerifyTotp(code, out _);
}
```

生成了一次密码后，在有效期内进行验证都是可以通过的，超过有效期就会验证失败；这个逻辑似乎和“一次性”有一点冲突。因为上面的代码并没有进行一次性的限定。

那么来看看要怎么限制：

根据 https://github.com/kspearrin/Otp.NET?tab=readme-ov-file#one-time-use ，我们可以使用 VerifyTotp 的 out 参数来做唯一性判断，大致代码如下

```c#
using System.Text;
using OtpNet;

HashSet<long> stepMatchSet = [];

var secretKey = Encoding.UTF8.GetBytes("123456");
var (code, sec) = Gen();
Console.WriteLine($"code:{code} remaining:{sec}");

// 第一次检查
var res = Check(code);
Console.WriteLine(res);

// 第二次检查
res = Check(code);
Console.WriteLine(res);

(string code, int sec) Gen()
{
    var totp = new Totp(secretKey: secretKey, mode: OtpHashMode.Sha512);
    var computeTotp = totp.ComputeTotp();
    var remainingSeconds = totp.RemainingSeconds();
    return (computeTotp, remainingSeconds);
}

bool Check(string code)
{
    var totp = new Totp(secretKey: secretKey, mode: OtpHashMode.Sha512);
    var flag = totp.VerifyTotp(code, out var timeStepMatched);

    if (!stepMatchSet.Add(timeStepMatched))
    {
        flag = false;
    }

    return flag;
}


// 输出结果
code:661597 remaining:3
True 
False
```

最后来看看时间窗口的例子，这种情况一般是针对客户端和服务端之间网络延迟较高的时候用。但是 RFC 中并不建议我们设置的时间窗口太大，一般放宽一个即可。

下面的示例是放宽了2个，主要是演示在特定时间区间内能否正常生效。

```json
using System.Text;
using OtpNet;

var secretKey = Encoding.UTF8.GetBytes("123456");
var (codeNow, secNow) = Gen(DateTime.UtcNow);
Console.WriteLine($"code:{codeNow} remaining:{secNow}");
var resNow = Check(codeNow);
Console.WriteLine(resNow);

var (codeP1, secP1) = Gen(DateTime.UtcNow.AddSeconds(-15));
Console.WriteLine($"code p1:{codeP1} remaining p1:{secP1}");
var resP1 = Check(codeP1);
Console.WriteLine(resP1);


var (codeP2, secP2) = Gen(DateTime.UtcNow.AddSeconds(-45));
Console.WriteLine($"code p2:{codeP2} remaining p2:{secP2}");
var resP2 = Check(codeP2);
Console.WriteLine(resP2);


var (codeP3, secP3) = Gen(DateTime.UtcNow.AddSeconds(-90));
Console.WriteLine($"code p3:{codeP3} remaining p3:{secP3}");
var resP3 = Check(codeP3);
Console.WriteLine(resP3);


var (codeP4, secP4) = Gen(DateTime.UtcNow.AddSeconds(15));
Console.WriteLine($"code p4:{codeP4} remaining p4:{secP4}");
var resP4 = Check(codeP4);
Console.WriteLine(resP4);


var (codeP5, secP5) = Gen(DateTime.UtcNow.AddSeconds(45));
Console.WriteLine($"code p5:{codeP2} remaining p5:{secP5}");
var resP5 = Check(codeP5);
Console.WriteLine(resP5);


var (codeP6, secP6) = Gen(DateTime.UtcNow.AddSeconds(90));
Console.WriteLine($"code p6:{codeP1} remaining p6:{secP6}");
var resP6 = Check(codeP6);
Console.WriteLine(resP6);


(string code, int sec) Gen(DateTime dt)
{
    var totp = new Totp(secretKey: secretKey, mode: OtpHashMode.Sha512);
    var computeTotp = totp.ComputeTotp(dt);
    var remainingSeconds = totp.RemainingSeconds();
    return (computeTotp, remainingSeconds);
}

bool Check(string code)
{
    var totp = new Totp(secretKey: secretKey, mode: OtpHashMode.Sha512);
    // 默认周期30s，验证窗口为前后两个时间窗口，所以是 -60s到60s
    var flag = totp.VerifyTotp(code, out _, new VerificationWindow(previous: 2, future: 2));

    return flag;
}
```

画了个简单的时间轴演示上面的代码

![image-20240313165227640](/common/image-20240313165227640.png)

## 参考资料

- https://datatracker.ietf.org/doc/html/rfc6238
- https://datatracker.ietf.org/doc/html/rfc4226