---
title: 脚本
lang: zh-CN
date: 2025-02-21
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
  - pgsql
tag:
  - 脚本
---

## 审计函数脚本

以下是一个通用的创建审计触发器的函数，可以为任意表创建审计功能：

:::info

使用前请确保：
1. 已创建 audit schema（或指定的其他审计schema）
2. 当前用户有相应的创建表和触发器的权限

:::

:::details

```sql
-- 创建审计schema（如果已存在可以跳过）
CREATE SCHEMA IF NOT EXISTS audit;

-- 创建通用审计触发器函数
CREATE OR REPLACE FUNCTION audit.create_audit_trigger(
    origin_schema TEXT,     -- 原始表所在schema
    origin_table TEXT,      -- 原始表名
    audit_schema TEXT DEFAULT 'audit'  -- 审计表所在schema，默认为audit
)
RETURNS void AS $$
DECLARE
    backup_table TEXT;
    trigger_name TEXT;
    trigger_func_name TEXT;
BEGIN
    -- 构造备份表名
    backup_table := origin_table || '_bak';
    -- 构造触发器名
    trigger_name := origin_table || '_audit';
    -- 构造触发器函数名
    trigger_func_name := origin_table || '_audit_func';
    
    -- 创建备份表
    EXECUTE format('
        DROP TABLE IF EXISTS %I.%I;
        CREATE TABLE %I.%I AS 
        SELECT 
            ''''::text as operation,
            now()::timestamp operation_time,
            ''''::text user_name,
            ''''::text old_content,
            * 
        FROM %I.%I
        WHERE 1=0;
    ', audit_schema, backup_table, audit_schema, backup_table, origin_schema, origin_table);

    -- 创建触发器函数
    EXECUTE format('
        CREATE OR REPLACE FUNCTION %I.%I() RETURNS TRIGGER AS $func$
        BEGIN
            IF (TG_OP = ''DELETE'') THEN
                INSERT INTO %I.%I 
                SELECT TG_OP, now(), current_user, '''', OLD.*;
                RETURN OLD;
            ELSIF (TG_OP = ''UPDATE'') THEN
                INSERT INTO %I.%I 
                SELECT TG_OP, now(), current_user, row_to_json(OLD.*), NEW.*;
                RETURN NEW;
            ELSIF (TG_OP = ''INSERT'') THEN
                INSERT INTO %I.%I 
                SELECT TG_OP, now(), current_user, '''', NEW.*;
                RETURN NEW;
            END IF;
            RETURN NULL;
        END;
        $func$ LANGUAGE plpgsql;
    ', audit_schema, trigger_func_name, audit_schema, backup_table, audit_schema, backup_table, audit_schema, backup_table);

    -- 创建触发器
    EXECUTE format('
        DROP TRIGGER IF EXISTS %I ON %I.%I;
        CREATE TRIGGER %I
            AFTER INSERT OR UPDATE OR DELETE ON %I.%I
            FOR EACH ROW EXECUTE PROCEDURE %I.%I();
    ', trigger_name, origin_schema, origin_table, trigger_name, origin_schema, origin_table, audit_schema, trigger_func_name);
    
END;
$$ LANGUAGE plpgsql;
```

:::

使用示例

```sql
-- 为 example.test_info 表创建审计
SELECT audit.create_audit_trigger('example', 'test_info');

-- 为 other_schema.employee 表创建审计，并指定审计表存放在 custom_audit schema中
SELECT audit.create_audit_trigger('other_schema', 'employee', 'custom_audit');
```

该函数会自动：
1. 创建备份表（表名为原表名+'_bak'）
2. 创建触发器函数
3. 创建并关联触发器

备份表中会记录：
- operation: 操作类型（INSERT/UPDATE/DELETE）
- operation_time: 操作时间
- user_name: 操作用户
- old_content: 更新前的数据（仅UPDATE操作时有值）
- 原表的所有字段

## 数据库备份脚本

该脚本它不仅支持 Windows 和 Linux 系统，还提供了灵活的备份选项，让你的数据库管理工作更加高效。

* 按需导出指定库、指定schema、指定表
* 按需导出表结构加数据、表结构、数据
* 操作之前需要手动确认
* 导出后输出导入脚本命令

:::details

