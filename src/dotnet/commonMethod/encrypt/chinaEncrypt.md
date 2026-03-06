---
title: 国密算法
lang: zh-CN
date: 2023-08-11
publish: true
author: runliuv
isOriginal: true
category:
  - dotNet
tag:
  - 国密
  - 加密
filename: chinaEncrypt
docsId: 'b9a656c6-f94f-46e5-b98f-dcc167ca35bf'
---

## 概述

国密算法包括SM1、SM2、SM3、SM4、SM7、SM9、祖冲之密码算法（ZUC) 等。

## SM2

### 方案一

根据字符串配置去嘉兴加解密，引用nuget包：BouncyCastle.Cryptography

```c#
/// <summary>
/// 生成 SM2 密钥对，密钥对使用 Base64 进行编码
/// </summary>
/// <param name="privateKey"></param>
/// <param name="publicKey"></param>
public static void GenerateSM2KeyPair(out string privateKey, out string publicKey)
{
    // 获取 SM2 曲线参数
    X9ECParameters curve = ECNamedCurveTable.GetByName("sm2p256v1");
    KeyGenerationParameters parameters = new ECKeyGenerationParameters(new ECDomainParameters(curve), new SecureRandom());

    // 创建 SM2 密钥对生成器
    ECKeyPairGenerator generator = new ECKeyPairGenerator();
    generator.Init(parameters);

    // 创建密钥对
    var keyPair = generator.GenerateKeyPair();

    // 私钥
    ECPrivateKeyParameters privateKeyParameters = (ECPrivateKeyParameters)keyPair.Private;
    privateKey = Base64.ToBase64String(privateKeyParameters.D.ToByteArrayUnsigned());

    // 公钥
    ECPublicKeyParameters publicKeyParameters = (ECPublicKeyParameters)keyPair.Public;
    publicKey = Base64.ToBase64String(publicKeyParameters.Q.GetEncoded());
}

/// <summary>
/// SM2 公钥加密
/// </summary>
/// <param name="message"></param>
/// <param name="key"></param>
/// <returns></returns>
public static string Encrypt(string message, string key)
{
    // 获取 SM2 曲线参数
    X9ECParameters curve = ECNamedCurveTable.GetByName("sm2p256v1");

    ECPoint q = curve.Curve.DecodePoint(Base64.Decode(key));
    ECDomainParameters domain = new ECDomainParameters(curve);
    ECPublicKeyParameters pubk = new ECPublicKeyParameters("EC", q, domain);

    // 创建SM2加密器
    SM2Engine sm2Engine = new SM2Engine();
    sm2Engine.Init(true, new ParametersWithRandom(pubk, new SecureRandom()));

    // 将原始数据转换为字节数组
    byte[] dataBytes = Encoding.UTF8.GetBytes(message);

    // 执行加密操作
    byte[] encryptedData = sm2Engine.ProcessBlock(dataBytes, 0, dataBytes.Length);

    // 将加密结果转换为 Base64 字符串
    return Base64.ToBase64String(encryptedData);
}

/// <summary>
/// SM2 私钥解密
/// </summary>
/// <param name="message"></param>
/// <param name="key"></param>
/// <returns></returns>
public static string Decrypt(string message, string key)
{
    // 获取 SM2 曲线参数
    X9ECParameters curve = ECNamedCurveTable.GetByName("sm2p256v1");

    ECDomainParameters domain = new ECDomainParameters(curve);
    BigInteger d = new BigInteger(1, Base64.Decode(key));
    ECPrivateKeyParameters prik = new ECPrivateKeyParameters(d, domain);

    // 创建SM2加密器
    SM2Engine sm2Engine = new SM2Engine();
    sm2Engine.Init(false, prik);

    byte[] encryptedData = Base64.Decode(message);

    // 执行解密操作
    byte[] decryptedData = sm2Engine.ProcessBlock(encryptedData, 0, encryptedData.Length);

    // 将解密结果转换为字符串
    return Encoding.UTF8.GetString(decryptedData);
}
```

使用示例

```c#
string privateKey = "Ja4UIUJz7XRNDhIiuWXwL78qd1Pc7SC0/Z9LzyF4SL8=";
string publicKey = "BGe1BZDFN+NhCQtc2qlVk8nUlXrIwcyjT3mMt7Xx3BkDNBGBQjFPV0+h3/cGUYXo2TFI1SShS7hWl9zi6SxUHvg=";

string raw = "jacky";
string e = Encrypt(raw, publicKey);
Console.WriteLine($"加密结果：{e}");

string d = Decrypt(e, privateKey);
Console.WriteLine($"解密结果：{d}");
```

资料：https://www.cnblogs.com/jackylovewendy/p/17449059.html

### 方案三

通过源文件方式处理

#### 加密解密

:::tip

原文地址：https://www.cnblogs.com/runliuv/p/17607568.html

:::

.NET 环境：.NET6 控制台程序(.net core)。

JAVA 环境：JAVA8，带maven 的JAVA控制台程序。

 

简要解析：
1.最好要到对方源码(DEMO+JAR包也可以)，可以用IDEA反编译（Ctrl+鼠标左键），看它过程逻辑和加密结果格式。

2.加密结果顺序：早期是 C1C2C3，后期是C1C3C2 ，双方得约定好。

3.加密结果：BASE64字符串或16进制字符串 ，双方得约定好。

\4. .NET BC库SM2加密结果会带04，如果JAVA 那边报 Invalid point encoding 错误，删除加密结果前的04。如果对方要的是BASE64的加密结果，我们可以先转16进制字符串，裁掉04，再转BASE64。
```c#
string newCipherText = Hex.ToHexString(bysm2keyEncrypted);
if (newCipherText.StartsWith("04"))
{
  newCipherText = newCipherText.Substring(2);
}
```

\5. .NET BC库解密，密文前要加 “04”，否则会报 Invalid point encoding XX 。如果加密结果是BASE64的，先把BASE64转16进制字符串，再判断是否04开头。
如果JAVA源码，固定截取的头2位，那么就不用判断是否04开头了，直接写死：javaSM2 = "04" + javaSM2;

 

生成一组国密公私钥：

私钥：FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0

公钥：049EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF

 本例是：C1C3C2。

//GmUtil.Sm2Encrypt 对应 C1C3C2
// GmUtil.Sm2EncryptOld ：C1C2C3

 

.NET 代码：

GmUtil 工具类，需要nuget下载 Portable.BouncyCastle 1.9.0 版本：

