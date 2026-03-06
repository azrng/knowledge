---
title: 数据绑定
lang: zh-CN
date: 2023-02-02
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - 无
filename: shujubangding
slug: xiwwks
docsId: '67652730'
---

## 介绍
在 Razor 组件中，可以将 HTML 元素数据绑定到 C## 字段、属性和 Razor 表达式值。 数据绑定支持在 HTML 和 Microsoft .NET 之间进行双向同步。
呈现组件时，数据从 HTML 推送到 .NET。 组件在事件处理程序代码执行后呈现自身，这就是为什么在触发事件处理程序后，属性更新会立即反映在 UI 中。
可使用 @bind 标记将 C## 变量绑定到 HTML 对象。 按名称将 C## 变量定义为 HTML 中的字符串。

## 操作

### Bind
@bind 指令非常智能，并且了解它所使用的控件。 例如，在将值绑定到文本框 `<input>`时，它将绑定 value 属性。 HTML 复选框 `<input>` 具有 checked 属性，而不是 value 属性。 @bind 属性将自动改用此 checked 属性。 默认情况下，该控件绑定到 DOM onchange 事件。 例如，请考虑以下页面：
```csharp
@page "/"

<h1>My favorite pizza is: @favPizza</h1>

<p>
    Enter your favorite pizza:
    <input @bind="favPizza" />
</p>

@code {
    private string favPizza { get; set; } = "Margherita"
}
```
呈现该页时，默认值 Margherita 将同时显示在 `<h1>` 元素和文本框中。 在文本框中输入最喜欢的新披萨时，除非离开文本框或选择 Enter 键，否则 `<h1>` 元素不会发生更改，因为那时才会触发 onchange DOM 事件。

如果想将在文本框输入任何内容的时候立即更新，可以通过绑定到 oninput DOM 事件来实现这一结果。 若要绑定到此事件，必须使用 @bind-value 和 @bind-value:event 指令：
```csharp
@page "/"

<h1>My favorite pizza is: @favPizza</h1>

<p>
    Enter your favorite pizza:
    <input @bind-value="favPizza" @bind-value:event="oninput" />
</p>

@code {
    private string favPizza { get; set; } = "Margherita"
}
```

### 设置绑定值的格式
```csharp
@page "/ukbirthdaypizza"

<h1>Order a pizza for your birthday!</h1>

<p>
    Enter your birth date:
    <input @bind="birthdate" @bind:format="dd-MM-yyyy" />
</p>

@code {
    private DateTime birthdate { get; set; } = new(2000, 1, 1);
}
```
可以编写 C## 代码来设置绑定值的格式，作为使用 @bind:format 指令的一种替代方法。 在成员定义中使用 get 和 set 访问器，如以下示例所示：
```csharp
@page "/pizzaapproval"
@using System.Globalization

<h1>Pizza: @PizzaName</h1>

<p>Approval rating: @approvalRating</p>

<p>
    <label>
        Set a new approval rating:
        <input @bind="ApprovalRating" />
    </label>
</p>

@code {
    private decimal approvalRating = 1.0;
    private NumberStyles style = NumberStyles.AllowDecimalPoint | NumberStyles.AllowLeadingSign;
    private CultureInfo culture = CultureInfo.CreateSpecificCulture("en-US");
    
    private string ApprovalRating
    {
        get => approvalRating.ToString("0.000", culture);
        set
        {
            if (Decimal.TryParse(value, style, culture, out var number))
            {
                approvalRating = Math.Round(number, 3);
            }
        }
    }
}
```
