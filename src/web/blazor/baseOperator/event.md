---
title: 事件
lang: zh-CN
date: 2023-02-02
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - 无
filename: shijian
slug: dzmxhl
docsId: '67651117'
---
## 代码隐藏

在页面包含复杂的逻辑时候，可以添加一个该页面文件名的cs文件类来单独存储应用的逻辑，这个方法叫做代码隐藏。


页面初始化后触发的事件
```bash
protected override async Task OnInitializedAsync()
{
    \\ Call the service here
}
```

## 处理事件

按钮事件  点击一次数量+1

```csharp
@page "/counter"

<h1>Counter</h1>

<p>Current count: @currentCount</p>

<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>

@code {
    private int currentCount = 0;

    private void IncrementCount()
    {
        currentCount++;
    }
}
```

方法可以接收参数EventArgs ，比如想实现按住ctrl的时候并点击，这个时候写法应该是

```csharp
@page "/counter"

<h1>Counter</h1>

<p>Current count: @currentCount</p>

<button class="btn btn-primary" @onclick="IncrementCount">Click me</button>


@code {
    private int currentCount = 0;

    private void IncrementCount(MouseEventArgs e)
    {
        if (e.CtrlKey) // Ctrl key pressed as well
        {
            currentCount += 5;
        }
        else
        {
            currentCount++;
        }
    }
}
```

## 将焦点设置为DOM元素

在下面的示例中，`<button>` 元素的 `@onclick` 事件处理程序将焦点设置到 `<input>` 元素。 input 元素的 `@onfocus` 事件处理程序在元素获得焦点时显示消息“已接收到焦点”。 input 元素是通过代码中的 `InputField` 变量引用的

```
<button class="btn btn-primary" @onclick="ChangeFocus">Click me to change focus</button>
<input @ref=InputField @onfocus="HandleFocus" value="@data"/>

@code {
    private ElementReference InputField;
    private string data;

    private async Task ChangeFocus()
    {
        await InputField.FocusAsync();
    }

    private async Task HandleFocus()
    {
        data = "Received focus";
    }	
```

## 内联事件处理程序

如果你有一个不需要在页面或组件中的其他位置重用的简单事件处理程序，则 Lambda 表达式非常有用

```csharp
@page "/counter"

<h1>Counter</h1>

<p>Current count: @currentCount</p>

<button class="btn btn-primary" @onclick="() => currentCount++">Click me</button>

@code {
    private int currentCount = 0;
}
```

如需为事件处理方法提供其他参数，此方法也很有用。 在下面的示例中，方法 `HandleClick` 以与普通单击事件处理程序相同的方式采用 `MouseEventArgs` 参数，但它也接受字符串参数。 该方法照常处理单击事件，但还会在用户按下 Ctrl 键时显示消息。 Lambda 表达式调用 `HandleCLick` 方法，并传入 `MouseEventArgs` 参数 (`mouseEvent`) 和字符串

```csharp
@page "/counter"
@inject IJSRuntime JS

<h1>Counter</h1>

<p id="currentCount">Current count: @currentCount</p>

<button class="btn btn-primary" @onclick='mouseEvent => HandleClick(mouseEvent, "Hello")'>Click me</button>

@code {
    private int currentCount = 0;

    private async Task HandleClick(MouseEventArgs e, string msg)
    {
        if (e.CtrlKey) // Ctrl key pressed as well
        {
            await JS.InvokeVoidAsync("alert", msg);
            currentCount += 5;
        }
        else
        {
            currentCount++;
        }
    }
}
```

## 替代事件的默认Dom操作

多个 DOM 事件具有在事件发生时运行的默认操作，而无论是否有可用于该事件的事件处理程序。 例如，input 元素的 `@onkeypress` 事件始终显示与用户按下的键对应的字符，并处理按键操作。 在示例中，`@onkeypress` 事件用于将用户的输入转换为大写。 此外，如果用户键入 `@` 字符，事件处理程序将显示警报：

```html
<input value=@data @onkeypress="ProcessKeyPress"/>

@code {
    private string data;

    private async Task ProcessKeyPress(KeyboardEventArgs e)
    {
        if (e.Key == "@")
        {
            await JS.InvokeVoidAsync("alert", "You pressed @");
        }
        else
        {
            data += e.Key.ToUpper();
        }
    }
}
```

如果要禁止该字符出现在输入框中，可以使用事件的 `preventDefault` 属性替代默认操作，如下所示：

```
<input value=@data @onkeypress="ProcessKeyPress" @onkeypress:preventDefault />
```

## 阻止冒泡

DOM 中子元素中的某些事件可以触发其父元素中的事件。 在下面的示例中，`<div>` 元素包含 `@onclick` 事件处理程序。 div 中的 button 有其自己的 `@onclick` 事件处理程序。 此外，div 包含 input 元素：

```
<div @onclick="HandleDivClick">
    <button class="btn btn-primary" @onclick="IncrementCount">Click me</button>
    <input value=@data @onkeypress="ProcessKeyPress" @onkeypress:preventDefault />
</div>

@code {
    private async Task HandleDivClick()
    {
        await JS.InvokeVoidAsync("alert", "Div click");
    }

    private async Task ProcessKeyPress(KeyboardEventArgs e)
    {
        // Omitted for brevity
    }

    private int currentCount = 0;

    private void IncrementCount(MouseEventArgs e)
    {
        // Omitted for brevity
    }
}
```

