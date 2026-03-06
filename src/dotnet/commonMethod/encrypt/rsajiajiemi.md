---
title: RSA加解密
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: rsajiajiemi
slug: gnc1oq7s7u80fupg
docsId: '142536573'
---

## 密钥区别
RSA生成的密钥可以以不同的格式进行表示，常见的包括字符串（PEM/Base64）和XML。

1. 字符串格式（PEM/Base64）: 这种格式通常用于在文本文件中存储和传输密钥。它将密钥转换为可读的字符串形式，经过Base64编码，并采用一定的标记和格式进行表示，例如以"-----BEGIN RSA PRIVATE KEY-----"开始和"-----END RSA PRIVATE KEY-----"结束。
2. XML格式: 这种格式使用XML标记语言表示密钥。公钥和私钥分别包含在`<RSAKeyValue>`元素中，并使用子元素来表示其中的参数，如模数（Modulus）、指数（Exponent）等。

两种格式之间的主要区别在于表示方式和可读性。XML格式相对于字符串格式更易于解析和处理，因为它具有结构化的特点，但字符串格式在某些情况下更灵活，可以直接在文本中嵌入或传输。选择使用哪种格式取决于具体的应用需求和所使用的密钥库或工具的支持情况。

## 用法

公钥加密、私钥解密。
私钥签名、公钥验签。

## 常用方法

### 创建方法
表示两种不同的方式来创建 RSA 密钥对的对象
```csharp
var rsa = new RSACryptoServiceProvider(2048);
var rsa = RSA.Create();
```

1. new RSACryptoServiceProvider(2048): 这是使用传统的 RSACryptoServiceProvider 类创建 RSA 对象的方式。在指定密钥大小为 2048 位时，它会生成一个具有指定位数的 RSA 密钥对。这是.NET Framework 中的传统方法，在 .NET Core 中也支持。
2. RSA.Create(): 这是使用 RSA 抽象类的工厂方法来创建 RSA 对象的方式。这是.NET Core 引入的新方法，它提供了更好的可扩展性和灵活性。使用 RSA.Create() 可以根据当前环境选择最合适的 RSA 实现。这意味着，根据运行时环境和操作系统，可能会使用不同的 RSA 实现，如 Windows CNG (Cryptographic Next Generation) 或 OpenSSL。通过 RSA.Create() 创建的 RSA 对象可以提供更好的跨平台兼容性，并且更易于迁移到其他环境。

总结来说，new RSACryptoServiceProvider(2048) 是传统的方式，在.NET Framework 和.NET Core 中都可以使用。而 RSA.Create()是.NET Core 推荐的方式，提供更好的可扩展性和跨平台兼容性。

### ExportRSAPrivateKey
PKCS#1 和 PKCS#8 都是用于描述 RSA 密钥的标准格式，但它们之间存在一些差异：

- PKCS#1 格式是较早的标准，它以 ASN.1 的 DER 编码格式保存密钥，并包含了附加的 RSA 私钥成分。
- PKCS#8 格式是一个通用的私钥信息语法标准，它同样使用 ASN.1 的 DER 编码格式保存密钥，但将 RSA 私钥的成分包装在一个 PrivateKeyInfo 结构中。

在 .NET Core 中，ExportRSAPrivateKey 方法返回的结果是 PKCS#1 格式的 RSA 私钥，这意味着导出的私钥被包装在 PrivateKeyInfo 结构中。
PCKS8的密钥可以转换为PKCS1的密钥

