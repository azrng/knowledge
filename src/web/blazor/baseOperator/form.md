---
title: 表单
lang: zh-CN
date: 2023-12-12
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
  - web
tag:
  - blazor
  - form
---

## EditForm

`EditForm` 是一个 Blazor 组件，它在 Blazor 页面上履行 HTML 表单这一角色。 EditForm 和 HTML 表单之间的主要区别是：

- **数据绑定**：可将对象与 EditForm 关联。 EditForm 的作用类似于用于数据输入和显示的对象视图。
- **验证**：`EditForm` 提供了广泛且可扩展的验证功能。 可以向指定验证规则的 `EditForm` 中的元素添加属性。 `EditForm` 将自动应用这些规则。 
- **表单提交**：HTML 表单将在提交后向表单处理程序发送一个发布请求。 该表单处理程序应会执行提交过程，然后显示任何结果。 `EditForm` 遵循 Blazor 事件模型；请指定捕获 `OnSubmit` 事件的 C# 事件处理程序。 事件处理程序执行提交逻辑。
- **输入元素**：HTML 表单使用 `<input>` 控件收集用户输入，并使用 `submit` 按钮发布表单以供处理。 `EditForm` 可以使用这些相同的元素，但 Blazor 提供了具有其他功能（例如内置验证和数据绑定）的输入组件库。

### 输入控件

HTML `<form>` 元素支持 `<input>` 元素，以便用户能够输入数据。 `<input>` 有一个 `type` 属性，用于指定输入的类型及其显示方式（作为数字、文本框、单选按钮、复选框、按钮等）。

Blazor 拥有自己的一组组件，旨在专用于 `<EditForm>` 元素并支持其他功能中的数据绑定。 下表列出了这些组件。 当 Blazor 呈现包含这些组件的页面时，它们将转换为表中列出的相应 HTML `<input>` 元素。 一些 Blazor 组件是通用的；类型参数由 Blazor 运行时根据绑定到元素的数据类型确定：

| 输入组件                  | 呈现为 (HTML)             |
| :------------------------ | :------------------------ |
| `InputCheckbox`           | `<input type="checkbox">` |
| `InputDate<TValue>`       | `<input type="date">`     |
| `InputFile`               | `<input type="file">`     |
| `InputNumber<TValue>`     | `<input type="number">`   |
| `InputRadio<TValue>`      | `<input type="radio">`    |
| `InputRadioGroup<TValue>` | 一组子单选按钮            |
| `InputSelect<TValue>`     | `<select>`                |
| `InputText`               | `<input>`                 |
| `InputTextArea`           | `<textarea>`              |

这些元素中的每一个都具有由 Blazor 识别的属性，例如 `DisplayName`（用于将输入元素与标签关联）和 `@ref`（可用于保存对 C# 变量中字段的引用）。 任何无法识别的非 Blazor 属性都将按原样传递给 HTML 呈现器。 这意味着可以利用 HTML 输入元素属性。 例如，可以将 `min`、`max` 和 `step` 属性添加到 `InputNumber` 组件，它们将作为所呈现的 `<input type="number">` 元素一部分正常运行。 比如可以将 `TemperatureC` 输入域指定为：

```html
<EditForm Model=@currentForecast>
    <InputNumber @bind-Value=currentForecast.TemperatureC width="5" min="-100" step="5"></InputNumber>
</EditForm>
```

### 窗体提交

Blazor 支持两种类型的验证：声明性和编程性。 声明性验证规则在客户端上和浏览器中运行。 对于在数据传输到服务器之前执行基本的客户端验证，它们会非常有用。 对于处理声明性验证无法实现的复杂场景，服务器端验证非常有用，例如针对来自其他源的数据交叉检查字段中的数据。 实际的应用程序应结合使用客户端验证和服务器端验证；客户端验证可捕获基本的用户输入错误，并防止将无效数据发送到服务器以进行处理等许多情况。 服务器端验证可确保用于保存数据的用户请求不会试图绕过数据验证并存储不完整或损坏的数据。



`EditForm` 具有三个在提交后运行的事件：

- `OnValidSubmit`：如果输入域成功通过其验证属性定义的验证规则，则会触发此事件。
- `OnInvalidSubmit`：如果表单上的任何输入域都未能通过其验证属性定义的验证，则会触发此事件。
- `OnSubmit`：无论所有输入域是否有效，提交 EditForm 时都会发生此事件。

