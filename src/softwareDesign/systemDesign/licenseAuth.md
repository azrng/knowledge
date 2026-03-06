---
title: 软件License原理
lang: zh-CN
date: 2024-09-19
publish: true
author:  领航员
isOriginal: false
category:
  - soft
tag:
  - license
---

## 一、说明

在数字时代，软件已成为我们日常生活和工作中不可或缺的一部分。为了保护软件的知识产权，并确保其合法使用，软件授权机制应运而生。本文将深入探讨软件License授权的原理及其重要性。

## **二、软件License授权的原理**

1. ### **许可证密钥**：

我们做的商业软件需要进行售卖，为了收取费用，一般需要一个软件使用许可证，然后输入这个许可到软件里就能够使用软件（比如，一串序列码或者一个许可证文件）。于是有的小伙伴就开始好奇这个许可是怎么实现的。

### 实现许可证的关键点： 如何控制只在指定设备上使用

如果不控制指定设备，那么下发了许可证，只要把软件复制多份安装则可到处使用，不利于版权维护。但我们想想，有什么办法唯一标识一台电脑？答案就是：mac地址，ip地址，主板序列号等。在许可证中指定这些唯一标识即可实现指定设备使用。

### 实现许可证的关键点：如何控制软件使用期限

为了版权可持续性收益，对软件使用设置期限，到期续费等，则需要在许可证中配置使用起止日期。

1. #### **在线验证**：

   - 越来越多的软件采用在线验证机制，即软件在运行时会定期或不定期地连接到开发者的服务器进行验证。这时就可以验证软件的使用期限了。
   - 如果验证失败，软件可能会限制某些功能或完全停止工作。

2. #### **数字签名**：

   - 数字签名技术用于验证软件的完整性和来源。通过对软件进行哈希处理并使用开发者的私钥进行加密，可以生成一个数字签名。
   - 当用户安装或运行软件时，系统会使用开发者的公钥来验证签名。如果签名有效，则说明软件是原始的、未被篡改的。

## **三、软件License授权的重要性**

1. **知识产权保护**：软件License授权是保护知识产权的重要手段。通过限制非法复制和分发，它确保了软件开发者的创意和劳动成果得到应有的回报。

2. **维护市场秩序**：合法的软件授权有助于维护一个公平的市场环境，防止不正当竞争和侵权行为。

3. **用户权益保障**：正版软件通常提供更好的技术支持和更新服务，确保用户能够享受到高质量的产品体验。

4. **促进软件创新**：当软件开发者的权益得到充分保护时，他们更有动力投入研发，推出更多创新的产品和功能。

## 四.核心源码

**由于篇幅限制，下面只列出一些关键的C#源码信息，其它部分请开发者自行思考+补足。**

### 电脑信息获取

主要通过ManagementClass进行获取客户端电脑硬件相关配置信息，如下所示

```csharp

using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
 
namespace DemoLicence.Common
{
    public class ComputerHelper
    {
        public static Dictionary<string,string> GetComputerInfo()
        {
            var info = new Dictionary<string,string>();
            string cpu = GetCPUInfo();
            string baseBoard = GetBaseBoardInfo();
            string bios = GetBIOSInfo();
            string mac = GetMACInfo();
            info.Add("cpu", cpu);
            info.Add("baseBoard", baseBoard);
            info.Add("bios", bios);
            info.Add("mac", mac);
            return info;
        }
        private static string GetCPUInfo()
        {
            string info = string.Empty;
            info = GetHardWareInfo("Win32_Processor", "ProcessorId");
            return info;
        }
        private static string GetBIOSInfo()
        {
            string info = string.Empty;
            info = GetHardWareInfo("Win32_BIOS", "SerialNumber");
            return info;
        }
        private static string GetBaseBoardInfo()
        {
            string info = string.Empty;
            info = GetHardWareInfo("Win32_BaseBoard", "SerialNumber");
            return info;
        }
        private static string GetMACInfo()
        {
            string info = string.Empty;
            info = GetMacAddress();//GetHardWareInfo("Win32_NetworkAdapterConfiguration", "MACAddress");
            return info;
        }
 
        private static string GetMacAddress()
        {
            var mac = "";
            var mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
            var moc = mc.GetInstances();
            foreach (var o in moc)
            {
                var mo = (ManagementObject)o;
                if (!(bool)mo["IPEnabled"]) continue;
                mac = mo["MacAddress"].ToString();
                break;
            }
            return mac;
        }
 
        private static string GetHardWareInfo(string typePath, string key)
        {
            try
            {
                ManagementClass managementClass = new ManagementClass(typePath);
                ManagementObjectCollection mn = managementClass.GetInstances();
                PropertyDataCollection properties = managementClass.Properties;
                foreach (PropertyData property in properties)
                {
                    if (property.Name == key)
                    {
                        foreach (ManagementObject m in mn)
                        {
                            return m.Properties[property.Name].Value.ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //这里写异常的处理
            }
            return string.Empty;
        }
    }
}
```

