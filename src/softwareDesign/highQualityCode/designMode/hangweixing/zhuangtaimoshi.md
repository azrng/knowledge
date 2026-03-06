---
title: 状态模式
lang: zh-CN
date: 2023-02-26
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: zhuangtaimoshi
slug: boe54efqqu0bqu7b
docsId: '111752861'
---

## 概述
状态模式是状态机的一种实现形式。状态机又叫做有限状态机，三个部分组成：状态、事件、动作。事件也称为转移条件，事件触发状态的转移以及动作的执行，不过动作不是必须的，也可能只转移状态，不执行任何动作。

### 使用场景
状态机常用在游戏、工作流引擎等系统开发中。

## 状态机实现
超级马里奥游戏中，超级马里奥可以变身为多种形态，比如小马里奥(Small Mario)、超级马里奥(Super Mario)、火焰马里奥(Fire Mario)、斗篷马里奥(Cape Mario)等，不同情况下会相互转换，并增加或者减少积分。

马里奥的形态转变就是一个状态机，其中，马里奥的不同形态就是状态机中的状态，游戏情节(吃蘑菇)就是状态机中的“事件”,加减积分就是状态机中的“动作”，比如吃蘑菇这个事件，就会触发状态的转移：从小马里奥转移为超级马里奥，以及触发动作的执行(增加100积分)。
![image.png](/common/1676387449367-3e84bcd3-2891-41d8-b275-2f8e4967af0e.png)
E1：吃了蘑菇 E2：获得斗篷 E3：获得火焰 E4：遇到怪物

定义状态的枚举
```csharp
/// <summary>
/// 马里奥状态
/// </summary>
public enum StateEnum
{
    /// <summary>
    /// 普通
    /// </summary>
    Small,

    /// <summary>
    /// 超级
    /// </summary>
    Super,

    /// <summary>
    /// 火焰
    /// </summary>
    Fire,

    /// <summary>
    /// 斗篷
    /// </summary>
    Cape
}
```

### 分支逻辑法
利用if-else或者switch-case分支逻辑，参照状态转义图，将每个状态转义原模原样直译成代码，对于简单的状态机来说，这种实现方法最简单、最直接，首选。
```csharp
public class MarioStateMachine1
{
    public int Score { get; private set; }
    public StateEnum CurrentState { get; private set; }

    public MarioStateMachine1()
    {
        Score = 0;
        CurrentState = StateEnum.Small;
    }

    /// <summary>
    /// 得到蘑菇
    /// </summary>
    public void ObtainMushRoom()
    {
        if (CurrentState == StateEnum.Small)
        {
            CurrentState = StateEnum.Super;
            Score += 100;
        }
    }


    /// <summary>
    /// 得到斗篷
    /// </summary>
    public void ObtainCape()
    {
        if (CurrentState is StateEnum.Small or StateEnum.Super)
        {
            CurrentState = StateEnum.Cape;
            Score += 200;
        }
    }

    /// <summary>
    /// 得到火焰
    /// </summary>
    public void ObtainFireFlower()
    {
        if (CurrentState is StateEnum.Small or StateEnum.Super)
        {
            CurrentState = StateEnum.Fire;
            Score += 300;
        }
    }

    /// <summary>
    /// 遇到怪物
    /// </summary>
    public void MeetMonster()
    {
        if (CurrentState == StateEnum.Super)
        {
            CurrentState = StateEnum.Small;
            Score -= 100;
            return;
        }

        if (CurrentState == StateEnum.Cape)
        {
            CurrentState = StateEnum.Small;
            Score -= 300;
            return;
        }

        if (CurrentState == StateEnum.Fire)
        {
            CurrentState = StateEnum.Small;
            Score -= 300;
        }
    }
}
```
使用方法
```csharp
var mario = new MarioStateMachine1();
mario.ObtainMushRoom();
var score = mario.Score;
var state = mario.CurrentState;
Console.WriteLine($"当前分数：{score} 当前状态是：{state}");
```
对于简单的状态机来说，分支逻辑的这种实现方式是可以接受的，但是如果负责的状态机来说，那么这个实现方式就容易漏写或者错写某个状态转义，并且一堆的if-else，代码的可读性和可维护性都很差，并且如果发生改动还容易出错。

