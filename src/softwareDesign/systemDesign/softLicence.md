---
title: 软件Licence应用实例
lang: zh-CN
date: 2023-08-12
publish: true
author: 码农阿亮
isOriginal: false
category:
  - dotNet
tag:
  - licence
filename: softLicence
# 是否显示到列表
article: false
---

## 前言

我们在使用一些需要购买版权的软件产品时，或者我们做的商业软件需要进行售卖，为了收取费用，一般需要一个软件使用许可证，然后输入这个许可到软件里就能够使用软件。简单的是一串序列码或者一个许可证文件，复杂的是一个定制化插件包。于是有的小伙伴就开始好奇这个许可是怎么实现的，特别是在离线情况下它是怎么给软件授权，同时又能避免被破解的。

## 应用场景

本文主要介绍的是许可证形式的授权。

**1. 如何控制只在指定设备上使用**

如果不控制指定设备，那么下发了许可证，只要把软件复制多份安装则可到处使用，不利于版权维护，每个设备都有唯一标识：mac地址，ip地址，主板序列号等，在许可证中指定唯一标识则只能指定设备使用。

**2. 如何控制软件使用期限**

为了版权可持续性收益，对软件使用设置期限，到期续费等，则需要在许可证中配置使用起止日期。

## **Licence实现方案**

**一、流程设计**

- 形式：许可证以文件形式下发，放在客户端电脑指定位置
- 流程：将控制项加密后写入license文件节点，部署到客户机器，客户机使用时再读取license文件内容与客户机实际参数进行匹配校验

**二、文件防破解**

- 防止篡改：文件内容加密，使用AES加密，但是AES加密解密都是使用同一个key；使用非对称公私钥（本文使用的RSA）对内容加密解密，但是对内容长度有限制；综合方案，将AES的key（内部定义）用RSA加密，公钥放在加密工具中，内部持有，私钥放在解密工具中，引入软件产品解密使用。
- 防止修改系统时间绕过许可证使用时间：许可证带上发布时间戳，并定时修改运行时间记录到文件，如果系统时间小于这个时间戳，就算大于许可证限制的起始时间也无法使用
- 提高破解难度：懂技术的可以将代码反编译过来修改代码文件直接绕过校验，所以需要进行代码混淆，有测试过xjar的混淆效果比较好。

## **Licence验证流程图**

关于Licence验证软件合法性流程图，如下所示：

![图片](/common/06207edb0c90475ba2c0eaeec6246f68.png)

## **核心源码**

本实例主要讲解Licence的实际验证过程，分为三部分：

1. 测试客户端【LicenceTest】，主要用于模拟客户端验证Licence的过程。
2. 生成工具【LicenceTool】，主要用于根据客户生成的电脑文件，生成对应的Licence。
3. LicenceCommon，Licence公共通用类，主要实现电脑信息获取，非对称加密，文件保存等功能。

### **LicenceCommon**

#### **电脑信息获取**

主要通过ManagementClass进行获取客户端电脑硬件相关配置信息，如下所示：

```c#
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

#### **RSA非对称加密**

主要对客户端提供的电脑信息及有效期等内容，进行非对称加密，如下所示：

```c#
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

#### **生成文件**

主要是加密后的信息，和解密秘钥等内容，保存到文件中，如下所示：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 
namespace DemoLicence.Common
{
    public class RegistFileHelper
    {
        public static string ComputerInfofile = "ComputerInfo.key";
        public static string RegistInfofile = "Licence.key";
        public static void WriteRegistFile(string info,string keyFile)
        {
            string tmp = string.IsNullOrEmpty(keyFile)?RegistInfofile:keyFile;
            WriteFile(info, tmp);
        }
        public static void WriteComputerInfoFile(string info)
        {
            WriteFile(info, ComputerInfofile);
        }
        public static string ReadRegistFile(string keyFile)
        {
            string tmp = string.IsNullOrEmpty(keyFile) ? RegistInfofile : keyFile;
            return ReadFile(tmp);
        }
        public static string ReadComputerInfoFile(string file)
        {
            string tmp = string.IsNullOrEmpty(file) ? ComputerInfofile : file;
            return ReadFile(tmp);
        }
 
