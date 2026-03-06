---
title: 第三方库
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: disanfangku
slug: gylzt6
docsId: '24016397'
---
## 查询包版本信息

网站搜索：https://pypi.org/

## 引用包文件

通过一个文本文件写入需要引用的包，文本文件名称是：requirements.txt

```python
certifi==2020.4.5.1
chardet==3.0.4
idna==2.9
lxml==4.5.1
requests==2.23.0
urllib3==1.25.9

```

## 第三方库

```python
网络请求：pip install requests
打包库：pip install pyinstaller
获取电脑配置信息：pip install wmi
画画库：pip install turtle
下载库：pip install wget 
Wget 是一个免费的实用程序，可以用于从网络上下载非交互式的文件。它支持 HTTP、HTTPS 和 FTP 协议，以及通过 HTTP 的代理进行文件检索。由于它是非交互式的，即使用户没有登录，它也可以在后台工作。所以下次当你想要下载一个网站或者一个页面上的所有图片时，wget 可以帮助你。
压力测试库：pip install locust
按照pep8风格自动排版的包：autopep8：pip install autopep8
```

### Web开发

#### uvicorn

**运行你 Python Web 代码的引擎**。它负责监听网络端口，接收 HTTP 请求，然后把请求交给你的 Python 程序（如 FastAPI 应用）处理，最后把响应返回给客户端。

`uvicorn` 有最小化安装和标准安装之分。

- 加上 `[standard]` 表示安装 “标准版”，它会额外安装一些推荐的依赖包，使功能更完整、性能更好。包括：
  - `uvloop`：更快的事件循环（提升性能）。
  - `httptools`：更快的 HTTP 协议解析。
  - `watchfiles`：支持代码修改后自动重载（开发时很有用）。
  - `python-dotenv`：支持从 `.env` 文件读取环境变量。
  - `websockets`：支持 WebSocket 协议。
- 如果不加 `[standard]`，只装 `uvicorn`，则是最小版本，可能缺少上述优化功能。

#### python-multipart

是一个用来解析 `multipart/form-data` 编码格式的库，当你的API需要接收文件上传或者使用复杂表单数据的时候，内容内容是`multipart/form-data` 那么就需要这个第三方库，代码示例

```python
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

# 这个接口接收文件上传，必须安装 python-multipart 才能工作
@app.post("/upload/")
async def create_upload_file(file: UploadFile = File(...)):
    return {"filename": file.filename}
```

### **文本**

string：通用字符串操作  
re：正则表达式操作  
difflib：差异计算工具  
textwrap：文本填充  
unicodedata：Unicode字符数据库  
stringprep：互联网字符串准备工具  
readline：GNU按行读取接口  
rlcompleter：GNU按行读取的实现函数  
struct：将字节解析为打包的二进制数据  
codecs：注册表与基类的编解码器  

### **数据类型**

datetime：基于日期与时间工具  
calendar：通用月份函数  
collections：容器数据类型  
collections.abc：容器虚基类  
heapq：堆队列算法  
bisect：数组二分算法  
array：高效数值数组  
weakref：弱引用  
types：内置类型的动态创建与命名  
copy：浅拷贝与深拷贝  
pprint：格式化输出  
reprlib：交替repr()的实现  

### **数学**

numbers：数值的虚基类  
math：数学函数  
cmath：复数的数学函数  
decimal：定点数与浮点数计算  
fractions：有理数  
random：生成伪随机数  

### **函数式编程**

itertools：为高效循环生成迭代器  
functools：可调用对象上的高阶函数与操作  
operator：针对函数的标准操作  

### **文件与目录**

os.path：通用路径名控制  
fileinput：从多输入流中遍历行  
stat：解释stat()的结果  
filecmp：文件与目录的比较函数  
tempfile：生成临时文件与目录  
glob：Unix风格路径名格式的扩展  
fnmatch：Unix风格路径名格式的比对  
linecache：文本行的随机存储  
shutil：高级文件操作  
macpath：MacOS 9路径控制函数  

### **持久化**

pickle：Python对象序列化  
copyreg：注册机对pickle的支持函数  
在公众号Python人工智能技术后台回复“面试”，获取腾讯Python面试题和答案。  
shelve：Python对象持久化  
marshal：内部Python对象序列化  
dbm：Unix“数据库”接口  
sqlite3：针对SQLite数据库的API2.0  

### **压缩**

zlib：兼容gzip的压缩  
gzip：对gzip文件的支持  
bz2：对bzip2压缩的支持  
lzma：使用LZMA算法的压缩  
zipfile：操作ZIP存档  
tarfile：读写tar存档文件  

### **加密**

hashlib：安全散列与消息摘要  
hmac：针对消息认证的键散列  

### **操作系统工具**

os：多方面的操作系统接口  
io：流核心工具  
time：时间的查询与转化  
argparser：命令行选项、参数和子命令的解析器  
optparser：命令行选项解析器  
getopt：C风格的命令行选项解析器  
logging：Python日志工具  
logging.config：日志配置  
logging.handlers：日志处理器  
getpass：简易密码输入  
curses：字符显示的终端处理  
curses.textpad：curses程序的文本输入域  
curses.ascii：ASCII字符集工具  
curses.panel：curses的控件栈扩展  
platform：访问底层平台认证数据  
errno：标准错误记号  
ctypes：Python外部函数库  

### **并发**

threading：基于线程的并行  
multiprocessing：基于进程的并行  
concurrent：并发包  
concurrent.futures：启动并行任务  
subprocess：子进程管理  
sched：事件调度  
queue：同步队列  
select：等待I / O完成  
dummy_threading：threading模块的替代（当_thread不可用时）  
_thread：底层的线程API（threading基于其上）  
_dummy_thread：_thread模块的替代（当_thread不可用时）  

### **进程间通信**

socket：底层网络接口  
ssl：socket对象的TLS / SSL填充器  
asyncore：异步套接字处理器  
asynchat：异步套接字命令 / 响应处理器  
signal：异步事务信号处理器  
mmap：内存映射文件支持  

### **互联网**

email：邮件与MIME处理包  
json：JSON编码与解码  
mailcap：mailcap文件处理  
mailbox：多种格式控制邮箱  
mimetypes：文件名与MIME类型映射  
base64：RFC3548：Base16、Base32、Base64编码  
binhex：binhex4文件编码与解码  
binascii：二进制码与ASCII码间的转化  
quopri：MIMEquoted - printable数据的编码与解码  
uu：uuencode文件的编码与解码  

### 预测分析

pandas numpy