```c#
using Org.BouncyCastle.Asn1;
using Org.BouncyCastle.Asn1.GM;
using Org.BouncyCastle.Asn1.X9;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Utilities;
using Org.BouncyCastle.Utilities.Encoders;
using Org.BouncyCastle.X509;
using System;
using System.Collections.Generic;
using System.IO;

namespace CommonUtils
{
    /**
     * need lib:
     * BouncyCastle.Crypto.dll（http://www.bouncycastle.org/csharp/index.html） 
      
     * 用BC的注意点：
     * 这个版本的BC对SM3withSM2的结果为asn1格式的r和s，如果需要直接拼接的r||s需要自己转换。下面rsAsn1ToPlainByteArray、rsPlainByteArrayToAsn1就在干这事。
     * 这个版本的BC对SM2的结果为C1||C2||C3，据说为旧标准，新标准为C1||C3||C2，用新标准的需要自己转换。下面（被注释掉的）changeC1C2C3ToC1C3C2、changeC1C3C2ToC1C2C3就在干这事。java版的高版本有加上C1C3C2，csharp版没准以后也会加，但目前还没有，java版的目前可以初始化时“ SM2Engine sm2Engine = new SM2Engine(SM2Engine.Mode.C1C3C2);”。
     * 
     * 按要求国密算法仅允许使用加密机，本demo国密算法仅供学习使用，请不要用于生产用途。
     */
    public class GmUtil
    {

        //private static readonly ILog log = LogManager.GetLogger(typeof(GmUtil));

        private static X9ECParameters x9ECParameters = GMNamedCurves.GetByName("sm2p256v1");
        private static ECDomainParameters ecDomainParameters = new ECDomainParameters(x9ECParameters.Curve, x9ECParameters.G, x9ECParameters.N);

        /**
         *
         * @param msg
         * @param userId
         * @param privateKey
         * @return r||s，直接拼接byte数组的rs
         */
        public static byte[] SignSm3WithSm2(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            return RsAsn1ToPlainByteArray(SignSm3WithSm2Asn1Rs(msg, userId, privateKey));
        }

        /**
          * @param msg
          * @param userId
          * @param privateKey
          * @return rs in <b>asn1 format</b>
          */
        public static byte[] SignSm3WithSm2Asn1Rs(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(true, new ParametersWithID(privateKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                byte[] sig = signer.GenerateSignature();
                return sig;
            }
            catch (Exception e)
            {
                //log.Error("SignSm3WithSm2Asn1Rs error: " + e.Message, e);
                return null;
            }
        }

        /**
        *
        * @param msg
        * @param userId
        * @param rs r||s，直接拼接byte数组的rs
        * @param publicKey
        * @return
        */
        public static bool VerifySm3WithSm2(byte[] msg, byte[] userId, byte[] rs, AsymmetricKeyParameter publicKey)
        {
            if (rs == null || msg == null || userId == null) return false;
            if (rs.Length != RS_LEN * 2) return false;
            return VerifySm3WithSm2Asn1Rs(msg, userId, RsPlainByteArrayToAsn1(rs), publicKey);
        }

        /**
         *
         * @param msg
         * @param userId
         * @param rs in <b>asn1 format</b>
         * @param publicKey
         * @return
         */

        public static bool VerifySm3WithSm2Asn1Rs(byte[] msg, byte[] userId, byte[] sign, AsymmetricKeyParameter publicKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(false, new ParametersWithID(publicKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                return signer.VerifySignature(sign);
            }
            catch (Exception e)
            {
                //log.Error("VerifySm3WithSm2Asn1Rs error: " + e.Message, e);
                return false;
            }
        }

        /**
         * bc加解密使用旧标c1||c2||c3，此方法在加密后调用，将结果转化为c1||c3||c2
         * @param c1c2c3
         * @return
         */
        private static byte[] ChangeC1C2C3ToC1C3C2(byte[] c1c2c3)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().getDigestSize();
            byte[] result = new byte[c1c2c3.Length];
            Buffer.BlockCopy(c1c2c3, 0, result, 0, c1Len); //c1
            Buffer.BlockCopy(c1c2c3, c1c2c3.Length - c3Len, result, c1Len, c3Len); //c3
            Buffer.BlockCopy(c1c2c3, c1Len, result, c1Len + c3Len, c1c2c3.Length - c1Len - c3Len); //c2
            return result;
        }


        /**
         * bc加解密使用旧标c1||c3||c2，此方法在解密前调用，将密文转化为c1||c2||c3再去解密
         * @param c1c3c2
         * @return
         */
        private static byte[] ChangeC1C3C2ToC1C2C3(byte[] c1c3c2)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().GetDigestSize();
            byte[] result = new byte[c1c3c2.Length];
            Buffer.BlockCopy(c1c3c2, 0, result, 0, c1Len); //c1: 0->65
            Buffer.BlockCopy(c1c3c2, c1Len + c3Len, result, c1Len, c1c3c2.Length - c1Len - c3Len); //c2
            Buffer.BlockCopy(c1c3c2, c1Len, result, c1c3c2.Length - c3Len, c3Len); //c3
            return result;
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2Decrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return Sm2DecryptOld(ChangeC1C3C2ToC1C2C3(data), key);
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */

        public static byte[] Sm2Encrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return ChangeC1C2C3ToC1C3C2(Sm2EncryptOld(data, key));
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2EncryptOld(byte[] data, AsymmetricKeyParameter pubkey)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(true, new ParametersWithRandom(pubkey, new SecureRandom()));
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2EncryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2DecryptOld(byte[] data, AsymmetricKeyParameter key)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(false, key);
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2DecryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * @param bytes
         * @return
         */
        public static byte[] Sm3(byte[] bytes)
        {
            try
            {
                SM3Digest digest = new SM3Digest();
                digest.BlockUpdate(bytes, 0, bytes.Length);
                byte[] result = DigestUtilities.DoFinal(digest);
                return result;
            }
            catch (Exception e)
            {
                //log.Error("Sm3 error: " + e.Message, e);
                return null;
            }
        }

        private const int RS_LEN = 32;

        private static byte[] BigIntToFixexLengthBytes(BigInteger rOrS)
        {
            // for sm2p256v1, n is 00fffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123,
            // r and s are the result of mod n, so they should be less than n and have length<=32
            byte[] rs = rOrS.ToByteArray();
            if (rs.Length == RS_LEN) return rs;
            else if (rs.Length == RS_LEN + 1 && rs[0] == 0) return Arrays.CopyOfRange(rs, 1, RS_LEN + 1);
            else if (rs.Length < RS_LEN)
            {
                byte[] result = new byte[RS_LEN];
                Arrays.Fill(result, (byte)0);
                Buffer.BlockCopy(rs, 0, result, RS_LEN - rs.Length, rs.Length);
                return result;
            }
            else
            {
                throw new ArgumentException("err rs: " + Hex.ToHexString(rs));
            }
        }

        /**
         * BC的SM3withSM2签名得到的结果的rs是asn1格式的，这个方法转化成直接拼接r||s
         * @param rsDer rs in asn1 format
         * @return sign result in plain byte array
         */
        private static byte[] RsAsn1ToPlainByteArray(byte[] rsDer)
        {
            Asn1Sequence seq = Asn1Sequence.GetInstance(rsDer);
            byte[] r = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[0]).Value);
            byte[] s = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[1]).Value);
            byte[] result = new byte[RS_LEN * 2];
            Buffer.BlockCopy(r, 0, result, 0, r.Length);
            Buffer.BlockCopy(s, 0, result, RS_LEN, s.Length);
            return result;
        }

        /**
         * BC的SM3withSM2验签需要的rs是asn1格式的，这个方法将直接拼接r||s的字节数组转化成asn1格式
         * @param sign in plain byte array
         * @return rs result in asn1 format
         */
        private static byte[] RsPlainByteArrayToAsn1(byte[] sign)
        {
            if (sign.Length != RS_LEN * 2) throw new ArgumentException("err rs. ");
            BigInteger r = new BigInteger(1, Arrays.CopyOfRange(sign, 0, RS_LEN));
            BigInteger s = new BigInteger(1, Arrays.CopyOfRange(sign, RS_LEN, RS_LEN * 2));
            Asn1EncodableVector v = new Asn1EncodableVector();
            v.Add(new DerInteger(r));
            v.Add(new DerInteger(s));
            try
            {
                return new DerSequence(v).GetEncoded("DER");
            }
            catch (IOException e)
            {
                //log.Error("RsPlainByteArrayToAsn1 error: " + e.Message, e);
                return null;
            }
        }

        public static AsymmetricCipherKeyPair GenerateKeyPair()
        {
            try
            {
                ECKeyPairGenerator kpGen = new ECKeyPairGenerator();
                kpGen.Init(new ECKeyGenerationParameters(ecDomainParameters, new SecureRandom()));
                return kpGen.GenerateKeyPair();
            }
            catch (Exception e)
            {
                //log.Error("generateKeyPair error: " + e.Message, e);
                return null;
            }
        }

        public static ECPrivateKeyParameters GetPrivatekeyFromD(BigInteger d)
        {
            return new ECPrivateKeyParameters(d, ecDomainParameters);
        }

        public static ECPublicKeyParameters GetPublickeyFromXY(BigInteger x, BigInteger y)
        {
            return new ECPublicKeyParameters(x9ECParameters.Curve.CreatePoint(x, y), ecDomainParameters);
        }

        public static AsymmetricKeyParameter GetPublickeyFromX509File(FileInfo file)
        {

            FileStream fileStream = null;
            try
            {
                //file.DirectoryName + "\\" + file.Name
                fileStream = new FileStream(file.FullName, FileMode.Open, FileAccess.Read);
                X509Certificate certificate = new X509CertificateParser().ReadCertificate(fileStream);
                return certificate.GetPublicKey();
            }
            catch (Exception e)
            {
                //log.Error(file.Name + "读取失败，异常：" + e);
            }
            finally
            {
                if (fileStream != null)
                    fileStream.Close();
            }
            return null;
        }

        public class Sm2Cert
        {
            public AsymmetricKeyParameter privateKey;
            public AsymmetricKeyParameter publicKey;
            public String certId;
        }

        private static byte[] ToByteArray(int i)
        {
            byte[] byteArray = new byte[4];
            byteArray[0] = (byte)(i >> 24);
            byteArray[1] = (byte)((i & 0xFFFFFF) >> 16);
            byteArray[2] = (byte)((i & 0xFFFF) >> 8);
            byteArray[3] = (byte)(i & 0xFF);
            return byteArray;
        }

        /**
         * 字节数组拼接
         *
         * @param params
         * @return
         */
        private static byte[] Join(params byte[][] byteArrays)
        {
            List<byte> byteSource = new List<byte>();
            for (int i = 0; i < byteArrays.Length; i++)
            {
                byteSource.AddRange(byteArrays[i]);
            }
            byte[] data = byteSource.ToArray();
            return data;
        }

        /**
         * 密钥派生函数
         *
         * @param Z
         * @param klen
         *            生成klen字节数长度的密钥
         * @return
         */
        private static byte[] KDF(byte[] Z, int klen)
        {
            int ct = 1;
            int end = (int)Math.Ceiling(klen * 1.0 / 32);
            List<byte> byteSource = new List<byte>();
            try
            {
                for (int i = 1; i < end; i++)
                {
                    byteSource.AddRange(GmUtil.Sm3(Join(Z, ToByteArray(ct))));
                    ct++;
                }
                byte[] last = GmUtil.Sm3(Join(Z, ToByteArray(ct)));
                if (klen % 32 == 0)
                {
                    byteSource.AddRange(last);
                }
                else
                    byteSource.AddRange(Arrays.CopyOfRange(last, 0, klen % 32));
                return byteSource.ToArray();
            }
            catch (Exception e)
            {
                //log.Error("KDF error: " + e.Message, e);
            }
            return null;
        }

        public static byte[] Sm4DecryptCBC(byte[] keyBytes, byte[] cipher, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(false, new ParametersWithIV(key, iv));
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptCBC(byte[] keyBytes, byte[] plain, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(true, new ParametersWithIV(key, iv));
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptECB(byte[] keyBytes, byte[] plain, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            //NoPadding 的情况下需要校验数据长度是16的倍数.
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(true, key);
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptECB error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] Sm4DecryptECB(byte[] keyBytes, byte[] cipher, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(false, key);
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptECB error: " + e.Message, e);
                return null;
            }
        }

        public const String SM4_ECB_NOPADDING = "SM4/ECB/NoPadding";
        public const String SM4_CBC_NOPADDING = "SM4/CBC/NoPadding";
        public const String SM4_CBC_PKCS7PADDING = "SM4/CBC/PKCS7Padding";

        /**
         * cfca官网CSP沙箱导出的sm2文件
         * @param pem 二进制原文
         * @param pwd 密码
         * @return
         */
        public static Sm2Cert readSm2File(byte[] pem, String pwd)
        {

            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {
                Asn1Sequence asn1Sequence = (Asn1Sequence)Asn1Object.FromByteArray(pem);
                //            ASN1Integer asn1Integer = (ASN1Integer) asn1Sequence.getObjectAt(0); //version=1
                Asn1Sequence priSeq = (Asn1Sequence)asn1Sequence[1];//private key
                Asn1Sequence pubSeq = (Asn1Sequence)asn1Sequence[2];//public key and x509 cert

                //            ASN1ObjectIdentifier sm2DataOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(0);
                //            ASN1ObjectIdentifier sm4AlgOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(1);
                Asn1OctetString priKeyAsn1 = (Asn1OctetString)priSeq[2];
                byte[] key = KDF(System.Text.Encoding.UTF8.GetBytes(pwd), 32);
                byte[] priKeyD = Sm4DecryptCBC(Arrays.CopyOfRange(key, 16, 32),
                        priKeyAsn1.GetOctets(),
                        Arrays.CopyOfRange(key, 0, 16), SM4_CBC_PKCS7PADDING);
                sm2Cert.privateKey = GetPrivatekeyFromD(new BigInteger(1, priKeyD));
                //            log.Info(Hex.toHexString(priKeyD));

                //            ASN1ObjectIdentifier sm2DataOidPub = (ASN1ObjectIdentifier) pubSeq.getObjectAt(0);
                Asn1OctetString pubKeyX509 = (Asn1OctetString)pubSeq[1];
                X509Certificate x509 = (X509Certificate)new X509CertificateParser().ReadCertificate(pubKeyX509.GetOctets());
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("readSm2File error: " + e.Message, e);
                return null;
            }
        }

        /**
         *
         * @param cert
         * @return
         */
        public static Sm2Cert ReadSm2X509Cert(byte[] cert)
        {
            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {

                X509Certificate x509 = new X509CertificateParser().ReadCertificate(cert);
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("ReadSm2X509Cert error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] ZeroIv(String algo)
        {

            try
            {
                IBufferedCipher cipher = CipherUtilities.GetCipher(algo);
                int blockSize = cipher.GetBlockSize();
                byte[] iv = new byte[blockSize];
                Arrays.Fill(iv, (byte)0);
                return iv;
            }
            catch (Exception e)
            {
                //log.Error("ZeroIv error: " + e.Message, e);
                return null;
            }
        }

        public static void Main2(string[] s)
        {

            // 随便看看
            //log.Info("GMNamedCurves: ");
            foreach (string e in GMNamedCurves.Names)
            {
                //log.Info(e);
            }
            //log.Info("sm2p256v1 n:" + x9ECParameters.N);
            //log.Info("sm2p256v1 nHex:" + Hex.ToHexString(x9ECParameters.N.ToByteArray()));

            // 生成公私钥对 ---------------------
            AsymmetricCipherKeyPair kp = GmUtil.GenerateKeyPair();
            //log.Info("private key d: " + ((ECPrivateKeyParameters)kp.Private).D);
            //log.Info("public key q:" + ((ECPublicKeyParameters)kp.Public).Q); //{x, y, zs...}

            //签名验签
            byte[] msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            byte[] userId = System.Text.Encoding.UTF8.GetBytes("userId");
            byte[] sig = SignSm3WithSm2(msg, userId, kp.Private);
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, kp.Public));

            // 由d生成私钥 ---------------------
            BigInteger d = new BigInteger("097b5230ef27c7df0fa768289d13ad4e8a96266f0fcb8de40d5942af4293a54a", 16);
            ECPrivateKeyParameters bcecPrivateKey = GetPrivatekeyFromD(d);
            //log.Info("testGetFromD: " + bcecPrivateKey.D.ToString(16));

            //公钥X坐标PublicKeyXHex: 59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4
            //公钥Y坐标PublicKeyYHex: 9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8
            AsymmetricKeyParameter publicKey = GetPublickeyFromX509File(new FileInfo("d:/certs/69629141652.cer"));
            //log.Info(publicKey);
            AsymmetricKeyParameter publicKey1 = GetPublickeyFromXY(new BigInteger("59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4", 16), new BigInteger("9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8", 16));
            //log.Info("testReadFromX509File: " + ((ECPublicKeyParameters)publicKey).Q);
            //log.Info("testGetFromXY: " + ((ECPublicKeyParameters)publicKey1).Q);
            //log.Info("testPubKey: " + publicKey.Equals(publicKey1));
            //log.Info("testPubKey: " + ((ECPublicKeyParameters)publicKey).Q.Equals(((ECPublicKeyParameters)publicKey1).Q));

            // sm2 encrypt and decrypt test ---------------------
            AsymmetricCipherKeyPair kp2 = GenerateKeyPair();
            AsymmetricKeyParameter publicKey2 = kp2.Public;
            AsymmetricKeyParameter privateKey2 = kp2.Private;
            byte[] bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), publicKey2);
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, privateKey2);
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            // sm4 encrypt and decrypt test ---------------------
            //0123456789abcdeffedcba9876543210 + 0123456789abcdeffedcba9876543210 -> 681edf34d206965e86b3e94f536e4246
            byte[] plain = Hex.Decode("0123456789abcdeffedcba98765432100123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210");
            byte[] key = Hex.Decode("0123456789abcdeffedcba9876543210");
            byte[] cipher = Hex.Decode("595298c7c6fd271f0402f804c33d3f66");
            bs = Sm4EncryptECB(key, plain, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4EncEcb: " + Hex.ToHexString(bs)); ;
            bs = Sm4DecryptECB(key, bs, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4DecEcb: " + Hex.ToHexString(bs));

            //读.sm2文件
            String sm2 = "MIIDHQIBATBHBgoqgRzPVQYBBAIBBgcqgRzPVQFoBDDW5/I9kZhObxXE9Vh1CzHdZhIhxn+3byBU\nUrzmGRKbDRMgI3hJKdvpqWkM5G4LNcIwggLNBgoqgRzPVQYBBAIBBIICvTCCArkwggJdoAMCAQIC\nBRA2QSlgMAwGCCqBHM9VAYN1BQAwXDELMAkGA1UEBhMCQ04xMDAuBgNVBAoMJ0NoaW5hIEZpbmFu\nY2lhbCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEbMBkGA1UEAwwSQ0ZDQSBURVNUIFNNMiBPQ0Ex\nMB4XDTE4MTEyNjEwMTQxNVoXDTIwMTEyNjEwMTQxNVowcjELMAkGA1UEBhMCY24xEjAQBgNVBAoM\nCUNGQ0EgT0NBMTEOMAwGA1UECwwFQ1VQUkExFDASBgNVBAsMC0VudGVycHJpc2VzMSkwJwYDVQQD\nDCAwNDFAWnRlc3RAMDAwMTAwMDA6U0lHTkAwMDAwMDAwMTBZMBMGByqGSM49AgEGCCqBHM9VAYIt\nA0IABDRNKhvnjaMUShsM4MJ330WhyOwpZEHoAGfqxFGX+rcL9x069dyrmiF3+2ezwSNh1/6YqfFZ\nX9koM9zE5RG4USmjgfMwgfAwHwYDVR0jBBgwFoAUa/4Y2o9COqa4bbMuiIM6NKLBMOEwSAYDVR0g\nBEEwPzA9BghggRyG7yoBATAxMC8GCCsGAQUFBwIBFiNodHRwOi8vd3d3LmNmY2EuY29tLmNuL3Vz\nL3VzLTE0Lmh0bTA4BgNVHR8EMTAvMC2gK6AphidodHRwOi8vdWNybC5jZmNhLmNvbS5jbi9TTTIv\nY3JsNDI4NS5jcmwwCwYDVR0PBAQDAgPoMB0GA1UdDgQWBBREhx9VlDdMIdIbhAxKnGhPx8FcHDAd\nBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwDAYIKoEcz1UBg3UFAANIADBFAiEAgWvQi3h6\niW4jgF4huuXfhWInJmTTYr2EIAdG8V4M8fYCIBixygdmfPL9szcK2pzCYmIb6CBzo5SMv50Odycc\nVfY6";
            bs = Convert.FromBase64String(sm2);
            String pwd = "cfca1234";
            GmUtil.Sm2Cert sm2Cert = GmUtil.readSm2File(bs, pwd);
            //log.Info("testReadSm2File, pubkey: " + ((ECPublicKeyParameters)sm2Cert.publicKey).Q.ToString());
            //log.Info("testReadSm2File, prikey: " + Hex.ToHexString(((ECPrivateKeyParameters)sm2Cert.privateKey).D.ToByteArray()));
            //log.Info("testReadSm2File, certId: " + sm2Cert.certId);

            bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), ((ECPublicKeyParameters)sm2Cert.publicKey));
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            userId = System.Text.Encoding.UTF8.GetBytes("userId");
            sig = SignSm3WithSm2(msg, userId, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, ((ECPublicKeyParameters)sm2Cert.publicKey)));
        }

    }
}
```

.Net使用