## RSAForJava
使用私钥加密、公钥解密，并且和java加解密互通
需要先安装BouncyCastle包
```csharp
using Org.BouncyCastle.Asn1;
using Org.BouncyCastle.Asn1.Pkcs;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Encodings;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Pkcs;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.X509;

namespace ConsoleApp1;

public class RSAForJava
{
    /// <summary>
    /// KEY 结构体
    /// </summary>
    public struct RSAKEY
    {
        /// <summary>
        /// 公钥
        /// </summary>
        public string PublicKey
        {
            get;
            set;
        }

        /// <summary>
        /// 私钥
        /// </summary>
        public string PrivateKey
        {
            get;
            set;
        }
    }

    public RSAKEY GetKey()
    {
        //RSA密钥对的构造器
        var keyGenerator = new RsaKeyPairGenerator();

        //RSA密钥构造器的参数
        RsaKeyGenerationParameters param = new RsaKeyGenerationParameters(
            Org.BouncyCastle.Math.BigInteger.ValueOf(3),
            new SecureRandom(),
            1024,   //密钥长度
            25);
        //用参数初始化密钥构造器
        keyGenerator.Init(param);
        //产生密钥对
        AsymmetricCipherKeyPair keyPair = keyGenerator.GenerateKeyPair();
        //获取公钥和密钥
        AsymmetricKeyParameter publicKey = keyPair.Public;
        AsymmetricKeyParameter privateKey = keyPair.Private;

        SubjectPublicKeyInfo subjectPublicKeyInfo = SubjectPublicKeyInfoFactory.CreateSubjectPublicKeyInfo(publicKey);
        PrivateKeyInfo privateKeyInfo = PrivateKeyInfoFactory.CreatePrivateKeyInfo(privateKey);

        Asn1Object asn1ObjectPublic = subjectPublicKeyInfo.ToAsn1Object();

        byte[] publicInfoByte = asn1ObjectPublic.GetEncoded("UTF-8");
        Asn1Object asn1ObjectPrivate = privateKeyInfo.ToAsn1Object();
        byte[] privateInfoByte = asn1ObjectPrivate.GetEncoded("UTF-8");

        var item = new RSAKEY()
        {
            PublicKey = Convert.ToBase64String(publicInfoByte),
            PrivateKey = Convert.ToBase64String(privateInfoByte)
        };
        return item;
    }

    private AsymmetricKeyParameter GetPublicKeyParameter(string s)
    {
        s = s.Replace("\r", "").Replace("\n", "").Replace(" ", "");
        byte[] publicInfoByte = Convert.FromBase64String(s);
        Asn1Object pubKeyObj = Asn1Object.FromByteArray(publicInfoByte);//这里也可以从流中读取，从本地导入
        AsymmetricKeyParameter pubKey = PublicKeyFactory.CreateKey(publicInfoByte);
        return pubKey;
    }

    private AsymmetricKeyParameter GetPrivateKeyParameter(string s)
    {
        s = s.Replace("\r", "").Replace("\n", "").Replace(" ", "");
        byte[] privateInfoByte = Convert.FromBase64String(s);
        // Asn1Object priKeyObj = Asn1Object.FromByteArray(privateInfoByte);//这里也可以从流中读取，从本地导入
        // PrivateKeyInfo privateKeyInfo = PrivateKeyInfoFactory.CreatePrivateKeyInfo(privateKey);
        AsymmetricKeyParameter priKey = PrivateKeyFactory.CreateKey(privateInfoByte);
        return priKey;
    }

    /// <summary>
    /// 私钥加密
    /// </summary>
    /// <param name="str"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public string EncryptByPrivateKey(string str, string key)
    {
        //非对称加密算法，加解密用
        IAsymmetricBlockCipher engine = new Pkcs1Encoding(new RsaEngine());

        //加密

        try
        {
            engine.Init(true, GetPrivateKeyParameter(key));
            var byteData = System.Text.Encoding.UTF8.GetBytes(str);
            var ResultData = engine.ProcessBlock(byteData, 0, byteData.Length);
            return Convert.ToBase64String(ResultData);
            //Console.WriteLine("密文（base64编码）:" + Convert.ToBase64String(testData) + Environment.NewLine);
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }

    /// <summary>
    /// 公钥解密
    /// </summary>
    /// <param name="s"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public string DecryptByPublicKey(string s, string key)
    {
        s = s.Replace("\r", "").Replace("\n", "").Replace(" ", "");
        //非对称加密算法，加解密用
        IAsymmetricBlockCipher engine = new Pkcs1Encoding(new RsaEngine());

        //解密

        try
        {
            engine.Init(false, GetPublicKeyParameter(key));
            var byteData = Convert.FromBase64String(s);
            var ResultData = engine.ProcessBlock(byteData, 0, byteData.Length);
            return System.Text.Encoding.UTF8.GetString(ResultData);
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
}
```

参考资料：[https://www.cnblogs.com/runliuv/p/17531440.html](https://www.cnblogs.com/runliuv/p/17531440.html)

