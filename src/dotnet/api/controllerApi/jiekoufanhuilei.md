---
title: 接口返回类
lang: zh-CN
date: 2023-03-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiekoufanhuilei
slug: bveqgl
docsId: '45443233'
---
```csharp
    public interface IApiResult
    {
        /// <summary>
        /// 是否成功
        /// </summary>
        bool IsSuccess { get; set; }

        /// <summary>
        /// 消息
        /// </summary>
        string Message { get; set; }

        /// <summary>
        /// 错误码
        /// </summary>
        string Code { get; set; }
    }

    public interface IApiResult<T> : IApiResult
    {
        /// <summary>
        /// 数据
        /// </summary>
        T Data { get; set; }
    }

    public class ApiResult : IApiResult
    {
        private string _message;
        private string _code;

        public bool IsSuccess { get; set; }

        public virtual string Code
        {
            get => string.IsNullOrWhiteSpace(_code) ? string.Empty : _code;
            set => _code = value;
        }

        public virtual string Message
        {
            get => string.IsNullOrEmpty(_message) ? string.Empty : _message;
            set => _message = value;
        }
    }

    public class ApiResult<T> : ApiResult, IApiResult<T>
    {
        public T Data { get; set; }
    }
```