```c#
using CommonUtils;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Utilities.Encoders;
using System.Text;


void TestSM2Enc()
{
    String privateKeyHex = "FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0";
    //完整公钥128位“9EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF”
    //完整公钥130位，比128位开头多了04“049EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF”
    string pubKeyHex = "049EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF";
    //如果是130位公钥，.NET 使用的话，把开头的04截取掉。
    if (pubKeyHex.Length == 130)
    {
        pubKeyHex = pubKeyHex.Substring(2, 128);
    }
    //公钥X，前64位
    String x = pubKeyHex.Substring(0, 64);
    //公钥Y，后64位
    String y = pubKeyHex.Substring(64);
    //获取公钥对象
    AsymmetricKeyParameter publicKey1 = GmUtil.GetPublickeyFromXY(new BigInteger(x, 16), new BigInteger(y, 16));
    String content = "1234泰酷拉NET";
    Console.WriteLine("待处理字符串：" + content);
    //Sm2Encrypt 对应  C1C3C2
    // Sm2EncryptOld ：C1C2C3
    byte[] digestByte = GmUtil.Sm2Encrypt(Encoding.UTF8.GetBytes(content), publicKey1);
    string strSM2 = Hex.ToHexString(digestByte);
    Console.WriteLine("SM2加密后：" + strSM2);
    // 4. .NET BC库SM2加密结果会带04，如果JAVA 那边报 Invalid point encoding 错误，删除加密结果前的04。如果对方要的是BASE64的加密结果，我们可以先转16进制字符串，裁掉04，再转BASE64。
    string newCipherText = Hex.ToHexString(digestByte);
    if (newCipherText.StartsWith("04"))
    {
        newCipherText = newCipherText.Substring(2);
    }
    Console.WriteLine("截取04后，加密结果：" + newCipherText);

    //.NET 自加自解
    BigInteger d = new BigInteger(privateKeyHex, 16);
    //先拿到私钥对象，用ECPrivateKeyParameters 或 AsymmetricKeyParameter 都可以
    //ECPrivateKeyParameters bcecPrivateKey = CommonUtils.GmUtil.GetPrivatekeyFromD(d);
    AsymmetricKeyParameter bcecPrivateKey = CommonUtils.GmUtil.GetPrivatekeyFromD(d);
    byte[] byToDecrypt = Hex.Decode(strSM2);
    byte[] byDecrypted = GmUtil.Sm2Decrypt(byToDecrypt, bcecPrivateKey);
    String strDecrypted = Encoding.UTF8.GetString(byDecrypted);
    Console.WriteLine("SM2解密后：" + strDecrypted);

    //JAVA 结果，.NET来解
    string javaSM2 = "04a7aaa9fd91aea6f99787ef431e19cb9feecc5bfb97fb445ce529c78c04676f1792e06b3a2814d1bda80bd3f63e530c149fc03911f1b81007dc86cef2c03f30c7fecc8b256272f881a8f2f4e71351c45d5bb27e8531f1e2ea6d55150c88f5026b8783ccef867a510a313178cfd26177";
    //.NET BC库解密，密文前要加 “04”，否则会报 Invalid point encoding XX
    //如果加密结果是BASE64的，把BASE64转16进制字符串，再判断是否04开头。 
    //如果对方源码，固定截取的头2位，那么就不用判断是否04开头了，直接写死：javaSM2 = "04" + javaSM2;
    if (!javaSM2.StartsWith("04"))
    {
        javaSM2 = "04" + javaSM2;
    }
    Console.WriteLine("javaSM2加密结果：" + javaSM2);
    byToDecrypt = Hex.Decode(javaSM2);
    byDecrypted = GmUtil.Sm2Decrypt(byToDecrypt, bcecPrivateKey);
    strDecrypted = Encoding.UTF8.GetString(byDecrypted);
    Console.WriteLine("java SM2解密后：" + strDecrypted);
}
```



java代码：

maven 引用 ：

```xml
<dependency>
      <groupId>cn.hutool</groupId>
      <artifactId>hutool-all</artifactId>
      <version>5.8.1</version>
    </dependency>

    <dependency>
      <groupId>org.bouncycastle</groupId>
      <artifactId>bcprov-jdk15on</artifactId>
      <version>1.70</version>
    </dependency>
```

java调用

```java
package org.example;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.SM2;
import org.bouncycastle.crypto.engines.SM2Engine;
import org.bouncycastle.util.encoders.Hex;

 static void testSM2Enc() {
        //sm2 加密模式:C1C3C2
        //私钥
        String privateKeyHex = "FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0";
        //完整公钥“9EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF”
        //公钥X
        String x = "9EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3";
        //公钥Y
        String y = "CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF";

        
        String content = "1234泰酷拉JJ";
        System.out.println("待处理字符串：" + content);

        SM2 sm2 = new SM2(privateKeyHex, x, y);
        //默认是:C1C3C2
        sm2.setMode(SM2Engine.Mode.C1C3C2);
        //公钥加密
        byte[] byRst = sm2.encrypt(content.getBytes(), KeyType.PublicKey);

        String strRst = Hex.toHexString(byRst);
        System.out.println("加密后：" + strRst);

        byte[] byToDecrypt = Hex.decode(strRst);
        byte[] byDecrypted = sm2.decrypt(byToDecrypt, KeyType.PrivateKey);
        String strDecrypted = new String(byDecrypted);

        System.out.println("解密后：" + strDecrypted);
    }
```

#### 签名验签

.NET 环境：.NET6 控制台程序(.net core)。

JAVA 环境：JAVA8（JDK8,JAVA 1.8），带maven 的JAVA控制台程序。

 


1.最好要到对方源码(DEMO+JAR包也可以)，可以用IDEA反编译（Ctrl+鼠标左键），看它过程逻辑和结果格式。

2.常说的SM2签名，指的就是“SM3withSM2”。类似于：SHA256withRSA，SHA1withRSA。

3.签名结果：有2种格式：r||s 和 asn1 ，双方得约定好。
SignSm3WithSm2 是RS，SignSm3WithSm2Asn1Rs 是 asn1，一种不行就换另一种调试。

4.签名结果传输，可以转BASE64字符串或16进制字符串，双方得约定好。

5.如果未指明 userId： 那默认值就是：1234567812345678。
string userId = "1234567812345678";

6.有的文档说是进行 sm3 hash 后进行 sm2 签名，我们以为是：

```
var rstA=sm3hash(dataString);
var rstB= SignSm3WithSm2(rstA);
```

但实际只有一步：
var rstB= SignSm3WithSm2(dataString);
文档描述和代码逻辑有出入的地方很多，所以得找对方要代码DEMO，Show me the code !

7.有的签名代码和BC库是不兼容的，得少量手动实现：https://www.cnblogs.com/runliuv/p/16486898.html。

注意：JAVA的 HUTOOL - sm2.sign 结果格式是 Asn1 的，我们得用 VerifySm3WithSm2Asn1Rs。

 

生成一组国密公私钥：

私钥：FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0

公钥：049EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF

.NET 代码：

GmUtil 工具类，需要nuget下载 Portable.BouncyCastle 1.9.0 版本：

