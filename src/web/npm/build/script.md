---
title: 脚本文件
lang: zh-CN
date: 2023-08-01
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: jiaobenwenjian
slug: kd80dkwf60qxvzxk
docsId: '117077699'
---

### 创建sh执行
```csharp
FROM node:latest

WORKDIR /
COPY . .

## RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7
## RUN pnpm config set store-dir .pnpm-store

RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npm.taobao.org/

## pnpm docs:build --dest public \n\

## RUN echo "#!/bin/sh \n\
## echo "npm install" \n\
## pnpm install --frozen-lockfile \n\
## pnpm run docs:dev  \n\
## " >> /usr/local/bin/entrypoint.sh

RUN echo "#!/bin/sh \n\
echo "pnpm install" \n\
pnpm install \n\
pnpm run docs:dev  \n\
" >> /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 80/tcp

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

```

### 直接运行
```csharp
FROM node:latest

RUN mkdir -p /home/nodeApp
COPY . /home/nodeApp
WORKDIR /home/nodeApp
RUN npm install -g pnpm && pnpm config set registry https://registry.npm.taobao.org && pnpm install
ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080
CMD ["pnpm", "run", "docs:dev"]
```
