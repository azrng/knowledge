---
title: NginxWebUI
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: nginxwebui
slug: ychpws
docsId: '52490584'
---

## 部署
docker部署
```yaml
docker run --name nginxwebui -itd -v /root/nginxWebUI:/home/nginxWebUI -v /var/net:/home/nginxWebUI/data -e BOOT_OPTIONS="--server.port=9008" --privileged=true --net=host  cym1102/nginxwebui:latest
```
> /var/net:/home/nginxWebUI/data 代码挂载目录
> --server.port=9008 是容器端口为9008
> --net=host 外面所有端口都映射到内部

如果nginx是通过容器启动的，那么我们在写映射路径的时候，要将部署的代码映射到容器内，这样子容器才能访问得到，比如var/net:/home/nginxWebUI/data，然后部署网站的时候反向代理的代理目标就变成了/home/nginxWebUI/data/kbms
```yaml
server {
  listen 8013;
  location / {
    root /home/nginxWebUI/data/kbms;
    index index.html;
  }
}

```

新生成文件后，最好按顺序执行：校验文件–》替换文件–》重新装载


## 资料
Gitee：[https://gitee.com/cym1102/nginxWebUI](https://gitee.com/cym1102/nginxWebUI)
