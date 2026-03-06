---
title: 点击列表点击右边展示
lang: zh-CN
date: 2022-10-23
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: dianjiliebiaodianjiyoubianzhanshi
slug: vd0hk1
docsId: '77400127'
---
```csharp
@inherits LayoutComponentBase

<MApp>
    <!--左边布局-->
    <MNavigationDrawer App>
        <MSheet Color="grey lighten-4" Class="pa-4">
            <MRow>
                <MCol Cols="3">
                    <MAvatar>
                        <MImage Alt=".Net Logo" Src="https://cdn.masastack.com/stack/images/website/masa-blazor/doddgu.png"></MImage>
                    </MAvatar>
                </MCol>
                <MCol Align="AlignTypes.Center">
                    <span>知识库</span>
                </MCol>
            </MRow>
        </MSheet>
        <MList Shaped>
            <MSubheader>菜单列表</MSubheader>
            <MListItemGroup @bind-Value="_selectedItem"
                            Color="primary">
                @foreach (var item in _items)
                {
                    <MListItem Link Href="@item.Href">
                        <MListItemIcon>
                            <MIcon>
                                @item.Icon
                            </MIcon>
                        </MListItemIcon>
                        <MListItemContent>
                            <MListItemTitle>@item.Text</MListItemTitle>
                        </MListItemContent>
                    </MListItem>
                }
            </MListItemGroup>
        </MList>
    </MNavigationDrawer>
    <!--右边布局-->
    <MMain>
        @Body
    </MMain>
</MApp>

@code {
    private StringNumber _selectedItem = 0;
    private Item[] _items = new Item[]
    {
       new Item { Text= "列表1", Icon= "mdi-clock",Href="/" },
       new Item { Text= "列表2", Icon= "mdi-account",Href="Counter" },
       new Item { Text= "列表3", Icon= "mdi-flag",Href="fetchdata" }
    };

    class Item
    {
        public string Text { get; set; }
        public string Icon { get; set; }
        public string Href { get; set; }
    }
}
```
