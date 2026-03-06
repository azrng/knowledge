---
title: 单元测试规范
lang: zh-CN
date: 2023-09-10
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: chanyuanceshiguifan
slug: hiimf57authx3vfk
docsId: '138284937'
---

## 最佳实践
编写单元测试的时候，尽量不要引入基础结构依赖项，依赖项会降低测试的速度，使测试更脆弱，该方式应该在集成测试的时候使用。

将单元测试项目保存在单独的项目中，和集成测试相互分割，这样子可以确保单元测试项目没有引用或者依赖基础结构包。

## 优质单元测试的特征

- 快速：对成熟项目进行数千次单元测试，这很常见。 单元测试应该只需很少的时间即可运行。 几毫秒。
- 独立：单元测试是独立的，可以单独运行，并且不依赖文件系统或数据库等任何外部因素。
- 可重复：运行单元测试的结果应该保持一致，也就是说，如果在运行期间不更改任何内容，总是返回相同的结果。
- 自检查：测试应该能够在没有任何人工交互的情况下自动检测测试是否通过。
- 适时：与要测试的代码相比，编写单元测试不应花费过多不必要的时间。 如果发现测试代码与编写代码相比需要花费大量的时间，请考虑一种更易测试的设计。

## 命名规范
命名标准非常重要，因为它们明确地表达了测试的意图。 测试不仅能确保代码有效，还能提供文档。 只需查看单元测试套件，就可以在不查看代码本身的情况下推断代码的行为。 此外，测试失败时，你可以确切地看到不符合预期的方案。

测试的名字应该包含三个部分

- 要测试的方法名称
- 测试的方案
- 调用方案时的预期行为

### 测试方法举例
测试一个添加方法
```csharp
[Fact]
public void Add_SingleNumber_ReturnsSameNumber()
{
    var stringCalculator = new StringCalculator();

    var actual = stringCalculator.Add("0");

    Assert.Equal(0, actual);
}
```
测试一个抛出异常的方法
```csharp
[Fact]
void Add_MaximumSumResult_ThrowsOverflowException()
{
    var stringCalculator = new StringCalculator();
    const string MAXIMUM_RESULT = "1001";

    Action actual = () => stringCalculator.Add(MAXIMUM_RESULT);

    Assert.Throws<OverflowException>(actual);
}
```

### 命名方式分类

#### DoesXGivenY
为每个类生成一个测试类，下面是该类的一些示例方法名字
```
ReturnsPositiveSumGivenTwoPositiveNumbers()
ReturnsNegativeSumGivenTwoNegativeNumbers()
ReturnsZeroGivenTwoZeroes()
ThrowsArgumentExceptionGivenInvalidValues()
```
如果你喜欢下划线可以使用下划线来分割名称的各个部分。
```
Add_WhenTwoPositiveNumbers_ResultIsPositive
```

#### Given_Precondition_When_Action_Then_ExpectedResult
Given/When/Then 几乎 1：1 映射与 Arrange/Act/Assert，因此您可以将这些约定中的任何一个与另一个约定一起使用。
```
Given_TwoPositiveNumbers_When_Adding_Then_ReturnPositiveSum
```


## 资料
单元测试命名和最佳实践：[https://ardalis.com/mastering-unit-tests-dotnet-best-practices-naming-conventions/](https://ardalis.com/mastering-unit-tests-dotnet-best-practices-naming-conventions/)
在.Net中编写单元测试最佳做法：[https://learn.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices](https://learn.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices)
[https://mp.weixin.qq.com/s/YFcKMDoPtJGD5PeAiTj4Ag](https://mp.weixin.qq.com/s/YFcKMDoPtJGD5PeAiTj4Ag) | 5个关键问题让单元测试的价值最大化



智能测试简化了单元测试的编写和维护：https://devblogs.microsoft.com/visualstudio/intellitest-simplifies-writing-and-maintaining-unit-tests/
