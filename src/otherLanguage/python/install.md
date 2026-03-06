---
title: 安装
lang: zh-CN
date: 2025-04-28
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
  - python
tag:
  - python
---
## 环境管理工具选择

|       **需求优先级**       |  **推荐工具**  |                           **原因**                           |
| :------------------------: | :------------: | :----------------------------------------------------------: |
|  数据科学/非 Python 依赖   |    Anaconda    |               一站式解决环境、依赖和跨平台问题               |
| 纯 Python 开发/多版本切换  |     pyenv      |                    轻量高效，避免臃肿环境                    |
|     团队协作与依赖锁定     | pyenv + Poetry | 通过 `poetry` 实现依赖锁定，`pyenv` 管理版本，兼顾灵活性与可维护性 |
| 开发环境一致性（如 CI/CD） |    Anaconda    |          `environment.yml` 文件更易维护和跨平台复现          |

## Anaconda

Anaconda：可以附带安装python，Anaconda和python的关系如下图

![图片](/otherLangage/aa35203280c6473891bc5c3dcd253037.png)

官网地址：https://www.anaconda.com/download

国内下载地址：https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/

## pyenv

pyenv是一个专注于 **Python 版本管理** 的工具，它允许开发者在同一台机器上轻松安装、切换和管理多个 Python 版本（如 3.8、3.12 等），从而解决不同项目对 Python 版本或依赖环境的冲突问题。

### 安装

#### 安装pyenv

**Windows 用户**（需启用 WSL 或直接使用 pyenv-win）：

```powershell
# 下载 pyenv-win（推荐使用 WSL 更稳定）
git clone https://github.com/pyenv-win/pyenv-win.git "$HOME/.pyenv"

git clone https://github.com/pyenv-win/pyenv-win.git "D:\soft\pyenv/.pyenv"

git clone https://github.com/pyenv-win/pyenv-win.git "C:\Programs\pyenv/.pyenv"
```

#### 配置环境变量

```powershell
# 添加到环境变量（需重启生效）
[System.Environment]::SetEnvironmentVariable('PYENV',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PATH', $env:PATH + ";$env:USERPROFILE\.pyenv\pyenv-win\bin;$env:USERPROFILE\.pyenv\pyenv-win\shims","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME', 'D:\PythonVersions', 'User')

# 自定义路径
[System.Environment]::SetEnvironmentVariable('PYENV',"D:\soft\pyenv\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',"D:\soft\pyenv\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PATH', $env:PATH + ";D:\soft\pyenv\.pyenv\pyenv-win\bin;D:\soft\pyenv\.pyenv\pyenv-win\shims","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME', 'D:\soft\pyenv\.pyenv\PythonVersions', 'User')
# 修改终端代理地址
[System.Environment]::SetEnvironmentVariable('PYTHON_BUILD_MIRROR_URL', 'https://mirrors.aliyun.com/python/', 'User')


[System.Environment]::SetEnvironmentVariable('PYENV',"C:\Programs\pyenv\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',"C:\Programs\pyenv\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PATH', $env:PATH + ";C:\Programs\pyenv\.pyenv\pyenv-win\bin;C:\Programs\pyenv\.pyenv\pyenv-win\shims","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME', 'C:\Programs\pyenv\.pyenv\PythonVersions', 'User')
# 修改终端代理地址
[System.Environment]::SetEnvironmentVariable('PYTHON_BUILD_MIRROR_URL', 'https://mirrors.aliyun.com/python/', 'User')


# 查看环境变量（新开窗口）
echo $env:PYENV_ROOT
echo $env:PYENV_HOME
echo $env:PYTHON_BUILD_MIRROR_URL  # 阿里云镜像源


# 删除配置操作(当配置错误的时候可以用下面命令删除)
Remove-Item Env:PYENV
Remove-Item Env:PYENV_ROOT
Remove-Item Env:PATH -ErrorAction SilentlyContinue
```

#### 验证安装

```bash
pyenv --version  # 显示版本号（不能和上面安装的使用同一个窗口）
pyenv install --list  # 列出可安装的 Python 版本

# 安装指定版本
pyenv install 3.13.0
```

### 手动安装python

若镜像源仍不可用，可手动下载并指定缓存目录：

