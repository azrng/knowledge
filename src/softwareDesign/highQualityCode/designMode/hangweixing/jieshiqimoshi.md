---
title: 解释器模式
lang: zh-CN
date: 2023-08-02
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: jieshiqimoshi
slug: yhegaml5ffepwffi
docsId: '116931987'
---

## 概述
解释器模式(Interpreter Design Pattern)；解释器模式为某个语言定义它的语法表示，并定义一个解释器用来处理这个语法。

> 此处的语言并不是所我们平常所说的中、英、法语等，从广义上讲，只要是能承载信息的载体，我们都可以称之为语言。


解释器模式就是用来实现根据语法规则解读“内容”的解释器。

使用场景：编译器、规则引擎、正则表达式

## 操作

### 举例
举例一个解释器的操作，假设我们有一个计算加减乘除的语言，然后描述语言是一个字符串，然后前面部分是要计算的值，后面部分是运算符，然后按照先后顺序，取出两个值和一个运算符去计算结果，然后讲结果放到数字的最头部位，循环上面的操作，直到最后剩下一个数字，这个数字就是最终的计算结果，编写示例代码如下
```csharp
/// <summary>
/// 实现一个简单的语法算法
/// 4 5 6 7 - * +
/// 实现(4-5)*6+7
/// </summary>
public void SampleOperator(string str)
{
    var list = new List<int>();

    var strArray = str.Split(" ");
    for (var i = 0; i < (strArray.Length + 1) / 2; i++)
    {
        list.Add(strArray[i].ToInt());
    }

    var startIndex = (strArray.Length + 1) / 2;
    for (var i = startIndex; i < strArray.Length; i++)
    {
        if (strArray[i] is not "+" and not "-" and not "*" and not "/")
        {
            throw new NotSupportedException("不支持的操作符");
        }

        var number1 = list[0];
        var number2 = list[1];

        list.RemoveAt(0);
        list.RemoveAt(0);

        var result = 0;
        switch (strArray[i])
        {
            case "+":
                result = number1 + number2;
                break;

            case "-":
                result = number1 - number2;
                break;

            case "*":
                result = number1 * number2;
                break;

            case "/":
                result = number1 / number2;
                break;
        }
        list.Insert(0, result);
    }
    if (list.Count != 1)
    {
        throw new ArgumentException("无效的表达式");
    }
    Console.WriteLine($"计算结果是  {list[0]}");
}
```
因为这个语法规则的解析简单，所以放到一个函数中设计就足够了，但是对于负责的语法规则解析，逻辑负责，代码量多，所有的解析逻辑都耦合在一个函数中，这样子肯定不行，所以这个时候就要考虑拆分代码，将解析的逻辑拆分到独立的类中。

下面就开始拆分，可以借助解释器模式