对于在单个输入域级别实现基本验证的 EditForm，`OnValidSubmit` 和 `OnInvalidSubmit` 事件很有用。 如果验证要求更复杂，例如将一个输入域与另一个输入域进行交叉检查以确保值的有效组合，请考虑使用 `OnSubmit` 事件。 `EditForm` 可以处理 `OnValidSubmit` 和 `OnInvalidSubmit` 事件对，也可以处理 `OnSubmit` 事件，但不能同时处理全部三个事件。 通过向 `EditForm` 添加一个 `Submit` 按钮来触发提交。 当用户选择此按钮时，将触发由 `EditForm` 指定的提交事件

```c#
@page "/addshirt"
@using BlazorSample.Model

<PageTitle>添加短袖</PageTitle>

<EditForm Model="_shirt" OnSubmit="ValidateData">
    <div class="form-field">
        <label>大小 :</label>
        <div>
            <InputRadioGroup Name="size" @bind-Value="_shirt.Size">
                @foreach (var shirtSize in Enum.GetValues(typeof(ShirtSize)))
                {
                    <label>
                        @shirtSize:
                        <InputRadio Name="size" Value="@shirtSize"></InputRadio>
                    </label>
                }
            </InputRadioGroup>
        </div>
    </div>

    <div class="form-field">
        <label>颜色 :</label>
        <div>
            <InputRadioGroup Name="color" @bind-Value="_shirt.Color">
                @foreach (var color in Enum.GetValues(typeof(ShirtColor)))
                {
                    <label>
                        @color:
                        <InputRadio Name="color" Value="@color"></InputRadio>
                    </label>
                }
            </InputRadioGroup>
        </div>
    </div>

    <div class="form-field">
        <label>价格 :</label>
        <div>
            <InputNumber @bind-Value="_shirt.Price" min="0" max="100" step="5"></InputNumber>
        </div>
    </div>

    <div class="form-field">
        <input type="submit" class="btn btn-primary"/>
    </div>
    <p></p>
    <p>@_message</p>
</EditForm>

@code {

    // 显示失败原因
    private string _message = string.Empty;

    private Shirt _shirt = new Shirt
    {
        Size = ShirtSize.Large,
        Color = ShirtColor.Blue,
        Price = 9.99m
    };

    private async Task ValidateData(EditContext editContext)
    {
        if (editContext.Model is not Shirt shirt)
        {
            _message = "模型无效";
            return;
        }

        if (shirt is { Color: ShirtColor.Red, Size: ShirtSize.ExtraLarge })
        {
            _message = "红色 T 恤不提供特大号";
            return;
        }

        if (shirt is { Color: ShirtColor.Blue, Size: <= ShirtSize.Medium })
        {
            _message = "蓝色 T 恤不提供小号或中号";
            return;
        }

        if (shirt is { Color: ShirtColor.White, Price: > 50 })
        {
            _message = "白色 T 恤的最高价格为 50 美元。";
            return;
        }

        // Data is valid
        // Save the data
        _message = "Changes saved";
    }

}
```

### 使用示例

:::tip

下面的示例，只是之前的代码片段

:::

#### 获取数据展示

一个简单的获取数据并根据索引展示的示例

```c#
@page "/wethers"

<PageTitle>天气管理</PageTitle>

@using BlazorSample.Data
@inject WeatherForecastService WetherService;

<h1>天气管理</h1>

<input type="number" width="2" min="0" max="@upperIndex" @onchange="ChangeForecast" value="@index" />

<EditForm Model="@currWeatherForecast">
    <InputDate @bind-Value="currWeatherForecast.Date"></InputDate>
    <InputNumber @bind-Value=currWeatherForecast.TemperatureC></InputNumber>
    <InputText @bind-Value=currWeatherForecast.Summary></InputText>
</EditForm>


@code
{
    /// <summary>
    /// 天气列表
    /// </summary>
    private WeatherForecast[] forecasts;
    /// <summary>
    /// 当前天气
    /// </summary>
    private WeatherForecast currWeatherForecast;
    /// <summary>
    /// 当前索引
    /// </summary>
    private int index = 0;
    /// <summary>
    /// 最大索引
    /// </summary>
    private int upperIndex = 0;

    protected override async Task OnInitializedAsync()
    {
        // 使用外部服务填充forecasts对象
        forecasts = await WetherService.GetForecastAsync(DateTime.Now);
        currWeatherForecast = forecasts[index];
        upperIndex = forecasts.Length - 1;
    }

    private async Task ChangeForecast(ChangeEventArgs e)
    {
        index = int.Parse(e.Value as string);
        if (index <= upperIndex && index >= 0)
        {
            currWeatherForecast = forecasts[index];
        }
    }
}
```

