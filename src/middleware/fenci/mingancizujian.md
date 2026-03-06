---
title: 敏感词组件
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: mingancizujian
slug: avllbk
docsId: '45236132'
---

## 概述
现如今大部分服务都会有用户输入，为了服务的正常运行，很多时候不得不针对输入进行敏感词的检测、替换。如果人工做这样的工作，不仅效率低，成本也高。所以，先让代码去处理输入，成为了经济方便的途径。

## ToolGood.Words
首先我们要使用的开源组件是 [ToolGood.Words](https://github.com/toolgood/ToolGood.Words)
![](/common/1620891320700-cdaee58d-cfff-4bb2-b590-2f1823c5e595.png)
通过简单的了解，我们可以知道它可以针对敏感词及其拼音、跳词等变形进行检测，在实际的应用场景中能满足大部分的需求。
具体的用法在这里不做过多的介绍，接下来我们需要做的事情是如何在现有代码中快速且方便的情况下接入敏感词组件。很显然，如果我们按照组件写的示例去操作，会发现需要在现有的代码中进行大量重构的操作，这显然会累垮 VS 。熟悉我的朋友首先就会想到使用 AOP 的方式去优化处理。（这里不过多介绍AOP，如果想了解更多，请移步 [C## 中使用面向切面编程（AOP）中实践代码整洁](https://www.cnblogs.com/chenug/p/9848852.html) )

### ValidationAttribute
我们先定义两个简单的模型来绑定输入参数，一个是只要输入含有敏感词就会报错，一个是只要输入含有敏感词就会把相关的字符串替换为 * ，代码如下：
```csharp
public class MinganCheckInput
    {
        [MinGanCheck]
        public string Text { get; set; }
    }
    
    public class MinganReplaceInput
    {
        [MinGanReplace]
        public string Text { get; set; }
    }
```
其中 `[MinGanCheck]` 和 `[MinGanReplace]` 是我们定义的特性标记，将其继承 [ValidationAttribute](https://docs.microsoft.com/zh-cn/dotnet/api/system.componentmodel.dataannotations.validationattribute?view=net-5.0)，就和我们常用的 `[Required]` 一样方便，哪里敏感点哪里。
```csharp
/// <summary>
    /// 敏感词检查的特性，一匹配就抛异常
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class MinGanCheck : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            throw  new NotImplementedException();
        }
    }
    /// <summary>
    /// 敏感词替换
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public class MinGanReplace : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            return ValidationResult.Success;
        }
    }
```
接下来就是实现 ValidationAttribute 的功能，如果看过我写过的 aop 文章，这时候就不会直接在校验的方法中直接引入 `ToolGood.Words` ，这样会带来很大的耦合，也不便于我们替换为其他的敏感词组件或服务。所以我们只要再多一层抽象就可以了。
```csharp
// 检查
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            return validationContext.GetService<IMinGanCheckValidator>().IsValid(value, validationContext);
        }
        // 替换
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            validationContext.GetService<IMinGanReplaceValidator>().IsValid(value, validationContext);
            return ValidationResult.Success;
        }
```
接着我们分别实现 `IMinGanCheckValidator` 和 `IMinGanReplaceValidator` 的功能，也即检查和替换功能。
```csharp
// 检查
   public class MinGanCheckValidator : IMinGanCheckValidator
    {
        public ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is string v)
            {
                if (!String.IsNullOrEmpty(v))
                {
                   // 文字检查
                    if (MinGanProvider.Instance.IllegalWordsSearch.ContainsAny(v))
                    {
                        return new ValidationResult("存在敏感词", new[] { validationContext.MemberName });
                    }
                    // 检查拼音
                    if (MinGanProvider.Instance.IllegalWordsSearch.ContainsAny(WordsHelper.GetPinyin(v)))
                    {
                        return new ValidationResult("存在敏感词",new []{ validationContext.MemberName });
                    }
                    // todo:其他变种
                }
            }
            return ValidationResult.Success;
        }
    }
//替换
 public class MinGanReplaceValidator : IMinGanReplaceValidator
    {
        public void Replace(object value, ValidationContext validationContext)
        {
            if (value is string v)
            {
                if (!String.IsNullOrEmpty(v))
                {
                    v = MinGanProvider.Instance.IllegalWordsSearch.Replace(v);
                    SetPropertyByName(validationContext.ObjectInstance,validationContext.MemberName, v);
                }
            }
        }
        
        static bool SetPropertyByName(Object obj, string name, Object value)
        {
            var type = obj.GetType();
            var prop = type.GetProperty(name, BindingFlags.Public | BindingFlags.Instance);
            if (null == prop || !prop.CanWrite) return false;
            prop.SetValue(obj, value, null);
            return true;
        }
    }
```
其中 `MinGanProvider.Instance.IllegalWordsSearch` 是 `ToolGood.Words` 中的检测类单例，这里不详细展开。这样我们就有一个大概能用的敏感词检测组件了，然而在实际过程中，我们还需要对敏感词进行管理，特别是需要实时更新敏感词。

### 敏感词热重载
以 json 配置文件存放敏感词为例，只需要配置热重载就行了。
首先是 `Program.cs` 文件中让 json 配置文件热重载。
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    config.AddJsonFile("IllegalKeywords.json", optional: false, reloadOnChange: true);// 配置可热重载
                })
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
```
最后是在 `Startup.cs` 中文件处理重载事件。
```csharp
ChangeToken.OnChange(() => Configuration.GetReloadToken(), () =>
            {
                // 敏感词重载
            var keys= Configuration.GetSection("IllegalKeywords").Get<List<string>>();
            if (keys!=null&&keys.Any())
            {
                var allKeys = new List<string>();
                foreach (var k in keys)
                {
                    allKeys.Add(k); // 增加词汇
                    allKeys.Add(WordsHelper.ToTraditionalChinese(k)); // 增加繁体
                    allKeys.Add(WordsHelper.GetPinyin(k)); // 增加拼音
                }
                IllegalWordsSearch.SetKeywords(allKeys);
            }
            });
```

### 效果
![](/common/1620891320662-0266f70c-87a8-4c05-9138-e498f773017b.png)
![](/common/1620891320658-04447a86-2dd4-477e-b67c-37e5368b37aa.png)

## 参考文档
> 作者：[**张蘅水**](http://www.cnblogs.com/chenug)
> [https://www.cnblogs.com/chenug/p/ToolGood_Words_Sample.html](https://www.cnblogs.com/chenug/p/ToolGood_Words_Sample.html)

