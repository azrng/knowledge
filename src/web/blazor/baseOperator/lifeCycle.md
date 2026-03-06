---
title: 组件生命周期
lang: zh-CN
date: 2023-12-14
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
  - web
tag:
  - blazor
  - life
---

## 概述

Blazor 组件具有定义完善的生命周期，该生命周期从首次创建时开始，在销毁时结束。 组件生命周期由一组事件控制，这些事件响应特定触发器。 例如组件被初始化、用户与组件交互或组件所在的页面被关闭。

## 组件生命周期

Blazor 组件表示 Blazor 应用中的视图，它们定义布局和 UI 逻辑。 应用运行时，这些组件会生成 HTML 标记。 用户交互事件可以触发自定义代码，并且可以更新组件以重新呈现显示。 页面关闭时，Blazor 会删除组件，并清理所有资源。 当用户返回到页面时，将创建新实例。

下图说明了在组件生命周期内发生的事件，以及可用于处理这些事件的方法。 Blazor 提供每种方法的同步和异步版本，`SetParametersAsync` 除外。

所有 Blazor 组件都源自 [ComponentBase](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase) 类或 [IComponent](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.icomponent)，该类定义了显示的方法并提供了默认行为。 通过重写相应的方法来处理事件。

![The Blazor component lifecycle.](/common/0725C008-51A4-4BB2-9968-2491DB040D3C.png)

尽管该图暗示生命周期方法之间存在单线程流，但这些方法的异步版本使 Blazor 应用能够加快呈现过程。 例如，当 `SetParametersAsync` 中发生第一个 `await` 时，Blazor 组件会运行 `OnInitialized` 和 `OnInitializedAsync` 方法。 当等待的语句完成时，`SetParametersAsync` 中的执行线程将继续。

## 生命周期方法