#### 单选按钮

```c#
@page "/addshirt"
@using BlazorSample.Model

<PageTitle>添加短袖</PageTitle>

<EditForm Model="_shirt">
    <div class="form-field">
        <label>大小 :</label>
        <div>
            <InputRadioGroup Name="size" @bind-Value="_shirt.Size">
                @foreach (var shirtSize in Enum.GetValues(typeof(ShirtSize)))
                {
                    <label>
                        @shirtSize:
                        <InputRadio Name="size" Value="@shirtSize"></InputRadio>
                    </label>
                }
            </InputRadioGroup>
        </div>
    </div>

    <div class="form-field">
        <label>颜色 :</label>
        <div>
            <InputRadioGroup Name="color" @bind-Value="_shirt.Color">
                @foreach (var color in Enum.GetValues(typeof(ShirtColor)))
                {
                    <label>
                        @color:
                        <InputRadio Name="color" Value="@color"></InputRadio>
                    </label>
                }
            </InputRadioGroup>
        </div>
    </div>

    <div class="form-field">
        <label>价格 :</label>
        <div>
            <InputNumber @bind-Value="_shirt.Price" min="0" max="100" step="0.01"></InputNumber>
        </div>
    </div>

</EditForm>

@code {

    private Shirt _shirt = new Shirt
    {
        Size = ShirtSize.Large,
        Color = ShirtColor.Blue,
        Price = 9.99m
    };

}
```

模型

```c#
/// <summary>
/// 短袖
/// </summary>
public class Shirt
{
    /// <summary>
    /// 短袖颜色
    /// </summary>
    public ShirtColor Color { get; set; }

    /// <summary>
    /// 短袖大小
    /// </summary>
    public ShirtSize Size { get; set; }

    /// <summary>
    /// 价格
    /// </summary>
    public decimal Price;
}

public enum ShirtColor
{
    Red, Blue, Yellow, Green, Black, White
};

public enum ShirtSize
{
    Small, Medium, Large, ExtraLarge
};
```

#### 显式手动验证

实现一个下单前输入地址的操作，经过地址验证后才可以下单

```c#
@page "/checkout"
@using Common.Extension

@inject OrderState OrderState;
@inject HttpClient HttpClient;
@inject NavigationManager NavigationManager;

<div class="main">
    <EditForm Model="Order.DeliveryAddress" OnSubmit="CheckSubmission">
        <div class="checkout-cols">
            <div class="checkout-order-details">
                <h4>查看订单</h4>
                <OrderReview Order="Order"/>
            </div>

            <div class="checkout-delivery-address">
                <h4>派送到...</h4>
                @if (_isError)
                {
                    <div class="alert alert-danger">@_errorMessage</div>
                }
                @* 嵌套地址编辑的组件 *@
                <AddressEditor Address="Order.DeliveryAddress"/>
            </div>
        </div>

        <button class="checkout-button btn btn-warning" disabled="@_isSubmitting">
            下单
        </button>

    </EditForm>
</div>

@code
{
    Order Order => OrderState.Order;

    // 是否提交
    bool _isSubmitting;

    // 是否异常
    bool _isError;

    // 异常信息
    string _errorMessage;

    // 验证通过后下单
    private async Task PlackOrder()
    {
        var response = await HttpClient.PostAsJsonAsync(NavigationManager.BaseUri + "orders", OrderState.Order);
        var newOrderId = await response.Content.ReadFromJsonAsync<int>();
        OrderState.ResetOrder();
        NavigationManager.NavigateTo($"/myOrders/{newOrderId}");
    }

    private async Task CheckSubmission(EditContext editContext)
    {
        _isSubmitting = true;
        if (editContext.Model is not Address model)
        {
            _errorMessage = "系统异常";
            _isError = true;
            _isSubmitting = false;
            return;
        }

        if (model.Name.IsNullOrWhiteSpace())
        {
            _errorMessage = "地名不能为空";
            _isError = true;
            _isSubmitting = false;
            return;
        }

        if (model.Province.IsNullOrWhiteSpace())
        {
            _errorMessage = "省份不能为空";
            _isError = true;
            _isSubmitting = false;
            return;
        }

        if (model.City.IsNullOrWhiteSpace())
        {
            _errorMessage = "城市不能为空";
            _isError = true;
            _isSubmitting = false;
            return;
        }

        if (model.Region.IsNullOrWhiteSpace())
        {
            _errorMessage = "区域不能为空";
            _isError = true;
            _isSubmitting = false;
            return;
        }

        if (model.PostalCode.IsNullOrWhiteSpace())
        {
            _errorMessage = "邮政编码不能为空";
            _isError = true;
            _isSubmitting = false;
            return;
        }

        if (!_isError)
        {
            await PlackOrder();
        }

        _isSubmitting = false;
    }
}
```

