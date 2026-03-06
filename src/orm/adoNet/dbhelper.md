---
title: DbHelper
lang: zh-CN
date: 2023-03-28
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: dbhelper
slug: apd11o
docsId: '63912517'
---
## DbHelperMySql
```csharp
public class DbHelperMySql
{
    //数据库连接字符串(web.config来配置)，可以动态更改connectionString支持多数据库.
    private static string connectionString = "server=localhost;database=moviesystem;uid=root;pwd=;SslMode=None;";

    /// <summary>
    /// 得到最大值
    /// </summary>
    /// <param name="fieldName">字段名</param>
    /// <param name="tableName">表名字</param>
    /// <returns></returns>
    public static int GetMaxId(string fieldName, string tableName)
    {
        var strsql = "select max(" + fieldName + ")+1 from " + tableName;
        var obj = ExecuteScalar(strsql);
        return obj == null ? 1 : int.Parse(obj.ToString());
    }

    /// <summary>
    /// 是否存在
    /// </summary>
    /// <param name="strSql"></param>
    /// <param name="cmdParms"></param>
    /// <returns></returns>
    public static bool Exists(string strSql, params MySqlParameter[] cmdParms)
    {
        var obj = ExecuteScalar(strSql, cmdParms);
        int cmdresult;
        if (Equals(obj, null) || Equals(obj, DBNull.Value))
        {
            cmdresult = 0;
        }
        else
        {
            cmdresult = int.Parse(obj.ToString());
        }

        return cmdresult != 0;
    }

    /// <summary>
    /// 返回受影响行数
    /// </summary>
    /// <param name="sqlString">strsql</param>
    /// <param name="times">超时时间</param>
    /// <param name="cmdParms">参数</param>
    /// <returns></returns>
    public static int ExecuteSql(string sqlString, int? times, params MySqlParameter[] cmdParms)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
            }

            using (var cmd = new MySqlCommand(sqlString, connection))
            {
                if (times != null)
                    cmd.CommandTimeout = times.Value;

                if (cmdParms != null)
                {
                    cmd.Parameters.AddRange(cmdParms);
                }

                try
                {
                    return Convert.ToInt32(cmd.ExecuteNonQuery());
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }
    }

    /// <summary>
    /// 执行多条SQL语句，实现数据库事务。
    /// </summary>
    /// <param name="sqlStringList">多条SQL语句</param>
    public static int ExecuteSqlTran(List<string> sqlStringList)
    {
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = conn;
            var tx = conn.BeginTransaction();
            cmd.Transaction = tx;
            try
            {
                var count = 0;
                for (var n = 0; n < sqlStringList.Count; n++)
                {
                    var strsql = sqlStringList[n];
                    if (strsql.Trim().Length > 1)
                    {
                        cmd.CommandText = strsql;
                        count += cmd.ExecuteNonQuery();
                    }
                }

                tx.Commit();
                return count;
            }
            catch
            {
                tx.Rollback();
                return 0;
            }
        }
    }


    /// <summary>
    /// 首行首列
    /// </summary>
    /// <param name="sqlString">计算查询结果语句</param>
    /// <returns>查询结果（object）</returns>
    public static object ExecuteScalar(string sqlString)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
            }

            using (var cmd = new MySqlCommand(sqlString, connection))
            {
                try
                {
                    var obj = cmd.ExecuteScalar();
                    if (Equals(obj, null) || Equals(obj, DBNull.Value))
                    {
                        return null;
                    }

                    return obj;
                }
                catch (MySqlException e)
                {
                    connection.Close();
                    throw e;
                }
            }
        }
    }


    /// <summary>
    /// 首行首列
    /// </summary>
    /// <param name="sqlString">strsql</param>
    /// <param name="cmdParms">参数</param>
    /// <returns>首行首列</returns>
    public static object ExecuteScalar(string sqlString, params MySqlParameter[] cmdParms)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            using (var cmd = new MySqlCommand())
            {
                try
                {
                    PrepareCommand(cmd, connection, null, sqlString, cmdParms);
                    var obj = cmd.ExecuteScalar();
                    cmd.Parameters.Clear();
                    if (Equals(obj, null) || Equals(obj, DBNull.Value))
                    {
                        return null;
                    }

                    return obj;
                }
                catch (MySqlException e)
                {
                    throw e;
                }
            }
        }
    }

    /// <summary>
    /// 执行查询语句，返回DataSet
    /// </summary>
    /// <param name="sqlString">strsql</param>
    /// <param name="times">过期时间</param>
    /// <param name="cmdParms">参数</param>
    /// <returns>返回DataSet</returns>
    public static DataSet GetData(string sqlString, int? times, params MySqlParameter[] cmdParms)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            if (connection.State == ConnectionState.Closed)
            {
                connection.Open();
            }

            var cmd = new MySqlCommand();

            PrepareCommand(cmd, connection, null, sqlString, cmdParms);
            using (var da = new MySqlDataAdapter(cmd))
            {
                if (times != null)
                    da.SelectCommand.CommandTimeout = times.Value;
                var ds = new DataSet();
                try
                {
                    da.Fill(ds, "ds");
                    cmd.Parameters.Clear();
                }
                catch (MySqlException ex)
                {
                    throw new Exception(ex.Message);
                }

                return ds;
            }
        }
    }

    /// <summary>
    /// 执行存储过程
    /// </summary>
    /// <param name="procName">存储过程名称</param>
    /// <param name="parm">参数</param>
    /// <returns></returns>
    public static MySqlDataReader GetDataTableByProc(string procName, params MySqlParameter[] parm)
    {
        using (var conn = new MySqlConnection(connectionString))
        {
            using (var cmd = new MySqlCommand(procName, conn))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }

                if (parm != null)
                {
                    cmd.Parameters.AddRange(parm);
                }

                cmd.CommandType = CommandType.StoredProcedure;
                return cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
        }
    }

    /// <summary>
    /// 执行存储过程
    /// </summary>
    /// <param name="procName">存储过程名称</param>
    /// <param name="parm">参数</param>
    /// <returns></returns>
    public static bool ExecuteNonQueryByProc(string procName, params MySqlParameter[] parm)
    {
        bool flag = false;
        using (var conn = new MySqlConnection(connectionString))
        {
            using (var cmd = new MySqlCommand(procName, conn))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }

                if (parm != null)
                {
                    cmd.Parameters.AddRange(parm);
                }

                cmd.CommandType = CommandType.StoredProcedure;
                if (int.Parse(cmd.ExecuteNonQuery().ToString()) > 0)
                {
                    flag = true;
                }

                return flag;
            }
        }
    }

    /// <summary>
    /// 执行sql语句
    /// </summary>
    private static void PrepareCommand(MySqlCommand cmd, MySqlConnection conn, MySqlTransaction trans,
        string cmdText, MySqlParameter[] cmdParms)
    {
        if (conn.State != ConnectionState.Open)
            conn.Open();
        cmd.Connection = conn;
        cmd.CommandText = cmdText;
        if (trans != null)
            cmd.Transaction = trans;
        cmd.CommandType = CommandType.Text; //cmdType;
        if (cmdParms != null)
        {
            foreach (var parameter in cmdParms)
            {
                if ((parameter.Direction == ParameterDirection.InputOutput ||
                     parameter.Direction == ParameterDirection.Input) &&
                    parameter.Value == null)
                {
                    parameter.Value = DBNull.Value;
                }

                cmd.Parameters.Add(parameter);
            }
        }
    }

    /// <summary>
    /// 执行多条SQL语句，实现数据库事务。
    /// </summary>
    /// <param name="sqlStringList">SQL语句的哈希表（key为sql语句，value是该语句的MySqlParameter[]）</param>
    public static void ExecuteSqlTran(Hashtable sqlStringList)
    {
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            using (var trans = conn.BeginTransaction())
            {
                var cmd = new MySqlCommand();
                try
                {
                    //循环
                    foreach (DictionaryEntry myDE in sqlStringList)
                    {
                        var cmdText = myDE.Key.ToString();
                        var cmdParms = (MySqlParameter[])myDE.Value;
                        PrepareCommand(cmd, conn, trans, cmdText, cmdParms);
                        var val = cmd.ExecuteNonQuery();
                        cmd.Parameters.Clear();
                    }

                    trans.Commit();
                }
                catch
                {
                    trans.Rollback();
                    throw;
                }
            }
        }
    }

    /// <summary>
    /// 执行多条SQL语句，实现数据库事务。
    /// </summary>
    /// <param name="sqlStringList">SQL语句的哈希表（key为sql语句，value是该语句的MySqlParameter[]）</param>
    public static void ExecuteSqlTranWithIdentity(Hashtable sqlStringList)
    {
        using (var conn = new MySqlConnection(connectionString))
        {
            conn.Open();
            using (var trans = conn.BeginTransaction())
            {
                var cmd = new MySqlCommand();
                try
                {
                    var indentity = 0;
                    //循环
                    foreach (DictionaryEntry myDE in sqlStringList)
                    {
                        var cmdText = myDE.Key.ToString();
                        var cmdParms = (MySqlParameter[])myDE.Value;
                        foreach (var q in cmdParms)
                        {
                            if (q.Direction == ParameterDirection.InputOutput)
                            {
                                q.Value = indentity;
                            }
                        }

                        PrepareCommand(cmd, conn, trans, cmdText, cmdParms);
                        var val = cmd.ExecuteNonQuery();
                        foreach (var q in cmdParms)
                        {
                            if (q.Direction == ParameterDirection.Output)
                            {
                                indentity = Convert.ToInt32(q.Value);
                            }
                        }

                        cmd.Parameters.Clear();
                    }

                    trans.Commit();
                }
                catch
                {
                    trans.Rollback();
                    throw;
                }
            }
        }
    }

    /// <summary>
    /// MySqlDataReader查询 * ( 注意：调用该方法后，一定要对MySqlDataReader进行Close )
    /// </summary>
    /// <param name="cmdParms"></param>
    /// <param name="sqlString"></param>
    /// <returns>MySqlDataReader</returns>
    public static MySqlDataReader ExecuteReader(string sqlString, params MySqlParameter[] cmdParms)
    {
        MySqlDataReader sqldata = null;
        var connection = new MySqlConnection(connectionString);
        var cmd = new MySqlCommand();
        try
        {
            PrepareCommand(cmd, connection, null, sqlString, cmdParms);
            var myReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            cmd.Parameters.Clear();
            sqldata = myReader;
        }
        catch (MySqlException)
        {
            sqldata = null;
        }

        return sqldata;
    }

    /// <summary>
    /// 执行带一个存储过程参数的的SQL语句。
    /// </summary>
    /// <param name="sqlString">SQL语句</param>
    /// <param name="content">参数内容,比如一个字段是格式复杂的文章，有特殊符号，可以通过这个方式添加</param>
    /// <returns>影响的记录数</returns>
    public static int ExecuteSql(string sqlString, string content)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            var cmd = new MySqlCommand(sqlString, connection);
            var myParameter = new MySqlParameter("@content", SqlDbType.NText) { Value = content };
            cmd.Parameters.Add(myParameter);
            try
            {
                connection.Open();
                var rows = cmd.ExecuteNonQuery();
                return rows;
            }
            catch (MySqlException e)
            {
                throw e;
            }
            finally
            {
                cmd.Dispose();
                connection.Close();
            }
        }
    }

    /// <summary>
    /// 执行带一个存储过程参数的的SQL语句。
    /// </summary>
    /// <param name="sqlString">SQL语句</param>
    /// <param name="content">参数内容,比如一个字段是格式复杂的文章，有特殊符号，可以通过这个方式添加</param>
    /// <returns>影响的记录数</returns>
    public static object ExecuteSqlGet(string sqlString, string content)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            var cmd = new MySqlCommand(sqlString, connection);
            var myParameter = new MySqlParameter("@content", SqlDbType.NText) { Value = content };
            cmd.Parameters.Add(myParameter);
            try
            {
                connection.Open();
                var obj = cmd.ExecuteScalar();
                if (Equals(obj, null) || Equals(obj, DBNull.Value))
                {
                    return null;
                }
                else
                {
                    return obj;
                }
            }
            catch (MySqlException e)
            {
                throw e;
            }
            finally
            {
                cmd.Dispose();
                connection.Close();
            }
        }
    }

    /// <summary>
    /// 向数据库里插入图像格式的字段(和上面情况类似的另一种实例)
    /// </summary>
    /// <param name="strSql">SQL语句</param>
    /// <param name="fs">图像字节,数据库的字段类型为image的情况</param>
    /// <returns>影响的记录数</returns>
    public static int ExecuteSqlInsertImg(string strSql, byte[] fs)
    {
        using (var connection = new MySqlConnection(connectionString))
        {
            var cmd = new MySqlCommand(strSql, connection);
            var myParameter =
                new MySqlParameter("@fs", SqlDbType.Image) { Value = fs };
            cmd.Parameters.Add(myParameter);
            try
            {
                connection.Open();
                return cmd.ExecuteNonQuery();
            }
            catch (MySqlException e)
            {
                throw e;
            }
            finally
            {
                cmd.Dispose();
                connection.Close();
            }
        }
    }
}
```

