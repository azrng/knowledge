---
title: 局部刷新
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jubushuaxin
slug: ryuks4
docsId: '31541775'
---
 
**局部刷新**
 <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>这个直接放在form内就行
使用局部刷新的方法就是把想不让闪的东西套在
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
 
            </ContentTemplate>
        </asp:UpdatePanel>里面，然后会发现一些弹窗不能使用，那么就是用其他方法弹框
 
在ajax中的UpdatePanel弹出对话窗，可以使用：
ScriptManager.RegisterStartupScript(UpdatePanel1, this.GetType(), "alert", "alert('更新成功!')", true);
修改后跳到另一个页面中去时，可以使用：
ScriptManager.RegisterStartupScript(UpdatePanel1, this.GetType(), "click", "location.replace('UserManger.aspx');", true);
如果跳转前还有提示信息的话，则可以使用：
ScriptManager.RegisterStartupScript(this.Page, this.GetType(), "click", "alert('更新成功!');location.replace('UserManger.aspx');", true);
 
例如：ScriptManager.RegisterStartupScript(this.UpdatePanel1,this.GetType(), "提示", "alert('购物车为空,请先购物!')", true);  
 
 protected void UpdatePanelAlert(string str_Message)
        {
            ScriptManager.RegisterStartupScript(this.UpdatePanel1, this.GetType(), "提示", "alert('" + str_Message+ "')", true);
        }
 UpdatePanelAlert("无此代码");
 
来自 <[https://blog.csdn.net/weibingbing_net/article/details/48241561](https://blog.csdn.net/weibingbing_net/article/details/48241561)> 
 
 
 
 
 
 
 
 
 