该页面包含了两个Razor组件 ，其中OrderReview用不到不予说明，组件AddressEditor内容为

```c#
<div class="form-field">
    <label>地名:</label>
    <div>
        <InputText @bind-Value="Address.Name"/>
    </div>
</div>

<div class="form-field">
    <label>省份 :</label>
    <div>
        <InputText @bind-Value="Address.Province"/>
    </div>
</div>

<div class="form-field">
    <label>市:</label>
    <div>
        <InputText @bind-Value="Address.City"/>
    </div>
</div>

<div class="form-field">
    <label>地区:</label>
    <div>
        <InputText @bind-Value="Address.Region"/>
    </div>
</div>

<div class="form-field">
    <label>邮政编码:</label>
    <div>
        <InputText @bind-Value="Address.PostalCode"/>
    </div>
</div>

@code
{
    [Parameter] public Address Address { get; set; }
}
```

在页面中触发表单提交后触发方法CheckSubmission，在校验不通过的时候显示错误信息且不下单，校验通过后触发PlackOrder方法进行下单



对了，该页面包含下面模型

```c#
public class Order
{
    /// <summary>
    /// 订单id
    /// </summary>
    public int OrderId { get; set; }

    /// <summary>
    /// 用户id
    /// </summary>
    public string UserId { get; set; }

    /// <summary>
    /// 创建事件
    /// </summary>
    public DateTime CreatedTime { get; set; }

    /// <summary>
    /// 下单地址
    /// </summary>
    public Address DeliveryAddress { get; set; } = new Address();

    /// <summary>
    /// 总价格
    /// </summary>
    /// <returns></returns>
    public decimal GetTotalPrice() => Pizzas.Sum(p => p.GetTotalPrice());

    /// <summary>
    /// 格式化的价格
    /// </summary>
    /// <returns></returns>
    public string GetFormattedTotalPrice() => GetTotalPrice().ToString("0.00");
}


public class Address
{
    /// <summary>
    /// 地址id
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 地名
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 省
    /// </summary>
    public string Province { get; set; }

    /// <summary>
    /// 市
    /// </summary>
    public string City { get; set; }

    /// <summary>
    /// 区域
    /// </summary>
    public string Region { get; set; }

    /// <summary>
    /// 邮政编码
    /// </summary>
    public string PostalCode { get; set; }
}
```

#### 隐式验证

隐式验证用户的输入，而无需编写验证代码，首先创建对应模型类并使用模型验证(内置无法满足需求还可以自定义验证特性)

```c#
/// <summary>
/// 添加披萨请求类
/// </summary>
public class AddPizzaRequest
{
    [Required(ErrorMessage = "名称不能为空")] 
    public string Name { get; set; }

    public string Description { get; set; }

    [Required]
    [Range(10.00, 25.00, ErrorMessage = "价格必须大于10小于25")]
    public decimal Price { get; set; }
}
```

创建页面，且向表单添加验证组件，要将表单配置为使用数据注释验证，请首先确保已将输入控件绑定到模型属性。 然后，在 `EditForm` 组件内的某个位置添加 DataAnnotationsValidator 组件。 若要显示验证生成的消息，请使用 ValidationSummary 组件，该组件显示表单中所有控件的所有验证消息。 如果想要在每个控件旁边显示验证消息，请使用多个 ValidationMessage 组件。 请记住，使用 `For` 属性将每个 ValidationMessage 控件与模型的特定属性相关联：

