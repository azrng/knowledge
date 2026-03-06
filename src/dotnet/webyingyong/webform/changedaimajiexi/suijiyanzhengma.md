---
title: 随机验证码
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: suijiyanzhengma
slug: gvmyno
docsId: '31541767'
---
在需要出来验证码的页面，使用一个图片控件，如下
```
  <asp:Image ID="Image1" runat="server" src="TransmitFileDemo.aspx" Style="cursor: pointer" onclick="this.src=this.src+'?'" align="middle" alt="看不清楚，点击换一张！" />
```
此控件的src对应另一个生成验证码的页面
 
生成验证码的页面前台没内容，看后台：
加载方法
```
protected void Page_Load(object sender, EventArgs e)
        {
            string checkCode = CreateRandomCode(4);//到这一步已经生成了验证码 如  5df5  位数也在此设置
           Session["CheckCode"] = checkCode; //用于检测输入验证码是否正确
           CreateImage(checkCode);//将验证码弄到图片上
        }
        /// <summary>
        /// 将验证码弄到图片上
        /// </summary>
        /// <param name="checkCode"></param>
        private void CreateImage(string checkCode)
        {
            // 生成图象验证码函数
            int iwidth = (int)(checkCode.Length * 11.5);
            System.Drawing.Bitmap image = new System.Drawing.Bitmap(iwidth, 20);
            Graphics g = Graphics.FromImage(image);
            Font f = new System.Drawing.Font("Arial", 10, System.Drawing.FontStyle.Bold);
            Brush b = new System.Drawing.SolidBrush(Color.Azure);//字母白色
            //g.FillRectangle(new System.Drawing.SolidBrush(Color.Blue),0,0,image.Width, image.Height);
            g.Clear(Color.Brown);//背景灰色
            g.DrawString(checkCode, f, b, 3, 3);
 
            Pen blackPen = new Pen(Color.Black, 0);
            Random rand = new Random();
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            Response.ClearContent();
            Response.ContentType = "image/Jpeg";
            Response.BinaryWrite(ms.ToArray());
            g.Dispose();
            image.Dispose();
        }
        /// <summary>
        /// 生成验证码
        /// </summary>
        /// <param name="codeCount"></param>
        /// <returns></returns>
        private string CreateRandomCode(int codeCount)
        {
            // 函数功能:产生数字和字符混合的随机字符串
            string allChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            char[] allCharArray = allChar.ToCharArray();
            string randomCode = "";
            Random rand = new Random();
            for (int i = 0; i < codeCount; i++)
            {
                int r = rand.Next(61);
                randomCode += allCharArray.GetValue(r);
            }
            return randomCode;
        }

```