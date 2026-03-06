---
title: 登录效果
lang: zh-CN
date: 2022-11-02
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - 无
filename: dengluxiaoguo
slug: nrwgpy
docsId: '104808125'
---

## 目的
实现BlazorServer不借助WebApi登录登出效果。

## 操作
新建BlazorServer项目，增加用户信息类
```csharp
public class User
{
    public string Account { get; set; }
    public string Password { get; set; }
    public string Roles { get; set; }
    public string Name { get; set; }
    public string Age { get; set; }
}
```
增加自定义认证服务类
```csharp
public class CustomAuthenticationStateProvider : AuthenticationStateProvider
{
    private readonly ProtectedLocalStorage storage;

    public CustomAuthenticationStateProvider(ProtectedLocalStorage storage)
    {
        this.storage = storage;
    }

    public override async Task<AuthenticationState> GetAuthenticationStateAsync()// 这个函数应当返回一个当前的用户
    {
        try
        {
            var userLocalStorage = await storage.GetAsync<User>("identity");
            var principal = CreateIdentityFromUser(userLocalStorage.Success ? userLocalStorage.Value : null);
            return new AuthenticationState(new ClaimsPrincipal(principal));
        }
        catch (Exception ex)
        {
            return new AuthenticationState(new ClaimsPrincipal(CreateIdentityFromUser(null)));
        }
    }

    public async void Login()
    {
        var user = new User
        {
            Account = "123123",
            Name = "Test",
            Age = "18",
            Password = "12321321",
            Roles = "admin,default"
        };
        if (user is not null)
        {
            await storage.SetAsync("identity", user);
            var identity = CreateIdentityFromUser(user);
            var principal = new ClaimsPrincipal(identity);
            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(principal)));
        }
    }

    public async void LogOut()
    {
        await storage.SetAsync("identity", new User() { Roles = "" });
        var identity = CreateIdentityFromUser(null);
        var principal = new ClaimsPrincipal(identity);
        NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(principal)));
    }

    private ClaimsPrincipal CreateIdentityFromUser(User? user)
    {
        if (user is not null)
        {
            var claims = new List<Claim>
            {
                new Claim( ClaimTypes.Name,user.Name),
                new Claim( ClaimTypes.Hash,user.Password),
                new Claim( "age",user.Age),
            };
            claims.AddRange(user.Roles.Split(",").Select(p => new Claim(ClaimTypes.Role, p)));
            var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims));
            return claimsPrincipal;
        }
        return new ClaimsPrincipal();
    }
}
```
Program中注册
```csharp
using Login.Demo;
using Login.Demo.Data;
using Microsoft.AspNetCore.Components.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddAuthenticationCore();
builder.Services.AddSingleton<WeatherForecastService>();

builder.Services.AddScoped<CustomAuthenticationStateProvider>();
builder.Services.AddScoped<AuthenticationStateProvider>(option => option.GetRequiredService<CustomAuthenticationStateProvider>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
```
修改App.razor
```csharp
<CascadingAuthenticationState>
    <Router AppAssembly="@typeof(App).Assembly">
        <Found Context="routeData">
            <AuthorizeRouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
            <FocusOnNavigate RouteData="@routeData" Selector="h1" />
        </Found>
        <NotFound>
            <PageTitle>Not found</PageTitle>
            <LayoutView Layout="@typeof(MainLayout)">
                <p role="alert">Sorry, there's nothing at this address.</p>
            </LayoutView>
        </NotFound>
    </Router>
</CascadingAuthenticationState>
```
在Index.razor中模拟登录登出操作
```csharp
@page "/"
@inject CustomAuthenticationStateProvider CustomAuthenticationStateProvider

<AuthorizeView Roles="default">
    <Authorized>
        <p>您具有该权限</p>
    </Authorized>
    <NotAuthorized>
        <p>您不具备该权限</p>
    </NotAuthorized>
</AuthorizeView>


<button class="btn btn-primary" @onclick='()=>{CustomAuthenticationStateProvider.Login();}'>
    模拟登录
</button>

<button class="btn btn-primary" @onclick='()=>{  CustomAuthenticationStateProvider.LogOut();}'>
    模拟登出
</button>
```
点击登录按钮即可在页面上显示您已经具有该权限。
当前的AuthorizeView也可以在其他地方使用，比如在左侧菜单组件NavMenu.razor使用实现登录后显示菜单
```csharp
<div class="top-row ps-3 navbar navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="">Login.Demo</a>
        <button title="Navigation menu" class="navbar-toggler" @onclick="ToggleNavMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
    </div>
</div>

<div class="@NavMenuCssClass nav-scrollable" @onclick="ToggleNavMenu">
    <nav class="flex-column">
        <div class="nav-item px-3">
            <NavLink class="nav-link" href="" Match="NavLinkMatch.All">
                <span class="oi oi-home" aria-hidden="true"></span> Home
            </NavLink>
        </div>
        <div class="nav-item px-3">
            <NavLink class="nav-link" href="counter">
                <span class="oi oi-plus" aria-hidden="true"></span> Counter
            </NavLink>
        </div>


        <AuthorizeView Roles="default">
            <Authorized>
                <div class="nav-item px-3">
                    <NavLink class="nav-link" href="fetchdata">
                        <span class="oi oi-list-rich" aria-hidden="true"></span> Fetch data
                    </NavLink>
                </div>
            </Authorized>
        </AuthorizeView>
    </nav>
</div>

@code {
    private bool collapseNavMenu = true;

    private string? NavMenuCssClass => collapseNavMenu ? "collapse" : null;

    private void ToggleNavMenu()
    {
        collapseNavMenu = !collapseNavMenu;
    }
}
```

## 参考资料
Blazor Server不借助WebApi实现登录：[https://www.bilibili.com/video/BV17V4y137Eq](https://www.bilibili.com/video/BV17V4y137Eq)
Github：[https://github.com/anan1213095357/BlazorServer.Login](https://github.com/anan1213095357/BlazorServer.Login)