| 生命周期方法                                                 | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| 已创建组件                                                   | 组件已实例化。                                               |
| [SetParametersAsync](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.setparametersasync) | 设置呈现树中组件的父级中的参数。                             |
| [OnInitialized](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.oninitialized) / [OnInitializedAsync](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.oninitializedasync) | 在组件已准备好启动时发生。                                   |
| [OnParametersSet](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.onparametersset) / [OnParametersSetAsync](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.onparameterssetasync) | 在组件收到参数且已分配属性时发生。                           |
| [OnAfterRender](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.onafterrender) / [OnAfterRenderAsync](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.onafterrenderasync) | 在呈现组件后发生。                                           |
| `Dispose` / `DisposeAsync`                                   | 如果组件实现 [IDisposable](https://learn.microsoft.com/zh-cn/dotnet/api/system.idisposable) 或 [IAsyncDisposable](https://learn.microsoft.com/zh-cn/dotnet/api/system.iasyncdisposable)，则会在销毁组件的过程中发生适当的可释放操作。 |

### SetParametersAsync

当用户访问包含 Blazor 组件的页面时，Blazor 运行时会创建该组件的新实例并运行默认构造函数。 构建组件后，Blazor 运行时会调用 `SetParametersAsync` 方法。

如果组件定义了任何参数，Blazor 运行时会将这些参数的值从调用环境注入到组件中。 这些参数包含在 `ParameterView` 对象中，可供 `SetParametersAsync` 方法访问。 你调用 `base.SetParametersAsync` 方法以使用这些值填充组件的 `Parameter` 属性。

或者，如果你需要以不同的方式处理参数，可以在此方法处执行相应的操作。 例如，你可能需要在使用之前验证传递给组件的任何参数。

### OnInitialized/OnInitializedAsync 

你可以重写 `OnInitialized` 和 `OnInitializedAsync` 方法以包含自定义功能。 这些方法在 `SetParametersAsync` 方法填充组件基于参数的属性后运行。 可以在这些方法中运行初始化逻辑。

如果应用程序的 `render-mode` 属性设置为 `Server`，那么 `OnInitialized` 和 `OnInitializedAsync` 方法只对组件实例运行一次。 如果组件的父级修改了组件参数，`SetParametersAsync` 方法会再次运行，但这些方法不会。 如果需要在参数更改时重新初始化组件，请使用 `SetParametersAsync` 方法。 如果要执行一次初始化，请使用这些方法。

如果 `render-mode` 属性设置为 [ServerPrerendered](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.rendering.rendermode#microsoft-aspnetcore-mvc-rendering-rendermode-serverprerendered)，则 `OnInitialized` 和 `OnInitializedAsync` 方法将运行两次；一次在生成静态页面输出的预呈现阶段运行，另一次在服务器与浏览器建立 SignalR 连接时运行。 你可能会在这些方法中执行成本高昂的初始化任务（例如从 Web 服务检索数据，该服务用于设置 Blazor 组件的状态）。 在此类情况下，请在第一次执行期间缓存状态信息，并在第二次执行期间重用保存的状态。

创建实例后但在 `OnInitialized` 或 `OnInitializedAsync` 方法运行之前，将注入 Blazor 组件使用的依赖项。 可以在 `OnInitialized` 或 `OnInitializedAsync` 方法中使用这些依赖项注入的对象，但不能在之前使用。

::: info

Blazor 组件不支持构造函数依赖项注入。 请改用组件标记中的 `@inject` 指令或属性声明中的 [InjectAttribute](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.injectattribute)。

:::

在预呈现阶段，Blazor Server 组件中的代码无法执行需要连接到浏览器的操作，例如调用 JavaScript 代码。 应将依赖于与浏览器连接的逻辑放置在 `OnAfterRender` 或 `OnAfterRenderAsync` 方法中。



当用户第一次请求页面时，`OnInitialized` 方法运行。 如果用户使用不同的路由参数请求同一页面，则该方法不会运行。 例如，如果希望用户从 `http://www.contoso.com/favoritepizza/hawaiian` 转到 `http://www.contoso.com/favoritepizza`，请改为在 `OnParametersSet()` 方法中设置默认值。

### OnParametersSet/OnParametersSetAsync

如果这是第一次呈现组件，则 `OnParametersSet` 和 `OnParametersSetAsync` 方法在 `OnInitialized` 或 `OnInitializedAsync` 方法之后运行，否则在 `SetParametersAsync` 方法之后运行。 与 `SetParametersAsync` 一样，即使组件没有参数，也会始终调用这些方法。

使用任一方法完成依赖于组件参数值的初始化任务，例如计算计算属性的值。 请勿在构造函数中执行此类长时间运行的操作。 构造函数是同步的，等待长时间运行的操作完成会影响包含该组件的页面的响应能力。

### OnAfterRender/OnAfterRenderAsync

每次 Blazor 运行时需要更新由用户界面中的组件表示的视图时，`OnAfterRender` 和 `OnAfterRenderAsync` 方法都会运行。 在以下情况下会自动出现此状态：

- 组件的状态更改，例如当 `OnInitialized` 或 `OnInitializedAsync` 方法或者 `OnParametersSet` 和 `OnParametersSetAsync` 方法运行时。
- 触发 UI 事件。
- 应用程序代码调用组件的 `StateHasChanged` 方法。

从外部事件或 UI 触发器调用 [StateHasChanged](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.statehaschanged) 时，组件会有条件地重新呈现。 以下列表详细介绍了方法调用的顺序，包括 `StateHasChanged` 和以下内容：

1. [StateHasChanged](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.statehaschanged)：组件被标记为需要重新呈现。
2. [ShouldRender](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.shouldrender)：返回一个标志，指示组件是否应呈现。
3. [BuildRenderTree](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.components.componentbase.buildrendertree)：呈现组件。

`StateHasChanged` 方法调用组件的 `ShouldRender` 方法。 此方法的目的是判断状态的更改是否需要组件重新呈现视图。 默认情况下，所有状态更改都会触发呈现操作，但你可以重写 `ShouldRender` 方法并定义自己的决策逻辑。 如果视图需要再次呈现，`ShouldRender` 方法将返回 `true`，否则返回 `false`。

如果组件需要呈现，可以使用 `BuildRenderTree` 方法生成一个模型，该模型可用于更新浏览器用来显示 UI 的 DOM 版本。 你可以使用 `ComponentBase` 类提供的默认方法实现，或者如果你有特定要求，也可以使用自定义逻辑进行重写。

接下来，呈现组件视图并更新 UI。 最后，该组件运行 `OnAfterRender` 和 `OnAfterRenderAsync` 方法。 此时，UI 功能齐全，你可以与 JavaScript 和 DOM 中的任何元素进行交互。 使用这些方法执行需要访问完全呈现的内容的任何其他步骤，例如从 JS 互操作调用 JavaScript 代码。

`OnAfterRender` 和 `OnAfterRenderAsync` 方法采用名为 `firstRender` 的布尔参数。 该参数在方法首次运行时为 `true`，但之后为 `false`。 可以计算此参数来执行一次性操作，如果每次呈现组件时都重复这些操作，则可能会造成浪费和过多资源消耗。

 备注

不要将预呈现与 Blazor 组件的首次呈现混淆。 预呈现发生在与浏览器建立 SignalR 连接之前，且生成页面的静态版本。 首次呈现发生于与浏览器的连接完全处于活动状态并且所有功能都可用时。

### Dispose/DisposeAsync

与任何 .NET 类一样，Blazor 组件可以使用托管和非托管资源。 运行时会自动回收受管理资源。 但是，应实现 `IDisposable` 或 `IAsyncDisposable` 接口，并提供 `Dispose` 或 `DisposeAsync` 方法来释放任何不受管理的资源。 这样的做法可以减少服务器中内存泄漏的可能性。

## 处理生命周期方法中的异常

如果 Blazor 组件的生命周期方法失败，它会关闭与浏览器的 SignalR 连接，从而导致 Blazor 应用停止运行。 若要防止出现此结果，请确保已准备好将异常作为生命周期方法逻辑的一部分进行处理。 有关详细信息，请参阅[处理 ASP.NET Core](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/fundamentals/handle-errors)