## OracleHelper

```csharp
public class OracleHelper
{
    //为缓存的参数创建一个hashtable
    private static Hashtable _parmCache = Hashtable.Synchronized(new Hashtable());

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
    public int ExecuteNonQuery(OracleConnection connection, string cmdText,
        params OracleParameter[] commandParameters)
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
        catch (Exception)
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
    public object ExecuteScalar(OracleTransaction transaction, string commandText,
        params OracleParameter[] commandParameters)
    {
        //如果传入的事务是空值，抛出异常
        if (transaction == null)
            throw new ArgumentNullException("transaction");
        //如果传入的事务无连接，抛出异常（无连接，说明传入的事务参数是已经提交过或者回滚了的事务）
        if (transaction != null && transaction.Connection == null)
            throw new ArgumentException(
                "The transaction was rollbacked    or commited, please    provide    an open    transaction.",
                "transaction");
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
    public object ExecuteScalar(OracleConnection connectionString, string cmdText,
        params OracleParameter[] commandParameters)
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
        _parmCache[cacheKey] = commandParameters;
    }

    /// <summary>
    /// 从缓存中获取参数
    /// </summary>
    /// <param name="cacheKey">look up 中的cachekey</param>
    /// <returns></returns>
    public OracleParameter[] GetCachedParameters(string cacheKey)
    {
        OracleParameter[] cachedParms = (OracleParameter[])_parmCache[cacheKey];

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
    private void PrepareCommand(OracleCommand cmd, OracleConnection conn, OracleTransaction trans,
        CommandType commandType, string cmdText, OracleParameter[] commandParameters)
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
```

