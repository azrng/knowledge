---
title: 基本使用
lang: zh-CN
date: 2023-02-19
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: jibenshiyong
slug: sftoca
docsId: '24016404'
---
## 内置函数

```python
abs()           dict()        help()         min()         setattr()
all()           dir()         hex()          next()        slice() 
any()           divmod()      id()           object()      sorted() 
ascii()         enumerate()   input()        oct()         staticmethod() 
bin()           eval()        int()          open()        str() 
bool()          exec()        isinstance()   ord()         sum() 
bytearray()     ﬁlter()       issubclass()   pow()         super() 
bytes()         ﬂoat()        iter()         print()       tuple() 
callable()      format()      len()          property()    type() 
chr()           frozenset()   list()         range()       vars() 
classmethod()   getattr()     locals()       repr()        zip() 
compile()       globals()     map()          reversed()    __import__() 
complex()       hasattr()     max()          round() 
delattr()       hash()        memoryview()   set()
```

### 数字相关

#### **1. 数据类型**

- bool : 布尔型(True,False)
- int : 整型(整数)
- float : 浮点型(小数)
- complex : 复数

#### **2. 进制转换**

- bin() 将给的参数转换成二进制
- oct() 将给的参数转换成八进制
- hex() 将给的参数转换成十六进制
```python
print(bin(10))  ## 二进制:0b1010
print(hex(10))  ## 十六进制:0xa
print(oct(10))  ## 八进制:0o12
```

#### **3. 数学运算**

- abs() 返回绝对值
- divmode() 返回商和余数
- round() 四舍五入
- pow(a, b) 求a的b次幂, 如果有三个参数. 则求完次幂后对第三个数取余
- sum() 求和
- min() 求最小值
- max() 求最大值

```python
print(abs(-2))  ## 绝对值:2
print(divmod(20,3)) ## 求商和余数:(6,2)
print(round(4.50))   ## 五舍六入:4
print(round(4.51))   #5
print(pow(10,2,3))  ## 如果给了第三个参数. 表示最后取余:1
print(sum([1,2,3,4,5,6,7,8,9,10]))  ## 求和:55
print(min(5,3,9,12,7,2))  #求最小值:2
print(max(7,3,15,9,4,13))  #求最大值:15
```

### 数据结构相关

#### **1. 序列**
（1）列表和元组

- list() 将一个可迭代对象转换成列表
- tuple() 将一个可迭代对象转换成元组

```python
print(list((1,2,3,4,5,6)))  #[1, 2, 3, 4, 5, 6]
print(tuple([1,2,3,4,5,6]))  #(1, 2, 3, 4, 5, 6)
```
（2）相关内置函数

- reversed() 将一个序列翻转, 返回翻转序列的迭代器
- slice() 列表的切片

```python
lst = "你好啊"
it = reversed(lst)   ## 不会改变原列表. 返回一个迭代器, 设计上的一个规则
print(list(it))  #['啊', '好', '你']
lst = [1, 2, 3, 4, 5, 6, 7]
print(lst[1:3:1])  #[2,3]
s = slice(1, 3, 1)  ##  切片用的
print(lst[s])  #[2,3]
```
（3）字符串

- str() 将数据转化成字符串

```python
print(str(123)+'456')  #123456
```

- format()     与具体数据相关, 用于计算各种小数, 精算等.
```python
s = "hello world!"
print(format(s, "^20"))  #剧中
print(format(s, "<20"))  #左对齐
print(format(s, ">20"))  #右对齐
##     hello world!    
## hello world!        
##         hello world!
print(format(3, 'b' ))    ## 二进制:11
print(format(97, 'c' ))   ## 转换成unicode字符:a
print(format(11, 'd' ))   ## ⼗进制:11
print(format(11, 'o' ))   ## 八进制:13 
print(format(11, 'x' ))   ## 十六进制(⼩写字母):b
print(format(11, 'X' ))   ## 十六进制(大写字母):B
print(format(11, 'n' ))   ## 和d⼀样:11
print(format(11))         ## 和d⼀样:11
print(format(123456789, 'e' ))      ## 科学计数法. 默认保留6位小数:1.234568e+08
print(format(123456789, '0.2e' ))   ## 科学计数法. 保留2位小数(小写):1.23e+08
print(format(123456789, '0.2E' ))   ## 科学计数法. 保留2位小数(大写):1.23E+08
print(format(1.23456789, 'f' ))     ## 小数点计数法. 保留6位小数:1.234568
print(format(1.23456789, '0.2f' ))  ## 小数点计数法. 保留2位小数:1.23
print(format(1.23456789, '0.10f'))  ## 小数点计数法. 保留10位小数:1.2345678900
print(format(1.23456789e+3, 'F'))   ## 小数点计数法. 很大的时候输出INF:1234.567890
```

