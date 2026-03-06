---
title: 动软代码生成器
lang: zh-CN
date: 2022-01-10
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: dongruandaimashengchengqi
slug: yl6uy4
docsId: '29663494'
---

## 介绍
官网地址：[http://www.maticsoft.com/download.aspx](http://www.maticsoft.com/download.aspx)

## 公共类
```csharp
using System;
using System.Data;
using System.Text;
using System.Data.SqlClient;
using Maticsoft.IDAL;
using Maticsoft.DBUtility;//Please add references
namespace Maticsoft.SQLServerDAL
{
    /// <summary>
    /// 数据访问类:BlogArticle
    /// </summary>
    public partial class BlogArticle:IBlogArticle
    {
        public BlogArticle()
        {}
        #region  BasicMethod

        /// <summary>
        /// 得到最大ID
        /// </summary>
        public int GetMaxId()
        {
        return DbHelperSQL.GetMaxID("bID", "BlogArticle"); 
        }

        /// <summary>
        /// 是否存在该记录
        /// </summary>
        public bool Exists(int bID)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("select count(1) from BlogArticle");
            strSql.Append(" where bID=@bID");
            SqlParameter[] parameters = {
                    new SqlParameter("@bID", SqlDbType.Int,4)
            };
            parameters[0].Value = bID;

            return DbHelperSQL.Exists(strSql.ToString(),parameters);
        }


        /// <summary>
        /// 增加一条数据
        /// </summary>
        public int Add(Maticsoft.Model.BlogArticle model)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("insert into BlogArticle(");
            strSql.Append("bsubmitter,btitle,bcategory,bcontent,btraffic,bcommentNum,bUpdateTime,bCreateTime,bRemark)");
            strSql.Append(" values (");
            strSql.Append("@bsubmitter,@btitle,@bcategory,@bcontent,@btraffic,@bcommentNum,@bUpdateTime,@bCreateTime,@bRemark)");
            strSql.Append(";select @@IDENTITY");
            SqlParameter[] parameters = {
                    new SqlParameter("@bsubmitter", SqlDbType.NVarChar,60),
                    new SqlParameter("@btitle", SqlDbType.NVarChar,256),
                    new SqlParameter("@bcategory", SqlDbType.NVarChar,-1),
                    new SqlParameter("@bcontent", SqlDbType.Text),
                    new SqlParameter("@btraffic", SqlDbType.Int,4),
                    new SqlParameter("@bcommentNum", SqlDbType.Int,4),
                    new SqlParameter("@bUpdateTime", SqlDbType.DateTime),
                    new SqlParameter("@bCreateTime", SqlDbType.DateTime),
                    new SqlParameter("@bRemark", SqlDbType.NVarChar,-1)};
            parameters[0].Value = model.bsubmitter;
            parameters[1].Value = model.btitle;
            parameters[2].Value = model.bcategory;
            parameters[3].Value = model.bcontent;
            parameters[4].Value = model.btraffic;
            parameters[5].Value = model.bcommentNum;
            parameters[6].Value = model.bUpdateTime;
            parameters[7].Value = model.bCreateTime;
            parameters[8].Value = model.bRemark;

            object obj = DbHelperSQL.GetSingle(strSql.ToString(),parameters);
            if (obj == null)
            {
                return 0;
            }
            else
            {
                return Convert.ToInt32(obj);
            }
        }
        /// <summary>
        /// 更新一条数据
        /// </summary>
        public bool Update(Maticsoft.Model.BlogArticle model)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("update BlogArticle set ");
            strSql.Append("bsubmitter=@bsubmitter,");
            strSql.Append("btitle=@btitle,");
            strSql.Append("bcategory=@bcategory,");
            strSql.Append("bcontent=@bcontent,");
            strSql.Append("btraffic=@btraffic,");
            strSql.Append("bcommentNum=@bcommentNum,");
            strSql.Append("bUpdateTime=@bUpdateTime,");
            strSql.Append("bCreateTime=@bCreateTime,");
            strSql.Append("bRemark=@bRemark");
            strSql.Append(" where bID=@bID");
            SqlParameter[] parameters = {
                    new SqlParameter("@bsubmitter", SqlDbType.NVarChar,60),
                    new SqlParameter("@btitle", SqlDbType.NVarChar,256),
                    new SqlParameter("@bcategory", SqlDbType.NVarChar,-1),
                    new SqlParameter("@bcontent", SqlDbType.Text),
                    new SqlParameter("@btraffic", SqlDbType.Int,4),
                    new SqlParameter("@bcommentNum", SqlDbType.Int,4),
                    new SqlParameter("@bUpdateTime", SqlDbType.DateTime),
                    new SqlParameter("@bCreateTime", SqlDbType.DateTime),
                    new SqlParameter("@bRemark", SqlDbType.NVarChar,-1),
                    new SqlParameter("@bID", SqlDbType.Int,4)};
            parameters[0].Value = model.bsubmitter;
            parameters[1].Value = model.btitle;
            parameters[2].Value = model.bcategory;
            parameters[3].Value = model.bcontent;
            parameters[4].Value = model.btraffic;
            parameters[5].Value = model.bcommentNum;
            parameters[6].Value = model.bUpdateTime;
            parameters[7].Value = model.bCreateTime;
            parameters[8].Value = model.bRemark;
            parameters[9].Value = model.bID;

            int rows=DbHelperSQL.ExecuteSql(strSql.ToString(),parameters);
            if (rows > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// 删除一条数据
        /// </summary>
        public bool Delete(int bID)
        {
            
            StringBuilder strSql=new StringBuilder();
            strSql.Append("delete from BlogArticle ");
            strSql.Append(" where bID=@bID");
            SqlParameter[] parameters = {
                    new SqlParameter("@bID", SqlDbType.Int,4)
            };
            parameters[0].Value = bID;

            int rows=DbHelperSQL.ExecuteSql(strSql.ToString(),parameters);
            if (rows > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// 批量删除数据
        /// </summary>
        public bool DeleteList(string bIDlist )
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("delete from BlogArticle ");
            strSql.Append(" where bID in ("+bIDlist + ")  ");
            int rows=DbHelperSQL.ExecuteSql(strSql.ToString());
            if (rows > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public Maticsoft.Model.BlogArticle GetModel(int bID)
        {
            
            StringBuilder strSql=new StringBuilder();
            strSql.Append("select  top 1 bID,bsubmitter,btitle,bcategory,bcontent,btraffic,bcommentNum,bUpdateTime,bCreateTime,bRemark from BlogArticle ");
            strSql.Append(" where bID=@bID");
            SqlParameter[] parameters = {
                    new SqlParameter("@bID", SqlDbType.Int,4)
            };
            parameters[0].Value = bID;

            Maticsoft.Model.BlogArticle model=new Maticsoft.Model.BlogArticle();
            DataSet ds=DbHelperSQL.Query(strSql.ToString(),parameters);
            if(ds.Tables[0].Rows.Count>0)
            {
                return DataRowToModel(ds.Tables[0].Rows[0]);
            }
            else
            {
                return null;
            }
        }


        /// <summary>
        /// 得到一个对象实体
        /// </summary>
        public Maticsoft.Model.BlogArticle DataRowToModel(DataRow row)
        {
            Maticsoft.Model.BlogArticle model=new Maticsoft.Model.BlogArticle();
            if (row != null)
            {
                if(row["bID"]!=null && row["bID"].ToString()!="")
                {
                    model.bID=int.Parse(row["bID"].ToString());
                }
                if(row["bsubmitter"]!=null)
                {
                    model.bsubmitter=row["bsubmitter"].ToString();
                }
                if(row["btitle"]!=null)
                {
                    model.btitle=row["btitle"].ToString();
                }
                if(row["bcategory"]!=null)
                {
                    model.bcategory=row["bcategory"].ToString();
                }
                if(row["bcontent"]!=null)
                {
                    model.bcontent=row["bcontent"].ToString();
                }
                if(row["btraffic"]!=null && row["btraffic"].ToString()!="")
                {
                    model.btraffic=int.Parse(row["btraffic"].ToString());
                }
                if(row["bcommentNum"]!=null && row["bcommentNum"].ToString()!="")
                {
                    model.bcommentNum=int.Parse(row["bcommentNum"].ToString());
                }
                if(row["bUpdateTime"]!=null && row["bUpdateTime"].ToString()!="")
                {
                    model.bUpdateTime=DateTime.Parse(row["bUpdateTime"].ToString());
                }
                if(row["bCreateTime"]!=null && row["bCreateTime"].ToString()!="")
                {
                    model.bCreateTime=DateTime.Parse(row["bCreateTime"].ToString());
                }
                if(row["bRemark"]!=null)
                {
                    model.bRemark=row["bRemark"].ToString();
                }
            }
            return model;
        }

        /// <summary>
        /// 获得数据列表
        /// </summary>
        public DataSet GetList(string strWhere)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("select bID,bsubmitter,btitle,bcategory,bcontent,btraffic,bcommentNum,bUpdateTime,bCreateTime,bRemark ");
            strSql.Append(" FROM BlogArticle ");
            if(strWhere.Trim()!="")
            {
                strSql.Append(" where "+strWhere);
            }
            return DbHelperSQL.Query(strSql.ToString());
        }

        /// <summary>
        /// 获得前几行数据
        /// </summary>
        public DataSet GetList(int Top,string strWhere,string filedOrder)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("select ");
            if(Top>0)
            {
                strSql.Append(" top "+Top.ToString());
            }
            strSql.Append(" bID,bsubmitter,btitle,bcategory,bcontent,btraffic,bcommentNum,bUpdateTime,bCreateTime,bRemark ");
            strSql.Append(" FROM BlogArticle ");
            if(strWhere.Trim()!="")
            {
                strSql.Append(" where "+strWhere);
            }
            strSql.Append(" order by " + filedOrder);
            return DbHelperSQL.Query(strSql.ToString());
        }

        /// <summary>
        /// 获取记录总数
        /// </summary>
        public int GetRecordCount(string strWhere)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("select count(1) FROM BlogArticle ");
            if(strWhere.Trim()!="")
            {
                strSql.Append(" where "+strWhere);
            }
            object obj = DbHelperSQL.GetSingle(strSql.ToString());
            if (obj == null)
            {
                return 0;
            }
            else
            {
                return Convert.ToInt32(obj);
            }
        }
        /// <summary>
        /// 分页获取数据列表
        /// </summary>
        public DataSet GetListByPage(string strWhere, string orderby, int startIndex, int endIndex)
        {
            StringBuilder strSql=new StringBuilder();
            strSql.Append("SELECT * FROM ( ");
            strSql.Append(" SELECT ROW_NUMBER() OVER (");
            if (!string.IsNullOrEmpty(orderby.Trim()))
            {
                strSql.Append("order by T." + orderby );
            }
            else
            {
                strSql.Append("order by T.bID desc");
            }
            strSql.Append(")AS Row, T.*  from BlogArticle T ");
            if (!string.IsNullOrEmpty(strWhere.Trim()))
            {
                strSql.Append(" WHERE " + strWhere);
            }
            strSql.Append(" ) TT");
            strSql.AppendFormat(" WHERE TT.Row between {0} and {1}", startIndex, endIndex);
            return DbHelperSQL.Query(strSql.ToString());
        }

        /*
        /// <summary>
        /// 分页获取数据列表
        /// </summary>
        public DataSet GetList(int PageSize,int PageIndex,string strWhere)
        {
            SqlParameter[] parameters = {
                    new SqlParameter("@tblName", SqlDbType.VarChar, 255),
                    new SqlParameter("@fldName", SqlDbType.VarChar, 255),
                    new SqlParameter("@PageSize", SqlDbType.Int),
                    new SqlParameter("@PageIndex", SqlDbType.Int),
                    new SqlParameter("@IsReCount", SqlDbType.Bit),
                    new SqlParameter("@OrderType", SqlDbType.Bit),
                    new SqlParameter("@strWhere", SqlDbType.VarChar,1000),
                    };
            parameters[0].Value = "BlogArticle";
            parameters[1].Value = "bID";
            parameters[2].Value = PageSize;
            parameters[3].Value = PageIndex;
            parameters[4].Value = 0;
            parameters[5].Value = 0;
            parameters[6].Value = strWhere;    
            return DbHelperSQL.RunProcedure("UP_GetRecordByPage",parameters,"ds");
        }*/

        #endregion  BasicMethod
        #region  ExtensionMethod

        #endregion  ExtensionMethod
    }
}

```