### RSA非对称加密

主要对客户端提供的电脑信息及有效期等内容，进行非对称加密，如下所示：

```csharp

public class RSAHelper
{
 
  private static string keyContainerName = "star";
 
  private static string m_PriKey = string.Empty;
 
  private static string m_PubKey = string.Empty;
 
 
  public static string PriKey
  {
    get
    {
      return m_PriKey;
    }
 
    set
    {
      m_PriKey = value;
    }
  }
 
  public static string PubKey
  {
    get
    {
      return m_PubKey;
    }
 
    set
    {
      m_PubKey = value;
    }
  }
 
  public static string Encrypto(string source)
  {
    if (string.IsNullOrEmpty(m_PubKey) && string.IsNullOrEmpty(m_PriKey))
    {
      generateKey();
    }
    return getEncryptoInfoByRSA(source);
  }
 
  public static string Decrypto(string dest)
  {
    if (string.IsNullOrEmpty(m_PubKey) && string.IsNullOrEmpty(m_PriKey))
    {
      generateKey();
    }
    return getDecryptoInfoByRSA(dest);
  }
 
  public static void generateKey()
  {
    CspParameters m_CspParameters;
    m_CspParameters = new CspParameters();
    m_CspParameters.KeyContainerName = keyContainerName;
    RSACryptoServiceProvider asym = new RSACryptoServiceProvider(m_CspParameters);
    m_PriKey = asym.ToXmlString(true);
    m_PubKey = asym.ToXmlString(false);
    asym.PersistKeyInCsp = false;
    asym.Clear();
  }
 
  private static string getEncryptoInfoByRSA(string source)
  {
    byte[] plainByte = Encoding.ASCII.GetBytes(source);
    //初始化参数
    RSACryptoServiceProvider asym = new RSACryptoServiceProvider();
    asym.FromXmlString(m_PubKey);
    int keySize = asym.KeySize / 8;//非对称加密，每次的长度不能太长，否则会报异常
    int bufferSize = keySize - 11;
    if (plainByte.Length > bufferSize)
    {
      throw new Exception("非对称加密最多支持【" + bufferSize + "】字节，实际长度【" + plainByte.Length + "】字节。");
    }
    byte[] cryptoByte = asym.Encrypt(plainByte, false);
    return Convert.ToBase64String(cryptoByte);
  }
 
  private static string getDecryptoInfoByRSA(string dest)
  {
    byte[] btDest = Convert.FromBase64String(dest);
    //初始化参数
    RSACryptoServiceProvider asym = new RSACryptoServiceProvider();
    asym.FromXmlString(m_PriKey);
    int keySize = asym.KeySize / 8;//非对称加密，每次的长度不能太长，否则会报异常
                     //int bufferSize = keySize - 11;
    if (btDest.Length > keySize)
    {
      throw new Exception("非对称解密最多支持【" + keySize + "】字节，实际长度【" + btDest.Length + "】字节。");
    }
    byte[] cryptoByte = asym.Decrypt(btDest, false);
    return Encoding.ASCII.GetString(cryptoByte);
  }
}
```

## 五、结论

软件License授权不仅是保护知识产权的重要工具，也是维护市场秩序和促进软件行业健康发展的关键因素。随着技术的进步和法律的完善，我们有理由相信，未来的软件授权机制将更加智能、高效和安全，为用户和开发者带来更好的体验。

## 文章来源

https://mp.weixin.qq.com/s/W3IiIYfVizMP23rft90_qA：软件License授权原理