- bytes() 把字符串转化成bytes类型
```python
bs = bytes("今天吃饭了吗", encoding="utf-8")
print(bs)  #b'\xe4\xbb\x8a\xe5\xa4\xa9\xe5\x90\x83\xe9\xa5\xad\xe4\xba\x86\xe5\x90\x97'
```

- bytearray()    返回一个新字节数组. 这个数字的元素是可变的, 并且每个元素的值得范围是[0,256)
```python
ret = bytearray("alex" ,encoding ='utf-8')
print(ret[0])  #97
print(ret)  #bytearray(b'alex')
ret[0] = 65  #把65的位置A赋值给ret[0]
print(str(ret))  #bytearray(b'Alex')
```

- ord() 输入字符找带字符编码的位置

- chr() 输入位置数字找出对应的字符
- ascii() 是ascii码中的返回该值 不是就返回u

```python
print(ord('a'))  ## 字母a在编码表中的码位:97
print(ord('中'))  ## '中'字在编码表中的位置:20013
print(chr(65))  ## 已知码位,求字符是什么:A
print(chr(19999))  #丟
for i in range(65536):  #打印出0到65535的字符
    print(chr(i), end=" ")
print(ascii("@"))  #'@'
```

- repr() 返回一个对象的string形式
```python
s = "今天\n吃了%s顿\t饭" % 3
print(s)#今天## 吃了3顿    饭
print(repr(s))   ## 原样输出,过滤掉转义字符 \n \t \r 不管百分号%
#'今天\n吃了3顿\t饭'
```

#### **2. 数据集合**

- 字典：dict 创建一个字典
- 集合：set 创建一个集合

frozenset() 创建一个冻结的集合，冻结的集合不能进行添加和删除操作。

#### **3. 相关内置函数**

- len() 返回一个对象中的元素的个数
- sorted() 对可迭代对象进行排序操作 (lamda)

语法：sorted(Iterable, key=函数(排序规则), reverse=False)

- Iterable: 可迭代对象
- key: 排序规则(排序函数), 在sorted内部会将可迭代对象中的每一个元素传递给这个函数的参数. 根据函数运算的结果进行排序
- reverse: 是否是倒叙. True: 倒叙, False: 正序

```python
lst = [5,7,6,12,1,13,9,18,5]
lst.sort()  ## sort是list里面的一个方法
print(lst)  #[1, 5, 5, 6, 7, 9, 12, 13, 18]
ll = sorted(lst) ## 内置函数. 返回给你一个新列表  新列表是被排序的
print(ll)  #[1, 5, 5, 6, 7, 9, 12, 13, 18]
l2 = sorted(lst,reverse=True)  #倒序
print(l2)  #[18, 13, 12, 9, 7, 6, 5, 5, 1]
```
```python
#根据字符串长度给列表排序
lst = ['one', 'two', 'three', 'four', 'five', 'six']
def f(s):
    return len(s)
l1 = sorted(lst, key=f, )
print(l1)  #['one', 'two', 'six', 'four', 'five', 'three']
```

- enumerate() 获取集合的枚举对象
```python
lst = ['one','two','three','four','five']
for index, el in enumerate(lst,1):    ## 把索引和元素一起获取,索引默认从0开始. 可以更改
    print(index)
    print(el)
## 1
## one
## 2
## two
## 3
## three
## 4
## four
## 5
## five
```

- all() 可迭代对象中全部是True, 结果才是True
- any() 可迭代对象中有一个是True, 结果就是True

```python
print(all([1,'hello',True,9]))  #True
print(any([0,0,0,False,1,'good']))  #True
```