```c#
using Org.BouncyCastle.Asn1;
using Org.BouncyCastle.Asn1.GM;
using Org.BouncyCastle.Asn1.X9;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Utilities;
using Org.BouncyCastle.Utilities.Encoders;
using Org.BouncyCastle.X509;
using System;
using System.Collections.Generic;
using System.IO;

namespace CommonUtils
{
    /**
     * need lib:
     * BouncyCastle.Crypto.dll（http://www.bouncycastle.org/csharp/index.html） 
      
     * 用BC的注意点：
     * 这个版本的BC对SM3withSM2的结果为asn1格式的r和s，如果需要直接拼接的r||s需要自己转换。下面rsAsn1ToPlainByteArray、rsPlainByteArrayToAsn1就在干这事。
     * 这个版本的BC对SM2的结果为C1||C2||C3，据说为旧标准，新标准为C1||C3||C2，用新标准的需要自己转换。下面（被注释掉的）changeC1C2C3ToC1C3C2、changeC1C3C2ToC1C2C3就在干这事。java版的高版本有加上C1C3C2，csharp版没准以后也会加，但目前还没有，java版的目前可以初始化时“ SM2Engine sm2Engine = new SM2Engine(SM2Engine.Mode.C1C3C2);”。
     * 
     * 按要求国密算法仅允许使用加密机，本demo国密算法仅供学习使用，请不要用于生产用途。
     */
    public class GmUtil
    {

        //private static readonly ILog log = LogManager.GetLogger(typeof(GmUtil));

        private static X9ECParameters x9ECParameters = GMNamedCurves.GetByName("sm2p256v1");
        private static ECDomainParameters ecDomainParameters = new ECDomainParameters(x9ECParameters.Curve, x9ECParameters.G, x9ECParameters.N);

        /**
         *
         * @param msg
         * @param userId
         * @param privateKey
         * @return r||s，直接拼接byte数组的rs
         */
        public static byte[] SignSm3WithSm2(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            return RsAsn1ToPlainByteArray(SignSm3WithSm2Asn1Rs(msg, userId, privateKey));
        }

        /**
          * @param msg
          * @param userId
          * @param privateKey
          * @return rs in <b>asn1 format</b>
          */
        public static byte[] SignSm3WithSm2Asn1Rs(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(true, new ParametersWithID(privateKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                byte[] sig = signer.GenerateSignature();
                return sig;
            }
            catch (Exception e)
            {
                //log.Error("SignSm3WithSm2Asn1Rs error: " + e.Message, e);
                return null;
            }
        }

        /**
        *
        * @param msg
        * @param userId
        * @param rs r||s，直接拼接byte数组的rs
        * @param publicKey
        * @return
        */
        public static bool VerifySm3WithSm2(byte[] msg, byte[] userId, byte[] rs, AsymmetricKeyParameter publicKey)
        {
            if (rs == null || msg == null || userId == null) return false;
            if (rs.Length != RS_LEN * 2) return false;
            return VerifySm3WithSm2Asn1Rs(msg, userId, RsPlainByteArrayToAsn1(rs), publicKey);
        }

        /**
         *
         * @param msg
         * @param userId
         * @param rs in <b>asn1 format</b>
         * @param publicKey
         * @return
         */

        public static bool VerifySm3WithSm2Asn1Rs(byte[] msg, byte[] userId, byte[] sign, AsymmetricKeyParameter publicKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(false, new ParametersWithID(publicKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                return signer.VerifySignature(sign);
            }
            catch (Exception e)
            {
                //log.Error("VerifySm3WithSm2Asn1Rs error: " + e.Message, e);
                return false;
            }
        }

        /**
         * bc加解密使用旧标c1||c2||c3，此方法在加密后调用，将结果转化为c1||c3||c2
         * @param c1c2c3
         * @return
         */
        private static byte[] ChangeC1C2C3ToC1C3C2(byte[] c1c2c3)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().getDigestSize();
            byte[] result = new byte[c1c2c3.Length];
            Buffer.BlockCopy(c1c2c3, 0, result, 0, c1Len); //c1
            Buffer.BlockCopy(c1c2c3, c1c2c3.Length - c3Len, result, c1Len, c3Len); //c3
            Buffer.BlockCopy(c1c2c3, c1Len, result, c1Len + c3Len, c1c2c3.Length - c1Len - c3Len); //c2
            return result;
        }


        /**
         * bc加解密使用旧标c1||c3||c2，此方法在解密前调用，将密文转化为c1||c2||c3再去解密
         * @param c1c3c2
         * @return
         */
        private static byte[] ChangeC1C3C2ToC1C2C3(byte[] c1c3c2)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().GetDigestSize();
            byte[] result = new byte[c1c3c2.Length];
            Buffer.BlockCopy(c1c3c2, 0, result, 0, c1Len); //c1: 0->65
            Buffer.BlockCopy(c1c3c2, c1Len + c3Len, result, c1Len, c1c3c2.Length - c1Len - c3Len); //c2
            Buffer.BlockCopy(c1c3c2, c1Len, result, c1c3c2.Length - c3Len, c3Len); //c3
            return result;
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2Decrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return Sm2DecryptOld(ChangeC1C3C2ToC1C2C3(data), key);
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */

        public static byte[] Sm2Encrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return ChangeC1C2C3ToC1C3C2(Sm2EncryptOld(data, key));
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2EncryptOld(byte[] data, AsymmetricKeyParameter pubkey)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(true, new ParametersWithRandom(pubkey, new SecureRandom()));
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2EncryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2DecryptOld(byte[] data, AsymmetricKeyParameter key)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(false, key);
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2DecryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * @param bytes
         * @return
         */
        public static byte[] Sm3(byte[] bytes)
        {
            try
            {
                SM3Digest digest = new SM3Digest();
                digest.BlockUpdate(bytes, 0, bytes.Length);
                byte[] result = DigestUtilities.DoFinal(digest);
                return result;
            }
            catch (Exception e)
            {
                //log.Error("Sm3 error: " + e.Message, e);
                return null;
            }
        }

        private const int RS_LEN = 32;

        private static byte[] BigIntToFixexLengthBytes(BigInteger rOrS)
        {
            // for sm2p256v1, n is 00fffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123,
            // r and s are the result of mod n, so they should be less than n and have length<=32
            byte[] rs = rOrS.ToByteArray();
            if (rs.Length == RS_LEN) return rs;
            else if (rs.Length == RS_LEN + 1 && rs[0] == 0) return Arrays.CopyOfRange(rs, 1, RS_LEN + 1);
            else if (rs.Length < RS_LEN)
            {
                byte[] result = new byte[RS_LEN];
                Arrays.Fill(result, (byte)0);
                Buffer.BlockCopy(rs, 0, result, RS_LEN - rs.Length, rs.Length);
                return result;
            }
            else
            {
                throw new ArgumentException("err rs: " + Hex.ToHexString(rs));
            }
        }

        /**
         * BC的SM3withSM2签名得到的结果的rs是asn1格式的，这个方法转化成直接拼接r||s
         * @param rsDer rs in asn1 format
         * @return sign result in plain byte array
         */
        private static byte[] RsAsn1ToPlainByteArray(byte[] rsDer)
        {
            Asn1Sequence seq = Asn1Sequence.GetInstance(rsDer);
            byte[] r = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[0]).Value);
            byte[] s = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[1]).Value);
            byte[] result = new byte[RS_LEN * 2];
            Buffer.BlockCopy(r, 0, result, 0, r.Length);
            Buffer.BlockCopy(s, 0, result, RS_LEN, s.Length);
            return result;
        }

        /**
         * BC的SM3withSM2验签需要的rs是asn1格式的，这个方法将直接拼接r||s的字节数组转化成asn1格式
         * @param sign in plain byte array
         * @return rs result in asn1 format
         */
        private static byte[] RsPlainByteArrayToAsn1(byte[] sign)
        {
            if (sign.Length != RS_LEN * 2) throw new ArgumentException("err rs. ");
            BigInteger r = new BigInteger(1, Arrays.CopyOfRange(sign, 0, RS_LEN));
            BigInteger s = new BigInteger(1, Arrays.CopyOfRange(sign, RS_LEN, RS_LEN * 2));
            Asn1EncodableVector v = new Asn1EncodableVector();
            v.Add(new DerInteger(r));
            v.Add(new DerInteger(s));
            try
            {
                return new DerSequence(v).GetEncoded("DER");
            }
            catch (IOException e)
            {
                //log.Error("RsPlainByteArrayToAsn1 error: " + e.Message, e);
                return null;
            }
        }

        public static AsymmetricCipherKeyPair GenerateKeyPair()
        {
            try
            {
                ECKeyPairGenerator kpGen = new ECKeyPairGenerator();
                kpGen.Init(new ECKeyGenerationParameters(ecDomainParameters, new SecureRandom()));
                return kpGen.GenerateKeyPair();
            }
            catch (Exception e)
            {
                //log.Error("generateKeyPair error: " + e.Message, e);
                return null;
            }
        }

        public static ECPrivateKeyParameters GetPrivatekeyFromD(BigInteger d)
        {
            return new ECPrivateKeyParameters(d, ecDomainParameters);
        }

        public static ECPublicKeyParameters GetPublickeyFromXY(BigInteger x, BigInteger y)
        {
            return new ECPublicKeyParameters(x9ECParameters.Curve.CreatePoint(x, y), ecDomainParameters);
        }

        public static AsymmetricKeyParameter GetPublickeyFromX509File(FileInfo file)
        {

            FileStream fileStream = null;
            try
            {
                //file.DirectoryName + "\\" + file.Name
                fileStream = new FileStream(file.FullName, FileMode.Open, FileAccess.Read);
                X509Certificate certificate = new X509CertificateParser().ReadCertificate(fileStream);
                return certificate.GetPublicKey();
            }
            catch (Exception e)
            {
                //log.Error(file.Name + "读取失败，异常：" + e);
            }
            finally
            {
                if (fileStream != null)
                    fileStream.Close();
            }
            return null;
        }

        public class Sm2Cert
        {
            public AsymmetricKeyParameter privateKey;
            public AsymmetricKeyParameter publicKey;
            public String certId;
        }

        private static byte[] ToByteArray(int i)
        {
            byte[] byteArray = new byte[4];
            byteArray[0] = (byte)(i >> 24);
            byteArray[1] = (byte)((i & 0xFFFFFF) >> 16);
            byteArray[2] = (byte)((i & 0xFFFF) >> 8);
            byteArray[3] = (byte)(i & 0xFF);
            return byteArray;
        }

        /**
         * 字节数组拼接
         *
         * @param params
         * @return
         */
        private static byte[] Join(params byte[][] byteArrays)
        {
            List<byte> byteSource = new List<byte>();
            for (int i = 0; i < byteArrays.Length; i++)
            {
                byteSource.AddRange(byteArrays[i]);
            }
            byte[] data = byteSource.ToArray();
            return data;
        }

        /**
         * 密钥派生函数
         *
         * @param Z
         * @param klen
         *            生成klen字节数长度的密钥
         * @return
         */
        private static byte[] KDF(byte[] Z, int klen)
        {
            int ct = 1;
            int end = (int)Math.Ceiling(klen * 1.0 / 32);
            List<byte> byteSource = new List<byte>();
            try
            {
                for (int i = 1; i < end; i++)
                {
                    byteSource.AddRange(GmUtil.Sm3(Join(Z, ToByteArray(ct))));
                    ct++;
                }
                byte[] last = GmUtil.Sm3(Join(Z, ToByteArray(ct)));
                if (klen % 32 == 0)
                {
                    byteSource.AddRange(last);
                }
                else
                    byteSource.AddRange(Arrays.CopyOfRange(last, 0, klen % 32));
                return byteSource.ToArray();
            }
            catch (Exception e)
            {
                //log.Error("KDF error: " + e.Message, e);
            }
            return null;
        }

        public static byte[] Sm4DecryptCBC(byte[] keyBytes, byte[] cipher, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(false, new ParametersWithIV(key, iv));
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptCBC(byte[] keyBytes, byte[] plain, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(true, new ParametersWithIV(key, iv));
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptECB(byte[] keyBytes, byte[] plain, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            //NoPadding 的情况下需要校验数据长度是16的倍数.
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(true, key);
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptECB error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] Sm4DecryptECB(byte[] keyBytes, byte[] cipher, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(false, key);
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptECB error: " + e.Message, e);
                return null;
            }
        }

        public const String SM4_ECB_NOPADDING = "SM4/ECB/NoPadding";
        public const String SM4_CBC_NOPADDING = "SM4/CBC/NoPadding";
        public const String SM4_CBC_PKCS7PADDING = "SM4/CBC/PKCS7Padding";

        /**
         * cfca官网CSP沙箱导出的sm2文件
         * @param pem 二进制原文
         * @param pwd 密码
         * @return
         */
        public static Sm2Cert readSm2File(byte[] pem, String pwd)
        {

            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {
                Asn1Sequence asn1Sequence = (Asn1Sequence)Asn1Object.FromByteArray(pem);
                //            ASN1Integer asn1Integer = (ASN1Integer) asn1Sequence.getObjectAt(0); //version=1
                Asn1Sequence priSeq = (Asn1Sequence)asn1Sequence[1];//private key
                Asn1Sequence pubSeq = (Asn1Sequence)asn1Sequence[2];//public key and x509 cert

                //            ASN1ObjectIdentifier sm2DataOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(0);
                //            ASN1ObjectIdentifier sm4AlgOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(1);
                Asn1OctetString priKeyAsn1 = (Asn1OctetString)priSeq[2];
                byte[] key = KDF(System.Text.Encoding.UTF8.GetBytes(pwd), 32);
                byte[] priKeyD = Sm4DecryptCBC(Arrays.CopyOfRange(key, 16, 32),
                        priKeyAsn1.GetOctets(),
                        Arrays.CopyOfRange(key, 0, 16), SM4_CBC_PKCS7PADDING);
                sm2Cert.privateKey = GetPrivatekeyFromD(new BigInteger(1, priKeyD));
                //            log.Info(Hex.toHexString(priKeyD));

                //            ASN1ObjectIdentifier sm2DataOidPub = (ASN1ObjectIdentifier) pubSeq.getObjectAt(0);
                Asn1OctetString pubKeyX509 = (Asn1OctetString)pubSeq[1];
                X509Certificate x509 = (X509Certificate)new X509CertificateParser().ReadCertificate(pubKeyX509.GetOctets());
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("readSm2File error: " + e.Message, e);
                return null;
            }
        }

        /**
         *
         * @param cert
         * @return
         */
        public static Sm2Cert ReadSm2X509Cert(byte[] cert)
        {
            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {

                X509Certificate x509 = new X509CertificateParser().ReadCertificate(cert);
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("ReadSm2X509Cert error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] ZeroIv(String algo)
        {

            try
            {
                IBufferedCipher cipher = CipherUtilities.GetCipher(algo);
                int blockSize = cipher.GetBlockSize();
                byte[] iv = new byte[blockSize];
                Arrays.Fill(iv, (byte)0);
                return iv;
            }
            catch (Exception e)
            {
                //log.Error("ZeroIv error: " + e.Message, e);
                return null;
            }
        }

        public static void Main2(string[] s)
        {

            // 随便看看
            //log.Info("GMNamedCurves: ");
            foreach (string e in GMNamedCurves.Names)
            {
                //log.Info(e);
            }
            //log.Info("sm2p256v1 n:" + x9ECParameters.N);
            //log.Info("sm2p256v1 nHex:" + Hex.ToHexString(x9ECParameters.N.ToByteArray()));

            // 生成公私钥对 ---------------------
            AsymmetricCipherKeyPair kp = GmUtil.GenerateKeyPair();
            //log.Info("private key d: " + ((ECPrivateKeyParameters)kp.Private).D);
            //log.Info("public key q:" + ((ECPublicKeyParameters)kp.Public).Q); //{x, y, zs...}

            //签名验签
            byte[] msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            byte[] userId = System.Text.Encoding.UTF8.GetBytes("userId");
            byte[] sig = SignSm3WithSm2(msg, userId, kp.Private);
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, kp.Public));

            // 由d生成私钥 ---------------------
            BigInteger d = new BigInteger("097b5230ef27c7df0fa768289d13ad4e8a96266f0fcb8de40d5942af4293a54a", 16);
            ECPrivateKeyParameters bcecPrivateKey = GetPrivatekeyFromD(d);
            //log.Info("testGetFromD: " + bcecPrivateKey.D.ToString(16));

            //公钥X坐标PublicKeyXHex: 59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4
            //公钥Y坐标PublicKeyYHex: 9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8
            AsymmetricKeyParameter publicKey = GetPublickeyFromX509File(new FileInfo("d:/certs/69629141652.cer"));
            //log.Info(publicKey);
            AsymmetricKeyParameter publicKey1 = GetPublickeyFromXY(new BigInteger("59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4", 16), new BigInteger("9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8", 16));
            //log.Info("testReadFromX509File: " + ((ECPublicKeyParameters)publicKey).Q);
            //log.Info("testGetFromXY: " + ((ECPublicKeyParameters)publicKey1).Q);
            //log.Info("testPubKey: " + publicKey.Equals(publicKey1));
            //log.Info("testPubKey: " + ((ECPublicKeyParameters)publicKey).Q.Equals(((ECPublicKeyParameters)publicKey1).Q));

            // sm2 encrypt and decrypt test ---------------------
            AsymmetricCipherKeyPair kp2 = GenerateKeyPair();
            AsymmetricKeyParameter publicKey2 = kp2.Public;
            AsymmetricKeyParameter privateKey2 = kp2.Private;
            byte[] bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), publicKey2);
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, privateKey2);
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            // sm4 encrypt and decrypt test ---------------------
            //0123456789abcdeffedcba9876543210 + 0123456789abcdeffedcba9876543210 -> 681edf34d206965e86b3e94f536e4246
            byte[] plain = Hex.Decode("0123456789abcdeffedcba98765432100123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210");
            byte[] key = Hex.Decode("0123456789abcdeffedcba9876543210");
            byte[] cipher = Hex.Decode("595298c7c6fd271f0402f804c33d3f66");
            bs = Sm4EncryptECB(key, plain, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4EncEcb: " + Hex.ToHexString(bs)); ;
            bs = Sm4DecryptECB(key, bs, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4DecEcb: " + Hex.ToHexString(bs));

            //读.sm2文件
            String sm2 = "MIIDHQIBATBHBgoqgRzPVQYBBAIBBgcqgRzPVQFoBDDW5/I9kZhObxXE9Vh1CzHdZhIhxn+3byBU\nUrzmGRKbDRMgI3hJKdvpqWkM5G4LNcIwggLNBgoqgRzPVQYBBAIBBIICvTCCArkwggJdoAMCAQIC\nBRA2QSlgMAwGCCqBHM9VAYN1BQAwXDELMAkGA1UEBhMCQ04xMDAuBgNVBAoMJ0NoaW5hIEZpbmFu\nY2lhbCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEbMBkGA1UEAwwSQ0ZDQSBURVNUIFNNMiBPQ0Ex\nMB4XDTE4MTEyNjEwMTQxNVoXDTIwMTEyNjEwMTQxNVowcjELMAkGA1UEBhMCY24xEjAQBgNVBAoM\nCUNGQ0EgT0NBMTEOMAwGA1UECwwFQ1VQUkExFDASBgNVBAsMC0VudGVycHJpc2VzMSkwJwYDVQQD\nDCAwNDFAWnRlc3RAMDAwMTAwMDA6U0lHTkAwMDAwMDAwMTBZMBMGByqGSM49AgEGCCqBHM9VAYIt\nA0IABDRNKhvnjaMUShsM4MJ330WhyOwpZEHoAGfqxFGX+rcL9x069dyrmiF3+2ezwSNh1/6YqfFZ\nX9koM9zE5RG4USmjgfMwgfAwHwYDVR0jBBgwFoAUa/4Y2o9COqa4bbMuiIM6NKLBMOEwSAYDVR0g\nBEEwPzA9BghggRyG7yoBATAxMC8GCCsGAQUFBwIBFiNodHRwOi8vd3d3LmNmY2EuY29tLmNuL3Vz\nL3VzLTE0Lmh0bTA4BgNVHR8EMTAvMC2gK6AphidodHRwOi8vdWNybC5jZmNhLmNvbS5jbi9TTTIv\nY3JsNDI4NS5jcmwwCwYDVR0PBAQDAgPoMB0GA1UdDgQWBBREhx9VlDdMIdIbhAxKnGhPx8FcHDAd\nBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwDAYIKoEcz1UBg3UFAANIADBFAiEAgWvQi3h6\niW4jgF4huuXfhWInJmTTYr2EIAdG8V4M8fYCIBixygdmfPL9szcK2pzCYmIb6CBzo5SMv50Odycc\nVfY6";
            bs = Convert.FromBase64String(sm2);
            String pwd = "cfca1234";
            GmUtil.Sm2Cert sm2Cert = GmUtil.readSm2File(bs, pwd);
            //log.Info("testReadSm2File, pubkey: " + ((ECPublicKeyParameters)sm2Cert.publicKey).Q.ToString());
            //log.Info("testReadSm2File, prikey: " + Hex.ToHexString(((ECPrivateKeyParameters)sm2Cert.privateKey).D.ToByteArray()));
            //log.Info("testReadSm2File, certId: " + sm2Cert.certId);

            bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), ((ECPublicKeyParameters)sm2Cert.publicKey));
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            userId = System.Text.Encoding.UTF8.GetBytes("userId");
            sig = SignSm3WithSm2(msg, userId, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, ((ECPublicKeyParameters)sm2Cert.publicKey)));
        }

    }
}
```

.NET使用：

```c#
using CommonUtils;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Utilities.Encoders;
using System.Text;


void TestSM2Sign()
{
    string userId = "1234567812345678";
    byte[] byUserId = Encoding.UTF8.GetBytes(userId);
    String privateKeyHex = "FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0";
    string pubKeyHex = "049EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF";
    //如果是130位公钥，.NET 使用的话，把开头的04截取掉。
    if (pubKeyHex.Length == 130)
    {
        pubKeyHex = pubKeyHex.Substring(2, 128);
    }
    //公钥X，前64位
    String x = pubKeyHex.Substring(0, 64);
    //公钥Y，后64位
    String y = pubKeyHex.Substring(64);
    //获取公钥对象
    AsymmetricKeyParameter publicKey1 = GmUtil.GetPublickeyFromXY(new BigInteger(x, 16), new BigInteger(y, 16));
    BigInteger d = new BigInteger(privateKeyHex, 16);
    //获取私钥对象，用ECPrivateKeyParameters 或 AsymmetricKeyParameter 都可以
    //ECPrivateKeyParameters bcecPrivateKey = CommonUtils.GmUtil.GetPrivatekeyFromD(d);
    AsymmetricKeyParameter bcecPrivateKey = CommonUtils.GmUtil.GetPrivatekeyFromD(d);

    String content = "1234泰酷拉NET";
    Console.WriteLine("待处理字符串：" + content);
    //SignSm3WithSm2 是RS，SignSm3WithSm2Asn1Rs 是 asn1
    byte[] digestByte = GmUtil.SignSm3WithSm2(Encoding.UTF8.GetBytes(content), byUserId, bcecPrivateKey);
    string strSM2 = Convert.ToBase64String(digestByte);
    Console.WriteLine("SM2加签后：" + strSM2);

    //.NET 验签    
    byte[] byToProc = Convert.FromBase64String(strSM2);
    //顺序：报文，userId，签名值，公钥。
    bool verifySign = GmUtil.VerifySm3WithSm2(Encoding.UTF8.GetBytes(content), byUserId, byToProc, publicKey1);

    Console.WriteLine("SM2 验签：" + verifySign.ToString());

    //JAVA 签名 .NET验签
    string javaContent = "1234泰酷拉JJ"; //注意：报文要和JAVA一致
    Console.WriteLine("javaContent：" + javaContent);
    string javaSM2 = "MEUCIF5PXxIlF0NmQaUtfIGLbZm4JuYT4bkYyoFMA/eIqVaUAiEAkRT3GkrtY2YtUSF9Ya0jOLRMcMUuHNLiWPTy591vnco=";

    Console.WriteLine("javaSM2签名结果：" + javaSM2);
    byToProc = Convert.FromBase64String(javaSM2);
    //注意：JAVA HUTOOL - sm2.sign 结果格式是 asn1 的，我们得用 VerifySm3WithSm2Asn1Rs。
    verifySign = GmUtil.VerifySm3WithSm2Asn1Rs(Encoding.UTF8.GetBytes(javaContent), byUserId, byToProc, publicKey1);

    Console.WriteLine("JAVA SM2 验签：" + verifySign.ToString());
}
```

