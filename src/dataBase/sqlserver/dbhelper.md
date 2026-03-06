---
title: DBHelper
lang: zh-CN
date: 2021-12-30
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: dbhelper
slug: yavuc0
docsId: '26493356'
---
操作
```c#
首行首列
public static object ExecuteScalar(string sql, params SqlParameter[] param)
        {
            using (SqlConnection con = new SqlConnection(conn))
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                using (SqlCommand com = new SqlCommand(sql, con))
                {
                    if (param != null)
                    {
                        com.Parameters.AddRange(param);
                    }
                    return com.ExecuteScalar();
                }
            }
        }

查询
public static DataTable GetDate(string sql, params SqlParameter[] parm)
        {
            using (SqlConnection con = new SqlConnection(conn))
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                SqlDataAdapter da = new SqlDataAdapter(sql, con);
                DataSet ds = new DataSet();
                if (parm != null)
                {
                    da.SelectCommand.Parameters.AddRange(parm);
                }
                da.Fill(ds);
                return ds.Tables[0];
            }

        }

受影响行数
 public static bool ExecuteNonQuery(string sql, params SqlParameter[] parm)
        {
            bool i = false;
            using (SqlConnection con = new SqlConnection(conn))
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                using (SqlCommand com = new SqlCommand(sql, con))
                {
                    if (parm != null)
                    {
                        com.Parameters.AddRange(parm);
                    }
                    if (Convert.ToInt32(com.ExecuteNonQuery()) > 0)
                    {
                        i = true;
                    }
                    return i;
                }
            }
        }

SqlDataReader 查询
  public static SqlDataReader DataReader(string sql, params SqlParameter[] parm)
        {
            SqlConnection con = new SqlConnection(conn);//此处不能使用using
            if (con.State == ConnectionState.Closed)
            {
                con.Open();
            }
            using (SqlCommand cmd = new SqlCommand(sql, con))
            {
                if (parm != null)
                {
                    cmd.Parameters.AddRange(parm);
                }
                return cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
        }
执行存储过程
  public static SqlDataReader DataReaderByProc(string procname, params SqlParameter[] parm)
        {
            SqlConnection con = new SqlConnection(conn);
            using (SqlCommand cmd = new SqlCommand(procname, con))
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                if (parm != null)
                {
                    cmd.Parameters.AddRange(parm);
                }
                cmd.CommandType = CommandType.StoredProcedure;
                return cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
        }



```
