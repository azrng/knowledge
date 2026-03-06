---
title: 贫血充血和充血模式
lang: zh-CN
date: 2023-08-24
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: modelDesignMode
slug: fuetgg
docsId: '67828037'
---

## 概述
贫血模型：一个类里面只有属性或者成员变量，没有方法
充血模式：一个类既有属性也有成员变量，也有方法


贫血模式缺点以及充血模式需要注意的点
业务泄露：对于对象的操作，应该通过对象自身来完成，不应该将操作泄露到对象的外部
增加调用者负担：当调用对象的方法的时候，应该将对象当为一个黑盒状态，不需要去使用对象的内部细节(需要先调用a方法后调用b方法)
难以维护：当后期业务需求发生变成，需要去修改操作该对象的所有方法，这样子难以维护


## 贫血模型
就将后端项目分为 Repository 层、Service 层、Controller 层。其 中，Repository 层负责数据访问，Service 层负责业务逻辑，Controller 层负责暴露接 口。 
UserEntity 和 UserRepository 组成了数据访问层，UserBo 和 UserService 组成了业务逻辑层，UserVo 和 UserController 在这里属于接口层。 从代码中，我们可以发现，UserBo 是一个纯粹的数据结构，只包含数据，不包含任何业务 逻辑。业务逻辑集中在 UserService 中。我们通过 UserService 来操作 UserBo。换句话 说，Service 层的数据和业务逻辑，被分割为 BO 和 Service 两个类中。像 UserBo 这样， 只包含数据，不包含业务逻辑的类，就叫作贫血模型（Anemic Domain Model）  

## 充血模型
基于充血模型的 DDD 开发模式实现的代码，也是按照 MVC 三层架构分层的。 Controller 层还是负责暴露接口，Repository 层还是负责数据存取，Service 层负责核心 业务逻辑。它跟基于贫血模型的传统开发模式的区别主要在 Service 层。 
 Service 层包含 Service 类和 Domain 类两部分。Domain 就相 当于贫血模型中的 BO。不过，Domain 与 BO 的区别在于它是基于充血模型开发的，既包 含数据，也包含业务逻辑。而 Service 类变得非常单薄。总结一下的话就是，基于贫血模型 的传统的开发模式，重 Service 轻 BO；基于充血模型的 DDD 开发模式，轻 Service 重 Domain。  

将对实体类的操作，比如初始化状态修改等操作都放在实体类内进行操作，这就是充血模型

## 使用场景
基于充血模型的DDD开发模式，更适合业务复杂的系统开发。

## 使用示例
```plsql
public class Employee
{
    /// <summary>
    /// 私有无参构造方法，给EFCore使用
    /// </summary>
    private Employee()
    {
    }

    public Employee(string name) : this()
    {
        Name = name;
    }

    /// <summary>
    /// 用户名 init只允许在构造函数的时候初始化
    /// </summary>
    public string Name { get; init; }

    /// <summary>
    /// 积分  private set，只允许在内部进行修改
    /// </summary>
    public int Credit { get; private set; }

    /// <summary>
    /// 密码哈希值  需要映射数据库中的列，但是不可以被修改的，所以定义为私有字段
    /// </summary>
    private string PasswordHash;

    public void ChangeCredit(int credit)
    {
        Credit = credit;
    }
}
```
