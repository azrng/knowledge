---
title: 跳转页面
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: tiaozhuaixiemian
slug: gl36la
docsId: '31541773'
---
返回上一次不用跳转
```
<a href="javascript:history.back(-1);" title="返回">返回</a>
```
input中使用其他标签的值
```
<input type='button' onclick="javascript:$('#a').val()">
```
1. 打开新的窗口并传送参数： 
传送参数：
response.write("＜script＞window.open(’*.aspx?id="+this.DropDownList1.SelectIndex+"&id1="+
+"’)＜/script＞")  
接收参数：
string a = Request.QueryString("id"); 
string b = Request.QueryString("id1");  
 
获取跳转过来的上一个页面的地址
Request.UrlReferrer.ToString()
使用a标签传值
```
  <asp:HyperLink NavigateUrl='<%## string.Format("a.aspx?Id={0}",Eval("Postid").ToString())%>' ID="HyperLink2" runat="server">HyperLink</asp:HyperLink>
```
或者：
```
<a runat="server" id="edit" href='EditOrganPost.aspx?Postid=<%#Eval("Postid") %>' class="btnclass1">修改</a>
```
前台页面跳转方式：
1、带frame的跳转 
a  window.frames.frameName.location.href= url; //frameName代表某个frame，url代表跳转的路径。 
b  打开一个新窗口，window.open(url,'frameName'); 
2、不带frame的跳转 
a   window.location.href=url; 
b   window.history.back(-1);//后退 
c   window.history.go(-1||-2||...);//后退到前一||二||。。。页面 
d   window.navigate(url); 
e   self.location = url; 
f   top.location = url; 
g   window.location.reload();//刷新当前页面 
h   parent.location.reload();//刷新父亲对象页面 
i   opener.location.reload();//刷新父窗口页面
后台使用js跳出整个框架
```
 Response.Write("<script>top.document.location='../login.aspx';</script>");
```
 
后台整个右边跳转
```
page.Response.Write(string.Format("<script>alert('{0}');window.open('main.aspx', '_parent');</script>", msg));
```
 
后台跳转:
1.HyperLink 服务器控件
```
HTML和ASP中,我们经常用<a href=target.asp>目标</a>方式实现页面的跳转,在ASP.Net中仍可用此方法,另外还可用HyperLink服务控件代替,如下:
<form id="form1" runat="server">
<div>
<asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl="target.aspx">目标</asp:HyperLink></div>
</form>
```
上述两种方法实现结果一样,但是有一点重要区别,HyperLink服务器控件可以在服务器端编程,目标页可以根据当前的状态进行动态的变化.
注： HyperLink控件本身没有事件,因此只能在其他事件中设置NavigateUrl属性,例如:Page_Load.
2.编程
HyperLink实现从一页面到另一页面的跳转的方式是完全由用户控制跳转时机的,如果在跳转之前添加条件判断,使用编程实现比较方便.
使用代码实现页面跳转的方法有: Response.Redirect, Server.Transfer,Server.Execute
（1）Response.Redirect
从页面A跳转到页面B,内部控件保存的所有数据信息将丢失,因此页面B无法访问页面A提交的数据,跳转后浏览器的URL信息改变,但是可以通过Session,Cookie,Application等对象进行页面间的数据传递.
Response.Redirect重定向操作发生在客户端,总共会涉及到两次与[Web服务器](https://www.baidu.com/s?wd=Web%E6%9C%8D%E5%8A%A1%E5%99%A8&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1dBuAFBm1u9mvDdnhRLm16d0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EP1DkrHnzn1m)的通讯.
（2）Server.Transfer
页面A跳转到页面B,同时页面处理的控制权也进行移交,在跳转过程中Request,Session等保存的信息不变,浏览器的URL仍保存A的URL信息.
Server.Transfer的重定向请求在[服务器端](https://www.baidu.com/s?wd=%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1dBuAFBm1u9mvDdnhRLm16d0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EP1DkrHnzn1m)进行,客户端不知晓服务器执行了页面转换,因此URL保持不变.
（3）Server.Execute 
Server.Execute 方法允许当前页面执行同一[Web服务器](https://www.baidu.com/s?wd=Web%E6%9C%8D%E5%8A%A1%E5%99%A8&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1dBuAFBm1u9mvDdnhRLm16d0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EP1DkrHnzn1m)上的另一页面,当另一页面执行完毕后,控制流程重新返回到原页面发出Server.Execute 调用的位置,被调用页面[Page指令](https://www.baidu.com/s?wd=Page%E6%8C%87%E4%BB%A4&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1dBuAFBm1u9mvDdnhRLm16d0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EP1DkrHnzn1m)的EnableViewStateMac属性需要设置为False;
跳转方式的选择:
HyperLink 服务器控件---------用户决定何时转换,用户决定转换的时机
Response.Redirect------需要链接到另一台服务器的情况,需要链接到非aspx类型的页面的时候,需要将查询字符串作为URL一部分保留的情况
 
Response.Redirect和Server.Transfer的区别
引自:[http://blog.csdn.net/popule_daisy/archive/2008/09/10/2907304.aspx](http://blog.csdn.net/popule_daisy/archive/2008/09/10/2907304.aspx)
1、浏览器ASPX文件请求->服务器执行->遇到response.redirect语句->服务器发送response.redirect后面的地址给客户机端的浏览器->浏览器请求执行新的地址
2、浏览器ASPX文件请求->服务器执行->遇到Server.Transfer语句->服务器转向新的文件
切换对象：
1、Response.Redirect可以切换到任何存在的网页。
2、Server.Transfer只能切换到同目录或者子目录的网页。
数据保密：
1、Response.Redirect后地址会变成跳转后的页面地址。
2、Server.Transfer后地址不变，隐藏了新网页的地址及附带在地址后边的参数值。具有数据保密功能。
 
 
 
 
 
 
 
 
传递的字符串中有特殊的，先进行编码然后在传递
如果传递数据中包含“&” 符号的参数  如：P & G  
```
处理方式用System.Web.HttpUtility.UrlEncode(param) 
 channelName = “P&G”
Response.Redirect("AA.aspx?UserId=" + userId + "&roleId=" + _roleId + "&CName=" + System.Web.HttpUtility.UrlEncode(channelName));
```
采用这种方式就顺利传递了包含“&”的数据
