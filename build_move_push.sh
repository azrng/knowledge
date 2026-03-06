#!/bin/bash

echo "start build"
# pnpm run docs:build

set "sourceFolder=.\src\.vuepress\dist"
set "destinationFolder=..\kbms\dist"

echo "input e to finish"
while read input
do
    if [ $input == "e" ]
    then
        break
    else
        ehco "input value show"
        echo $input
    fi
done


# REM 拷贝文件夹到目标文件夹
# robocopy "%sourceFolder%" "%destinationFolder%" /e /purge /ndl /nfl
# echo copy success


# echo Ready to submit
# REM 切换到目标文件夹
# cd /d "%destinationFolder%"


# REM 执行 git 提交和推送
# git add .
# git commit -m "Update files"
# @REM git push origin master