当应用运行时，如果用户在 div 元素占据的区域中单击了任何元素（或空白区域），`HandleDivClick` 方法将运行并显示一条消息。 如果用户选择了 `Click me` 按钮，`IncrementCount` 方法将运行，然后 `HandleDivClick` 运行；`@onclick` 事件沿 DOM 树向上传播。 如果 div 是另一个也处理 `@onclick` 事件的元素的一部分，那么该事件处理程序也将运行到 DOM 树的根部等。 可以使用事件的 `stopPropagation` 属性来减少此类向上激增的事件，如下所示：

```
<div @onclick="HandleDivClick">
    <button class="btn btn-primary" @onclick="IncrementCount" @onclick:stopPropagation>Click me</button>
    <!-- Omitted for brevity -->
</div>
```

## EventCallback 处理跨组件的事件

一个 Blazor 页面可包含一个或多个 Blazor 组件，并且组件可以嵌套在父子关系中。 子组件中的事件可使用 `EventCallback` 触发父组件中的事件处理程序方法。 回调将引用父组件中的方法。 子组件可以通过调用回调来运行该方法。 此机制类似于使用 `delegate` 来引用 C# 应用程序中的方法。

回调可采用单个参数。 `EventCallback` 是泛型类型。 类型形参指定传递给回调的实参类型。

例如，请考虑以下情形。 你想创建一个名为 `TextDisplay` 的组件，用户可通过该组件输入一个输入字符串并以某种方式转换该字符串；你可能想要将该字符串转换为大写、小写、大小写混合、筛选其中的字符或执行某种其他类型的转换。 但是，当你为 `TextDisplay` 组件编写代码时，并不知道转换过程，而是希望将此操作推迟到另一个组件中。 以下代码显示了 `TextDisplay` 组件。 它以 input 元素的形式提供输入字符串，使用户能够输入文本值。

```
@* TextDisplay component *@
@using WebApplication.Data;

<p>Enter text:</p>
<input @onkeypress="HandleKeyPress" value="@data" />

@code {
    [Parameter]
    public EventCallback<KeyTransformation> OnKeyPressCallback { get; set; }

    private string data;

    private async Task HandleKeyPress(KeyboardEventArgs e)
    {
        KeyTransformation t = new KeyTransformation() { Key = e.Key };
        await OnKeyPressCallback.InvokeAsync(t);
        data += t.TransformedKey;
    }
}
```

`TextDisplay` 组件使用名为 `OnKeyPressCallback` 的 `EventCallback` 对象。 `HandleKeypress` 方法中的代码调用回调。 每当按下某个键时，`@onkeypress` 事件处理程序都会运行并调用 `HandleKeypress` 方法。 `HandleKeypress` 方法使用用户按下的键创建一个 `KeyTransformation` 对象，并将该对象作为参数传递给回调。 `KeyTransformation` 类型是一个包含两个字段的简单类：

```
namespace WebApplication.Data
{
    public class KeyTransformation
    {
        public string Key { get; set; }
        public string TransformedKey { get; set; }
    }
}
```

`key` 字段包含用户输入的值，而 `TransformedKey` 字段将保存被处理后的键的转换值。

在此示例中，`EventCallback` 对象是一个组件参数，该参数的值是在创建组件时提供的。 此操作由名为 `TextTransformer` 的另一个组件执行：

```
@page "/texttransformer"
@using WebApplication.Data;

<h1>Text Transformer - Parent</h1>

<TextDisplay OnKeypressCallback="@TransformText" />

@code {
    private void TransformText(KeyTransformation k)
    {
        k.TransformedKey = k.Key.ToUpper();
    }
}
```

`TextTransformer` 组件是一个用于创建 `TextDisplay` 组件实例的 Blazor 页面。 它使用对页面代码部分中的 `TransformText` 方法的引用填充 `OnKeypressCallback` 参数。 `TransformText` 方法将提供的 `KeyTransformation` 对象作为其参数，并用转换为大写的 `Key` 属性中的值来填充 `TransformedKey` 属性。 下图说明了当用户在 `TextTransformer` 页面显示的 `TextDisplay` 组件的 `<input> `字段中输入值时的控制流

此方法的优点在于，可以将 `TextDisplay` 组件用于为 `OnKeypressCallback` 参数提供回调的任何页面。 显示和处理之间完全分离。 可以为与 `TextDisplay` 组件中的 `EventCallback` 参数的签名匹配的任何其他回调切换 `TransformText` 方法。

如果使用适当的 `EventArgs` 参数键入回调，则可以将回调直接连接到事件处理程序，而无需使用中间方法。 例如，子组件可能会引用一个回调，该回调可以处理 `@onclick` 等鼠标事件，如下所示：

```
<button @onclick="OnClickCallback">
    Click me!
</button>

@code {
    [Parameter]
    public EventCallback<MouseEventArgs> OnClickCallback { get; set; }
}
```