- zip() 函数用于将可迭代的对象作为参数, 将对象中对应的元素打包成一个元组, 然后返回由这些元组组成的列表. 如果各个迭代器的元素个数不一致, 则返回列表长度与最短的对象相同

```python
lst1 = [1, 2, 3, 4, 5, 6]
lst2 = ['醉乡民谣', '驴得水', '放牛班的春天', '美丽人生', '辩护人', '被嫌弃的松子的一生']
lst3 = ['美国', '中国', '法国', '意大利', '韩国', '日本']
print(zip(lst1, lst1, lst3))  #<zip object at 0x00000256CA6C7A88>
for el in zip(lst1, lst2, lst3):
    print(el)
## (1, '醉乡民谣', '美国')
## (2, '驴得水', '中国')
## (3, '放牛班的春天', '法国')
## (4, '美丽人生', '意大利')
## (5, '辩护人', '韩国')
## (6, '被嫌弃的松子的一生', '日本')
```

- fiter() 过滤 (lamda)


语法：fiter(function. Iterable)
function: 用来筛选的函数. 在ﬁlter中会自动的把iterable中的元素传递给function. 然后根据function返回的True或者False来判断是否保留留此项数据 , Iterable: 可迭代对象
```python
def func(i):    ## 判断奇数
    return i % 2 == 1
    lst = [1,2,3,4,5,6,7,8,9]
l1 = filter(func, lst)  #l1是迭代器
print(l1)  #<filter object at 0x000001CE3CA98AC8>
print(list(l1))  #[1, 3, 5, 7, 9]
```

- map() 会根据提供的函数对指定序列列做映射(lamda)


语法 : map(function, iterable)
可以对可迭代对象中的每一个元素进行映射. 分别去执行 function
```python
def f(i):    
  return i
  lst = [1,2,3,4,5,6,7,]
it = map(f, lst) ## 把可迭代对象中的每一个元素传递给前面的函数进行处理. 处理的结果会返回成迭代器print(list(it))  #[1, 2, 3, 4, 5, 6, 7]
```

### **和作用域相关**

- locals() 返回当前作用域中的名字
- globals() 返回全局作用域中的名字
```python
def func():
    a = 10
    print(locals())  ## 当前作用域中的内容
    print(globals())  ## 全局作用域中的内容
    print("今天内容很多")
func()
## {'a': 10}
## {'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': 
## <_frozen_importlib_external.SourceFileLoader object at 0x0000026F8D566080>, 
## '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' 
## (built-in)>, '__file__': 'D:/pycharm/练习/week03/new14.py', '__cached__': None,
##  'func': <function func at 0x0000026F8D6B97B8>}
## 今天内容很多
```

### **和迭代器生成器相关**

- range() 生成数据
- next() 迭代器向下执行一次, 内部实际使用了__ next__()方法返回迭代器的下一个项目
- iter() 获取迭代器, 内部实际使用的是__ iter__()方法来获取迭代器
```python
for i in range(15,-1,-5):
    print(i)
## 15
## 10
## 5
## 0
lst = [1,2,3,4,5]
it = iter(lst)  ##  __iter__()获得迭代器
print(it.__next__())  #1
print(next(it)) #2  __next__()  
print(next(it))  #3
print(next(it))  #4
```

###  **字符串类型代码的执行**

- eval() 执行字符串类型的代码. 并返回最终结果
- exec() 执行字符串类型的代码
- compile() 将字符串类型的代码编码. 代码对象能够通过exec语句来执行或者eval()进行求值
```python
s1 = input("请输入a+b:")  #输入:8+9
print(eval(s1))  ## 17 可以动态的执行代码. 代码必须有返回值
s2 = "for i in range(5): print(i)"
a = exec(s2) ## exec 执行代码不返回任何内容
## 0
## 1
## 2
## 3
## 4
print(a)  #None
## 动态执行代码
exec("""
def func():
    print(" 我是周杰伦")
""" )
func()  #我是周杰伦
code1 = "for i in range(3): print(i)"
com = compile(code1, "", mode="exec")   ## compile并不会执行你的代码.只是编译
exec(com)   ## 执行编译的结果
## 0
## 1
## 2
code2 = "5+6+7"
com2 = compile(code2, "", mode="eval")
print(eval(com2))  ## 18
code3 = "name = input('请输入你的名字:')"  #输入:hello
com3 = compile(code3, "", mode="single")
exec(com3)
print(name)  #hello
```

