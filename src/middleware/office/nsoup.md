---
title: NSoup
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: nsoup
slug: vgns7g
docsId: '67741047'
---

## 概述
操作html的工具

## 操作

### 获取文本
```csharp
var nsoup = NSoup.NSoupClient.Parse(htmltxt);
var str = nsoup.Text();
```

### 字符串操作
通过NSoup.Standard组件来实现将html格式的字符串转html，然后可以使用html的方法操作字符串。

使用场景

- 循环所有元素，对执行元素执行匿名化
- 获取指定标签内容
```csharp
/// <summary>
/// 获取Html字符串中指定标签的指定属性的值
/// </summary>
/// <param name="html">Html字符</param>
/// <param name="tag">指定标签名</param>
/// <param name="attr">指定属性名</param>
/// <returns></returns>
public List<string> GetHtmlAttr(string html, string tag, string attr)
{
    Regex re = new("(<" + tag + @"[\w\W].+?>)");
    var imgreg = re.Matches(html);
    var m_Attributes = new List<string>();
    Regex attrReg = new(@"([a-zA-Z1-9_-]+)\s*=\s*(\x27|\x22)([^\x27\x22]*)(\x27|\x22)", RegexOptions.IgnoreCase);

    for (int i = 0; i < imgreg.Count; i++)
    {
        MatchCollection matchs = attrReg.Matches(imgreg[i].ToString());
        for (int j = 0; j < matchs.Count; j++)
        {
            GroupCollection groups = matchs[j].Groups;

            if (string.Equals(attr, groups[1].Value, StringComparison.CurrentCultureIgnoreCase))
            {
                m_Attributes.Add(groups[3].Value);
                break;
            }
        }
    }

    return m_Attributes;
}
```
