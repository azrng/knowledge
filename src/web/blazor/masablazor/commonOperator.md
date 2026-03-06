---
title: 常用功能
lang: zh-CN
date: 2023-04-23
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: changyonggongneng
slug: kwl2nb
docsId: '77392412'
---

## 概述
Masa Blazor自定义组件封装：[https://mp.weixin.qq.com/s/qlv11I5qwm2Q91vPXE2YCQ](https://mp.weixin.qq.com/s/qlv11I5qwm2Q91vPXE2YCQ)

## 基础
MSheet：最小的组件，类似于div

## 排版

- MAppBar：总是放在应用顶部，优先级低于 MSystemBar。
- MBottomNavigation：总是放在应用底部，优先级高于 MFooter。
- MFooter：总是放在应用底部，优先级低于 MBottomNavigation。
- MNavigationDrawer：可以放置在应用的左边或右边，并且可以配置在 MAppBar 的旁边或下面。
- MSystemBar：总是放在应用顶部，优先级高于 MAppBar。

### 左上中下
![image.png](/common/1666491679296-d49f9aa7-cc7b-48d5-92cd-708f5277274a.png)
布局文件
```csharp
@using BlazorComponent;
@inherits LayoutComponentBase

<MApp>
    <!--左侧导航菜单-->
    <MNavigationDrawer App>
        <NavMenu />
    </MNavigationDrawer>

    <MAppBar App Flat>
        <!-- tab栏 -->
        头部tab栏展示
    </MAppBar>

    <!-- 内容显示：根据应用组件来调整你的内容 -->
    <MMain>
        <!-- 给应用提供合适的间距 -->
        <MContainer Fluid>
            @Body
        </MContainer>
    </MMain>

    <!--页脚-->
    <MFooter>
        <MCol Class="primary lighten-2 py-2 text-center white--text" Cols="12">
            @DateTime.Now.Year - <strong>AZRNG</strong>
        </MCol>
    </MFooter>

</MApp>
```
左侧导航
```csharp
@using BlazorComponent;
<MSheet Color="grey lighten-4" Class="pa-4">
    <MRow>
        <MCol Cols="3">
            <MAvatar>
                <MImage Alt="小猫咪" Src="img/logo.jpg"></MImage>
            </MAvatar>
        </MCol>
        <MCol Align="AlignTypes.Center">
            <span>Tools</span>
        </MCol>
    </MRow>
</MSheet>
<MList Shaped Rounded>
    <MSubheader>目录</MSubheader>
    <MListItemGroup @bind-Value="_selectedItem"
                    Color="primary">
        @foreach (var item in _items)
        {
            <NavLink href="@item.Href" style="text-decoration:none">
                <MListItem>
                    <MListItemContent>
                        <MListItemTitle> @item.Text</MListItemTitle>
                    </MListItemContent>
                </MListItem>
            </NavLink>

        }
    </MListItemGroup>
</MList>

@code {
    private StringNumber _selectedItem = 0;
    private Item[] _items = new Item[]
    {
       new Item { Text= "列表1", Href="/" },
       new Item { Text= "列表2",Href="/fetchdata" },
       new Item { Text= "列表3",Href="/timeline" }
    };
    class Item
    {
        /// <summary>
        /// 显示文本
        /// </summary>
        public string Text { get; set; }
        /// <summary>
        /// 链接地址
        /// </summary>
        public string Href { get; set; }
    }
}
```


## 样式与动画
APP
大小自动，比如
```csharp
<MNavigationDrawer App>
</MNavigationDrawer>
```

### 颜色(color)
背景，样式从[https://masa-blazor-docs-dev.lonsid.cn/stylesandanimations/colors](https://masa-blazor-docs-dev.lonsid.cn/stylesandanimations/colors)

### 间距(spacing)


## 按钮
点击按钮后让图片的src跟着变化
```csharp
<MCard Dark Flat>
    <MButton Absolute Bottom Right Fab OnClick="LoadAgain">
        <MIcon>fas fa-circle-notch fa-spin</MIcon>
    </MButton>
    <MImage Id="bgImg" Src="@Url" Gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)" Dark>
        <MContainer Class="fill-height">
            <MRow Align="@AlignTypes.Center">
                <strong class="text-h1 font-weight-regular mr-6">@DateTime.Now.Day</strong>
                <MRow Justify="@JustifyTypes.End">
                    <div class="text-h5 font-weight-light">
                        @DateTime.Now.DayOfWeek
                    </div>
                    <div class="text-uppercase font-weight-light">
                        @DateTime.Now.ToString("yyyy-MM")
                    </div>
                </MRow>
            </MRow>
        </MContainer>
    </MImage>
</MCard>

按钮触发事件
@code {
    public string Url { get; set; }

    public async void LoadAgain()
    {
        Url = "https://www.dmoe.cc/random.php?version" + Environment.TickCount;
    }
}
```
点击按钮后让框的背景色改变
```csharp
<MCard Color="@BgColor">
    112454545
</MCard>
<MButton @onclick="ChangeColor">改变框的颜色</MButton>

事件
@code {
    private string BgColor = "red";

    public void ChangeColor()
    {
        BgColor = "black";
    }
}
```

## 小属性

- Flat
   - 让边框阴影去掉
- APP
   - 会自动给布局元素设置 position: fixed
- Rounded
   - 变成圆角
