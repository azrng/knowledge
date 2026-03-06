---
title: Python调用
lang: zh-CN
date: 2025-05-11
publish: true
author: azrng
isOriginal: true
category:
  - ai
tag:
  - ai
  - python
---

## LangChain

LangChain是一个用于开发由大语言模型驱动的应用程序框架。

LangChain文档：https://python.langchain.com/docs/how_to/

LangChain中文文档：https://langchain.ichuangpai.com/

### 安装库

#### 基础库

```
pip install langchain==0.3.7 -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install langchain-openai==0.2.3 -i https://pypi.tuna.tsinghua.edu.cn/simple


pip install langchain -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install langchain-openai -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### langgraph-swarm

仓库地址：[https://github.com/langchain-ai/langgraph-swarm-py](https://github.com/langchain-ai/langgraph-swarm-py)



##  LangGraph

LangGraph文档：https://langchain-ai.github.io/langgraph/



### 示例代码

#### 响应结果汇总后流式输出

```python
async def process_query(request: ChatRequest):
    """
    处理查询操作
    :param request: 请求模型
    :return: 流式输出
    """
    try:
        token = "123456" # 模拟token传递

        yield f"data: {json.dumps({'event': 'start'})}\n\n"
        # 处理聊天历史
        chat_history = []
        for msg in request.history:
            if msg["role"] == "user":
                chat_history.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                chat_history.append(AIMessage(content=msg["content"]))
            elif msg["role"] == "tool":
                chat_history.append(ToolMessage(
                    content=msg["content"],
                    tool_call_id=msg.get("tool_call_id", ""),
                    name=msg.get("name", "")
                ))

        config = RunnableConfig(configurable={'thread_id': request.conversation_id, 'token': token})
        # 执行agent并流式输出
        response = main_agent.invoke({"messages": [HumanMessage(content=request.message)] + chat_history, },
                                     config=config)

        for message in response["messages"]:
            content = ResponseUtils.ai_response_stream_output(message)
            if content:  # 如果content存在数据
                yield f"data: {content}\n\n"

    except Exception as e:
        error_message = {"event": "error", "detail": str(e)}
        yield f"data: {json.dumps(error_message, ensure_ascii=False)}\n\n"
    finally:
        # 结束事件
        yield f"data: {json.dumps({'event': 'end'})}\n\n"
```

## Langfuse

中文文档：https://langfuse.com/cn

对接LangChain文档：https://langfuse.com/docs/integrations/langchain/tracing

适用于LangChain的invoke、run、predict方法

## SearXNG

AI搜索工具：https://appscross.com/blog/essential-for-ai-search-deployment-and-release-of-searxng.html