java代码：

maven 引用 ：

```xml
<dependency>
      <groupId>cn.hutool</groupId>
      <artifactId>hutool-all</artifactId>
      <version>5.8.1</version>
    </dependency>

    <dependency>
      <groupId>org.bouncycastle</groupId>
      <artifactId>bcprov-jdk15on</artifactId>
      <version>1.70</version>
    </dependency>
```

JAVA调用：

```java
package org.example;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.SM2;
import org.bouncycastle.crypto.engines.SM2Engine;
import org.bouncycastle.util.encoders.Hex;
import java.util.Base64;


    static void testSM2Sign() {

        String content = "1234泰酷拉JJ";
        System.out.println("待处理字符串：" + content);
        String userId = "1234567812345678";
        byte[] byUserId = userId.getBytes();

        //私钥
        String privateKeyHex = "FAB8BBE670FAE338C9E9382B9FB6485225C11A3ECB84C938F10F20A93B6215F0";
        //公钥X
        String x = "9EF573019D9A03B16B0BE44FC8A5B4E8E098F56034C97B312282DD0B4810AFC3";
        //公钥Y
        String y = "CC759673ED0FC9B9DC7E6FA38F0E2B121E02654BF37EA6B63FAF2A0D6013EADF";
        //构造函数里，私钥或公钥，其中一方可为空 null
        SM2 sm2 = new SM2(privateKeyHex, x, y);
        byte[] byRst = sm2.sign(content.getBytes(), byUserId);
        String sm2Sign = Base64.getEncoder().encodeToString(byRst);
        System.out.println("sm2 BASE64 签名:" + sm2Sign);

        byte[] bySign = Base64.getDecoder().decode(sm2Sign);
        boolean verifySign = sm2.verify(content.getBytes(), bySign, byUserId);

        System.out.println("SM2 验签：" + verifySign);
    }
```

## SM3

### 快速上手

安装nuget包

```c#
<PackageReference Include="BouncyCastle.Cryptography" Version="2.2.1" />
```

使用

```c#
var plaintext = "123456";
var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
    
var digest = new SM3Digest();
var hashBytes = new byte[digest.GetDigestSize()];
    
digest.BlockUpdate(plaintextBytes, 0, plaintextBytes.Length);
digest.DoFinal(hashBytes, 0);
    
var hashString = Hex.ToHexString(hashBytes);
Console.WriteLine("SM3 Hash: " + hashString);
```

上述代码使用 BouncyCastle 库中的 `SM3Digest` 类来计算给定字符串的 SM3 哈希值。可以通过 `Encoding.UTF8.GetBytes` 方法将字符串转换为字节数组，然后使用 `BlockUpdate` 将字节数组输入到 `SM3Digest` 中，最后通过 `DoFinal` 方法获取计算出的 SM3 哈希值。

### 其他方案

:::tip

原文地址：https://www.cnblogs.com/runliuv/p/17604030.html

:::

.NET 环境：.NET6 控制台程序(.net core)。

JAVA 环境：JAVA8，带maven 的JAVA控制台程序。

 

简要解析：

1：明文输入参数都需要string转 byte [] ，要约定好编码，如：UTF8。

2：输出参数：byte [] ，在传输时需要转为string，要约定好编码，如：16进制字符串。

 

.NET 代码：

GmUtil 工具类，需要nuget下载 Portable.BouncyCastle 1.9.0 版本：