        private static void WriteFile(string info, string fileName)
        {
            try
            {
                using (StreamWriter sw = new StreamWriter(fileName, false))
                {
                    sw.Write(info);
                    sw.Close();
                }
            }
            catch (Exception ex)
            {
            }
        }
        private static string ReadFile(string fileName)
        {
            string info = string.Empty;
            try
            {
                using (StreamReader sr = new StreamReader(fileName))
                {
                    info = sr.ReadToEnd();
                    sr.Close();
                }
            }
            catch (Exception ex)
            {
            }
            return info;
        }
    }
}
```

以上这三部分，各个功能相互独立，通过LicenceHelper相互调用，如下所示：

```c#

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
 
namespace DemoLicence.Common
{
    public class LicenceHelper
    {
        /// <summary>
        /// 获取电脑信息，并生成文件
        /// </summary>
        public static string GetComputerInfoAndGenerateFile()
        {
            string computerKeyFile = string.Empty;
            try
            {
                var info = GetComputerInfo();
                if (info != null && info.Count > 0)
                {
                    //获取到电脑信息
                    var strInfo = new StringBuilder();
                    foreach (var computer in info)
                    {
                        strInfo.AppendLine($"{computer.Key}={computer.Value}");
                    }
                    RegistFileHelper.WriteComputerInfoFile(strInfo.ToString());
                    computerKeyFile = RegistFileHelper.ComputerInfofile;
                }
            }catch(Exception ex)
            {
                throw ex;
            }
            return computerKeyFile;
        }
 
        public static Dictionary<string,string> GetComputerInfo()
        {
            var info = ComputerHelper.GetComputerInfo();
            return info;
        }
 
