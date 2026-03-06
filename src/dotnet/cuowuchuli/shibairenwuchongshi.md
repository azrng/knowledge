---
title: 失败任务重试
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shibairenwuchongshi
slug: rl63d8
docsId: '29472994'
---

### 说明
异常是指方法没有完成应该完成的任务。有时候需要对一些失败的任务进行多次的重试操作，如果重试达到指定数目，就不再重试。(由于网络波动导致任务处理失败)

### 示例
```csharp
 public static class CommonTools
    {
        static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();
        static int sleepMillisecondsTimeout = 1000;

        /// <summary>
        /// 若发生 Exception (资料库查询时候)，重复执行相同的动作
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="handler"></param>
        /// <param name="retryTimes">预设重试 3次，传入 0直接 return default(T)</param>
        /// <returns></returns>
        public static T Retry<T>(Func<T> handler, int retryTimes = 3)
        {
            if (retryTimes <= 0)
            {
                return default(T);
            }

            try
            {
                return handler();
            }
            catch (Exception e)
            {
                retryTimes--;
                logger.Error($"剩余重试次数: {retryTimes}, retry error: {e.Message}, Exception detail: {e.ToJsonString()}");
                System.Threading.Thread.Sleep(sleepMillisecondsTimeout);
                return Retry(handler, retryTimes);
            }
        }

        /// <summary>
        /// 传入多个动作，遇到 Exception依序执行 (资料库查詢超时，改用不同条件查询)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="handlers"></param>
        /// <returns></returns>
        public static T Retry<T>(params Func<T>[] handlers)
        {
            for (int i = 0; i < handlers.Length; i++)
            {
                var handler = handlers[i];
                try
                {
                    return handler();
                }
                catch (Exception e)
                {
                    logger.Error($"第 {i}次执行错误(start from 0): retry error: {e.Message}, Exception detail: {e.ToJsonString()}");
                    System.Threading.Thread.Sleep(sleepMillisecondsTimeout);
                }
            }
            return default(T);
        }

        /// <summary>
        /// 若发生生 Exception (资料库查询时候)，重复执行相同的动作
        /// </summary>
        /// <param name="handler"></param>
        /// <param name="retryTimes">预设重试 3次，传入 0直接 return</param>
        public static void Retry(Action handler, int retryTimes = 3)
        {
            if (retryTimes <= 0)
            {
                return;
            }

            try
            {
                handler();
            }
            catch (Exception e)
            {
                retryTimes--;
                logger.Error($"剩余重试次数: {retryTimes}, retry error: {e.Message}, Exception detail: {e.ToJsonString()}");
                System.Threading.Thread.Sleep(sleepMillisecondsTimeout);
                Retry(handler, retryTimes);
            }
        }

```
调用示例
```csharp
Common.CommonTools.Retry(() => _spSystemSettingsDapperRep.GetSendMailList(mailSearchModel));
```