拆分的思想就是将语法解析的工作拆分到各个小类中，以此来避免大而全的解析类，那么就可以将解析工作拆分为下面的解析类
```csharp
public interface IExpression
{
    int Interpret();
}

public class NumberExpression : IExpression
{
    private readonly int _number;

    public NumberExpression(int number)
    {
        _number = number;
    }

    public int Interpret()
    {
        return _number;
    }
}

/// <summary>
/// 加
/// </summary>
public class AdditionExpression : IExpression
{
    private readonly IExpression _expression1;

    private readonly IExpression _expression2;

    public AdditionExpression(IExpression expression1, IExpression expression2)
    {
        _expression1 = expression1;
        _expression2 = expression2;
    }

    public int Interpret()
    {
        return _expression1.Interpret() + _expression2.Interpret();
    }
}

/// <summary>
/// 减
/// </summary>
public class SubtractionExpression : IExpression
{
    private readonly IExpression _expression1;

    private readonly IExpression _expression2;

    public SubtractionExpression(IExpression expression1, IExpression expression2)
    {
        _expression1 = expression1;
        _expression2 = expression2;
    }

    public int Interpret()
    {
        return _expression1.Interpret() - _expression2.Interpret();
    }
}

/// <summary>
/// 乘
/// </summary>
public class MultiplicationExpression : IExpression
{
    private readonly IExpression _expression1;

    private readonly IExpression _expression2;

    public MultiplicationExpression(IExpression expression1, IExpression expression2)
    {
        _expression1 = expression1;
        _expression2 = expression2;
    }

    public int Interpret()
    {
        return _expression1.Interpret() * _expression2.Interpret();
    }
}

/// <summary>
/// 除
/// </summary>
public class DivisionExpression : IExpression
{
    private readonly IExpression _expression1;
    private readonly IExpression _expression2;

    public DivisionExpression(IExpression expression1, IExpression expression2)
    {
        _expression1 = expression1;
        _expression2 = expression2;
    }

    public int Interpret()
    {
        return _expression1.Interpret() / _expression2.Interpret();
    }
}

public class ExpressionInterpreter
{
    /// <summary>
    /// 实现一个简单的语法算法
    /// 4 5 6 7 - * +
    /// 实现(4-5)*6+7
    /// </summary>
    public void SampleOperator(string str)
    {
        var list = new List<IExpression>();

        var strArray = str.Split(" ");
        for (var i = 0; i < (strArray.Length + 1) / 2; i++)
        {
            list.Add(new NumberExpression(strArray[i].ToInt()));
        }

        var startIndex = (strArray.Length + 1) / 2;
        for (var i = startIndex; i < strArray.Length; i++)
        {
            if (strArray[i] is not "+" and not "-" and not "*" and not "/")
            {
                throw new NotSupportedException("不支持的操作符");
            }

            var number1 = list[0];
            var number2 = list[1];

            list.RemoveAt(0);
            list.RemoveAt(0);

            IExpression result = new NumberExpression(0);
            switch (strArray[i])
            {
                case "+":
                    result = new AdditionExpression(number1, number2);
                    break;

                case "-":
                    result = new SubtractionExpression(number1, number2);
                    break;

                case "*":
                    result = new MultiplicationExpression(number1, number2);
                    break;

                case "/":
                    result = new DivisionExpression(number1, number2);
                    break;
            }
            list.Insert(0, result);
        }
        if (list.Count != 1)
        {
            throw new ArgumentException("无效的表达式");
        }
        Console.WriteLine($"计算结果是  {list[0].Interpret()}");
    }
}
```
这里的代码主要是为了解释原理，不要纠结于例子是否过度设计。

### 实战例子
来实现一个自定义接口告警规则的功能，该功能支持通过配置字符串形式个规则，然后去解析该规则，如果该规则符合条件，那么就进行告警，例如我们定义了下面的规则
```csharp
key1 > 100 && key2 < 30 || key3 < 100 || key4 = 88
```
当进行填充数据后该规则执行为true，那么就符合条件，我们假设自定义的告警规则值包含"||、&&、>、<、 ==" 这五个运算符，其中 > < == 运算符的优先级高于|| &&运算符，&&运算符的优先级高于||，在表达式中，任意元素之间通过空格来进行分割。除此之外，用户可以自定义要监控的key，下面来实现我们的解析代码