### **输入输出**

- print() : 打印输出
- input() : 获取用户输出的内容
```python
print("hello", "world", sep="*", end="@") ## sep:打印出的内容用什么连接,end:以什么为结尾
#hello*world@
```

- hash() : 获取到对象的哈希值(int, str, bool, tuple). hash算法:(1) 目的是唯一性 (2) dict 查找效率非常高, hash表.用空间换的时间 比较耗费内存
```python
s = 'alex'
print(hash(s))  #-168324845050430382
lst = [1, 2, 3, 4, 5]
print(hash(lst))  #报错,列表是不可哈希的
  id() :  获取到对象的内存地址
s = 'alex'
print(id(s))  #2278345368944
```

### 文件操作相关
- open() : 用于打开一个文件, 创建一个文件句柄
```python
f = open('file',mode='r',encoding='utf-8')
f.read()
f.close()
```

### 模块相关

__ import__() : 用于动态加载类和函数

```python
## 让用户输入一个要导入的模块
import os
name = input("请输入你要导入的模块:")
__import__(name)    ## 可以动态导入模块
```

### **帮  助**

- help() : 函数用于查看函数或模块用途的详细说明
```python
print(help(str))  #查看字符串的用途
```

### **调用相关**

- callable() : 用于检查一个对象是否是可调用的. 如果返回True, object有可能调用失败, 但如果返回False. 那调用绝对不会成功
```python
a = 10
print(callable(a))  #False  变量a不能被调用
#
def f():
    print("hello")
    print(callable(f))   ## True 函数是可以被调用的
```

### **查看内置属性**

- dir() : 查看对象的内置属性, 访问的是对象中的__dir__()方法

```python
print(dir(tuple))  #查看元组的方法
```

## 文件操作

### 1.显示当前目录

当我们想知道当前的工作目录是什么的时候，我们可以简单地使用`os`模块的`getcwd()`功能，或者使用`pathlib`的`cwd()`，如下所示。

```python
>>> ## 第一种方法：显示当前目录
... import os
... print("当前工作目录:", os.getcwd())
... 
Current Work Directory: /Users/ycui1/PycharmProjects/Medium_Python_Tutorials

>>> ## 第二种方法：或者我们也可以使用 pathlib
... from pathlib import Path
... print("当前工作目录:", Path.cwd())
... 
Current Work Directory: /Users/ycui1/PycharmProjects/Medium_Python_Tutorials
```

### 2.建立一个新目录

要创建目录，可以使用`os`模块的`mkdir()`功能。该函数将在指定的路径下创建目录，如果仅使用目录名称，则将在当前目录中创建文件夹，即绝对路径和相对路径的概念。

```python
>>> ## 在当前文件夹创建新目录
... os.mkdir("test_folder")
... print("目录是否存在:", os.path.exists("test_folder"))
... 
目录是否存在: True
>>> ## 在特定文件夹创建新目录
... os.mkdir('/Users/ycui1/PycharmProjects/tmp_folder')
... print("目录是否存在:", os.path.exists('/Users/ycui1/PycharmProjects/tmp_folder'))
... 
目录是否存在: True
```

但是，如果想要建立一个多层级的目录，比如文件夹中下的文件夹），则需要使用该`makedirs()`功能。

```python
>>> ## 创建包含子目录的目录
... os.makedirs('tmp_level0/tmp_level1')
... print("目录是否存在:", os.path.exists("tmp_level0/tmp_level1"))
... 
Is the directory there: True
```

如果使用最新版本的Python（≥3.4），则可以考虑利用`pathlib`模块创建新目录。它不仅可以创建子目录，而且可以处理路径中所有丢失的目录。

```python
## 使用 pathlib
from pathlib import Path
Path("test_folder").mkdir(parents=True, exist_ok=True)
```

需要注意一个问题，如果尝试多次运行上述某些代码，可能会遇到问题“无法创建已经存在的新目录”。我们可以将`exist_ok`参设置为`True`来处理此问题（默认值False值将阻止我们创建目录）。