```c#
using Org.BouncyCastle.Asn1;
using Org.BouncyCastle.Asn1.GM;
using Org.BouncyCastle.Asn1.X9;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Utilities;
using Org.BouncyCastle.Utilities.Encoders;
using Org.BouncyCastle.X509;
using System;
using System.Collections.Generic;
using System.IO;

namespace CommonUtils
{
    /**
     * need lib:
     * BouncyCastle.Crypto.dll（http://www.bouncycastle.org/csharp/index.html） 
      
     * 用BC的注意点：
     * 这个版本的BC对SM3withSM2的结果为asn1格式的r和s，如果需要直接拼接的r||s需要自己转换。下面rsAsn1ToPlainByteArray、rsPlainByteArrayToAsn1就在干这事。
     * 这个版本的BC对SM2的结果为C1||C2||C3，据说为旧标准，新标准为C1||C3||C2，用新标准的需要自己转换。下面（被注释掉的）changeC1C2C3ToC1C3C2、changeC1C3C2ToC1C2C3就在干这事。java版的高版本有加上C1C3C2，csharp版没准以后也会加，但目前还没有，java版的目前可以初始化时“ SM2Engine sm2Engine = new SM2Engine(SM2Engine.Mode.C1C3C2);”。
     * 
     * 按要求国密算法仅允许使用加密机，本demo国密算法仅供学习使用，请不要用于生产用途。
     */
    public class GmUtil
    {

        //private static readonly ILog log = LogManager.GetLogger(typeof(GmUtil));

        private static X9ECParameters x9ECParameters = GMNamedCurves.GetByName("sm2p256v1");
        private static ECDomainParameters ecDomainParameters = new ECDomainParameters(x9ECParameters.Curve, x9ECParameters.G, x9ECParameters.N);

        /**
         *
         * @param msg
         * @param userId
         * @param privateKey
         * @return r||s，直接拼接byte数组的rs
         */
        public static byte[] SignSm3WithSm2(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            return RsAsn1ToPlainByteArray(SignSm3WithSm2Asn1Rs(msg, userId, privateKey));
        }

        /**
          * @param msg
          * @param userId
          * @param privateKey
          * @return rs in <b>asn1 format</b>
          */
        public static byte[] SignSm3WithSm2Asn1Rs(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(true, new ParametersWithID(privateKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                byte[] sig = signer.GenerateSignature();
                return sig;
            }
            catch (Exception e)
            {
                //log.Error("SignSm3WithSm2Asn1Rs error: " + e.Message, e);
                return null;
            }
        }

        /**
        *
        * @param msg
        * @param userId
        * @param rs r||s，直接拼接byte数组的rs
        * @param publicKey
        * @return
        */
        public static bool VerifySm3WithSm2(byte[] msg, byte[] userId, byte[] rs, AsymmetricKeyParameter publicKey)
        {
            if (rs == null || msg == null || userId == null) return false;
            if (rs.Length != RS_LEN * 2) return false;
            return VerifySm3WithSm2Asn1Rs(msg, userId, RsPlainByteArrayToAsn1(rs), publicKey);
        }

        /**
         *
         * @param msg
         * @param userId
         * @param rs in <b>asn1 format</b>
         * @param publicKey
         * @return
         */

        public static bool VerifySm3WithSm2Asn1Rs(byte[] msg, byte[] userId, byte[] sign, AsymmetricKeyParameter publicKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(false, new ParametersWithID(publicKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                return signer.VerifySignature(sign);
            }
            catch (Exception e)
            {
                //log.Error("VerifySm3WithSm2Asn1Rs error: " + e.Message, e);
                return false;
            }
        }

        /**
         * bc加解密使用旧标c1||c2||c3，此方法在加密后调用，将结果转化为c1||c3||c2
         * @param c1c2c3
         * @return
         */
        private static byte[] ChangeC1C2C3ToC1C3C2(byte[] c1c2c3)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().getDigestSize();
            byte[] result = new byte[c1c2c3.Length];
            Buffer.BlockCopy(c1c2c3, 0, result, 0, c1Len); //c1
            Buffer.BlockCopy(c1c2c3, c1c2c3.Length - c3Len, result, c1Len, c3Len); //c3
            Buffer.BlockCopy(c1c2c3, c1Len, result, c1Len + c3Len, c1c2c3.Length - c1Len - c3Len); //c2
            return result;
        }


        /**
         * bc加解密使用旧标c1||c3||c2，此方法在解密前调用，将密文转化为c1||c2||c3再去解密
         * @param c1c3c2
         * @return
         */
        private static byte[] ChangeC1C3C2ToC1C2C3(byte[] c1c3c2)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().GetDigestSize();
            byte[] result = new byte[c1c3c2.Length];
            Buffer.BlockCopy(c1c3c2, 0, result, 0, c1Len); //c1: 0->65
            Buffer.BlockCopy(c1c3c2, c1Len + c3Len, result, c1Len, c1c3c2.Length - c1Len - c3Len); //c2
            Buffer.BlockCopy(c1c3c2, c1Len, result, c1c3c2.Length - c3Len, c3Len); //c3
            return result;
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2Decrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return Sm2DecryptOld(ChangeC1C3C2ToC1C2C3(data), key);
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */

        public static byte[] Sm2Encrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return ChangeC1C2C3ToC1C3C2(Sm2EncryptOld(data, key));
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2EncryptOld(byte[] data, AsymmetricKeyParameter pubkey)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(true, new ParametersWithRandom(pubkey, new SecureRandom()));
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2EncryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2DecryptOld(byte[] data, AsymmetricKeyParameter key)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(false, key);
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2DecryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * @param bytes
         * @return
         */
        public static byte[] Sm3(byte[] bytes)
        {
            try
            {
                SM3Digest digest = new SM3Digest();
                digest.BlockUpdate(bytes, 0, bytes.Length);
                byte[] result = DigestUtilities.DoFinal(digest);
                return result;
            }
            catch (Exception e)
            {
                //log.Error("Sm3 error: " + e.Message, e);
                return null;
            }
        }

        private const int RS_LEN = 32;

        private static byte[] BigIntToFixexLengthBytes(BigInteger rOrS)
        {
            // for sm2p256v1, n is 00fffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123,
            // r and s are the result of mod n, so they should be less than n and have length<=32
            byte[] rs = rOrS.ToByteArray();
            if (rs.Length == RS_LEN) return rs;
            else if (rs.Length == RS_LEN + 1 && rs[0] == 0) return Arrays.CopyOfRange(rs, 1, RS_LEN + 1);
            else if (rs.Length < RS_LEN)
            {
                byte[] result = new byte[RS_LEN];
                Arrays.Fill(result, (byte)0);
                Buffer.BlockCopy(rs, 0, result, RS_LEN - rs.Length, rs.Length);
                return result;
            }
            else
            {
                throw new ArgumentException("err rs: " + Hex.ToHexString(rs));
            }
        }

        /**
         * BC的SM3withSM2签名得到的结果的rs是asn1格式的，这个方法转化成直接拼接r||s
         * @param rsDer rs in asn1 format
         * @return sign result in plain byte array
         */
        private static byte[] RsAsn1ToPlainByteArray(byte[] rsDer)
        {
            Asn1Sequence seq = Asn1Sequence.GetInstance(rsDer);
            byte[] r = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[0]).Value);
            byte[] s = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[1]).Value);
            byte[] result = new byte[RS_LEN * 2];
            Buffer.BlockCopy(r, 0, result, 0, r.Length);
            Buffer.BlockCopy(s, 0, result, RS_LEN, s.Length);
            return result;
        }

        /**
         * BC的SM3withSM2验签需要的rs是asn1格式的，这个方法将直接拼接r||s的字节数组转化成asn1格式
         * @param sign in plain byte array
         * @return rs result in asn1 format
         */
        private static byte[] RsPlainByteArrayToAsn1(byte[] sign)
        {
            if (sign.Length != RS_LEN * 2) throw new ArgumentException("err rs. ");
            BigInteger r = new BigInteger(1, Arrays.CopyOfRange(sign, 0, RS_LEN));
            BigInteger s = new BigInteger(1, Arrays.CopyOfRange(sign, RS_LEN, RS_LEN * 2));
            Asn1EncodableVector v = new Asn1EncodableVector();
            v.Add(new DerInteger(r));
            v.Add(new DerInteger(s));
            try
            {
                return new DerSequence(v).GetEncoded("DER");
            }
            catch (IOException e)
            {
                //log.Error("RsPlainByteArrayToAsn1 error: " + e.Message, e);
                return null;
            }
        }

        public static AsymmetricCipherKeyPair GenerateKeyPair()
        {
            try
            {
                ECKeyPairGenerator kpGen = new ECKeyPairGenerator();
                kpGen.Init(new ECKeyGenerationParameters(ecDomainParameters, new SecureRandom()));
                return kpGen.GenerateKeyPair();
            }
            catch (Exception e)
            {
                //log.Error("generateKeyPair error: " + e.Message, e);
                return null;
            }
        }

        public static ECPrivateKeyParameters GetPrivatekeyFromD(BigInteger d)
        {
            return new ECPrivateKeyParameters(d, ecDomainParameters);
        }

        public static ECPublicKeyParameters GetPublickeyFromXY(BigInteger x, BigInteger y)
        {
            return new ECPublicKeyParameters(x9ECParameters.Curve.CreatePoint(x, y), ecDomainParameters);
        }

        public static AsymmetricKeyParameter GetPublickeyFromX509File(FileInfo file)
        {

            FileStream fileStream = null;
            try
            {
                //file.DirectoryName + "\\" + file.Name
                fileStream = new FileStream(file.FullName, FileMode.Open, FileAccess.Read);
                X509Certificate certificate = new X509CertificateParser().ReadCertificate(fileStream);
                return certificate.GetPublicKey();
            }
            catch (Exception e)
            {
                //log.Error(file.Name + "读取失败，异常：" + e);
            }
            finally
            {
                if (fileStream != null)
                    fileStream.Close();
            }
            return null;
        }

        public class Sm2Cert
        {
            public AsymmetricKeyParameter privateKey;
            public AsymmetricKeyParameter publicKey;
            public String certId;
        }

        private static byte[] ToByteArray(int i)
        {
            byte[] byteArray = new byte[4];
            byteArray[0] = (byte)(i >> 24);
            byteArray[1] = (byte)((i & 0xFFFFFF) >> 16);
            byteArray[2] = (byte)((i & 0xFFFF) >> 8);
            byteArray[3] = (byte)(i & 0xFF);
            return byteArray;
        }

        /**
         * 字节数组拼接
         *
         * @param params
         * @return
         */
        private static byte[] Join(params byte[][] byteArrays)
        {
            List<byte> byteSource = new List<byte>();
            for (int i = 0; i < byteArrays.Length; i++)
            {
                byteSource.AddRange(byteArrays[i]);
            }
            byte[] data = byteSource.ToArray();
            return data;
        }

        /**
         * 密钥派生函数
         *
         * @param Z
         * @param klen
         *            生成klen字节数长度的密钥
         * @return
         */
        private static byte[] KDF(byte[] Z, int klen)
        {
            int ct = 1;
            int end = (int)Math.Ceiling(klen * 1.0 / 32);
            List<byte> byteSource = new List<byte>();
            try
            {
                for (int i = 1; i < end; i++)
                {
                    byteSource.AddRange(GmUtil.Sm3(Join(Z, ToByteArray(ct))));
                    ct++;
                }
                byte[] last = GmUtil.Sm3(Join(Z, ToByteArray(ct)));
                if (klen % 32 == 0)
                {
                    byteSource.AddRange(last);
                }
                else
                    byteSource.AddRange(Arrays.CopyOfRange(last, 0, klen % 32));
                return byteSource.ToArray();
            }
            catch (Exception e)
            {
                //log.Error("KDF error: " + e.Message, e);
            }
            return null;
        }

        public static byte[] Sm4DecryptCBC(byte[] keyBytes, byte[] cipher, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(false, new ParametersWithIV(key, iv));
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptCBC(byte[] keyBytes, byte[] plain, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(true, new ParametersWithIV(key, iv));
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptECB(byte[] keyBytes, byte[] plain, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            //NoPadding 的情况下需要校验数据长度是16的倍数.
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(true, key);
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptECB error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] Sm4DecryptECB(byte[] keyBytes, byte[] cipher, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(false, key);
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptECB error: " + e.Message, e);
                return null;
            }
        }

        public const String SM4_ECB_NOPADDING = "SM4/ECB/NoPadding";
        public const String SM4_CBC_NOPADDING = "SM4/CBC/NoPadding";
        public const String SM4_CBC_PKCS7PADDING = "SM4/CBC/PKCS7Padding";

        /**
         * cfca官网CSP沙箱导出的sm2文件
         * @param pem 二进制原文
         * @param pwd 密码
         * @return
         */
        public static Sm2Cert readSm2File(byte[] pem, String pwd)
        {

            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {
                Asn1Sequence asn1Sequence = (Asn1Sequence)Asn1Object.FromByteArray(pem);
                //            ASN1Integer asn1Integer = (ASN1Integer) asn1Sequence.getObjectAt(0); //version=1
                Asn1Sequence priSeq = (Asn1Sequence)asn1Sequence[1];//private key
                Asn1Sequence pubSeq = (Asn1Sequence)asn1Sequence[2];//public key and x509 cert

                //            ASN1ObjectIdentifier sm2DataOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(0);
                //            ASN1ObjectIdentifier sm4AlgOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(1);
                Asn1OctetString priKeyAsn1 = (Asn1OctetString)priSeq[2];
                byte[] key = KDF(System.Text.Encoding.UTF8.GetBytes(pwd), 32);
                byte[] priKeyD = Sm4DecryptCBC(Arrays.CopyOfRange(key, 16, 32),
                        priKeyAsn1.GetOctets(),
                        Arrays.CopyOfRange(key, 0, 16), SM4_CBC_PKCS7PADDING);
                sm2Cert.privateKey = GetPrivatekeyFromD(new BigInteger(1, priKeyD));
                //            log.Info(Hex.toHexString(priKeyD));

                //            ASN1ObjectIdentifier sm2DataOidPub = (ASN1ObjectIdentifier) pubSeq.getObjectAt(0);
                Asn1OctetString pubKeyX509 = (Asn1OctetString)pubSeq[1];
                X509Certificate x509 = (X509Certificate)new X509CertificateParser().ReadCertificate(pubKeyX509.GetOctets());
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("readSm2File error: " + e.Message, e);
                return null;
            }
        }

        /**
         *
         * @param cert
         * @return
         */
        public static Sm2Cert ReadSm2X509Cert(byte[] cert)
        {
            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {

                X509Certificate x509 = new X509CertificateParser().ReadCertificate(cert);
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("ReadSm2X509Cert error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] ZeroIv(String algo)
        {

            try
            {
                IBufferedCipher cipher = CipherUtilities.GetCipher(algo);
                int blockSize = cipher.GetBlockSize();
                byte[] iv = new byte[blockSize];
                Arrays.Fill(iv, (byte)0);
                return iv;
            }
            catch (Exception e)
            {
                //log.Error("ZeroIv error: " + e.Message, e);
                return null;
            }
        }

        public static void Main2(string[] s)
        {

            // 随便看看
            //log.Info("GMNamedCurves: ");
            foreach (string e in GMNamedCurves.Names)
            {
                //log.Info(e);
            }
            //log.Info("sm2p256v1 n:" + x9ECParameters.N);
            //log.Info("sm2p256v1 nHex:" + Hex.ToHexString(x9ECParameters.N.ToByteArray()));

            // 生成公私钥对 ---------------------
            AsymmetricCipherKeyPair kp = GmUtil.GenerateKeyPair();
            //log.Info("private key d: " + ((ECPrivateKeyParameters)kp.Private).D);
            //log.Info("public key q:" + ((ECPublicKeyParameters)kp.Public).Q); //{x, y, zs...}

            //签名验签
            byte[] msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            byte[] userId = System.Text.Encoding.UTF8.GetBytes("userId");
            byte[] sig = SignSm3WithSm2(msg, userId, kp.Private);
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, kp.Public));

            // 由d生成私钥 ---------------------
            BigInteger d = new BigInteger("097b5230ef27c7df0fa768289d13ad4e8a96266f0fcb8de40d5942af4293a54a", 16);
            ECPrivateKeyParameters bcecPrivateKey = GetPrivatekeyFromD(d);
            //log.Info("testGetFromD: " + bcecPrivateKey.D.ToString(16));

            //公钥X坐标PublicKeyXHex: 59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4
            //公钥Y坐标PublicKeyYHex: 9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8
            AsymmetricKeyParameter publicKey = GetPublickeyFromX509File(new FileInfo("d:/certs/69629141652.cer"));
            //log.Info(publicKey);
            AsymmetricKeyParameter publicKey1 = GetPublickeyFromXY(new BigInteger("59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4", 16), new BigInteger("9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8", 16));
            //log.Info("testReadFromX509File: " + ((ECPublicKeyParameters)publicKey).Q);
            //log.Info("testGetFromXY: " + ((ECPublicKeyParameters)publicKey1).Q);
            //log.Info("testPubKey: " + publicKey.Equals(publicKey1));
            //log.Info("testPubKey: " + ((ECPublicKeyParameters)publicKey).Q.Equals(((ECPublicKeyParameters)publicKey1).Q));

            // sm2 encrypt and decrypt test ---------------------
            AsymmetricCipherKeyPair kp2 = GenerateKeyPair();
            AsymmetricKeyParameter publicKey2 = kp2.Public;
            AsymmetricKeyParameter privateKey2 = kp2.Private;
            byte[] bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), publicKey2);
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, privateKey2);
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            // sm4 encrypt and decrypt test ---------------------
            //0123456789abcdeffedcba9876543210 + 0123456789abcdeffedcba9876543210 -> 681edf34d206965e86b3e94f536e4246
            byte[] plain = Hex.Decode("0123456789abcdeffedcba98765432100123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210");
            byte[] key = Hex.Decode("0123456789abcdeffedcba9876543210");
            byte[] cipher = Hex.Decode("595298c7c6fd271f0402f804c33d3f66");
            bs = Sm4EncryptECB(key, plain, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4EncEcb: " + Hex.ToHexString(bs)); ;
            bs = Sm4DecryptECB(key, bs, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4DecEcb: " + Hex.ToHexString(bs));

            //读.sm2文件
            String sm2 = "MIIDHQIBATBHBgoqgRzPVQYBBAIBBgcqgRzPVQFoBDDW5/I9kZhObxXE9Vh1CzHdZhIhxn+3byBU\nUrzmGRKbDRMgI3hJKdvpqWkM5G4LNcIwggLNBgoqgRzPVQYBBAIBBIICvTCCArkwggJdoAMCAQIC\nBRA2QSlgMAwGCCqBHM9VAYN1BQAwXDELMAkGA1UEBhMCQ04xMDAuBgNVBAoMJ0NoaW5hIEZpbmFu\nY2lhbCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEbMBkGA1UEAwwSQ0ZDQSBURVNUIFNNMiBPQ0Ex\nMB4XDTE4MTEyNjEwMTQxNVoXDTIwMTEyNjEwMTQxNVowcjELMAkGA1UEBhMCY24xEjAQBgNVBAoM\nCUNGQ0EgT0NBMTEOMAwGA1UECwwFQ1VQUkExFDASBgNVBAsMC0VudGVycHJpc2VzMSkwJwYDVQQD\nDCAwNDFAWnRlc3RAMDAwMTAwMDA6U0lHTkAwMDAwMDAwMTBZMBMGByqGSM49AgEGCCqBHM9VAYIt\nA0IABDRNKhvnjaMUShsM4MJ330WhyOwpZEHoAGfqxFGX+rcL9x069dyrmiF3+2ezwSNh1/6YqfFZ\nX9koM9zE5RG4USmjgfMwgfAwHwYDVR0jBBgwFoAUa/4Y2o9COqa4bbMuiIM6NKLBMOEwSAYDVR0g\nBEEwPzA9BghggRyG7yoBATAxMC8GCCsGAQUFBwIBFiNodHRwOi8vd3d3LmNmY2EuY29tLmNuL3Vz\nL3VzLTE0Lmh0bTA4BgNVHR8EMTAvMC2gK6AphidodHRwOi8vdWNybC5jZmNhLmNvbS5jbi9TTTIv\nY3JsNDI4NS5jcmwwCwYDVR0PBAQDAgPoMB0GA1UdDgQWBBREhx9VlDdMIdIbhAxKnGhPx8FcHDAd\nBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwDAYIKoEcz1UBg3UFAANIADBFAiEAgWvQi3h6\niW4jgF4huuXfhWInJmTTYr2EIAdG8V4M8fYCIBixygdmfPL9szcK2pzCYmIb6CBzo5SMv50Odycc\nVfY6";
            bs = Convert.FromBase64String(sm2);
            String pwd = "cfca1234";
            GmUtil.Sm2Cert sm2Cert = GmUtil.readSm2File(bs, pwd);
            //log.Info("testReadSm2File, pubkey: " + ((ECPublicKeyParameters)sm2Cert.publicKey).Q.ToString());
            //log.Info("testReadSm2File, prikey: " + Hex.ToHexString(((ECPrivateKeyParameters)sm2Cert.privateKey).D.ToByteArray()));
            //log.Info("testReadSm2File, certId: " + sm2Cert.certId);

            bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), ((ECPublicKeyParameters)sm2Cert.publicKey));
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            userId = System.Text.Encoding.UTF8.GetBytes("userId");
            sig = SignSm3WithSm2(msg, userId, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, ((ECPublicKeyParameters)sm2Cert.publicKey)));
        }

    }
}
```

使用

```c#
using CommonUtils;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Utilities.Encoders;
using System.Text;


void TestSM3()
{
    String content = "1234泰酷拉";
    Console.WriteLine("待处理字符串：" + content);

    byte[] digestByte = GmUtil.Sm3(Encoding.UTF8.GetBytes(content));
    string strSM3 = Hex.ToHexString(digestByte);
    Console.WriteLine("SM3 HASH后：" + strSM3);
    string javaSM3 = "40f9b63398b72bee91f5e59c3c3d7fe9f66c4fb1637ec7adb9babb880e6489ec";
    Console.WriteLine("javaSM3：" + javaSM3);
    if (strSM3 == javaSM3)
    {
        Console.WriteLine("相等");
    }
}
```



JAVA 代码：

maven 引用这2个包。

```xml
<dependency>
      <groupId>cn.hutool</groupId>
      <artifactId>hutool-all</artifactId>
      <version>5.8.1</version>
    </dependency>

    <dependency>
      <groupId>org.bouncycastle</groupId>
      <artifactId>bcprov-jdk15on</artifactId>
      <version>1.70</version>
    </dependency>
```

调用

```java
package org.example;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.SM2;
import org.bouncycastle.crypto.engines.SM2Engine;
import org.bouncycastle.util.encoders.Hex;

    static void testSM3() {
        String content = "1234泰酷拉";
        System.out.println("待处理字符串：" + content);

        String digestHex = SmUtil.sm3(content);
        System.out.println("SM3 HASH后：" + digestHex);
    }
```

## SM4

### 方案一

引用nuget包

```c#
 <PackageReference Include="BouncyCastle.Cryptography" Version="2.2.1" />
```

使用

```c#
// 加密
var inputBytes = Encoding.UTF8.GetBytes(_origin);
var secretBytes = Encoding.UTF8.GetBytes(_secret);

var engine = new SM4Engine();
var secretParameter = new KeyParameter(secretBytes);
var cipher = new PaddedBufferedBlockCipher(new CbcBlockCipher(engine));

var encryptedBytes = cipher.DoFinal(inputBytes);
var encryptedBase64 = Convert.ToBase64String(encryptedBytes);
//Console.WriteLine($"加密后的文本: {encryptedBase64}");

// 解密
cipher.Init(false, new ParametersWithIV(secretParameter, new byte[16]));
var decryptedBytes = cipher.DoFinal(Convert.FromBase64String(encryptedBase64));
var decryptedText = Encoding.UTF8.GetString(decryptedBytes);
//Console.WriteLine($"解密后的文本: {decryptedText}");
```

### 其他方案

:::tip

原文地址：https://www.cnblogs.com/runliuv/p/17593661.html

:::

.NET 环境：.NET6 控制台程序(.net core)。

