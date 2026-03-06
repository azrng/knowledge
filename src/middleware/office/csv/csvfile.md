---
title: CsvFile
lang: zh-CN
date: 2022-06-26
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: csvfile
slug: dq2ryg
docsId: '81511329'
---
```csharp
namespace ConsoleApp4
{
    /// <summary>
    /// CSV文件读写工具类
    /// </summary>
    public class CsvFile
    {
        #region 写CSV文件
        //字段数组转为CSV记录行
        private static string FieldsToLine(IEnumerable<string> fields)
        {
            if (fields == null) return string.Empty;
            fields = fields.Select(field =>
            {
                if (field == null) field = string.Empty;
                //所有字段都加双引号
                field = string.Format("\"{0}\"", field.Replace("\"", "\"\""));

                //不简化
                //field = field.Replace("\"", "\"\"");
                //if (field.IndexOfAny(new char[] { ',', '"', ' ', '\r' }) != -1)
                //{
                //    field = string.Format("\"{0}\"", field);
                //}
                return field;
            });
            string line = string.Format("{0}{1}", string.Join(",", fields), Environment.NewLine);
            return line;
        }

        //默认的字段转换方法
        private static IEnumerable<string> GetObjFields<T>(T obj, bool isTitle) where T : class
        {
            IEnumerable<string> fields;
            if (isTitle)
            {
                fields = obj.GetType().GetProperties().Select(pro => pro.Name);
            }
            else
            {
                fields = obj.GetType().GetProperties().Select(pro => pro.GetValue(obj)?.ToString());
            }
            return fields;
        }

        /// <summary>
        /// 写CSV文件，默认第一行为标题
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">数据列表</param>
        /// <param name="path">文件路径</param>
        /// <param name="append">追加记录</param>
        /// <param name="func">字段转换方法</param>
        /// <param name="defaultEncoding"></param>
        public static void Write<T>(List<T> list, string path,bool append=true, Func<T, bool, IEnumerable<string>> func = null, Encoding defaultEncoding = null) where T : class
        {
            if (list == null || list.Count == 0) return;
            if (defaultEncoding == null)
            {
                defaultEncoding = Encoding.UTF8;
            }
            if (func == null)
            {
                func = GetObjFields;
            }
            if (!File.Exists(path)|| !append)
            {
                var fields = func(list[0], true);
                string title = FieldsToLine(fields);
                File.WriteAllText(path, title, defaultEncoding);
            }
            using (StreamWriter sw = new StreamWriter(path, true, defaultEncoding))
            {
                list.ForEach(obj =>
                {
                    var fields = func(obj, false);
                    string line = FieldsToLine(fields);
                    sw.Write(line);
                });
            }
        }
        #endregion

        #region 读CSV文件（使用TextFieldParser）
        /// <summary>
        /// 读CSV文件，默认第一行为标题
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="path">文件路径</param>
        /// <param name="func">字段解析规则</param>
        /// <param name="defaultEncoding">文件编码</param>
        /// <returns></returns>
        public static List<T> Read<T>(string path, Func<string[], T> func, Encoding defaultEncoding = null) where T : class
        {
            if (defaultEncoding == null)
            {
                defaultEncoding = Encoding.UTF8;
            }
            List<T> list = new List<T>();
            using (TextFieldParser parser = new TextFieldParser(path, defaultEncoding))
            {
                parser.TextFieldType = FieldType.Delimited;
                //设定逗号分隔符
                parser.SetDelimiters(",");
                //设定不忽略字段前后的空格
                parser.TrimWhiteSpace = false;
                bool isLine = false;
                while (!parser.EndOfData)
                {
                    string[] fields = parser.ReadFields();
                    if (isLine)
                    {
                        var obj = func(fields);
                        if (obj != null) list.Add(obj);
                    }
                    else
                    {
                        //忽略标题行业
                        isLine = true;
                    }
                }
            }
            return list;
        }
        #endregion

        #region 读CSV文件（使用正则表达式）
        /// <summary>
        /// 读CSV文件，默认第一行为标题
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="path">文件路径</param>
        /// <param name="func">字段解析规则</param>
        /// <param name="defaultEncoding">文件编码</param>
        /// <returns></returns>
        public static List<T> Read_Regex<T>(string path, Func<string[], T> func, Encoding defaultEncoding = null) where T : class
        {
            List<T> list = new List<T>();
            StringBuilder sbr = new StringBuilder(100);
            Regex lineReg = new Regex("\"");
            Regex fieldReg = new Regex("\\G(?:^|,)(?:\"((?>[^\"]*)(?>\"\"[^\"]*)*)\"|([^\",]*))");
            Regex quotesReg = new Regex("\"\"");

            bool isLine = false;
            string line = string.Empty;
            using (StreamReader sr = new StreamReader(path))
            {
                while (null != (line = ReadLine(sr)))
                {
                    sbr.Append(line);
                    string str = sbr.ToString();
                    //一个完整的CSV记录行，它的双引号一定是偶数
                    if (lineReg.Matches(sbr.ToString()).Count % 2 == 0)
                    {
                        if (isLine)
                        {
                            var fields = ParseCsvLine(sbr.ToString(), fieldReg, quotesReg).ToArray();
                            var obj = func(fields.ToArray());
                            if (obj != null) list.Add(obj);
                        }
                        else
                        {
                            //忽略标题行业
                            isLine = true;
                        }
                        sbr.Clear();
                    }
                    else
                    {
                        sbr.Append(Environment.NewLine);
                    }                   
                }
            }
            if (sbr.Length > 0)
            {
                //有解析失败的字符串，报错或忽略
            }
            return list;
        }

        //重写ReadLine方法，只有\r\n才是正确的一行
        private static string ReadLine(StreamReader sr) 
        {
            StringBuilder sbr = new StringBuilder();
            char c;
            int cInt;
            while (-1 != (cInt =sr.Read()))
            {
                c = (char)cInt;
                if (c == '\n' && sbr.Length > 0 && sbr[sbr.Length - 1] == '\r')
                {
                    sbr.Remove(sbr.Length - 1, 1);
                    return sbr.ToString();
                }
                else 
                {
                    sbr.Append(c);
                }
            }
            return sbr.Length>0?sbr.ToString():null;
        }
       
        private static List<string> ParseCsvLine(string line, Regex fieldReg, Regex quotesReg)
        {
            var fieldMath = fieldReg.Match(line);
            List<string> fields = new List<string>();
            while (fieldMath.Success)
            {
                string field;
                if (fieldMath.Groups[1].Success)
                {
                    field = quotesReg.Replace(fieldMath.Groups[1].Value, "\"");
                }
                else
                {
                    field = fieldMath.Groups[2].Value;
                }
                fields.Add(field);
                fieldMath = fieldMath.NextMatch();
            }
            return fields;
        }
        #endregion

    }
}
```
使用方法如下：
```csharp
//写CSV文件
CsvFile.Write(records, path, true, new Func<Test, bool, IEnumerable<string>>((obj, isTitle) =>
{
    IEnumerable<string> fields;
    if (isTitle)
    {
        fields = obj.GetType().GetProperties().Select(pro => pro.Name + Environment.NewLine + "\",\"");
    }
    else
    {
        fields = obj.GetType().GetProperties().Select(pro => pro.GetValue(obj)?.ToString());
    }
    return fields;
}));

//读CSV文件
records = CsvFile.Read(path, Test.Parse);

//读CSV文件
records = CsvFile.Read_Regex(path, Test.Parse);
```
