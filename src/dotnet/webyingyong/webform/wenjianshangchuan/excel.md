---
title: Excel
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: excel
slug: kqsobg
docsId: '31541562'
---
上传excel并且读取excel(xls)文件
 
```csharp
前台：
            <%--只支持xls格式--%>
            <asp:FileUpload ID="FuStud" runat="server" />
            <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />
后台：
  if (FuStud.PostedFile.FileName != "")
            {
                //substring里面只有一个参数时候，取这个参数后面的东西，包括这个
                if (FuStud.FileName.Substring(FuStud.FileName.LastIndexOf(".") + 1) == "xls")
                {
                    Random rd = new Random(1);
                    string filename = DateTime.Now.Date.ToString("yyyymmdd") + DateTime.Now.ToLongTimeString().Replace(":", "") + rd.Next(9999).ToString() + ".xls";
                    try
                    {
                       FuStud.PostedFile.SaveAs(@Server.MapPath("~/upload/") + filename);
                        getDs(filename);
                    }
                    catch (HttpException ex)
                    {
                        // MessageBox.Show(this, ex.Message.ToString());  出错的情况
                        return;
                    }
                }
   private void getDs(string filename)
        {
            string connstr = " Provider = Microsoft.Jet.OLEDB.4.0 ; Data Source =" + Server.MapPath("~/upload/") + filename + ";Extended Properties=Excel 8.0";
            OleDbConnection conn = new OleDbConnection(connstr);
            conn.Open();
            string sql = "select * from [Sheet1$]";
            OleDbDataAdapter da = new OleDbDataAdapter(sql, conn);
            DataSet ds = new DataSet();
            da.Fill(ds, "[Sheet1$]");
            conn.Close();
            string xm;
            for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
            {
                xm = ds.Tables[0].Rows[i]["姓名"].ToString();//循环读取excel的数据
              
 
            }
        }
```
 
 