### 查表法
状态机使用二维表来表示，第一维表示当前状态，第二维表示事件，值表示当前状态经过时间之后，转义到的新状态以及执行的动作。
![image.png](/common/1676468428590-cafcd980-93fc-4186-a5d6-79797bf4ad7c.png)
查表法实现方式更加清洗，可读性和可维护性更好。当修改状态机，我们只需要修改二维数组即可。
```csharp
/// <summary>
/// 查表法
/// </summary>
public class MarioStateMachine2
{
    private static readonly StateEnum[][] _transitionTable =
    {
        // 第一层：small  super cape fire
        new[] { StateEnum.Super, StateEnum.Cape, StateEnum.Fire, StateEnum.Small },
        new[] { StateEnum.Super, StateEnum.Cape, StateEnum.Fire, StateEnum.Small },
        new[] { StateEnum.Cape, StateEnum.Cape, StateEnum.Cape, StateEnum.Small },
        new[] { StateEnum.Fire, StateEnum.Fire, StateEnum.Fire, StateEnum.Small }
    };

    private static readonly List<List<int>> _actionTable = new()
    {
        new List<int> { +100, +200, +300, 0 },
        new List<int> { 0, 200, 300, -100 },
        new List<int> { 0, 0, 0, -200 },
        new List<int> { 0, 0, 0, -300 }
    };

    public MarioStateMachine2()
    {
        Score = 0;
        State = StateEnum.Small;
    }

    public int Score { get; private set; }

    public StateEnum State { get; private set; }

    /// <summary>
    /// 得到蘑菇
    /// </summary>
    public void ObtainMushRoom()
    {
        ExecuteEvent(EventEnum.GotMushRoom);
    }


    /// <summary>
    /// 得到斗篷
    /// </summary>
    public void ObtainCape()
    {
        ExecuteEvent(EventEnum.GotCape);
    }

    /// <summary>
    /// 得到火焰
    /// </summary>
    public void ObtainFireFlower()
    {
        ExecuteEvent(EventEnum.GotFire);
    }

    /// <summary>
    /// 遇到怪物
    /// </summary>
    public void MeetMonster()
    {
        ExecuteEvent(EventEnum.MetMonState);
    }

    private void ExecuteEvent(EventEnum @event)
    {
        var stateValue = (int)State;
        var eventValue = (int)@event;
        State = _transitionTable[stateValue][eventValue];
        Score = _actionTable[stateValue][eventValue];
    }
}

public enum EventEnum
{
    /// <summary>
    /// 得到蘑菇
    /// </summary>
    GotMushRoom,

    /// <summary>
    /// 得到斗篷
    /// </summary>
    GotCape,

    /// <summary>
    /// 得到火焰
    /// </summary>
    GotFire,

    /// <summary>
    /// 遇到怪物
    /// </summary>
    MetMonState
}
```
使用方法
```csharp
var mario2 = new MarioStateMachine2();
mario2.ObtainMushRoom();
var score2 = mario2.Score;
var state2 = mario2.State;
Console.WriteLine($"当前分数：{score2} 当前状态是：{state2}");
```

### 状态模式
在上面查表法中，事件的触发动作只是简单的积分加减，所以我们用一个二维的数组就能够标识，但是真实的执行动作并非这么简单，而是一系列复杂的逻辑操作(比如加减积分、写数据库还有可能发送短信通知等)这个时候就没法使用如此简单的二位数组来表示了，也就是说查表法的实现方式有一定的局限性。

虽然分支逻辑的方式不存在这个问题，当时前面也说了，分支判断逻辑较多的时候，会导致代码的可读性和可维护性不好。实际上，针对分支逻辑法存在的问题，我们可以使用状态模式来解决。