```c#
@page "/admin/createpizza"

<h1>添加披萨</h1>

<div>
    <EditForm Model="@_pizza" OnSubmit="@HandleSubmission">
        @* 注释验证 *@
        <DataAnnotationsValidator/>
        @* 显示表单中所有控件验证生成的消息 *@
         @* <ValidationSummary/> *@

        <InputText id="name" @bind-Value="_pizza.Name"></InputText>
        <ValidationMessage For="() => _pizza.Name"></ValidationMessage>

        <InputText id="description" @bind-Value="_pizza.Description"></InputText>

        <InputNumber id="price" @bind-Value="_pizza.Price"></InputNumber>
        <ValidationMessage For="() => _pizza.Price"></ValidationMessage>

    </EditForm>
</div>

@code
{
    private AddPizzaRequest _pizza = new();

    private void HandleSubmission(EditContext context)
    {
        var dataIsValid = context.Validate();
        if (dataIsValid)
        {
            // 存储数据
        }
    }
}
```

如果改用 `OnValidSubmit` 和 `OnInvalidSubmit`，不使用`OnSubmit`，则不必在每个事件处理程序中检查验证状态：

```c#
<EditForm Model="@pizza" OnValidSubmit=@ProcessInputData OnInvalidSubmit=@ShowFeedback>

</EditForm>
@code 
{
    private Pizza pizza = new();
    
    void ProcessInputData(EditContext context)
    {
        // Store valid data here
    }
    
    void ShowFeedback(EditContext context)
    {
        // Take action here to help the user correct the issues
    }
}
```



实现一个实时内容校验的方案，如果校验不通过，那么就不能提交，校验通过后才可以点击提交按钮(模型上面标注了验证规则)，首先子组件AddressEditor内容如下

```c#
<div class="form-field">
    <label>地名:</label>
    <div>
        <InputText @bind-Value="Address.Name"/>
        <ValidationMessage For="() => Address.Name"/>
    </div>
</div>

<div class="form-field">
    <label>省份 :</label>
    <div>
        <InputText @bind-Value="Address.Province"/>
        <ValidationMessage For="() => Address.Province"/>
    </div>
</div>

<div class="form-field">
    <label>市:</label>
    <div>
        <InputText @bind-Value="Address.City"/>
        <ValidationMessage For="() => Address.City"/>
    </div>
</div>

<div class="form-field">
    <label>地区:</label>
    <div>
        <InputText @bind-Value="Address.Region"/>
        <ValidationMessage For="() => Address.Region"/>
    </div>
</div>

<div class="form-field">
    <label>邮政编码:</label>
    <div>
        <InputText @bind-Value="Address.PostalCode"/>
        <ValidationMessage For="() => Address.PostalCode"/>
    </div>
</div>

@code
{
    [Parameter] public Address Address { get; set; }
}
```

页面内容如下

```c#
@page "/checkout"

@inject OrderState OrderState;
@inject HttpClient HttpClient;
@inject NavigationManager NavigationManager;

@* 组件不用的时候释放内容 *@
@implements IDisposable;

<div class="main">
    <EditForm Model="Order.DeliveryAddress" OnValidSubmit="PlackOrder" OnInvalidSubmit="ShowError">
        <div class="checkout-cols">
            <div class="checkout-order-details">
                <h4>查看订单</h4>
                <OrderReview Order="Order"/>
            </div>

            <div class="checkout-delivery-address">
                <h4>派送到...</h4>
                @* 嵌套地址编辑的组件 *@
                <AddressEditor Address="Order.DeliveryAddress"/>
            </div>
        </div>

        <button class="checkout-button btn btn-warning" disabled="@_isError">
            下单
        </button>

        @* 模型验证 *@
        <DataAnnotationsValidator/>
    </EditForm>
</div>

@code
{
    Order Order => OrderState.Order;

    // 是否异常
    bool _isError;

    private EditContext _editContext;

    protected override void OnInitialized()
    {
        _editContext = new EditContext(Order.DeliveryAddress);
        _editContext.OnFieldChanged += HandleFieldChanged;
    }

    // 处理字段更改
    private void HandleFieldChanged(object sender, FieldChangedEventArgs e)
    {
        _isError = !_editContext.Validate();
        StateHasChanged();
    }

    // 验证通过后下单
    private async Task PlackOrder()
    {
        var response = await HttpClient.PostAsJsonAsync(NavigationManager.BaseUri + "orders", OrderState.Order);
        var newOrderId = await response.Content.ReadFromJsonAsync<int>();
        OrderState.ResetOrder();
        NavigationManager.NavigateTo($"/myOrders/{newOrderId}");
    }

    private void ShowError()
    {
        _isError = true;
    }

    // 在不需要结账组件的时候将事件处理程序释放
    public void Dispose()
    {
        _editContext.OnFieldChanged -= HandleFieldChanged;
    }
}
```