```python
>>> ## 使用 pathlib
... from pathlib import Path
... Path("test_folder").mkdir(parents=True, exist_ok=False)
... 
Traceback (most recent call last):
  File "<input>", line 3, in <module>
  File "/Users/ycui1/.conda/envs/Medium/lib/python3.8/pathlib.py", line 1284, in mkdir
    self._accessor.mkdir(self, mode)
FileExistsError: [Errno 17] File exists: 'test_folder'
```

### 3.删除目录和文件

完成对某些文件或文件夹的操作后，我们可能希望删除它。为此，我们可以使用`os`模块中的`remove()`函数来删除文件。如果要删除文件夹，我们应该改用`rmdir()`。

```python
>>> ## 删除一个文件
... print(f"* 删除文件前 {os.path.isfile('tmp.txt')}")
... os.remove('tmp.txt')
... print(f"* 删除文件后 {os.path.exists('tmp.txt')}")
... 
* 删除文件前 True
* 删除文件后 False
>>> ## 删除一个文件夹
... print(f"* 删除文件夹前 {os.path.isdir('tmp_folder')}")
... os.rmdir('tmp_folder')
... print(f"* 删除文件夹后 {os.path.exists('tmp_folder')}")
... 
* 删除文件夹前 True
* 删除文件夹后 False
```

如果使用`pathlib`模块,可以使用`unlink()`方法，而删除目录可以使用`rmdir()`方法。

### 4.获取文件列表

当我们分析某个工作或机器学习项目进行数据处理时，需要获取特定目录中的文件列表。
通常，文件名具有匹配的模式。假设我们要查找目录中的所有.txt文件，可使用Path对象的方法`glob()`来实现。`glob()`方法创建了一个生成器，允许我们进行迭代。

```
>>> txt_files = list(Path('.').glob("*.txt"))
... print("Txt files:", txt_files)
... 
Txt files: [PosixPath('hello_world.txt'), PosixPath('hello.txt')]
```

另外，直接使用`glob模块`也很方便，如下所示，通过创建可以使用的文件名列表，它具有相似的功能。在大多数情况下，例如文件读取和写入，两者都可以使用。

```
>>> from glob import glob
... files = list(glob('h*'))
... print("以h开头的文件:", files)
... 
Files starting with h: ['hello_world.txt', 'hello.txt']
```

### 5.移动和复制文件

**移动文件**
常规文件管理任务之一是移动和复制文件。在Python中，这些工作可以非常轻松地完成。要移动文件，只需将其旧目录替换为目标目录即可重命名该文件。假设我们需要将所有.txt文件移动到另一个文件夹，下面用`Path`来实现。

```
>>> target_folder = Path("目标文件")
... target_folder.mkdir(parents=True,exist_ok=True)
... source_folder = Path('.')
... 
... txt_files = source_folder.glob('*.txt')
... for txt_file in txt_files:
...     filename = txt_file.name
...     target_path = target_folder.joinpath(filename)
...     print(f"** 移动文件 {filename}")
...     print("目标文件存在:", target_path.exists())
...     txt_file.rename(target_path)
...     print("目标文件存在:", target_path.exists(), '\n')
... 
** 移动文件 hello_world.txt
目标文件存在: False
目标文件存在: True 
** 移动文件 hello.txt
目标文件存在: False
目标文件存在: True
```

**复制文件**
我们可以利用`_shutil_`模块中可用的功能，_shutil_模块是标准库中另一个用于文件操作的有用模块。我们可以`copy()`通过将源文件和目标文件指定为字符串来在模块中使用该函数。一个简单的例子如下所示。当然，您可以将`copy()`函数与`glob()`函数结合使用，以处理具有相同模式的一堆文件。

```
>>> import shutil
... 
... source_file = "target_folder/hello.txt"
... target_file = "hello2.txt"
... target_file_path = Path(target_file)
... print("* 复制前，文件存在:", target_file_path.exists())
... shutil.copy(source_file, target_file)
... print("* 复制后，文件存在:", target_file_path.exists())
... 
* 复制前，文件存在: False
* 复制后，文件存在: True
```

### 6.检查目录/文件

上面的示例中一直在使用`exists()`方法来检查是否存在特定路径。如果存在，返回True；如果不存在，则返回False。此功能在`os`和`pathlib`模块中均可用，各自的用法如下。

```python
## os 模块中 exists() 用法
os.path.exists('path_to_check')
## pathlib 模块中 exists() 用法
Path('directory_path').exists()
```