        public static bool CheckLicenceKeyIsExists()
        {
            var keyFile = RegistFileHelper.RegistInfofile;
            if (File.Exists(keyFile))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
 
        public static string GetComputerInfo(string computerInfoFile)
        {
            return RegistFileHelper.ReadComputerInfoFile(computerInfoFile);
        }
 
        public static void GenerateLicenceKey(string info,string keyfile)
        {
            string encrypto = RSAHelper.Encrypto(info);
            string priKey = RSAHelper.PriKey;//公钥加密，私钥解密
            byte[] priKeyBytes = Encoding.ASCII.GetBytes(priKey);
            string priKeyBase64=Convert.ToBase64String(priKeyBytes);
            StringBuilder keyInfo= new StringBuilder();
            keyInfo.AppendLine($"prikey={priKeyBase64}");
            keyInfo.AppendLine($"encrypto={encrypto}");
            RegistFileHelper.WriteRegistFile(keyInfo.ToString(), keyfile);
        }
 
        public static string ReadLicenceKey(string keyfile)
        {
            var keyInfo = RegistFileHelper.ReadRegistFile(keyfile);
            if (keyInfo == null)
            {
                return string.Empty;
            }
            string[] keyInfoArr = keyInfo.Split("\r\n");
            var priKeyBase64 = keyInfoArr[0].Substring(keyInfoArr[0].IndexOf("=")+1);
            var encrypto = keyInfoArr[1].Substring(keyInfoArr[1].IndexOf("=")+1);
            var priKeyByte= Convert.FromBase64String(priKeyBase64);
            var priKey = Encoding.ASCII.GetString(priKeyByte);
            RSAHelper.PriKey= priKey;
            var info = RSAHelper.Decrypto(encrypto);
            return info;
        }
 
        public static string GetDefaultRegisterFileName()
        {
            return RegistFileHelper.RegistInfofile;
        }
 
        public static string GetDefaultComputerFileName()
        {
            return RegistFileHelper.ComputerInfofile;
        }
        
        public static string GetPublicKey()
        {
            if (string.IsNullOrEmpty(RSAHelper.PubKey))
            {
                RSAHelper.generateKey();
            }
            return RSAHelper.PubKey;
        }
 
        public static string GetPrivateKey()
        {
            if (string.IsNullOrEmpty(RSAHelper.PriKey))
            {
                RSAHelper.generateKey();
            }
            return RSAHelper.PriKey;
        }
    }
}
```

### **客户端LicenceTest**

客户端验证Licence的有效性，当Licence有效时，正常使用软件，当Licence无效时，则不能正常使用软件。如下所示：

```c#

using DemoLicence.Common;
 
namespace LicenceTest
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }
 
        private void MainForm_Load(object sender, EventArgs e)
        {
            try
            {
 
                string info = string.Empty;
                string msg = string.Empty;
                //初始化加载
                if (LicenceHelper.CheckLicenceKeyIsExists())
                {
                    string keyFile = LicenceHelper.GetDefaultRegisterFileName();
                    info = LicenceHelper.ReadLicenceKey(keyFile);
                }
                else
                {
                    var dialogResult = MessageBox.Show("没有找到默认首选文件，是否手动选择授权文件？", "询问", MessageBoxButtons.YesNo);
                    if (dialogResult == DialogResult.Yes)
                    {
                        OpenFileDialog openFileDialog = new OpenFileDialog();
                        openFileDialog.Title = "请选择授权文件";
                        openFileDialog.FileName = LicenceHelper.GetDefaultRegisterFileName();
                        if (openFileDialog.ShowDialog() == DialogResult.OK)
                        {
                            var keyFile = openFileDialog.FileName;
                            info = LicenceHelper.ReadLicenceKey(keyFile);
                            //验证成功后，将手动选择的文件复制到程序根目录,且修改为默认名称
                            File.Copy(keyFile, LicenceHelper.GetDefaultRegisterFileName());
 
                        }
                        else
                        {
                            string computerFile = LicenceHelper.GetComputerInfoAndGenerateFile();
                            if (!string.IsNullOrEmpty(computerFile))
                            {
                                msg = $"您还没有被授权，请将程序根目录下的{computerFile}文件，发送到管理员，获取Licence.";
                            }
                        }
                    }
                    else
                    {
                        string computerFile = LicenceHelper.GetComputerInfoAndGenerateFile();
                        if (!string.IsNullOrEmpty(computerFile))
                        {
                            msg = $"您还没有被授权，请将程序根目录下的{computerFile}文件，发送到管理员，获取Licence.";
                        }
                    }
                }
                if (!string.IsNullOrEmpty(info) && string.IsNullOrEmpty(msg))
                {
                    string[] infos = info.Split("\r\n");
                    if (infos.Length > 0)
                    {
                        var dicInfo = new Dictionary<string, string>();
                        foreach (var info2 in infos)
                        {
                            if (string.IsNullOrEmpty(info2))
                            {
                                continue;
                            }
                            var info2Arr = info2.Split("=");
                            dicInfo.Add(info2Arr[0], info2Arr[1]);
                        }
                        if (dicInfo.Count > 0)
                        {
                            string localMacAddress = string.Empty;
                            var computerInfo = LicenceHelper.GetComputerInfo();
                            if (computerInfo != null)
                            {
                                localMacAddress = computerInfo["mac"];
                            }
                            //比较本地信息和Licence中的信息是否一致
                            if (localMacAddress == dicInfo["mac"])
                            {
                                var endTime = DateTime.Parse(dicInfo["endTime"]);
                                if (DateTime.Now < endTime)
                                {
                                    //在有效期内，可以使用
                                }
                                else
                                {
                                    msg = $"软件授权使用时间范围：[{endTime}之前]，已过期";
                                }
                            }
                            else
                            {
                                msg = "软件Licence不匹配";
                            }
                        }
                        else
                        {
                            msg = $"软件Licence非法.";
                        }
                    }
                    else
                    {
                        msg = $"软件Licence非法.";
                    }
                }
                if (!string.IsNullOrEmpty(msg))
                {
                    MessageBox.Show(msg);
                    foreach (var control in this.Controls)
                    {
                        (control as Control).Enabled = false;
                    }
                    return;
                }
            }
            catch (Exception ex)
            {
                string error = $"程序异常，请联系管理人员：{ex.Message}\r\n{ex.StackTrace}";
                MessageBox.Show(error);
                foreach (var control in this.Controls)
                {
                    (control as Control).Enabled = false;
                }
            }
        }
    }
}
```

### **Licence生成工具**

LicenceTool主要根据客户端提供的电脑信息，生成对应的Licence，然后再发送给客户端，以此达到客户端电脑的授权使用软件的目的。如下所示：

```c#