```shell
#!/bin/bash

# 检测操作系统类型
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# 设置日志文件
LOG_FILE="pg_export_$(date +%Y%m%d_%H%M%S).log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 错误处理函数
error_exit() {
    log "错误: $1"
    exit 1
}

# 验证输入函数
validate_input() {
    if [ -z "$1" ]; then
        error_exit "输入不能为空"
    fi
}

# 验证pg_dump路径
validate_pg_dump() {
    if $IS_WINDOWS; then
        # Windows下检查.exe后缀
        win_path=$(echo "$1" | sed 's|^/||; s|/|\\|g')
        echo "检查路径: $win_path"
        # 检查路径是否存在
        if [ ! -f "$win_path" ] && [ ! -f "${win_path}.exe" ]; then
            error_exit "pg_dump路径无效: $win_path"
        fi
        # 保存处理后的路径
        PG_DUMP="$win_path"
    else
        if [ ! -x "$1" ]; then
            error_exit "pg_dump路径无效或没有执行权限: $1"
        fi
    fi
}

# 获取基本信息
if $IS_WINDOWS; then
    echo "请输入pg_dump可执行文件的完整路径（例如: /C:/Program Files/PostgreSQL/16/bin/pg_dump）："
else
    echo "请输入pg_dump可执行文件的完整路径（例如: /usr/bin/pg_dump）："
fi
read PG_DUMP
validate_input "$PG_DUMP"
validate_pg_dump "$PG_DUMP"

echo "请输入数据库服务器IP地址(默认：localhost)："
read DB_HOST
DB_HOST=${DB_HOST:-localhost}
validate_input "$DB_HOST"

echo "请输入数据库端口号（默认：5432）："
read DB_PORT
DB_PORT=${DB_PORT:-5432}

echo "请输入数据库用户名(默认：postgres)："
read DB_USER
DB_USER=${DB_USER:-postgres}
validate_input "$DB_USER"

echo "请输入数据库密码(默认：123456)："
read -s DB_PASS
DB_PASS=${DB_PASS:-123456}
validate_input "$DB_PASS"

echo "请输入数据库名称："
read DB_NAME
validate_input "$DB_NAME"

# 选择导出范围
echo "请选择导出范围："
echo "1) 导出整个数据库"
echo "2) 导出指定schema"
echo "3) 导出指定schema下的特定表"
read EXPORT_SCOPE

SCHEMA_NAME=""
TABLE_NAME=""
EXPORT_PARAMS=""

case $EXPORT_SCOPE in
    1)
        log "选择导出整个数据库"
        ;;
    2)
        echo "请输入schema名称："
        read SCHEMA_NAME
        validate_input "$SCHEMA_NAME"
        EXPORT_PARAMS="$EXPORT_PARAMS -n $SCHEMA_NAME"
        ;;
    3)
        echo "请输入schema名称："
        read SCHEMA_NAME
        validate_input "$SCHEMA_NAME"
        echo "请输入表名："
        read TABLE_NAME
        validate_input "$TABLE_NAME"
        EXPORT_PARAMS="$EXPORT_PARAMS -t $SCHEMA_NAME.$TABLE_NAME"
        ;;
    *)
        error_exit "无效的选择"
        ;;
esac

# 选择导出类型
echo "请选择导出类型："
echo "1) 仅结构"
echo "2) 仅数据"
echo "3) 结构和数据"
read EXPORT_TYPE

case $EXPORT_TYPE in
    1)
        EXPORT_PARAMS="$EXPORT_PARAMS --schema-only"
        ;;
    2)
        EXPORT_PARAMS="$EXPORT_PARAMS --data-only"
        ;;
    3)
        # 默认导出结构和数据，不需要额外参数
        ;;
    *)
        error_exit "无效的选择"
        ;;
esac

# 设置输出文件名
echo "请输入导出文件名（不需要扩展名）："
read OUTPUT_NAME
validate_input "$OUTPUT_NAME"

# 添加时间戳到文件名
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${OUTPUT_NAME}_${TIMESTAMP}.sql"

# 构建完整的命令
if $IS_WINDOWS; then
    # Windows下使用处理后的路径
    EXPORT_CMD="\"$PG_DUMP\" -h \"$DB_HOST\" -p \"$DB_PORT\" -U \"$DB_USER\" -d \"$DB_NAME\" $EXPORT_PARAMS -O -f \"$OUTPUT_FILE\""
else
    # Linux下使用原始路径
    EXPORT_CMD="\"$PG_DUMP\" -h \"$DB_HOST\" -p \"$DB_PORT\" -U \"$DB_USER\" -d \"$DB_NAME\" $EXPORT_PARAMS -O -f \"$OUTPUT_FILE\""
fi

# 显示将要执行的命令（隐藏密码）
echo "即将执行以下命令："
echo "$EXPORT_CMD"
echo "注意：实际执行时将通过环境变量传递数据库密码"

# 确认执行
echo "是否确认执行？(y/n)"
read CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    log "用户取消操作"
    exit 0
fi

# 设置环境变量以避免密码在命令行中显示
export PGPASSWORD="$DB_PASS"

# 执行导出
log "开始导出数据库..."

eval "$EXPORT_CMD" 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
    # 设置输出文件权限（仅在Linux下）
    if ! $IS_WINDOWS; then
        chmod 600 "$OUTPUT_FILE"
    fi
    log "导出成功完成！"
    log "导出文件：$OUTPUT_FILE"
    # 输出下导入命令
    echo "导入命令：psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $OUTPUT_FILE"
else
    error_exit "导出过程中发生错误，请查看日志文件：$LOG_FILE"
fi

# 清除环境变量
unset PGPASSWORD 
```

:::

## 数据库授权脚本

该函数用于**自动化批量授予用户指定 Schema 下所有对象的完整权限**，包括表、序列、函数、视图等，同时设置默认权限确保未来新建对象自动继承权限。

:::details

