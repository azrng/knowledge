@echo off
set /p choice=Whether to pull(y/n): 

if /i "%choice%"=="y" (
    git pull
)

pnpm run docs:dev
