---
title: 图片转base64
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: tupianzhuaibase64
slug: yf2svw
docsId: '31541561'
---
```csharp
        /// <summary>
        /// 将图片转换成Base64字符串
        /// </summary>
        /// <param name="fileName">文件路径加名称</param>
        /// <returns></returns>
        public static string ImgToBase64String(string fileName)
        {
            try
            {
                //相对路径转换为绝对路径
                string filePath = System.IO.Path.Combine(System.Web.HttpContext.Current.Server.MapPath(fileName));
                //判断图片是否存在
                if (File.Exists(filePath))
                {
                    Bitmap bmp = new Bitmap(filePath);
                    int newHeight = bmp.Height;
                    if (bmp.Width > 2000)
                    {
                        float _w = bmp.Width / 2000;
                        newHeight = (int)(bmp.Height / _w);
                        bmp = KiResizeImage(bmp, 2000, newHeight); //图片等比例压缩至宽度2000px 
                    }

                    MemoryStream ms = new MemoryStream();
                    bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] arr = new byte[ms.Length];
                    ms.Position = 0;
                    ms.Read(arr, 0, (int)ms.Length);
                    ms.Close();
                    return Convert.ToBase64String(arr);
                }
                else
                    return "未找到文件";
            }
            catch (Exception e)
            {
                LogHelper.WriteLogTxt("ImgToBase64String ErrorMessage:" + e.Message);
                LogHelper.WriteLogTxt("ImgToBase64String error:" + e);

                return "failure";
            }
        }

        /// <summary>  
        /// Resize图片  
        /// </summary>  
        /// <param name="bmp">原始Bitmap</param>  
        /// <param name="newW">新的宽度</param>  
        /// <param name="newH">新的高度</param>  
        /// <returns>处理以后的Bitmap</returns>  
        public static Bitmap KiResizeImage(Bitmap bmp, int newW, int newH)
        {
            try
            {
                Bitmap b = new Bitmap(newW, newH);
                Graphics g = Graphics.FromImage(b);

                g.InterpolationMode = InterpolationMode.HighQualityBicubic;

                g.DrawImage(bmp, new Rectangle(0, 0, newW, newH), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
                g.Dispose();

                return b;
            }
            catch
            {
                return null;
            }
        }

```