1. **下载 Python 3.13.0 源码包**
   访问华为云镜像站：[Python 3.13.0 下载页](https://mirrors.huaweicloud.com/python/3.13.0/)
   下载 `Python-3.13.0.tgz`（根据系统选择压缩包类型）。

2. 放入缓存目录

```
$env:USERPROFILE\.pyenv\pyenv-win\install_cache\
```

3. 执行安装

```shell
pyenv install 3.13.0

# 设置全局版本
pyenv global 3.13.0

# 查询当前版本
pyenv version

# 查询安装路径，下面命令包含输出
pip show pip
```

## uv

是新一代高性能 Python 工具（Astral 团队开发，Rust 实现），不仅能创建虚拟环境（类似 `venv`），还具备超高速包安装与依赖解析能力，兼容 `pip` 和 `pip-tools` 工作流，支持生成 `requirements.txt` 和 `pyproject.toml`，比python默认自带的venv快。

整合功能：替代pip、pip-tools、pipx、poetry、pyenv等

###  UV命令速查表

| 命令                       | 描述           |
| :------------------------- | :------------- |
| `uv init <项目名>`         | 创建新项目     |
| `uv venv`                  | 创建虚拟环境   |
| `uv add <包名>`            | 添加依赖       |
| `uv remove <包名>`         | 移除依赖       |
| `uv run <脚本>`            | 运行脚本       |
| `uv lock`                  | 生成锁文件     |
| `uv sync`                  | 同步环境与依赖 |
| `uv python install <版本>` | 安装Python版本 |
| `uv tool install <工具>`   | 安装Python工具 |
| `uvx <工具> [参数]`        | 运行Python工具 |
| `uv tree`                  | 打印依赖树     |
| `uv build`                 | 编译工程       |

```shell
# 检查是否有可更新的包
uv pip list --outdated

# 更新单个包
uv pip install --upgrade <package_name>
```

### 创建项目流程

```shell
# 用 uv 工具创建一个名为 weather 的新项目。uv init 是 UV 工具中用于初始化新项目的命令，它会生成必要的文件结构，如 .gitignore、README.md、pyproject.toml 等
un init weather

# 进入项目目录
cd weather

# 在当前命令行目录下创建一个名为 .venv 的虚拟环境。UV 会利用这个虚拟环境来隔离项目的 Python 解释器和依赖库
uv venv
# 激活虚拟环境。激活后，命令行提示符前会显示虚拟环境的名称，表示后续的操作将在该虚拟环境中进行
.venv\Scripts\activate # 退出激活的环境deactivate

# 安装依赖，同时会安装其所有必须的依赖项
# uv add 命令会自动将这些依赖信息写入 pyproject.toml 文件中，并更新 uv.lock 锁定文件，以确保项目依赖的一致性和可重复性
uv add mcp[cli] httpx

# 运行项目
uv run main.py
```

### 管理python版本

```shell
# 列出uv支持的python版本
uv python list

# 安装特定Python版本
uv python install 3.10 3.11 3.12

# 创建特定Python版本的虚拟环境
uv venv --python 3.13.0
```

### pip兼容接口

UV提供了pip兼容的接口，可直接替代pip命令：

```
# 编译依赖
uv pip compile requirements.in --output-file requirements.txt

# 安装锁定依赖
uv pip sync requirements.txt
```

### 迁移现有项目

如果你有一个使用`requirements.txt`的现有项目：

```shell
# 导入现有依赖
# 将 requirements.txt 文件中的依赖信息进行编译，生成一个锁定文件 requirements.lock
uv pip compile requirements.txt -o requirements.lock
# 用于同步项目的 Python 环境，使其与 requirements.lock 文件中记录的依赖版本一致
uv pip sync requirements.lock

# 或者直接转换成UV项目(生成诸如 .python-version、main.py、pyproject.toml、README.md 等基础文件)
uv init .
# 将requirements.txt文件依赖包导入到pyproject.toml(需要提前有这个文件)中
uv add -r requirements.txt
# 使用命令去下载pyproject.toml中依赖项了
uv sync
```

### 安装

```powershell
# 指定安装目录-没测试成功
$env:UV_INSTALL_DIR = /D:/soft/pyuv

powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 设置源地址(切换新窗口生效)
[System.Environment]::SetEnvironmentVariable('UV_DEFAULT_INDEX',"https://mirrors.aliyun.com/pypi/simple/","User")
```

查看版本

```shell
uv --version
```

成功之后需要重新启动终端。

### 卸载

在删除二进制文件之前，你可以选择清理 `uv` 存储的任何数据，执行以下命令：

```shell
uv cache clean
```

此命令会清理 `uv` 的缓存数据。之后，你还可以手动删除 `uv` 存储数据的目录，在 macOS 和 Linux 系统中，一般是 `~/.uv` 目录；在 Windows 系统中，通常是 `%USERPROFILE%\.uv` 目录。你可以使用以下命令进行删除：

```shell
rm -r %USERPROFILE%\.uv
```

删除 uv 和 uvx 二进制文件

```
rm %USERPROFILE%\.local\bin\uv.exe %USERPROFILE%\.local\bin\uvx.exe
```

这里删除的是 `uv` 和 `uvx` 的二进制文件，以确保完全卸载。

## venv

:::tip

首先要确保你的系统已经安装了 Python

:::

 Python 自带的用于创建虚拟环境的工具。虚拟环境可以为每个项目创建一个独立的 Python 运行环境，不同项目之间的依赖不会相互影响。适用于只在一个环境开发，项目程序不算太复杂，建议使用。

* 虚拟环境
* 依赖包安装=>pip

### 创建虚拟环境

#### 选择创建位置

打开命令行工具（Windows 上是 `cmd` 或 `PowerShell`，Linux 和 macOS 上是 `Terminal`），使用 `cd` 命令导航到你想要创建虚拟环境的目录。例如：

```bash
cd /path/to/your/project/directory
```

#### 创建虚拟环境

在不同操作系统上，创建虚拟环境的命令有所不同：

- **Windows**：

```bash
python -m venv myenv
```

- **Linux/MacOS**：

```bash
python3 -m venv myenv
```

这里的 `myenv` 是虚拟环境的名称，你可以根据需要自定义。执行命令后，指定名称的文件夹将会在当前目录下创建，该文件夹包含了虚拟 Python 安装所需的所有文件

### 激活虚拟环境

创建好虚拟环境后，需要激活它，这样后续的操作才会在虚拟环境中进行。

- **Windows（cmd.exe）**：

```bash
myenv\Scripts\activate
```

- **Windows（PowerShell）**：

```bash
myenv\Scripts\Activate.ps1
```

- **Linux/MacOS**：

```bash
source myenv/bin/activate
```

激活成功后，命令行提示符前会显示虚拟环境的名称，例如 `(myenv)`，表示你已经成功进入虚拟环境

### 退出虚拟环境

当你完成工作后，想要退出虚拟环境，只需在命令行中输入 `deactivate` 命令：

```bash
deactivate
```

执行该命令后，你将回到系统的默认 Python 环境

### 虚拟环境

如果你不再需要某个虚拟环境，直接删除对应的文件夹即可。例如，在 Windows 上可以使用以下命令：

```bash
rm -rf myenv
```

在 Linux 和 macOS 上也可以使用同样的命令。删除后，虚拟环境将被彻底清除

## pip

pip是 Python 的包管理工具，用于安装、升级和卸载 Python 包。在最新版本的 Python 中，`pip` 会随 Python 一同安装并完成系统变量设置

### 安装包

在激活的虚拟环境中，使用 `pip install` 命令来安装 Python 包。例如，安装 `requests` 库：

```bash
pip install requests
```

`pip` 会自动从 Python Package Index（PyPI）下载并安装指定的包及其所有依赖项

### 安装指定版本的包

如果你需要安装特定版本的包，可以在包名后面加上版本号，使用 `==` 进行指定。例如，安装 `Django` 的 3.2.5 版本：

```bash
pip install Django==3.2.5

# 显示一个包的所有可用版本
pip index versions [package-id]
```

### 查看已安装的包

使用 `pip list` 命令可以列出当前虚拟环境中已经安装的所有包及其版本号：

```bash
pip list

# 查看哪些包有更新可用
pip list --outdated
```

### 卸载包

如果想要卸载某个包，使用 `pip uninstall` 命令，例如卸载 `requests` 库：

```bash
pip uninstall requests
```

执行该命令后，`pip` 会要求你确认卸载操作

### 导出依赖清单

你可以使用 `pip freeze` 命令将当前虚拟环境中所有已安装的包及其版本号导出到一个文件中，通常命名为 `requirements.txt`：

```bash
pip freeze > requirements.txt
```

`requirements.txt` 文件的格式通常是每行一个包名和版本号，例如：

```markdown
requests==2.25.1
numpy==1.21.0
```

### 从依赖清单安装包

当你需要在另一个环境中安装相同的依赖时，可以使用 `pip install -r` 命令读取 `requirements.txt` 文件并安装其中的所有包：

```bash
pip install -r requirements.txt
```

这样可以确保新环境中的依赖与原环境一致

### 检测未使用的依赖

```shell
# 安装 pip-autoremove
pip install pip-autoremove

# 检测未使用的依赖
pip-autoremove -l
```

## poetry

适用于windows开发，linux服务器部署，python版本也不相同。项目程序相对复杂，建议使用。

* 虚拟环境管理工具
* 依赖管理工具
* 打包工具

为什么使用poetry：https://github.com/geekfong/how_to_use_poetry

使用教程：https://www.bilibili.com/video/BV1J34y1A7q9/

### 使用



### Poetry 常用命令

#### 创建项目

```
poetry new my_project   # 创建一个新项目
poetry init             # 在当前目录初始化 Poetry 项目1
```

#### 依赖管理

```
poetry add requests     # 安装 requests 依赖
poetry remove requests  # 移除 requests 依赖
poetry update           # 更新所有依赖
```

#### 运行和管理环境

```
poetry install          # 安装所有依赖
poetry shell            # 进入虚拟环境
poetry run python app.py  # 在虚拟环境中运行 Python 脚本
```

#### 发布和配置包

```
poetry build            # 构建项目
poetry publish          # 发布项目到 PyPI
```

### 安装

#### 设置环境变量

```powershell
[System.Environment]::SetEnvironmentVariable('POETRY_HOME',"D:\soft\Poetry\","User")
[System.Environment]::SetEnvironmentVariable('PATH', $env:PATH + ";D:\soft\Poetry\","User")
```

#### 执行脚本

新开窗口执行

```bash
# Windows PowerShell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# 验证安装
poetry --version
```
设置环境变量

```powershell
[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";C:\Users\synyi\AppData\Roaming\Python\Scripts", "User")
```

#### 配置

```bash
# 配置国内镜像源（加速下载）
poetry config repositories.pypi https://pypi.tuna.tsinghua.edu.cn/simple/

# 将虚拟环境生成在项目内（推荐）
poetry config virtualenvs.in-project true
```

## 虚拟环境工具选择

1. **数据科学/跨语言依赖** → **Conda**（不可替代）
2. **新项目开发** → **Poetry**（标准化 + 高效）
3. **极速依赖安装** → **UV**（性能王者）
4. **全流程轻量管理** → **Hatch**（一站式）
5. **过渡/简单场景** → **Pipenv**（逐步淘汰）

## 优化

### 切换源

国内镜像源
清华：[https://pypi.tuna.tsinghua.edu.cn/simple](https://pypi.tuna.tsinghua.edu.cn/simple)

阿里云：https://mirrors.aliyun.com/pypi/simple/

中国科技大学 [https://pypi.mirrors.ustc.edu.cn/simple/](https://pypi.mirrors.ustc.edu.cn/simple/)

华中理工大学：[http://pypi.hustunique.com/](http://pypi.hustunique.com/)

山东理工大学：[http://pypi.sdutlinux.org/](http://pypi.sdutlinux.org/) 

豆瓣：[http://pypi.douban.com/simple/](http://pypi.douban.com/simple/)

使用方法：下载包的时候加上参数-I （不加也可以）

```shell
pip install -i https://pypi.tuna.tsinghua.edu.cn/simplepyspider
```

修改配置的方法：

#### linux

修改 ~/.pip/pip.conf (没有就创建一个文件夹及文件。文件夹要加“.”，表示是隐藏文件夹)

```csharp
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
```

#### windows

直接在user目录中创建一个pip目录，如：C:\Users\xx\pip，新建文件pip.ini。内容同上。
事例：在C:\Users\azrng\pip目录下创建pip.ini 文件

```csharp
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
```

然后下次下载的时候就直接pip install requests



直接命令行设置（会输出该配置文件所在目录）

```shell
# 查询默认源
pip config list
 
# 设置源 
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

### 减少占用空间

1. **更改 pip 缓存目录**
   可以通过设置环境变量 `PIP_CACHE_DIR` 或在 pip 配置文件中指定缓存路径，将缓存目录移动到其他磁盘。例如，将缓存目录设置为 E 盘的某个路径。

2. **清理缓存文件**
   使用 `pip cache purge` 命令清理不必要的缓存文件。

3. **更改依赖项安装路径**
   如果使用虚拟环境，可以在创建虚拟环境时指定路径，例如：

   bash复制

   ```bash
   python -m venv E:\path\to\your\venv
   ```

   这样，依赖项会被安装到指定的虚拟环境目录中。

4. **清理临时文件**
   定期清理系统临时文件目录 `C:\Users\<用户名>\AppData\Local\Temp`