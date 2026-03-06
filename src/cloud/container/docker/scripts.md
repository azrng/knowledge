---
title: 脚本
lang: zh-CN
date: 2023-06-05
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - docker
  - script
---

## 导入导出指定镜像

```shell
#!/bin/bash

# docker image export import

echo "Please select action:"
echo "1) Export Images"
echo "2) Import Images"
read -p "Please enter your choice (1/2)： " choice

case $choice in
    1)
        # export images
        read -p "Please enter the image ID: " image_id
        read -p "Please enter the export file name: " export_path
        echo "export..."
        # docker export $container_id > $export_path
        docker save $image_id -o $export_path
        echo "Export complete"
        ;;
    2)
        # import images
        read -p "Please enter the image ID: " image_id
        read -p "Please enter the import name: " image_name
        read -p "Please enter the import path: " import_path
        echo "import..."
        # docker import $import_path $import_name
        docker load -i $import_path
        docker tag $image_id $image_name
        echo "imports closure。"
        ;;
    *)
        echo "Invalid selection, the script will exit。"
        exit 1
        ;;
esac
```

## 导入导出所有镜像

### 导出脚本

```sh
#!/bin/bash


## 获取到 "image:tag" 格式的镜像名
IMG_NAME=`docker images | grep -v TAG | awk '{print $1":"$2}'`
## echo $IMG_NAME | awk '{gsub(/ /,"\n",$0)} {print $0}'

## 如果原本镜像名中存在 "/" 是需要去掉的

## 定义镜像存放目录
DIR="/data/docker/image_tar"
if [ ! -d "$DIR" ]; then
  echo -e "\033[34m${DIR}\033[0m 不存在"
  mkdir -p "$DIR"
  echo -e "\033[34m${DIR}\033[0m 已创建"
else
  echo -e "\033[34m${DIR}\033[0m 已存在"
fi
echo ""
for IMAGE in $IMG_NAME
do
  echo -e "正在保存 \033[33m${IMAGE}\033[0m"
  SAVE_NAME=`echo $IMAGE | awk -F: '{print $1"_"$2}' | sed 's/\//_/g'`
  docker save $IMAGE -o ${DIR}/${SAVE_NAME}.tar
  echo -e "已保存到 \033[34m${DIR}/\033[31m${SAVE_NAME}.tar\033[0m"
  echo ""
done
```

### 导入脚本
```sh
#!/bin/bash

## 在此处填写镜像文件的保存目录
IMAGE_DIR="/data/docker/image_tar"

for IMAGE in `ls $IMAGE_DIR`
do
  echo -e "正在导入镜像 \033[33m$IMAGE\033[0m"
  docker load -i ${IMAGE_DIR}/${IMAGE}
  echo -e "已成功导入镜像 \033[33m$IMAGE\033[0m"
  echo ""
done
```
