@REM 构建发布-拷贝文件到发布目录-提交并推送

@rem 这是一个批处理脚本的命令，它用于关闭在执行脚本时显示命令本身的输出。如果在脚本中包含了该命令，那么在脚本运行时将不会显示执行的命令，只会显示命令的输出结果。
@echo off


echo start build
@REM pnpm run docs:build

set "sourceFolder=.\src\.vuepress\dist"
set "destinationFolder=..\kbms\dist"

echo set path success

echo copy folder
robocopy "%sourceFolder%" "%destinationFolder%" /e /purge /ndl /nfl
echo copy success


echo Ready to submit
REM 切换到目标文件夹
cd /d "%destinationFolder%"


REM 执行 git 提交和推送
git add .
git commit -m "feat:update docs"
git push

pause