JAVA 环境：JAVA8，带maven 的JAVA控制台程序。

 

简要解析：

1：加密的KEY、明文等输入参数都需要string转 byte [] ，要约定好编码，如：UTF8。

2：加密后的输出参数：byte [] ，在传输时需要转为string，要约定好编码，如：16进制字符串。

 

这里演示的是“SM4/ECB/PKCS5Padding”，CBC的自行探索。

.NET 代码：

GmUtil 工具类，需要nuget下载 Portable.BouncyCastle 1.9.0 版本：

```c#
using Org.BouncyCastle.Asn1;
using Org.BouncyCastle.Asn1.GM;
using Org.BouncyCastle.Asn1.X9;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.Crypto.Generators;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Math;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.Utilities;
using Org.BouncyCastle.Utilities.Encoders;
using Org.BouncyCastle.X509;
using System;
using System.Collections.Generic;
using System.IO;

namespace CommonUtils
{
    /**
     * need lib:
     * BouncyCastle.Crypto.dll（http://www.bouncycastle.org/csharp/index.html） 
      
     * 用BC的注意点：
     * 这个版本的BC对SM3withSM2的结果为asn1格式的r和s，如果需要直接拼接的r||s需要自己转换。下面rsAsn1ToPlainByteArray、rsPlainByteArrayToAsn1就在干这事。
     * 这个版本的BC对SM2的结果为C1||C2||C3，据说为旧标准，新标准为C1||C3||C2，用新标准的需要自己转换。下面（被注释掉的）changeC1C2C3ToC1C3C2、changeC1C3C2ToC1C2C3就在干这事。java版的高版本有加上C1C3C2，csharp版没准以后也会加，但目前还没有，java版的目前可以初始化时“ SM2Engine sm2Engine = new SM2Engine(SM2Engine.Mode.C1C3C2);”。
     * 
     * 按要求国密算法仅允许使用加密机，本demo国密算法仅供学习使用，请不要用于生产用途。
     */
    public class GmUtil
    {

        //private static readonly ILog log = LogManager.GetLogger(typeof(GmUtil));

        private static X9ECParameters x9ECParameters = GMNamedCurves.GetByName("sm2p256v1");
        private static ECDomainParameters ecDomainParameters = new ECDomainParameters(x9ECParameters.Curve, x9ECParameters.G, x9ECParameters.N);

        /**
         *
         * @param msg
         * @param userId
         * @param privateKey
         * @return r||s，直接拼接byte数组的rs
         */
        public static byte[] SignSm3WithSm2(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            return RsAsn1ToPlainByteArray(SignSm3WithSm2Asn1Rs(msg, userId, privateKey));
        }

        /**
          * @param msg
          * @param userId
          * @param privateKey
          * @return rs in <b>asn1 format</b>
          */
        public static byte[] SignSm3WithSm2Asn1Rs(byte[] msg, byte[] userId, AsymmetricKeyParameter privateKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(true, new ParametersWithID(privateKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                byte[] sig = signer.GenerateSignature();
                return sig;
            }
            catch (Exception e)
            {
                //log.Error("SignSm3WithSm2Asn1Rs error: " + e.Message, e);
                return null;
            }
        }

        /**
        *
        * @param msg
        * @param userId
        * @param rs r||s，直接拼接byte数组的rs
        * @param publicKey
        * @return
        */
        public static bool VerifySm3WithSm2(byte[] msg, byte[] userId, byte[] rs, AsymmetricKeyParameter publicKey)
        {
            if (rs == null || msg == null || userId == null) return false;
            if (rs.Length != RS_LEN * 2) return false;
            return VerifySm3WithSm2Asn1Rs(msg, userId, RsPlainByteArrayToAsn1(rs), publicKey);
        }

        /**
         *
         * @param msg
         * @param userId
         * @param rs in <b>asn1 format</b>
         * @param publicKey
         * @return
         */

        public static bool VerifySm3WithSm2Asn1Rs(byte[] msg, byte[] userId, byte[] sign, AsymmetricKeyParameter publicKey)
        {
            try
            {
                ISigner signer = SignerUtilities.GetSigner("SM3withSM2");
                signer.Init(false, new ParametersWithID(publicKey, userId));
                signer.BlockUpdate(msg, 0, msg.Length);
                return signer.VerifySignature(sign);
            }
            catch (Exception e)
            {
                //log.Error("VerifySm3WithSm2Asn1Rs error: " + e.Message, e);
                return false;
            }
        }

        /**
         * bc加解密使用旧标c1||c2||c3，此方法在加密后调用，将结果转化为c1||c3||c2
         * @param c1c2c3
         * @return
         */
        private static byte[] ChangeC1C2C3ToC1C3C2(byte[] c1c2c3)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().getDigestSize();
            byte[] result = new byte[c1c2c3.Length];
            Buffer.BlockCopy(c1c2c3, 0, result, 0, c1Len); //c1
            Buffer.BlockCopy(c1c2c3, c1c2c3.Length - c3Len, result, c1Len, c3Len); //c3
            Buffer.BlockCopy(c1c2c3, c1Len, result, c1Len + c3Len, c1c2c3.Length - c1Len - c3Len); //c2
            return result;
        }


        /**
         * bc加解密使用旧标c1||c3||c2，此方法在解密前调用，将密文转化为c1||c2||c3再去解密
         * @param c1c3c2
         * @return
         */
        private static byte[] ChangeC1C3C2ToC1C2C3(byte[] c1c3c2)
        {
            int c1Len = (x9ECParameters.Curve.FieldSize + 7) / 8 * 2 + 1; //sm2p256v1的这个固定65。可看GMNamedCurves、ECCurve代码。
            const int c3Len = 32; //new SM3Digest().GetDigestSize();
            byte[] result = new byte[c1c3c2.Length];
            Buffer.BlockCopy(c1c3c2, 0, result, 0, c1Len); //c1: 0->65
            Buffer.BlockCopy(c1c3c2, c1Len + c3Len, result, c1Len, c1c3c2.Length - c1Len - c3Len); //c2
            Buffer.BlockCopy(c1c3c2, c1Len, result, c1c3c2.Length - c3Len, c3Len); //c3
            return result;
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2Decrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return Sm2DecryptOld(ChangeC1C3C2ToC1C2C3(data), key);
        }

        /**
         * c1||c3||c2
         * @param data
         * @param key
         * @return
         */

        public static byte[] Sm2Encrypt(byte[] data, AsymmetricKeyParameter key)
        {
            return ChangeC1C2C3ToC1C3C2(Sm2EncryptOld(data, key));
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2EncryptOld(byte[] data, AsymmetricKeyParameter pubkey)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(true, new ParametersWithRandom(pubkey, new SecureRandom()));
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2EncryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * c1||c2||c3
         * @param data
         * @param key
         * @return
         */
        public static byte[] Sm2DecryptOld(byte[] data, AsymmetricKeyParameter key)
        {
            try
            {
                SM2Engine sm2Engine = new SM2Engine();
                sm2Engine.Init(false, key);
                return sm2Engine.ProcessBlock(data, 0, data.Length);
            }
            catch (Exception e)
            {
                //log.Error("Sm2DecryptOld error: " + e.Message, e);
                return null;
            }
        }

        /**
         * @param bytes
         * @return
         */
        public static byte[] Sm3(byte[] bytes)
        {
            try
            {
                SM3Digest digest = new SM3Digest();
                digest.BlockUpdate(bytes, 0, bytes.Length);
                byte[] result = DigestUtilities.DoFinal(digest);
                return result;
            }
            catch (Exception e)
            {
                //log.Error("Sm3 error: " + e.Message, e);
                return null;
            }
        }

        private const int RS_LEN = 32;

        private static byte[] BigIntToFixexLengthBytes(BigInteger rOrS)
        {
            // for sm2p256v1, n is 00fffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123,
            // r and s are the result of mod n, so they should be less than n and have length<=32
            byte[] rs = rOrS.ToByteArray();
            if (rs.Length == RS_LEN) return rs;
            else if (rs.Length == RS_LEN + 1 && rs[0] == 0) return Arrays.CopyOfRange(rs, 1, RS_LEN + 1);
            else if (rs.Length < RS_LEN)
            {
                byte[] result = new byte[RS_LEN];
                Arrays.Fill(result, (byte)0);
                Buffer.BlockCopy(rs, 0, result, RS_LEN - rs.Length, rs.Length);
                return result;
            }
            else
            {
                throw new ArgumentException("err rs: " + Hex.ToHexString(rs));
            }
        }

        /**
         * BC的SM3withSM2签名得到的结果的rs是asn1格式的，这个方法转化成直接拼接r||s
         * @param rsDer rs in asn1 format
         * @return sign result in plain byte array
         */
        private static byte[] RsAsn1ToPlainByteArray(byte[] rsDer)
        {
            Asn1Sequence seq = Asn1Sequence.GetInstance(rsDer);
            byte[] r = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[0]).Value);
            byte[] s = BigIntToFixexLengthBytes(DerInteger.GetInstance(seq[1]).Value);
            byte[] result = new byte[RS_LEN * 2];
            Buffer.BlockCopy(r, 0, result, 0, r.Length);
            Buffer.BlockCopy(s, 0, result, RS_LEN, s.Length);
            return result;
        }

        /**
         * BC的SM3withSM2验签需要的rs是asn1格式的，这个方法将直接拼接r||s的字节数组转化成asn1格式
         * @param sign in plain byte array
         * @return rs result in asn1 format
         */
        private static byte[] RsPlainByteArrayToAsn1(byte[] sign)
        {
            if (sign.Length != RS_LEN * 2) throw new ArgumentException("err rs. ");
            BigInteger r = new BigInteger(1, Arrays.CopyOfRange(sign, 0, RS_LEN));
            BigInteger s = new BigInteger(1, Arrays.CopyOfRange(sign, RS_LEN, RS_LEN * 2));
            Asn1EncodableVector v = new Asn1EncodableVector();
            v.Add(new DerInteger(r));
            v.Add(new DerInteger(s));
            try
            {
                return new DerSequence(v).GetEncoded("DER");
            }
            catch (IOException e)
            {
                //log.Error("RsPlainByteArrayToAsn1 error: " + e.Message, e);
                return null;
            }
        }

        public static AsymmetricCipherKeyPair GenerateKeyPair()
        {
            try
            {
                ECKeyPairGenerator kpGen = new ECKeyPairGenerator();
                kpGen.Init(new ECKeyGenerationParameters(ecDomainParameters, new SecureRandom()));
                return kpGen.GenerateKeyPair();
            }
            catch (Exception e)
            {
                //log.Error("generateKeyPair error: " + e.Message, e);
                return null;
            }
        }

        public static ECPrivateKeyParameters GetPrivatekeyFromD(BigInteger d)
        {
            return new ECPrivateKeyParameters(d, ecDomainParameters);
        }

        public static ECPublicKeyParameters GetPublickeyFromXY(BigInteger x, BigInteger y)
        {
            return new ECPublicKeyParameters(x9ECParameters.Curve.CreatePoint(x, y), ecDomainParameters);
        }

        public static AsymmetricKeyParameter GetPublickeyFromX509File(FileInfo file)
        {

            FileStream fileStream = null;
            try
            {
                //file.DirectoryName + "\\" + file.Name
                fileStream = new FileStream(file.FullName, FileMode.Open, FileAccess.Read);
                X509Certificate certificate = new X509CertificateParser().ReadCertificate(fileStream);
                return certificate.GetPublicKey();
            }
            catch (Exception e)
            {
                //log.Error(file.Name + "读取失败，异常：" + e);
            }
            finally
            {
                if (fileStream != null)
                    fileStream.Close();
            }
            return null;
        }

        public class Sm2Cert
        {
            public AsymmetricKeyParameter privateKey;
            public AsymmetricKeyParameter publicKey;
            public String certId;
        }

        private static byte[] ToByteArray(int i)
        {
            byte[] byteArray = new byte[4];
            byteArray[0] = (byte)(i >> 24);
            byteArray[1] = (byte)((i & 0xFFFFFF) >> 16);
            byteArray[2] = (byte)((i & 0xFFFF) >> 8);
            byteArray[3] = (byte)(i & 0xFF);
            return byteArray;
        }

        /**
         * 字节数组拼接
         *
         * @param params
         * @return
         */
        private static byte[] Join(params byte[][] byteArrays)
        {
            List<byte> byteSource = new List<byte>();
            for (int i = 0; i < byteArrays.Length; i++)
            {
                byteSource.AddRange(byteArrays[i]);
            }
            byte[] data = byteSource.ToArray();
            return data;
        }

        /**
         * 密钥派生函数
         *
         * @param Z
         * @param klen
         *            生成klen字节数长度的密钥
         * @return
         */
        private static byte[] KDF(byte[] Z, int klen)
        {
            int ct = 1;
            int end = (int)Math.Ceiling(klen * 1.0 / 32);
            List<byte> byteSource = new List<byte>();
            try
            {
                for (int i = 1; i < end; i++)
                {
                    byteSource.AddRange(GmUtil.Sm3(Join(Z, ToByteArray(ct))));
                    ct++;
                }
                byte[] last = GmUtil.Sm3(Join(Z, ToByteArray(ct)));
                if (klen % 32 == 0)
                {
                    byteSource.AddRange(last);
                }
                else
                    byteSource.AddRange(Arrays.CopyOfRange(last, 0, klen % 32));
                return byteSource.ToArray();
            }
            catch (Exception e)
            {
                //log.Error("KDF error: " + e.Message, e);
            }
            return null;
        }

        public static byte[] Sm4DecryptCBC(byte[] keyBytes, byte[] cipher, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(false, new ParametersWithIV(key, iv));
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptCBC(byte[] keyBytes, byte[] plain, byte[] iv, String algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                if (iv == null) iv = ZeroIv(algo);
                c.Init(true, new ParametersWithIV(key, iv));
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptCBC error: " + e.Message, e);
                return null;
            }
        }


        public static byte[] Sm4EncryptECB(byte[] keyBytes, byte[] plain, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            //NoPadding 的情况下需要校验数据长度是16的倍数.
            if (plain.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(true, key);
                return c.DoFinal(plain);
            }
            catch (Exception e)
            {
                //log.Error("Sm4EncryptECB error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] Sm4DecryptECB(byte[] keyBytes, byte[] cipher, string algo)
        {
            if (keyBytes.Length != 16) throw new ArgumentException("err key length");
            if (cipher.Length % 16 != 0 && algo.Contains("NoPadding")) throw new ArgumentException("err data length");

            try
            {
                KeyParameter key = ParameterUtilities.CreateKeyParameter("SM4", keyBytes);
                IBufferedCipher c = CipherUtilities.GetCipher(algo);
                c.Init(false, key);
                return c.DoFinal(cipher);
            }
            catch (Exception e)
            {
                //log.Error("Sm4DecryptECB error: " + e.Message, e);
                return null;
            }
        }

        public const String SM4_ECB_NOPADDING = "SM4/ECB/NoPadding";
        public const String SM4_CBC_NOPADDING = "SM4/CBC/NoPadding";
        public const String SM4_CBC_PKCS7PADDING = "SM4/CBC/PKCS7Padding";

        /**
         * cfca官网CSP沙箱导出的sm2文件
         * @param pem 二进制原文
         * @param pwd 密码
         * @return
         */
        public static Sm2Cert readSm2File(byte[] pem, String pwd)
        {

            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {
                Asn1Sequence asn1Sequence = (Asn1Sequence)Asn1Object.FromByteArray(pem);
                //            ASN1Integer asn1Integer = (ASN1Integer) asn1Sequence.getObjectAt(0); //version=1
                Asn1Sequence priSeq = (Asn1Sequence)asn1Sequence[1];//private key
                Asn1Sequence pubSeq = (Asn1Sequence)asn1Sequence[2];//public key and x509 cert

                //            ASN1ObjectIdentifier sm2DataOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(0);
                //            ASN1ObjectIdentifier sm4AlgOid = (ASN1ObjectIdentifier) priSeq.getObjectAt(1);
                Asn1OctetString priKeyAsn1 = (Asn1OctetString)priSeq[2];
                byte[] key = KDF(System.Text.Encoding.UTF8.GetBytes(pwd), 32);
                byte[] priKeyD = Sm4DecryptCBC(Arrays.CopyOfRange(key, 16, 32),
                        priKeyAsn1.GetOctets(),
                        Arrays.CopyOfRange(key, 0, 16), SM4_CBC_PKCS7PADDING);
                sm2Cert.privateKey = GetPrivatekeyFromD(new BigInteger(1, priKeyD));
                //            log.Info(Hex.toHexString(priKeyD));

                //            ASN1ObjectIdentifier sm2DataOidPub = (ASN1ObjectIdentifier) pubSeq.getObjectAt(0);
                Asn1OctetString pubKeyX509 = (Asn1OctetString)pubSeq[1];
                X509Certificate x509 = (X509Certificate)new X509CertificateParser().ReadCertificate(pubKeyX509.GetOctets());
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("readSm2File error: " + e.Message, e);
                return null;
            }
        }

        /**
         *
         * @param cert
         * @return
         */
        public static Sm2Cert ReadSm2X509Cert(byte[] cert)
        {
            Sm2Cert sm2Cert = new Sm2Cert();
            try
            {

                X509Certificate x509 = new X509CertificateParser().ReadCertificate(cert);
                sm2Cert.publicKey = x509.GetPublicKey();
                sm2Cert.certId = x509.SerialNumber.ToString(10); //这里转10进账，有啥其他进制要求的自己改改
                return sm2Cert;
            }
            catch (Exception e)
            {
                //log.Error("ReadSm2X509Cert error: " + e.Message, e);
                return null;
            }
        }

        public static byte[] ZeroIv(String algo)
        {

            try
            {
                IBufferedCipher cipher = CipherUtilities.GetCipher(algo);
                int blockSize = cipher.GetBlockSize();
                byte[] iv = new byte[blockSize];
                Arrays.Fill(iv, (byte)0);
                return iv;
            }
            catch (Exception e)
            {
                //log.Error("ZeroIv error: " + e.Message, e);
                return null;
            }
        }

        public static void Main2(string[] s)
        {

            // 随便看看
            //log.Info("GMNamedCurves: ");
            foreach (string e in GMNamedCurves.Names)
            {
                //log.Info(e);
            }
            //log.Info("sm2p256v1 n:" + x9ECParameters.N);
            //log.Info("sm2p256v1 nHex:" + Hex.ToHexString(x9ECParameters.N.ToByteArray()));

            // 生成公私钥对 ---------------------
            AsymmetricCipherKeyPair kp = GmUtil.GenerateKeyPair();
            //log.Info("private key d: " + ((ECPrivateKeyParameters)kp.Private).D);
            //log.Info("public key q:" + ((ECPublicKeyParameters)kp.Public).Q); //{x, y, zs...}

            //签名验签
            byte[] msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            byte[] userId = System.Text.Encoding.UTF8.GetBytes("userId");
            byte[] sig = SignSm3WithSm2(msg, userId, kp.Private);
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, kp.Public));

            // 由d生成私钥 ---------------------
            BigInteger d = new BigInteger("097b5230ef27c7df0fa768289d13ad4e8a96266f0fcb8de40d5942af4293a54a", 16);
            ECPrivateKeyParameters bcecPrivateKey = GetPrivatekeyFromD(d);
            //log.Info("testGetFromD: " + bcecPrivateKey.D.ToString(16));

            //公钥X坐标PublicKeyXHex: 59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4
            //公钥Y坐标PublicKeyYHex: 9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8
            AsymmetricKeyParameter publicKey = GetPublickeyFromX509File(new FileInfo("d:/certs/69629141652.cer"));
            //log.Info(publicKey);
            AsymmetricKeyParameter publicKey1 = GetPublickeyFromXY(new BigInteger("59cf9940ea0809a97b1cbffbb3e9d96d0fe842c1335418280bfc51dd4e08a5d4", 16), new BigInteger("9a7f77c578644050e09a9adc4245d1e6eba97554bc8ffd4fe15a78f37f891ff8", 16));
            //log.Info("testReadFromX509File: " + ((ECPublicKeyParameters)publicKey).Q);
            //log.Info("testGetFromXY: " + ((ECPublicKeyParameters)publicKey1).Q);
            //log.Info("testPubKey: " + publicKey.Equals(publicKey1));
            //log.Info("testPubKey: " + ((ECPublicKeyParameters)publicKey).Q.Equals(((ECPublicKeyParameters)publicKey1).Q));

            // sm2 encrypt and decrypt test ---------------------
            AsymmetricCipherKeyPair kp2 = GenerateKeyPair();
            AsymmetricKeyParameter publicKey2 = kp2.Public;
            AsymmetricKeyParameter privateKey2 = kp2.Private;
            byte[] bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), publicKey2);
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, privateKey2);
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            // sm4 encrypt and decrypt test ---------------------
            //0123456789abcdeffedcba9876543210 + 0123456789abcdeffedcba9876543210 -> 681edf34d206965e86b3e94f536e4246
            byte[] plain = Hex.Decode("0123456789abcdeffedcba98765432100123456789abcdeffedcba98765432100123456789abcdeffedcba9876543210");
            byte[] key = Hex.Decode("0123456789abcdeffedcba9876543210");
            byte[] cipher = Hex.Decode("595298c7c6fd271f0402f804c33d3f66");
            bs = Sm4EncryptECB(key, plain, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4EncEcb: " + Hex.ToHexString(bs)); ;
            bs = Sm4DecryptECB(key, bs, GmUtil.SM4_ECB_NOPADDING);
            //log.Info("testSm4DecEcb: " + Hex.ToHexString(bs));

            //读.sm2文件
            String sm2 = "MIIDHQIBATBHBgoqgRzPVQYBBAIBBgcqgRzPVQFoBDDW5/I9kZhObxXE9Vh1CzHdZhIhxn+3byBU\nUrzmGRKbDRMgI3hJKdvpqWkM5G4LNcIwggLNBgoqgRzPVQYBBAIBBIICvTCCArkwggJdoAMCAQIC\nBRA2QSlgMAwGCCqBHM9VAYN1BQAwXDELMAkGA1UEBhMCQ04xMDAuBgNVBAoMJ0NoaW5hIEZpbmFu\nY2lhbCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEbMBkGA1UEAwwSQ0ZDQSBURVNUIFNNMiBPQ0Ex\nMB4XDTE4MTEyNjEwMTQxNVoXDTIwMTEyNjEwMTQxNVowcjELMAkGA1UEBhMCY24xEjAQBgNVBAoM\nCUNGQ0EgT0NBMTEOMAwGA1UECwwFQ1VQUkExFDASBgNVBAsMC0VudGVycHJpc2VzMSkwJwYDVQQD\nDCAwNDFAWnRlc3RAMDAwMTAwMDA6U0lHTkAwMDAwMDAwMTBZMBMGByqGSM49AgEGCCqBHM9VAYIt\nA0IABDRNKhvnjaMUShsM4MJ330WhyOwpZEHoAGfqxFGX+rcL9x069dyrmiF3+2ezwSNh1/6YqfFZ\nX9koM9zE5RG4USmjgfMwgfAwHwYDVR0jBBgwFoAUa/4Y2o9COqa4bbMuiIM6NKLBMOEwSAYDVR0g\nBEEwPzA9BghggRyG7yoBATAxMC8GCCsGAQUFBwIBFiNodHRwOi8vd3d3LmNmY2EuY29tLmNuL3Vz\nL3VzLTE0Lmh0bTA4BgNVHR8EMTAvMC2gK6AphidodHRwOi8vdWNybC5jZmNhLmNvbS5jbi9TTTIv\nY3JsNDI4NS5jcmwwCwYDVR0PBAQDAgPoMB0GA1UdDgQWBBREhx9VlDdMIdIbhAxKnGhPx8FcHDAd\nBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYBBQUHAwQwDAYIKoEcz1UBg3UFAANIADBFAiEAgWvQi3h6\niW4jgF4huuXfhWInJmTTYr2EIAdG8V4M8fYCIBixygdmfPL9szcK2pzCYmIb6CBzo5SMv50Odycc\nVfY6";
            bs = Convert.FromBase64String(sm2);
            String pwd = "cfca1234";
            GmUtil.Sm2Cert sm2Cert = GmUtil.readSm2File(bs, pwd);
            //log.Info("testReadSm2File, pubkey: " + ((ECPublicKeyParameters)sm2Cert.publicKey).Q.ToString());
            //log.Info("testReadSm2File, prikey: " + Hex.ToHexString(((ECPrivateKeyParameters)sm2Cert.privateKey).D.ToByteArray()));
            //log.Info("testReadSm2File, certId: " + sm2Cert.certId);

            bs = Sm2Encrypt(System.Text.Encoding.UTF8.GetBytes("s"), ((ECPublicKeyParameters)sm2Cert.publicKey));
            //log.Info("testSm2Enc dec: " + Hex.ToHexString(bs));
            bs = Sm2Decrypt(bs, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSm2Enc dec: " + System.Text.Encoding.UTF8.GetString(bs));

            msg = System.Text.Encoding.UTF8.GetBytes("message digest");
            userId = System.Text.Encoding.UTF8.GetBytes("userId");
            sig = SignSm3WithSm2(msg, userId, ((ECPrivateKeyParameters)sm2Cert.privateKey));
            //log.Info("testSignSm3WithSm2: " + Hex.ToHexString(sig));
            //log.Info("testVerifySm3WithSm2: " + VerifySm3WithSm2(msg, userId, sig, ((ECPublicKeyParameters)sm2Cert.publicKey)));
        }

    }
}
```