使用`pathlib`，我们还可以检查路径是目录还是文件。

```python
## 检查路径是否是目录
os.path.isdir('需要检查的路径')
Path('需要检查的路径').is_dir()
## 检查路径是否是文件
os.path.isfile('需要检查的路径')
Path('需要检查的路径').is_file()
```

### 7.获取文件信息

**文件名称**
处理文件时，许多情况下都需要提取文件名。使用Path非常简单，可以在Path对象上查看name属性`path.name`。如果不想带后缀，可以查看stem属性`path.stem`。

```python
for py_file in Path().glob('c*.py'):
...     print('Name with extension:', py_file.name)
...     print('Name only:', py_file.stem)
... 
带文件后缀: closures.py
只有文件名: closures
带文件后缀: counter.py
只有文件名: counter
带文件后缀: context_management.py
只有文件名: context_management
```

**文件后缀**
如果想单独提取文件的后缀，可查看Path对象的`suffix`属性。

```python
>>> file_path = Path('closures.py')
... print("文件后缀:", file_path.suffix)
... 
File Extension: .py
```

**文件更多信息**
如果要获取有关文件的更多信息，例如文件大小和修改时间，则可以使用该`stat()`方法，该方法和`os.stat()`一样。

```python
>>> ## 路径 path 对象
... current_file_path = Path('iterable_usages.py')
... file_stat = current_file_path.stat()
... 
>>> ## 获取文件大小:
... print("文件大小（Bytes）:", file_stat.st_size)
文件大小（Bytes）: 3531
>>> ## 获取最近访问时间
... print("最近访问时间:", file_stat.st_atime)
最近访问时间: 1595435202.310935
>>> ## 获取最近修改时间
... print("最近修改时间:", file_stat.st_mtime)
最近修改时间: 1594127561.3204417
```

### 8.读取文件

最重要的文件操作之一就是从文件中读取数据。读取文件，最常规的方法是使用内置`open()`函数创建文件对象。默认情况下，该函数将以读取模式打开文件，并将文件中的数据视为文本。

```python
>>> ## 读取所有的文本
... with open("hello2.txt", 'r') as file:
...     print(file.read())
... 
Hello World!
Hello Python!
>>> ## 逐行的读取
... with open("hello2.txt", 'r') as file:
...     for i, line in enumerate(file, 1):
...         print(f"* 读取行 #{i}: {line}") 
... 
* 读取行 #1: Hello World!
* 读取行 #2: Hello Python!
```

如果文件中没有太多数据，则可以使用该`read()`方法一次读取所有内容。但如果文件很大，则应考虑使用生成器，生成器可以逐行处理数据。
默认将文件内容视为文本。如果要使用二进制文件，则应明确指定用`r`还是`rb`。
另一个棘手的问题是**文件的编码**。在正常情况下，`open()`处理编码使用`utf-8`编码，如果要使用其他编码处理文件，应设置`encoding`参数。

### 9. 写入文件

仍然使用`open()`函数,将模式改为`w`或`a`打开文件来创建文件对象。`w`模式下会覆盖旧数据写入新数据，`a`模式下可在原有数据基础上增加新数据。

```python
>>> ## 向文件中写入新数据
... with open("hello3.txt", 'w') as file:
...     text_to_write = "Hello Files From Writing"
...     file.write(text_to_write)
... 
>>> ## 增加一些数据
... with open("hello3.txt", 'a') as file:
...     text_to_write = "\nHello Files From Appending"
...     file.write(text_to_write)
... 
>>> ## 检查文件数据是否正确
... with open("hello3.txt") as file:
...     print(file.read())
... 
Hello Files From Writing
Hello Files From Appending
```

上面每次打开文件时都使用`with`语句。
`with`语句为我们创建了一个处理文件的上下文，当我们完成文件操作后，它可以关闭文件对象。这点很重要，如果我们不及时关闭打开的文件对象，它很有可能会被损坏。

### 10. 压缩和解压缩文件

**压缩文件**
`zipfile`模块提供了文件压缩的功能。使用`ZipFile()`函数创建一个`zip`文件对象，类似于我们对open()函数所做的操作，两者都涉及创建由上下文管理器管理的文件对象。

