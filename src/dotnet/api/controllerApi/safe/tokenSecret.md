---
title: 后台接口-Token+参数签名
lang: zh-CN
date: 2022-09-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: houtaijiekou-token+canshuqianming
slug: cnizm2
docsId: '30017721'
---
原理:

### 1.认证服务
做一个认证服务，提供一个认证的webapi，用法先访问它获取对应的token（比如说利用传过去的id去生成了一个token，然后可以把这个token去存储到HttpRuntime.Cache缓存中，然后去请求接口的时候，去这个里获取token，如果不同或者找不到说明失败）
例子：
```csharp
 //插入缓存
            Tokens token = (Tokens)HttpRuntime.Cache.Get(id.ToString());
            if (HttpRuntime.Cache.Get(id.ToString()) == null)
            {
                token = new Tokens();
                token.StaffId = ID;
                token.SignToken = Guid.NewGuid();
                token.ExpireTime = DateTime.Now.AddDays(1);
                HttpRuntime.Cache.Insert(token.StaffId.ToString(), token, null, token.ExpireTime, TimeSpan.Zero);
            }

```

### 2.计算签名
用户拿着相应的token以及请求的参数和服务器提供的签名算法计算出签名后再去访问指定的api。

### 3.签名比对
服务器每次收到请求就去获取对应用户的token和请求参数，服务器再次计算签名和客户端签名进行比对，如果验证通过则正常访问相应的api，验证失败则返回具体的失败信息。

#### 3.1 get请求
按照请求参数名称将所有请求参数按照字母先后顺序排序得到：keyvaluekeyvalue...keyvalue  字符串如：将arong=1,mrong=2,crong=3 排序为：arong=1, crong=3,mrong=2  然后将参数名和参数值进行拼接得到参数字符串：arong1crong3mrong2。
```csharp
public static Tuple<string,string> GetQueryString(Dictionary<string, string> parames)
        {
            // 第一步：把字典按Key的字母顺序排序
            IDictionary<string, string> sortedParams = new SortedDictionary<string, string>(parames);
            IEnumerator<KeyValuePair<string, string>> dem = sortedParams.GetEnumerator();

            // 第二步：把所有参数名和参数值串在一起
            StringBuilder query = new StringBuilder("");  //签名字符串
            StringBuilder queryStr = new StringBuilder(""); //url参数
            if (parames == null || parames.Count == 0)
                return new Tuple<string,string>("","");

            while (dem.MoveNext())
            {
                string key = dem.Current.Key;
                string value = dem.Current.Value;
                if (!string.IsNullOrEmpty(key))
                {
                    query.Append(key).Append(value);
                    queryStr.Append("&").Append(key).Append("=").Append(value);
                }
            }

            return new Tuple<string, string>(query.ToString(), queryStr.ToString().Substring(1, queryStr.Length - 1));
        }
```

#### 3.2 post请求
将请求的参数对象序列化为json格式字符串
Product product = new Product() { Id = 1, Name = "安慕希", Count = 10, Price = 58.8 };
var data=JsonConvert.SerializeObject(product);

#### 3.3 请求头
在请求头中添加timespan（时间戳），nonce（随机数），staffId（用户Id），signature（签名参数）
```csharp
 //加入头信息
            request.Headers.Add("staffid", staffId.ToString()); //当前请求用户StaffId
            request.Headers.Add("timestamp", timeStamp); //发起请求时的时间戳（单位：毫秒）
            request.Headers.Add("nonce", nonce); //发起请求时的随机数            
			request.Headers.Add("signature", GetSignature(timeStamp,nonce,staffId,data)); //当前请求内容的数字签名
```

#### 3.4 计算签名
根据请求参数计算本次请求的签名，用timespan+nonc+staffId+token+data（请求参数字符串）得到signStr签名字符串，然后再进行排序和MD5加密得到最终的signature签名字符串，添加到请求头中
```csharp
private static string GetSignature(string timeStamp,string nonce,int staffId,string data)
        {
            token自己获取
            var hash = System.Security.Cryptography.MD5.Create();
            //拼接签名数据
            var signStr = timeStamp +nonce+ staffId + token+ data;
            //将字符串中字符按升序排序
            var sortStr = string.Concat(signStr.OrderBy(c => c));
            var bytes = Encoding.UTF8.GetBytes(sortStr);
            //使用MD5加密
            var md5Val = hash.ComputeHash(bytes);
            //把二进制转化为大写的十六进制
            StringBuilder result = new StringBuilder();
            foreach (var c in md5Val)
            {
                result.Append(c.ToString("X2"));
            }
            return result.ToString().ToUpper();
        }
        /// <summary>
        /// 获取时间戳
        /// </summary>
        /// <returns></returns>
        private static string GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalMilliseconds).ToString();
        }
        /// <summary>
        ///获取随机数  
        /// </summary>
        /// <returns></returns>
        private static string GetRandom()
        {
            Random rd = new Random(DateTime.Now.Millisecond);
            int i = rd.Next(0, int.MaxValue);
            return i.ToString();
        }
```

## 参数签名
**参数签名如何生成？作用是什么？**
参数签名sign：为了提高传参过程中，防止参数被恶意修改，在请求接口的时候加上sign可以有效防止参数被篡改，那么sign是如何起作用的呢？
看看它的生成方法就明白了
比如有这样一个接口http:127.0.0.1/api/product?&type=zl&p1=value1&p2=value2&p3=&sign=signValue
第一步：拼接参数字符串，除去sign参数本身和为空值的p3，那么剩下的就是字符串type=zl&p1=value1&p2=value2,然后按参数名字符升（降）序，得到字符串
p1=value1&p2=value2&type=zl
第二步：然后做参数名和值的拼接，得到字符串p1value1p2value2type=zl,注意编码，不能出现这种&quot; ,要转码后拼接
第三步：将字符串进行DES加密，假设p1value1p2value2type=zl进行des加密后的结果是abc123，最终得到的字符串abc123就是参数sign的值signValue
第四步：在接口中我们会接收到参数名sign的参数值abc123，然后解密得到字符串p1value1p2value2type=zl，再与接口中参数拼接排序后进行比较，如果不一样则说明参数的循序不一样，参数的值就一定是被修改过了。
总结：
1.接口的调用方和接口的提供方统一约定参数加密算法
2.参数签名就是对参数key ，value的一个记录。参数如果被修改肯定对不上参数签名，就不会调用请求

```csharp
public static Tuple<string,string> GetQueryString(Dictionary<string, string> parames)
        {
            // 第一步：把字典按Key的字母顺序排序
            IDictionary<string, string> sortedParams = new SortedDictionary<string, string>(parames);
            IEnumerator<KeyValuePair<string, string>> dem = sortedParams.GetEnumerator();

            // 第二步：把所有参数名和参数值串在一起
            StringBuilder query = new StringBuilder("");  //签名字符串
            StringBuilder queryStr = new StringBuilder(""); //url参数
            if (parames == null || parames.Count == 0)
                return new Tuple<string,string>("","");

            while (dem.MoveNext())
            {
                string key = dem.Current.Key;
                string value = dem.Current.Value;
                if (!string.IsNullOrEmpty(key))
                {
                    query.Append(key).Append(value);
                    queryStr.Append("&").Append(key).Append("=").Append(value);
                }
            }

            return new Tuple<string, string>(query.ToString(), queryStr.ToString().Substring(1, queryStr.Length - 1));
        }
```