.NET调用DEMO：

```c#
// See https://aka.ms/new-console-template for more information
using CommonUtils;
using Org.BouncyCastle.Utilities.Encoders;
using System.Text;

Console.WriteLine("Hello, World!");


try
{
    String content = "1234泰酷拉";
    String key = "9814548961710661";
    byte[] byteKey = Encoding.UTF8.GetBytes(key);
    string algo = "SM4/ECB/PKCS7Padding";
    byte[] sourceData = Encoding.UTF8.GetBytes(content);
    byte[] encryptedData = GmUtil.Sm4EncryptECB(byteKey, sourceData, algo);
    string encryptedStr=BitConverter.ToString(encryptedData).Replace("-","").ToLower();
    Console.WriteLine("encryptedStr:" + encryptedStr);

    string javaEncryptedStr = "02d225c9ff6bb99be6a67421aae4f3aa";
    Console.WriteLine("JAVA程序加密后的串:" + javaEncryptedStr);
    byte[] byJavaEncrypted=Hex.Decode(javaEncryptedStr);
    byte[] decryptedData = GmUtil.Sm4DecryptECB(byteKey, byJavaEncrypted, algo);
    string sm4DecryptedStr = Encoding.UTF8.GetString(decryptedData);
    Console.WriteLine("解密结果:" + sm4DecryptedStr);
}
catch (Exception ex)
{

    Console.WriteLine("ex:"+ ex.Message);
}

Console.ReadKey();
```

JAVA代码：

maven需要增加依赖：

```xml
<dependency>
      <groupId>cn.hutool</groupId>
      <artifactId>hutool-all</artifactId>
      <version>5.8.1</version>
    </dependency>

    <dependency>
      <groupId>org.bouncycastle</groupId>
      <artifactId>bcprov-jdk15on</artifactId>
      <version>1.70</version>
    </dependency>
```

Sm4Util 工具类：

```java
package org.example;

import cn.hutool.crypto.symmetric.SymmetricCrypto;

public class Sm4Util {

    //加密为16进制，也可以加密成base64/字节数组
    public static String encryptSm4ECB(String key,String plaintext) {
        String _Sm4EcbNoPaddingAlg ="SM4/ECB/PKCS5Padding";
        SymmetricCrypto sm4 = new SymmetricCrypto(_Sm4EcbNoPaddingAlg, key.getBytes());
        return sm4.encryptHex(plaintext);
    }

    //解密
    public static String decryptSm4ECB(String key,String ciphertext) {
        String _Sm4EcbNoPaddingAlg ="SM4/ECB/PKCS5Padding";
        SymmetricCrypto sm4 = new SymmetricCrypto(_Sm4EcbNoPaddingAlg, key.getBytes());
        return sm4.decryptStr(ciphertext);
    }
}
```

JAVA调用DEMO：

```java
package org.example;

public class App 
{
    public static void main( String[] args )
    {
        System.out.println( "Hello World!" );
        try {

            String key = "9814548961710661";
            String content = "1234泰酷拉";
            System.out.println( "待加密字符串：" + content);
            String plain = Sm4Util.encryptSm4ECB(key,content);
            System.out.println( "加密后：" + plain);
            String cipher = Sm4Util.decryptSm4ECB(key,plain);
            System.out.println( "解密后：" + cipher);

        } catch (Exception ex) {
            String    msg = ex.getMessage();
            System.out.println( "解密后：" + msg);
        }
    }
}
```



## 参考资料

本文内容来自博客园：https://www.cnblogs.com/runliuv/category/2089854.html
感谢老哥runliuv的分享，我只是拿来学习使用