```python
>>> from zipfile import ZipFile
... 
... ## 创建压缩文件
... with ZipFile('text_files.zip', 'w') as file:
...     for txt_file in Path().glob('*.txt'):
...         print(f"*添加文件: {txt_file.name} 到压缩文件")
...         file.write(txt_file)
... 
*添加文件: hello3.txt 到压缩文件
*添加文件: hello2.txt 到压缩文件
```

**解压缩文件**

```python
>>> ## 解压缩文件
... with ZipFile('text_files.zip') as zip_file:
...     zip_file.printdir()
...     zip_file.extractall()
... 
File Name                                             Modified             Size
hello3.txt                                     2020-07-30 20:29:50           51
hello2.txt                                     2020-07-30 18:29:52           26
```

## XPath

XPath(XML Path Language) 是一门在XML和HTML文档中查找信息的语言，可以用来在XML和HTML文档中对元素和属性进行遍历
**选取节点**
XPath使用路径表达式来选取XML文档中的节点或者节点集，这些路径表达式和我们在常规的电脑文件系统中看到的表达式非常相似

| **表达式** | **描述**                                                     | **示例**       | **结果**                        |
| ---------- | ------------------------------------------------------------ | -------------- | ------------------------------- |
| nodename   | 选取此节点的所有子节点                                       | bookstore      | 选取bookstore下所有的子节点     |
| /          | 如果是在最前面，代表从根节点选取，否则选择某节点下的某个节点 | /bookstore     | 选取根元素下所有的bookstore节点 |
| //         | 从全局节点中选择节点，随意在哪个位置                         | //book         | 从全局节点中找到所有的book节点  |
| @          | 选取某个节点的属性                                           | //book[@price] | 选择所有拥有price属性的book节点 |
| .          | 当前节点                                                     | ./a            | 选取当前节点下的a标签           |

**谓语**
谓语用来查找某个特定的节点或者包含某个指定的值的及诶按，被嵌在括号中使用

| **路径表达式**                 | **描述**                              |
| ------------------------------ | ------------------------------------- |
| //bookstore/book[1]            | 选取bookstore下的第一个book子元素     |
| //bookstore/book[last()]       | 选取bookstore下最后一个book子元素     |
| //bookstore/book[position()<3] | 选取bookstore下前面两个book子元素     |
| //book[@price]                 | 选取拥有price属性的book元素           |
| //book[@price=10]              | 选取拥有price属性并且等于10的book元素 |

**通配符**在XPath中用 * 来表示通配符


| **通配符** | **描述**             | **示例**     | **结果**                    |
| ---------- | -------------------- | ------------ | --------------------------- |
| *          | 匹配任意节点         | /bookstore/* | 选取bookstore下的所有子元素 |
| @*         | 匹配节点中的任意属性 | //book[@*]   | 选取所有带属性的book元素    |

**选取多个路径**
通过在路径表达式中使用 | 运算符，可以选取若干个路径，比如选取所有book元素已经book元素下所有的title元素 //bookstore/book | //book/title


例如：
/text() 获取当前路径下的文本内容
//div[@class='name'] 从根节点获取所有class值为name的div

## 打包

### 打包Exe

下载包

```csharp
pip install pyinstaller
```

在文件存放地址下执行cmd命令
默认图标

```csharp
pyinstaller -F xxx.py
```

添加带图标的exe

```csharp
pyinstaller -F -w -i C:\1.ico C:\hello.py
```

参数解析：

> -w 程序启动的时候不会打开命令行。如果不加-w的参数，就会有黑框窗口。
> -i 1.ico 设置自己的图标图案。

压缩打包的exe文件

> conda create -n 虚拟环境名字 python==3.6 #创建虚拟环境
> conda activate 虚拟环境名字 #激活虚拟环境
> conda deactivate #退出虚拟环境
> conda info --envs  #查看conda环境下所有的虚拟环境
> conda list 可以查看当前虚拟环境内里面安装的库

虚拟环境+打包的全过程

```shell
#创建虚拟环境
conda create -n aotu python=3.6

#激活虚拟环境
conda activate aotu

#Pyinstaller打包
Pyinstaller -F -w -i apple.ico py_word.py

#想要删除虚拟环境的话，执行命令
conda remove -n auto-all
```