```postgresql
CREATE OR REPLACE FUNCTION grant_schema_privileges(
 p_schema_name VARCHAR,
 p_username VARCHAR,
 p_with_grant_option BOOLEAN DEFAULT FALSE
) RETURNS TEXT AS $$
DECLARE
 v_grant_option TEXT := CASE WHEN p_with_grant_option THEN ' WITH GRANT OPTION' ELSE '' END;
 v_grant_statements TEXT := '';
 v_schema_owner VARCHAR;
BEGIN
 -- 1. 检查Schema是否存在
 IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = p_schema_name) THEN
     RAISE EXCEPTION 'Schema "%" does not exist', p_schema_name;
 END IF;

 -- 2. 获取Schema所有者（确保ALTER DEFAULT PRIVILEGES正确执行）
 SELECT pg_get_userbyid(nspowner) INTO v_schema_owner
 FROM pg_namespace WHERE nspname = p_schema_name;

 -- 3. 授予Schema基础权限
 v_grant_statements := v_grant_statements || format(
         'GRANT USAGE, CREATE ON SCHEMA %I TO %I%s;',
         p_schema_name, p_username, v_grant_option
                                             ) || E'\n';

 -- 4. 表权限（含COALESCE防空）
 v_grant_statements := v_grant_statements || COALESCE(
         (SELECT STRING_AGG(format(
                                    'GRANT ALL ON TABLE %I.%I TO %I%s;',
                                    table_schema, table_name, p_username, v_grant_option
                            ), E'\n') FROM information_schema.tables
          WHERE table_schema = p_schema_name AND table_type = 'BASE TABLE'),
         '-- No tables in schema'
                                             ) || E'\n';

 -- 5. 序列权限（关键补充！）
 v_grant_statements := v_grant_statements || COALESCE(
         (SELECT STRING_AGG(format(
                                    'GRANT USAGE, SELECT, UPDATE ON SEQUENCE %I.%I TO %I%s;', -- USAGE+SELECT+UPDATE[2,5](@ref)
                                    sequence_schema, sequence_name, p_username, v_grant_option
                            ), E'\n') FROM information_schema.sequences
          WHERE sequence_schema = p_schema_name),
         '-- No sequences in schema'
                                             ) || E'\n';

 -- 6. 函数权限（含参数签名处理）
 v_grant_statements := v_grant_statements || COALESCE(
         (SELECT STRING_AGG(format(
                                    'GRANT EXECUTE ON FUNCTION %I.%I(%s) TO %I%s;', -- EXECUTE权限[6,8](@ref)
                                    r.routine_schema, r.routine_name,
                                    COALESCE(pg_get_function_identity_arguments(p.oid), ''),
                                    p_username, v_grant_option
                            ), E'\n')
          FROM information_schema.routines r
                   JOIN pg_proc p ON p.proname = r.routine_name
                   JOIN pg_namespace n ON n.oid = p.pronamespace AND n.nspname = r.routine_schema
          WHERE r.routine_schema = p_schema_name AND r.routine_type = 'FUNCTION'),
         '-- No functions in schema'
                                             ) || E'\n';

 -- 7. 视图权限（关键补充！）
 v_grant_statements := v_grant_statements || COALESCE(
         (SELECT STRING_AGG(format(
                                    'GRANT SELECT, REFERENCES, TRIGGER ON %I.%I TO %I%s;', -- SELECT+REFERENCES+TRIGGER[10](@ref)
                                    table_schema, table_name, p_username, v_grant_option
                            ), E'\n') FROM information_schema.views
          WHERE table_schema = p_schema_name),
         '-- No views in schema'
                                             ) || E'\n';

 -- 8. 设置未来对象的默认权限（核心！）
 v_grant_statements := v_grant_statements || format(
         'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA %I ' ||
         'GRANT ALL ON TABLES TO %I%s;',
         v_schema_owner, p_schema_name, p_username, v_grant_option
                                             ) || E'\n';

 v_grant_statements := v_grant_statements || format(
         'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA %I ' ||
         'GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO %I%s;', -- 序列默认权限[9](@ref)
         v_schema_owner, p_schema_name, p_username, v_grant_option
                                             ) || E'\n';

 v_grant_statements := v_grant_statements || format(
         'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA %I ' ||
         'GRANT EXECUTE ON FUNCTIONS TO %I%s;', -- 函数默认权限[6](@ref)
         v_schema_owner, p_schema_name, p_username, v_grant_option
                                             ) || E'\n';

 -- 9. 执行所有语句（含调试日志）
 RAISE NOTICE 'Executing:%', v_grant_statements;
 EXECUTE v_grant_statements;

 RETURN '✅ 权限授予成功！执行语句：' || E'\n' || v_grant_statements;
EXCEPTION
 WHEN OTHERS THEN
     RETURN '❌ 错误: ' || SQLERRM || E'\n' || '当前SQL:' || E'\n' || v_grant_statements;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

:::

使用示例

```postgresql
-- 授予用户 cdr_app 对 mdm Schema 的所有权限（不含转授权）
SELECT grant_schema_privileges('order', 'zyp');

-- 授予用户 360_app 对 ehrcda Schema 的权限，并允许转授权
SELECT grant_schema_privileges('order', 'zyp', TRUE);
```