首先定义告警解析表达式接口，然后让其他表达式继承该接口
```csharp
/// <summary>
/// 告警表达式
/// </summary>
public interface IAlertRuleExpression
{
    bool Interpret(Dictionary<string, long> stats);
}
```
然后在定义大于小于等于的表达式
```csharp
/// <summary>
/// 大于表达式
/// </summary>
public class DaYuExpression : IAlertRuleExpression
{
    private readonly string _key;
    private readonly long _value;

    public DaYuExpression(string key, long value)
    {
        _key = key;
        _value = value;
    }

    public DaYuExpression(string expression)
    {
        var elements = expression.Trim().Split(" ");
        if (elements.Length != 3 || !elements[1].Trim().Equals(">"))
        {
            throw new ArgumentException("无效的表达式");
        }

        this._key = elements[0].Trim();
        this._value = elements[2].Trim().ToInt64();
    }

    public bool Interpret(Dictionary<string, long> stats)
    {
        if (!stats.ContainsKey(_key))
            return false;

        var statValue = stats[_key];
        return statValue > _value;
    }
}

/// <summary>
/// 小于
/// </summary>
public class XiaoYuExpression : IAlertRuleExpression
{
    private readonly string _key;
    private readonly long _value;

    public XiaoYuExpression(string key, long value)
    {
        _key = key;
        _value = value;
    }

    public XiaoYuExpression(string expression)
    {
        var elements = expression.Trim().Split(" ");
        if (elements.Length != 3 || !elements[1].Trim().Equals("<"))
        {
            throw new ArgumentException("无效的表达式");
        }

        this._key = elements[0].Trim();
        this._value = elements[2].Trim().ToInt64();
    }

    public bool Interpret(Dictionary<string, long> stats)
    {
        if (!stats.ContainsKey(_key))
            return false;

        var statValue = stats[_key];
        return statValue < _value;
    }
}

/// <summary>
/// 等于表达式
/// </summary>
public class EqualExpression : IAlertRuleExpression
{
    private readonly string _key;
    private readonly long _value;

    public EqualExpression(string key, long value)
    {
        _key = key;
        _value = value;
    }

    public EqualExpression(string expression)
    {
        var elements = expression.Trim().Split(" ");
        if (elements.Length != 3 || !elements[1].Trim().Equals("="))
        {
            throw new ArgumentException("无效的表达式");
        }

        this._key = elements[0].Trim();
        this._value = elements[2].Trim().ToInt64();
    }

    public bool Interpret(Dictionary<string, long> stats)
    {
        if (!stats.ContainsKey(_key))
            return false;

        var statValue = stats[_key];
        return statValue == _value;
    }
}
```
还得定义and和or的表达式
```csharp
/// <summary>
/// and 表达式
/// </summary>
public class AndExpression : IAlertRuleExpression
{
    private readonly List<IAlertRuleExpression> _expressions = new List<IAlertRuleExpression>();

    public AndExpression(string strAndExpression)
    {
        var strExpressions = strAndExpression.Split("&&");
        foreach (var e in strExpressions)
        {
            if (e.Contains(">"))
            {
                _expressions.Add(new DaYuExpression(e));
            }
            else if (e.Contains("<"))
            {
                _expressions.Add(new XiaoYuExpression(e));
            }
            else if (e.Contains("=="))
            {
                _expressions.Add(new EqualExpression(e));
            }
            else
            {
                throw new ArgumentException("表达式无效");
            }
        }
    }

    public AndExpression(List<IAlertRuleExpression> expressions)
    {
        _expressions.AddRange(expressions);
    }

    public bool Interpret(Dictionary<string, long> stats)
    {
        foreach (var item in _expressions)
        {
            if (!item.Interpret(stats))
            {
                return false;
            }
        }

        return true;
    }
}

/// <summary>
/// or 表达式
/// </summary>
public class OrExpression : IAlertRuleExpression
{
    private readonly List<IAlertRuleExpression> _expressions = new List<IAlertRuleExpression>();

    public OrExpression(string strOrExpression)
    {
        var andExpressions = strOrExpression.Split("||");
        foreach (var andExpr in andExpressions)
        {
            _expressions.Add(new AndExpression(andExpr));
        }
    }

    public OrExpression(List<IAlertRuleExpression> expressions)
    {
        _expressions.AddRange(expressions);
    }

    public bool Interpret(Dictionary<string, long> stats)
    {
        foreach (var item in _expressions)
        {
            if (item.Interpret(stats))
            {
                return true;
            }
        }
        return false;
    }
}
```
最后在定义告警解析表达式
```csharp
/// <summary>
/// 告警规则解释器
/// </summary>
public class AlertRuleInterpreter
{
    private readonly IAlertRuleExpression _alertRuleExpression;

    /// <summary>
    /// key1 > 100 && key2 < 1000 || key3 == 200
    /// </summary>
    /// <param name="ruleExpression"></param>
    public AlertRuleInterpreter(string ruleExpression)
    {
        _alertRuleExpression = new OrExpression(ruleExpression);
    }

    public bool Interpret(Dictionary<string, long> statuDic)
    {
        return _alertRuleExpression.Interpret(statuDic);
    }
}
```
调用方式如下
```csharp
// 使用解释器模式去解析下面的规则，然后判断该规则在填充下面数据的情况下返回什么
const string rule = "key1 > 100 && key2 < 30 || key3 < 100 || key4 == 88";
var interpreter = new AlertRuleInterpreter(rule);
var stats = new Dictionary<string, long>
{
    { "key1", 101 },
    { "key3", 121 },
    { "key4", 88 }
};
var alert = interpreter.Interpret(stats);
Console.WriteLine($"根据告警规则 当前状态为：{(alert ? "警告" : "无警告")}");
```
实现规则就是，首先根据分隔符||将表达式分割，然后在按照分隔符&&分割，然后就分别解析判断是那种运算符，然后去计算运算符的结果

## 总结
解释器模式就是用来实现根据语法规则解读“句子”的解释器。

核心思想：将语法解析的工作拆分到各个小类中，以此来避免大而全的解析类。一般的做法就是，将语法规则拆分一些小的独立单元，然后对每个单元进行解析，最终合并为整个语法规则的解析。


[https://kgithub.com/HeavenXin/MonitorExpressionTest](https://kgithub.com/HeavenXin/MonitorExpressionTest)