状态模式通过将时间触发的状态转移和动作执行，拆分到不同的状态类中，来避免分支判断逻辑，下面来看代码， IMario 是状态的接口，定义了所有的事件。SmallMario、SuperMario、 CapeMario、FireMario 是 IMario 接口的实现类，分别对应状态机中的 4 个状态。  
```csharp
/// <summary>
/// 状态的接口，定义所有的事件
/// </summary>
public interface IMario
{
    StateEnum GetName();

    /// <summary>
    /// 得到蘑菇
    /// </summary>
    void ObtainMushRoom();

    /// <summary>
    /// 得到斗篷
    /// </summary>
    void ObtainCape();

    /// <summary>
    /// 得到火焰
    /// </summary>
    void ObtainFireFlower();

    /// <summary>
    /// 遇到怪物
    /// </summary>
    void MeetMonster();
}

public class SmallMario : IMario
{
    private readonly MarioStateMachine3 _stateMachine3;

    public SmallMario(MarioStateMachine3 stateMachine3)
    {
        _stateMachine3 = stateMachine3;
    }

    public StateEnum GetName()
    {
        return StateEnum.Small;
    }

    public void ObtainMushRoom()
    {
        _stateMachine3.SetCurrentState(new SuperMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score + 100);
    }

    public void ObtainCape()
    {
        _stateMachine3.SetCurrentState(new CapeMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score + 200);
    }

    public void ObtainFireFlower()
    {
        _stateMachine3.SetCurrentState(new FireMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score + 300);
    }

    public void MeetMonster()
    {
        // 直接挂掉或者做一些事情
    }
}

public class SuperMario : IMario
{
    private readonly MarioStateMachine3 _stateMachine3;

    public SuperMario(MarioStateMachine3 stateMachine3)
    {
        _stateMachine3 = stateMachine3;
    }

    public StateEnum GetName()
    {
        return StateEnum.Super;
    }

    public void ObtainMushRoom()
    {
        // 没有变化
    }

    public void ObtainCape()
    {
        _stateMachine3.SetCurrentState(new CapeMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score + 200);
    }

    public void ObtainFireFlower()
    {
        _stateMachine3.SetCurrentState(new FireMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score + 300);
    }

    public void MeetMonster()
    {
        _stateMachine3.SetCurrentState(new SmallMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score - 100);
    }
}

/// <summary>
/// 斗篷马里奥
/// </summary>
public class CapeMario : IMario
{
    private readonly MarioStateMachine3 _stateMachine3;

    public CapeMario(MarioStateMachine3 stateMachine3)
    {
        _stateMachine3 = stateMachine3;
    }

    public StateEnum GetName()
    {
        return StateEnum.Cape;
    }

    public void ObtainMushRoom()
    {
        // 无操作
    }

    public void ObtainCape()
    {
        // 无操作
    }

    public void ObtainFireFlower()
    {
        // 无操作
    }

    public void MeetMonster()
    {
        _stateMachine3.SetCurrentState(new SmallMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score - 200);
    }
}

public class FireMario : IMario
{
    private readonly MarioStateMachine3 _stateMachine3;

    public FireMario(MarioStateMachine3 stateMachine3)
    {
        _stateMachine3 = stateMachine3;
    }

    public StateEnum GetName()
    {
        return StateEnum.Fire;
    }

    public void ObtainMushRoom()
    {
        // 无操作
    }

    public void ObtainCape()
    {
        // 无操作
    }

    public void ObtainFireFlower()
    {
        // 无操作
    }

    public void MeetMonster()
    {
        _stateMachine3.SetCurrentState(new SmallMario(_stateMachine3));
        _stateMachine3.SetScore(_stateMachine3.Score - 300);
    }
}
```
然后所有状态转义和动作执行的逻辑都集中在MarioStateMachine3中
```csharp
public class MarioStateMachine3
{
    /// <summary>
    /// 积分
    /// </summary>
    public int Score { get; private set; }

    /// <summary>
    /// 当前状态
    /// </summary>
    public IMario CurrentState { get; private set; } // 不再使用枚举来表示状态

    public MarioStateMachine3()
    {
        Score = 0;
        CurrentState = new SmallMario(this);
    }

    /// <summary>
    /// 得到蘑菇
    /// </summary>
    public void ObtainMushRoom()
    {
        this.CurrentState.ObtainMushRoom();
    }

    /// <summary>
    /// 得到斗篷
    /// </summary>
    public void ObtainCape()
    {
        this.CurrentState.ObtainCape();
    }

    /// <summary>
    /// 得到火焰
    /// </summary>
    public void ObtainFireFlower()
    {
        this.CurrentState.ObtainFireFlower();
    }

    /// <summary>
    /// 遇到怪物
    /// </summary>
    public void MeetMonster()
    {
        this.CurrentState.MeetMonster();
    }

    /// <summary>
    /// 设置积分
    /// </summary>
    /// <param name="score"></param>
    public void SetScore(int score)
    {
        this.Score = score;
    }

    /// <summary>
    /// 设置状态
    /// </summary>
    /// <param name="currentState"></param>
    public void SetCurrentState(IMario currentState)
    {
        this.CurrentState = currentState;
    }
}
```
使用例子
```csharp
var mario3 = new MarioStateMachine3();
mario3.ObtainMushRoom();
var score3 = mario3.Score;
var state3 = mario3.CurrentState.GetName();
Console.WriteLine($"当前分数：{score3} 当前状态是：{state3}");

mario3.ObtainCape();
var score4 = mario3.Score;
var state4 = mario3.CurrentState.GetName();
Console.WriteLine($"当前分数：{score4} 当前状态是：{state4}");
```
 实际上，像游戏这种比较复杂的状态机，包含的状态比较多，我优先推荐使用查表法，而状 态模式会引入非常多的状态类，会导致代码比较难维护。相反，像电商下单、外卖下单这种 类型的状态机，它们的状态并不多，状态转移也比较简单，但事件触发执行的动作包含的业 务逻辑可能会比较复杂，所以，更加推荐使用状态模式来实现。  
