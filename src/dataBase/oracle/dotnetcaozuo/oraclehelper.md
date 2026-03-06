---
title: OracleHelper
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: oraclehelper
slug: gzksbw
docsId: '31816094'
---
```sql
  <appSettings>
    <add key="ConnectionString" value="Data Source= (DESCRIPTION =    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.10)(PORT = 1521))     (CONNECT_DATA =       (SERVER = DEDICATED)       (SERVICE_NAME = LYKG)     )  );User ID==LYKG;Password==Dyzhcs;Persist Security Info=True;Connection Lifetime=20;Max Pool Size=500" />
  </appSettings>
```
记得引用Oracle.ManagedDataAccess东西
```csharp
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;

namespace Service
{
    public class OracleHelper
    {
        //为缓存的参数创建一个hashtable
        private static Hashtable parmCache = Hashtable.Synchronized(new Hashtable());

        public OracleHelper()
        {

            ConnectionString = ConfigurationManager.AppSettings["ConnectionString"];
        }
        public string ConnectionString { get; set; }

        /// <summary>
        /// 增删改操作使用此方法
        /// </summary>
        /// <param name="connString">连接字符串</param>
        /// <param name="cmdType">命令类型（sql语句或者存储过程）</param>
        /// <param name="cmdText">要执行的sql语句或者存储过程名称</param>
        /// <param name="commandParameters">执行所需的一些参数</param>
        /// <returns>返回受影响的行数</returns>
        public int ExecuteNonQuery(string cmdText, params OracleParameter[] commandParameters)
        {
            // 创建一个OracleCommand
            OracleCommand cmd = new OracleCommand();
            //创建一个OracleConnection
            using (OracleConnection connection = new OracleConnection(this.ConnectionString))
            {
                //调用静态方法PrepareCommand完成赋值操作
                PrepareCommand(cmd, connection, null, CommandType.Text, cmdText, commandParameters);
                //执行命令返回
                int val = cmd.ExecuteNonQuery();
                //清空参数
                cmd.Parameters.Clear();
                // OracleConnection.ClearPool(connection);

                return val;
            }

        }

        /// <summary>
        /// 增删改操作使用此方法（需要一个存在的事务参数）
        /// </summary>
        /// <param name="trans">一个存在的事务</param>
        /// <param name="commandType">命令类型（sql或者存储过程）</param>
        /// <param name="commandText">sql语句或者存储过程名称</param>
        /// <param name="commandParameters">命令所需参数数组</param>
        /// <returns>返回受影响的行数</returns>
        public int ExecuteNonQuery(OracleTransaction trans, string cmdText, params OracleParameter[] commandParameters)
        {
            // 创建一个OracleCommand
            OracleCommand cmd = new OracleCommand();
            //调用静态方法PrepareCommand完成赋值操作
            PrepareCommand(cmd, trans.Connection, trans, CommandType.Text, cmdText, commandParameters);
            //执行命令返回
            int val = cmd.ExecuteNonQuery();
            //清空参数
            cmd.Parameters.Clear();

            return val;
        }

        /// <summary>
        /// 增删改操作使用此方法（需要一个存在的连接）
        /// </summary> 
        /// <param name="conn">一个存在的OracleConnection参数</param>
        /// <param name="commandType">命令类型（sql或者存储过程）</param>
        /// <param name="commandText">sql语句或者存储过程名称</param>
        /// <param name="commandParameters">命令所需参数数组</param>
        /// <returns>返回受影响的行数</returns>
        public int ExecuteNonQuery(OracleConnection connection, string cmdText, params OracleParameter[] commandParameters)
        {
            // 创建一个OracleCommand
            OracleCommand cmd = new OracleCommand();
            //调用静态方法PrepareCommand完成赋值操作
            PrepareCommand(cmd, connection, null, CommandType.Text, cmdText, commandParameters);
            //执行命令返回
            int val = cmd.ExecuteNonQuery();
            //清空参数
            cmd.Parameters.Clear();
            // OracleConnection.ClearPool(connection);
            return val;
        }
        /// <summary>  
        /// 执行数据库查询操作,返回DataSet类型的结果集  
        /// </summary>  
        /// <param name="connectionString">数据库连接字符串</param>
        /// <param name="cmdType">命令的类型</param>
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="cmdParms">命令参数集合</param>  
        /// <returns>当前查询操作返回的DataSet类型的结果集</returns>  
        public DataSet ExecuteDataSet(string cmdText, params OracleParameter[] cmdParms)
        {
            OracleCommand cmd = new OracleCommand();
            OracleConnection conn = new OracleConnection(this.ConnectionString);
            DataSet ds = null;
            try
            {
                PrepareCommand(cmd, conn, null, CommandType.Text, cmdText, cmdParms);
                OracleDataAdapter adapter = new OracleDataAdapter();
                adapter.SelectCommand = cmd;
                ds = new DataSet();
                adapter.Fill(ds);
                cmd.Parameters.Clear();
            }
            catch
            {
                throw;
            }
            finally
            {

                cmd.Dispose();
                conn.Close();
                conn.Dispose();
                //OracleConnection.ClearPool(conn);
            }

            return ds;
        }

        /// <summary>  
        /// 执行数据库查询操作,返回DataTable类型的结果集  
        /// </summary>  
        /// <param name="connectionString">数据库连接字符串</param>
        /// <param name="cmdType">命令的类型</param>
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="cmdParms">命令参数集合</param>  
        /// <returns>当前查询操作返回的DataTable类型的结果集</returns>  
        public DataTable ExecuteDataTable(string cmdText, params OracleParameter[] cmdParms)
        {

            DataTable dt = null;

            using (OracleConnection conn = new OracleConnection(this.ConnectionString))
            {
                OracleCommand cmd = new OracleCommand();
                try
                {
                    PrepareCommand(cmd, conn, null, CommandType.Text, cmdText, cmdParms);
                    OracleDataAdapter adapter = new OracleDataAdapter();
                    adapter.SelectCommand = cmd;
                    dt = new DataTable();
                    adapter.Fill(dt);
                    cmd.Parameters.Clear();
                }
                catch
                {
                    throw;
                }
                finally
                {
                    cmd.Dispose();
                    conn.Close();
                    conn.Dispose();
                    OracleConnection.ClearPool(conn);
                }
            }

            return dt;
        }

        /// <summary>
        /// 查询返回一个结果集
        /// </summary>
        /// <param name="connString">连接字符串</param>
        //// <param name="commandType">命令类型（sql或者存储过程）</param>
        /// <param name="commandText">sql语句或者存储过程名称</param>
        /// <param name="commandParameters">命令所需参数数组</param>
        /// <returns></returns>
        public OracleDataReader ExecuteReader(string cmdText, params OracleParameter[] commandParameters)
        {

            // 创建一个OracleCommand

            // 创建一个OracleConnection
            OracleConnection conn = new OracleConnection(this.ConnectionString);
            OracleCommand cmd = new OracleCommand();
            try
            {
                //调用静态方法PrepareCommand完成赋值操作
                PrepareCommand(cmd, conn, null, CommandType.Text, cmdText, commandParameters);
                //执行查询
                OracleDataReader odr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
               // Tools.FileOperator.TxtHelper.WriteTxtFile("logDb.txt", "HasRows:" + odr.HasRows);
                //清空参数
                cmd.Parameters.Clear();
                return odr;

            }
            catch (Exception ex)
            {
                //如果发生异常，关闭连接，并且向上抛出异常
                conn.Close();

                throw;
            }
            finally
            {
                cmd.Dispose();
                //conn.Close();
                //conn.Dispose();
            }
        }

        /// <summary>
        /// 执行语句返回的是单行单列的结果 
        /// </summary>
        /// <param name="connectionString">连接字符串</param>
        /// <param name="commandType">命令类型（sql或者存储过程）</param>
        /// <param name="commandText">sql语句或者存储过程名称</param>
        /// <param name="commandParameters">命令所需参数数组</param>
        /// <returns>返回是第一行第一列的结果（object类型）请使用Covert.to进行类型转换</returns>
        public object ExecuteScalar(string cmdText, params OracleParameter[] commandParameters)
        {
            // 创建一个OracleCommand
            OracleCommand cmd = new OracleCommand();
            // 创建一个OracleConnection
            using (OracleConnection conn = new OracleConnection(this.ConnectionString))
            {
                //调用静态方法PrepareCommand完成赋值操作
                PrepareCommand(cmd, conn, null, CommandType.Text, cmdText, commandParameters);
                //执行查询
                object val = cmd.ExecuteScalar();
                //清空参数
                cmd.Parameters.Clear();
                //OracleConnection.ClearPool(conn);
                return val;
            }
        }

        ///    <summary>
        ///    执行语句返回的是单行单列的结果（有指定的事务参数）
        ///    </summary>
        ///    <param name="transaction">一个存在的事务参数</param>
        ///    <param name="commandType">命令类型（sql或者存储过程）</param>
        ///    <param name="commandText">sql语句或者存储过程名称</param>
        ///    <param name="commandParameters">命令所需参数数组</param>
        ///    <returns>返回是第一行第一列的结果（object类型）请使用Covert.to进行类型转换</returns>
        public object ExecuteScalar(OracleTransaction transaction, string commandText, params OracleParameter[] commandParameters)
        {
            //如果传入的事务是空值，抛出异常
            if (transaction == null)
                throw new ArgumentNullException("transaction");
            //如果传入的事务无连接，抛出异常（无连接，说明传入的事务参数是已经提交过或者回滚了的事务）
            if (transaction != null && transaction.Connection == null)
                throw new ArgumentException("The transaction was rollbacked    or commited, please    provide    an open    transaction.", "transaction");
            // 创建一个OracleCommand
            OracleCommand cmd = new OracleCommand();
            //调用静态方法PrepareCommand完成赋值操作
            PrepareCommand(cmd, transaction.Connection, transaction, CommandType.Text, commandText, commandParameters);
            //执行查询
            object retval = cmd.ExecuteScalar();
            //清空参数
            cmd.Parameters.Clear();

            return retval;
        }

        /// <summary>
        ///   执行语句返回的是单行单列的结果（有指定的连接参数）
        /// </summary>
        /// <param name="conn">一个存在的连接参数</param>
        /// <param name="commandType">命令类型（sql或者存储过程）</param>
        /// <param name="commandText">sql语句或者存储过程名称</param>
        /// <param name="commandParameters">命令所需参数数组</param>
        /// <returns>返回是第一行第一列的结果（object类型）请使用Covert.to进行类型转换</returns>
        public object ExecuteScalar(OracleConnection connectionString, string cmdText, params OracleParameter[] commandParameters)
        {
            // 创建一个OracleCommand
            OracleCommand cmd = new OracleCommand();
            //调用静态方法PrepareCommand完成赋值操作
            PrepareCommand(cmd, connectionString, null, CommandType.Text, cmdText, commandParameters);
            //执行查询
            object val = cmd.ExecuteScalar();
            //清空参数
            cmd.Parameters.Clear();
            // OracleConnection.ClearPool(cmd.Connection);
            return val;
        }

        /// <summary>
        /// Add a set of parameters to the cached
        /// </summary>
        /// <param name="cacheKey">Key value to look up the parameters</param>
        /// <param name="commandParameters">Actual parameters to cached</param>
        public void CacheParameters(string cacheKey, params OracleParameter[] commandParameters)
        {
            parmCache[cacheKey] = commandParameters;
        }

        /// <summary>
        /// 从缓存中获取参数
        /// </summary>
        /// <param name="cacheKey">look up 中的cachekey</param>
        /// <returns></returns>
        public OracleParameter[] GetCachedParameters(string cacheKey)
        {
            OracleParameter[] cachedParms = (OracleParameter[])parmCache[cacheKey];

            if (cachedParms == null)
                return null;

            // 如果缓存中有此参数
            OracleParameter[] clonedParms = new OracleParameter[cachedParms.Length];

            // 返回参数的copy
            for (int i = 0, j = cachedParms.Length; i < j; i++)
                clonedParms[i] = (OracleParameter)((ICloneable)cachedParms[i]).Clone();

            return clonedParms;
        }

        /// <summary>
        /// 一个静态的预处理函数
        /// </summary>
        /// <param name="cmd">存在的OracleCommand对象</param>
        /// <param name="conn">存在的OracleConnection对象</param>
        /// <param name="trans">存在的OracleTransaction对象</param>
        /// <param name="cmdType">命令类型（sql或者存在过程）</param>
        /// <param name="cmdText">sql语句或者存储过程名称</param>
        /// <param name="commandParameters">Parameters for the command</param>
        private void PrepareCommand(OracleCommand cmd, OracleConnection conn, OracleTransaction trans, CommandType commandType, string cmdText, OracleParameter[] commandParameters)
        {

            //如果连接未打开，先打开连接
            if (conn.State != ConnectionState.Open)
                conn.Open();

            //未要执行的命令设置参数
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            cmd.CommandType = commandType;

            //如果传入了事务，需要将命令绑定到指定的事务上去
            if (trans != null)
                cmd.Transaction = trans;

            //将传入的参数信息赋值给命令参数
            if (commandParameters != null)
            {
                cmd.Parameters.AddRange(commandParameters);
            }
        }
    }
}

```
