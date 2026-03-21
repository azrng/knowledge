# 候选标题（请在公众号后台选择一个最吸引你的）

**从报错到成功运行：解决 SkillHub 安装过程中“找不到 Python”与“python3”依赖问题**

---

# 正文内容

## 📖 导读

最近在尝试安装 **SkillHub** 时，遇到了一系列典型的 Windows 环境配置问题。由于我使用的是目前非常流行的 Python 包管理器 **`uv`**，而非传统的系统级 Python 安装，导致在执行安装脚本时，终端频频报错，提示找不到 Python 或 python3。

这篇文章记录了从环境变量冲突、应用执行别名干扰，到手动配置 `python3` 别名的完整排查过程。如果你也在 Windows 下使用 `uv` 或遇到了类似的“Python not found”问题，希望这篇教程能帮你节省时间。

---

## ⚠️ 初次尝试：Python 找不到？

最开始，我直接复制了官方提供的安装命令运行，结果终端立刻抛出了错误：

```plsql
$ curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings > App execution aliases.
```

这是因为我的开发环境主要由 `uv` 管理，并没有将 Python 添加到全局 PATH 中。验证一下：

```plsql
PS C:\Users\Azrng> python -v
Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings -> App execution aliases.
```

---

## 🔍 环境分析：uv 的目录结构

先来看看当前的系统环境变量（`PATH`）配置情况：

```plsql
D:\Soft\pyuv
C:\Users\Azrng\AppData\Local\Microsoft\WindowsApps
D:\Program Files\Microsoft VS Code\bin
```

可以看到 `uv` 的目录 `D:\Soft\pyuv` 已经在环境变量中了。确认一下 `uv` 的安装是否正常：

```plsql
PS C:\Users\Azrng> uv --version
uv 0.9.8 (85c5d3228 2025-11-07)
```

在这个目录下，只有 `uv` 的可执行文件，并没有直接的 `python.exe`：

```plsql
PS D:\Soft\pyuv> dir


    目录: D:\Soft\pyuv


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         2025/11/7     18:05       60600832 uv.exe
-a----         2025/11/7     18:05         330752 uvw.exe
-a----         2025/11/7     18:05         330752 uvx.exe
```

我们需要找到 `uv` 实际管理的 Python 解释器在哪里。使用以下命令查看：

```plsql
PS C:\Users\Azrng> uv python list
cpython-3.13.9-windows-x86_64-none                   AppData\Roaming\uv\python\cpython-3.13.9-windows-x86_64-none\python.exe
```

---

## 🛠️ 解决方案一：修正环境变量优先级

既然找到了 Python 的真实路径，我们就可以尝试将这个路径加入环境变量。

**操作步骤：**

1.  在系统环境变量 `PATH` 中**新增**一项：
    `C:\Users\Azrng\AppData\Roaming\uv\python\cpython-3.13.9-windows-x86_64-none`
2.  **关键点**：将这一项移动到 `C:\Users\Azrng\AppData\Local\Microsoft\WindowsApps` **之前**。

这样做是为了优先找到真实的 Python，而不是 Windows 应用商店的快捷方式。

修改后，打开一个新的 PowerShell 窗口验证：

```plsql
PS C:\Users\Azrng> python --version
Python 3.13.9
```

很好，PowerShell 中已经能识别 Python 了。但此时如果我们在 **Git Bash**（MINGW64）中再次尝试安装，问题依旧：

```plsql
Azrng@AZRNG MINGW64 /d
$ curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
Python was not found; run without arguments to install from the Microsoft Store, or disable this shortcut from Settings > Apps > Advanced app settings -> App execution aliases.
```

---

## 🛡️ 解决方案二：禁用 App Execution Aliases

Windows 系统有一个“应用执行别名”功能，它会拦截 `python.exe` 的调用。为了彻底避免干扰，建议将其关闭。

**操作步骤：**

1.  打开 **Windows 设置** → **应用** → **高级应用设置** → **应用执行别名**。
2.  找到 `python.exe` 和 `python3.exe`，将开关**关闭**。

![img](https://cdn.nlark.com/yuque/0/2026/png/272869/1774068455904-7fe04a5a-181d-41f1-ae3c-fed75913cd7f.png)

---

## 🔄 解决方案三：解决 `python3` 依赖问题

关掉别名后，再次运行安装脚本，虽然不再提示之前错误了，但出现了新的错误：

```plsql
Azrng@AZRNG MINGW64 /d/Soft/pyuv
$ curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
Error: python3 is required for skillhub.
Azrng@AZRNG MINGW64 /d/Soft/pyuv
$ where python3
信息: 用提供的模式无法找到文件。

Azrng@AZRNG MINGW64 /d/Soft/pyuv
$ where python
C:\Users\Azrng\AppData\Roaming\uv\python\cpython-3.13.9-windows-x86_64-none\python.exe
```

**问题分析：**
脚本明确要求 `python3` 命令，但 `uv` 管理的目录下只有 `python.exe`。系统找不到 `python3` 这个可执行文件。

**解决方法：**
我们需要手动做一个“复制并重命名”的操作。

进入 `uv` 的 Python 安装目录：
`C:\Users\Azrng\AppData\Roaming\uv\python\cpython-3.13.9-windows-x86_64-none`

将 `python.exe` **复制一份**，并重命名为 `python3.exe`。

验证一下：

```plsql
Azrng@AZRNG MINGW64 /d/Soft/pyuv
$ where python3
C:\Users\Azrng\AppData\Roaming\uv\python\cpython-3.13.9-windows-x86_64-none\python3.exe
```

现在，再次执行安装命令：

```plsql
curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
```

这次脚本运行没有报错了！但输入 `skillhub -v` 查看版本时，又遇到一个坑：

```plsql
Azrng@AZRNG MINGW64 /d/Soft/pyuv
$ skillhub -v
bash: skillhub: command not found


# 检查安装目录是否存在
ls -la /c/Users/Azrng/.local/bin/skillhub
```

---

## ✅ 解决方案四：添加 SkillHub 全局路径

虽然安装成功，但 `skillhub` 的可执行文件所在的目录还没有加入到环境变量中。

**操作步骤：**
编辑用户环境变量，在 `PATH` 中新增：

```plsql
C:\Users\Azrng\.local\bin
```

**注意：** 记得新开一个命令行窗口让环境变量生效。

再次验证：

```plsql
Azrng@AZRNG MINGW64 ~/.local/bin
$ skillhub -v
skillhub 2026.3.18

Azrng@AZRNG MINGW64 ~/.local/bin
$ skillhub install github
Downloading: https://lightmake.site/api/v1/download?slug=github
Installed: github -> C:\Users\Azrng\.local\bin\skills\github
```

完美，技能安装成功！

---

## 💡 总结

在 Windows 下使用 `uv` 这种非传统的 Python 管理工具时，安装旧脚本或依赖 `python3` 命令的工具，容易遇到环境变量冲突。

回顾一下本次排错的 4 个关键点：
1.  **优先级问题**：确保真实 Python 路径在 `WindowsApps` 之前。
2.  **系统拦截**：果断关闭 Windows 的 **App Execution Aliases**。
3.  **命令别名**：针对报错需求，手动复制 `python.exe` 为 `python3.exe`。
4.  **工具路径**：别忘了将工具的 bin 目录（如 `.local\bin`）加入 PATH。