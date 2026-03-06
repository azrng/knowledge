---
title: repeater
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: repeater
slug: ga2nrg
docsId: '31541644'
---
repeater里面写超链接
```
 <a href='../BackstageWebPage/ShowArticleList.aspx?id=<%#Eval("id")%>'><%#Eval("title")%></a>
```
repeater中给button的Text属性绑定两个值：

```
Text='<%#string.Format("{0}({1})",Eval("a_RealName"),Eval("a_num"))%>'
```

Repeater使用rptShow_ItemDataBound获取数据

```csharp
if (e.Item.ItemType == ListItemType.Item || e.Item.ItemType == ListItemType.AlternatingItem)
            {
                DataRowView drv = (DataRowView)e.Item.DataItem;
                string a = drv.Row.ItemArray[1].ToString();
                if (a=="")
                {
                   
                }
  }
```
 repeater嵌套
```csharp
前台代码：
<table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 5px" width="100%">  
    <asp:Repeater runat="server" ID="rptypelist" OnItemDataBound="rptypelist_ItemDataBound">  
        <ItemTemplate>  
            <tr>  
                <td class="fb">  
                      <a><%#Eval("names") %></a>
                </td>  
            </tr>  
            <tr>  
                <td>  
                    <div>  
                        <asp:Repeater runat="server" ID="rpquestionlist">  
                            <ItemTemplate>  
                                <%#Eval("classify")%>
  
                            </ItemTemplate>  
                        </asp:Repeater>  
                    </div>  
                </td>  
            </tr>  
        </ItemTemplate>  
    </asp:Repeater>  
</table>
后台代码：
 private void RpTypeBind()
        {
            Model.majorFieldChildModel model = new majorFieldChildModel();
            this.rptypelist.DataSource = bllmajorf.getgetmajorField(model);
            this.rptypelist.DataBind();
        }
        protected void rptypelist_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            if (e.Item.ItemType == ListItemType.Item || e.Item.ItemType == ListItemType.AlternatingItem)
            {
                Repeater rep = e.Item.FindControl("rpquestionlist") as Repeater;//找到里层的repeater对象  
                DataRowView rowv = (DataRowView)e.Item.DataItem;//找到分类Repeater关联的数据项   
                int typeid = Convert.ToInt32(rowv["id"]); //获取填充子类的id   
                Model.majorFieldChildModel model = new majorFieldChildModel();
                model.Fieldid = typeid;
                rep.DataSource = bllmajorf.getgetmajorField(model);
                rep.DataBind();
            }
        }

```
 epeater显示每一个列的序号
```csharp
<div id='page<%#Container.ItemIndex+1 %>'>
```
编译后为：
```
<div id='page1'> 
<div id='page2'> 
```
 repeater绑定数组
后台直接DataSource绑定数组名称
前面获取值使用 src='<%#GetDataItem().ToString()%>'
```
 src='<%#GetDataItem().ToString()%>'
```
