---
title: 流水线脚本
lang: zh-CN
date: 2022-11-27
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - gitlab
  - ci
  - cd
---
## 说明

预定义变量：[https://docs.gitlab.com/ee/ci/variables/predefined_variables.html](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)

环境变量官方翻译中文资料：[https://blog.csdn.net/londa/article/details/93896368](https://blog.csdn.net/londa/article/details/93896368)

## 语法

* job/script/before_script/after_script/stages/stage/variables
* 作业名字必须唯一
* 每个作业必须包含script

## 示例文件

```yaml
# .gitlab-ci.yml

before_script:
  - echo "before-scipt"
  - echo "Hello, $GITLAB_USER_LOGIN!"

# 定义变量
variables:
  IMAGE_REPOSITORY_ADDRESS: registry.cn-hangzhou.aliyuncs.com/zrng/test2

# job/script/before_script/after_script/stages/stage/variables

# 定义作业可以使用的阶段，同一个阶段的作业并行执行，不同的作业按照顺序执行
stages: # 每个job名字必须唯一
  - build
  - test
  - codescan
  - deploy

build:
  before_script: # 作业运行之间执行
    - echo "before_script in job"
  stage: build
  script:
    - echo "build!"
  after_script:
    - echo "after script in buildjob"

unittest:
  stage: test
  script:
    - echo "run test"

deploy:
  stage: deploy
  script:
    - echo "hello deploy"
  parallel: 5
  tags:
    - dotnet # 让标记有dotnet的runner去执行这一部分操作

codescan:
  stage: deploy
  script:
    - echo "codescan"

after_script:
  - echo "after_script"
```
## Docker构建.Net示例

```shell
# .gitlab-ci.yml

stages:
  - build
  
build:
  stage: build
  script:
    - cd WebApplication1
    - docker build -f Dockerfile -t mytest ../
    - docker rm -f mytest && docker run --name mytest -d -p 8060:8080 mytest ## remove old,create new 
  tags:
    - dotnet
```

## Docker构建.Net并推送镜像到仓库

```shell
# .gitlab-ci.yml

variables:
  IMAGE_REPOSITORY_ADDRESS: registry.cn-hangzhou.aliyuncs.com/zrng/test2

# 控制顺序
stages: # 每个job名字必须唯一
  - Deploy To Docker
  - Push Image To Repository

deploy:
  stage: Deploy To Docker
  script:
    - cd WebApplication1
    - docker build -f Dockerfile -t $IMAGE_REPOSITORY_ADDRESS:$CI_COMMIT_BRANCH ../
    - docker rm -f $CI_PROJECT_ID_$CI_COMMIT_BRANCH && docker run --name $CI_PROJECT_ID_$CI_COMMIT_BRANCH -d -p 8060:8080 $IMAGE_REPOSITORY_ADDRESS:$CI_COMMIT_BRANCH ## remove old,create new 
  tags:
    - dotnet # 让标记有dotnet的runner去执行这一部分操作

push-image: # runner服务器需要登录，查询是否登录 history | grep 'docker login'
  rules:
    - if: $CI_DEFAULT_BRANCH
  stage: Push Image To Repository
  script:
    - echo "推送镜像"
    #- docker push $IMAGE_REPOSITORY_ADDRESS:$CI_COMMIT_BRANCH # 默认每个分支只先保留一个镜像
    #- docker rmi -f $IMAGE_REPOSITORY_ADDRESS:$CI_COMMIT_BRANCH
  tags:
    - dotnet
```

## docker in docker打包上传

```yaml
docker:build:
  stage: build
  tags:
    - gr1
  image: docker:19.03.1
  services:
    - name: docker:19.03.1-dind
      command: ['--insecure-registry=your.registry.com:port']
  variables:
    # Use TLS https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#tls-enabled
    DOCKER_HOST: tcp://docker:2375
    DOCKER_TLS_CERTDIR: ""
    #DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker pull $CI_REGISTRY_IMAGE:latest || true
    - docker build --cache-from $CI_REGISTRY_IMAGE:latest --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA --tag $CI_REGISTRY_IMAGE:latest --build-arg JAR_FILE=target/*.jar .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
```