using DemoLicence.Common;
using System.Text;
 
namespace LicenceTool
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }
 
 
        private void MainForm_Load(object sender, EventArgs e)
        {
            this.txtPublicKey.Text=LicenceHelper.GetPublicKey();
            this.txtPrivateKey.Text=LicenceHelper.GetPrivateKey();
        }
 
 
 
        private void btnBrowser_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Filter = "电脑信息文件|*.key";
            ofd.Multiselect = false;
            ofd.Title = "请选择电脑信息文件";
            ofd.FileName=LicenceHelper.GetDefaultComputerFileName();
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                this.txtSourceFile.Text = ofd.FileName;
            }
        }
 
        private void btnGenerate_Click(object sender, EventArgs e)
        {
 
            try
            {
                if (string.IsNullOrEmpty(this.txtSourceFile.Text))
                {
                    MessageBox.Show("请先选择电脑信息文件");
                    return;
                }
                if (File.Exists(this.txtSourceFile.Text))
                {
                    //读取电脑文件
                    var info = LicenceHelper.GetComputerInfo(this.txtSourceFile.Text);
                    int days = GetLicenceDays();
                    var keyInfos = new StringBuilder(info);
                    var beginTime = DateTime.Now;
                    var endTime = DateTime.Now.AddDays(days);
                    //keyInfos.AppendLine($"beginTime={beginTime.ToString("yyyy-MM-dd HH:mm:ss")}");
                    keyInfos.AppendLine($"endTime={endTime.ToString("yyyy-MM-dd HH:mm:ss")}");
                    //
                    info = keyInfos.ToString();
                    SaveFileDialog saveFileDialog = new SaveFileDialog();
                    saveFileDialog.Title = "保存生成的Licence文件";
                    saveFileDialog.FileName = LicenceHelper.GetDefaultRegisterFileName();
                    if (saveFileDialog.ShowDialog() == DialogResult.OK)
                    {
                        LicenceHelper.GenerateLicenceKey(info, saveFileDialog.FileName);
                        MessageBox.Show("生成成功");
                    }
                }
                else
                {
                    MessageBox.Show("电脑信息文件不存在！");
                    return;
                }
            }catch(Exception ex)
            {
                string error = $"生成出错：{ex.Message}\r\n{ex.StackTrace}";
                MessageBox.Show(error);
            }
        }
 
        /// <summary>
        /// 获取有效期天数
        /// </summary>
        /// <returns></returns>
        private int GetLicenceDays()
        {
            int days = 1;
            RadioButton[] rbtns = new RadioButton[] { this.rbtSeven, this.rbtnTen, this.rbtnFifteen, this.rbtnThirty, this.rbtnSixty, this.rbtnSixMonth, this.rbtnNinety, this.rbtnSixMonth, this.rbtnForver };
            foreach (RadioButton rb in rbtns)
            {
                if (rb.Checked)
                {
                    if (!int.TryParse(rb.Tag.ToString(), out days))
                    {
                        days = 0;
                    }
                    break;
                }
            }
            days = days == -1 ? 9999 : days;//永久要转换一下
            return days;
        }
    }
}
```

## **测试验证**

启动软件时会进行校验，在没有Licence时，会有信息提示，且无法使用软件。



Lincence生成工具

根据客户提供的电脑信息文件，生成对应的Licence。

:::tip

注意：非对称加密每次生成的秘钥都是不同的，所以需要将解密秘钥一起保存到生成的Licence文件中，否则秘钥不同，则无法解密。

:::

## 源码地址

https://gitee.com/ahsiang/demo-licence

## 资料

https://mp.weixin.qq.com/s/tHVq_x2RspiBUyN1_oBpUw | C# 软件Licence应用实例
