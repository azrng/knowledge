---
title: ArrayPool和MemoryPool
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: arraypoolMemorypool.md
slug: oeyqtg
docsId: '32486346'
---
> 参考文档：[https://mp.weixin.qq.com/s/u3Ve-zeR0GymxDKRFQRNZg](https://mp.weixin.qq.com/s/u3Ve-zeR0GymxDKRFQRNZg)


## 介绍
对资源的可复用是提升应用程序性能的一个非常重要的手段，比如本篇要分享的 ArrayPool 和 MemoryPool，它们就有效的减少了内存使用和对GC的压力，从而提升应用程序性能。

## ArrayPoll

### 什么是ArrayPoll
System.Buffers 命名空间下提供了一个可对 array 进行复用的高性能池化类 `ArrayPool<T>`，在经常使用 array 的场景下可使用 `ArrayPool<T>` 来减少内存占用,它是一个抽象类，如下代码所示：
```
public abstract class ArrayPool<T>
{
}
```
可以想象一下你的业务场景中需要多次实例化 array，这么做有什么后果呢？很显然每一次 new array 都会在托管堆上分配，同时当 array 不再使用时还需要 GC 去释放，而 `ArrayPool<T>` 就是为了解决此事而生的，它在池中动态维护若干个 array 对象，当你需要 `new array` 的时候只需从池中获取即可。

### 使用场景
`ArrayPool<T>` 的主要用途是在需要频繁创建和释放数组的情况下，提高性能和减少内存开销。以下是一些常见的使用场景：

1. 高性能的数据处理：当你需要处理大量数据并频繁创建和释放数组时，使用 `ArrayPool<T>` 可以避免频繁的垃圾回收和内存分配，从而提高性能。这对于需要快速处理图像、音频、视频等大型数据集的应用程序特别有用。
2. 网络编程：在网络编程中，经常需要处理和传输大量的字节数据。使用 `ArrayPool<T>` 可以减少内存碎片和垃圾回收，提高网络数据的处理效率。
3. 数据库操作：当进行数据库读写或批处理操作时，可能需要频繁地创建和释放数组来作为缓冲区或临时存储区。使用 `ArrayPool<T>` 可以减少内存分配和垃圾回收的开销，提高数据库操作的效率。
4. 并行和多线程编程：在并行和多线程编程中，为每个线程分配一个私有的数组池实例，可以避免线程之间的竞争和锁的开销。这样可以更好地利用多核处理器，并提高并发性能。

需要注意的是，在使用 `ArrayPool<T>` 时，一定要正确地租借和归还数组，以避免资源泄漏和内存错误。确保在使用完数组后及时调用 Return() 方法将其归还给数组池。

### 常用方法

#### Create和Shared

1. `ArrayPool<T>`.Create() 方法：这是一个静态方法，用于创建一个新的数组池实例。每次调用该方法都会创建一个全新的数组池，该数组池具有独立的资源和配置。这意味着每个调用 `ArrayPool<T>`.Create() 的地方都会创建一个不同的数组池实例，彼此之间没有共享。
2. `ArrayPool<T>`.Shared 属性：这是一个静态属性，用于获取全局共享的数组池实例。在整个应用程序域中，只会存在一个共享的数组池实例。多个线程可以共享使用这个实例，以便在需要分配和回收数组时更高效地利用内存资源。

两者的主要区别如下：

- 创建方式：`ArrayPool<T>`.Create() 创建一个新的数组池实例，而 `ArrayPool<T>`.Shared 获取全局共享的数组池实例。
- 实例数：`ArrayPool<T>`.Create() 每次调用创建一个新的实例，而 `ArrayPool<T>`.Shared 只有一个全局共享实例。
- 作用范围：`ArrayPool<T>`.Create() 的作用范围是调用它的代码块或对象，而 `ArrayPool<T>`.Shared 在整个应用程序域中有效。

如果你需要在特定的代码块或对象中管理数组池，可以使用 `ArrayPool<T>`.Create() 来创建一个专用的实例。而如果你需要在整个应用程序域中共享和重复使用数组池，可以使用 `ArrayPool<T>`.Shared 来获取全局共享的实例。共享的实例可以提高性能并减少资源消耗，但需要注意合理使用，避免滥用和浪费资源。

#### Rent
在 `ArrayPool<T>` 中，Rent() 方法用于从数组池中租借一个数组，并指定所需的长度。然而，租借的数组的实际长度可能会超过所需的长度。这是因为 `ArrayPool<T>` 内部维护了一组预分配的数组池，以便更高效地管理内存。
具体来说，`ArrayPool<T>` 倾向于分配的数组长度是按照某种预定义的规则进行调整的。这种行为可以最大程度地减少内存碎片化，并在一定程度上提高内存利用率。
对于常见的数组大小，例如小于 85 元素的情况，实际分配的数组大小是根据以下规则选择的：

- 如果请求的长度小于等于 16，分配一个长度为 16 的数组。
- 如果请求的长度大于 16，但小于等于 32，分配一个长度为 32 的数组。
- 如果请求的长度大于 32，但小于等于 64，分配一个长度为 64 的数组。
- 如果请求的长度大于 64，但小于等于 128，分配一个长度为 128 的数组。

这样做的目的是为了避免频繁分配和回收小数组所带来的性能开销，以及减少内存碎片。

### 使用 `ArrayPool<T>`
可以通过下面三种方式来使用 `ArrayPool<T>` 。

- 通过 `ArrayPool<T>.Shared` 属性来获取 `ArrayPool<T>` 实例。
- 通过 `ArrayPool<T>.Create()` 来生成 `ArrayPool<T>` 实例。
- 通过继承 `ArrayPool<T>` 来生成一个自定义子类。

下面的代码展示了如何从 ArrayPool 中获取一个 `size >= 10` 的 array 数组。
```csharp
var shared = ArrayPool<int>.Shared;
var rentedArray = shared.Rent(10);
```
![](/common/1619855963637-722690b1-54c7-4e74-bf67-1c79024eff2d.png)
上面的代码一定要注意，虽然只租用了 10 个 size，但底层会返回 `2的倍数`  的size , 也就是图中的 2* 8 = 16。
当什么时候不需要 rentedArray 了，记得再将它归还到 ArrayPool 中，如下代码所示。
```csharp
shared.Return(rentedArray);
```
下面是仅供参考的完整代码。
```csharp
void Main()
{
	var shared = ArrayPool<int>.Shared;
	var rentedArray = shared.Rent(17);
	Console.WriteLine($"当前大小：{rentedArray.Length}   没有和所需大小一样是因为内部维护了一组预分配的数组池");
	for (int i = 0; i < 10; i++)
	{
		rentedArray[i] = i + 1;
	}
	for (int j = 0; j < 10; j++)
	{
		Console.WriteLine(rentedArray[j]);
	}
	shared.Return(rentedArray);
}
```

### 创建自定义的 ArrayPool
你也可以通过重写 ArrayPool 来实现自定义的池化对象，如下代码所示：
```
public class CustomArrayPool<T> : ArrayPool<T>
    {
        public override T[] Rent(int minimumLength)
        {
            throw new NotImplementedException();
        }
        public override void Return(T[] array, bool clearArray = false)
        {
            throw new NotImplementedException();
        }
    }
```

## MemoryPool

### `使用MemoryPool<T>`
`System.Memory` 命名空间下提供了一个内存池对象 `MemoryPool<T>`，在这之前你需要每次都 new 一个内存块出来，同时也增加了 GC 的负担，有了 `MemoryPool<T>` 之后，你需要的内存块直接从池中拿就可以了。
```
static void Main(string[] args)
        {
            var  memoryPool = MemoryPool<int>.Shared;
            var rentedArray = memoryPool.Rent(10);
            for (int i = 0; i < 10; i++)
            {
                rentedArray.Memory.Span[i] = i + 1;
            }
            for (int j = 0; j < 10; j++)
            {
                Console.WriteLine(rentedArray.Memory.Span[j]);
            }
            Console.ReadKey();
        }
```
![](/common/1619855963561-fdb20396-e50c-445e-9c63-b2bb987fe5a7.png)

## `ArrayPool<T>` vs `MemoryPool<T>`

从上面的演示可以看出， `ArrayPool<T>` 是以 `array` 的形式向外租借，而 `MemoryPool<T>` 则是以 `内存块` 的方式向外租借，所以在重复使用 array 的场景下可以优选 `ArrayPool<T>` 来提高性能，如果你的代码是以 `Memory<T>` 这种内存块的形式多次使用则优先使用 `MemoryPool<T>`。

## 参考资料
资料来源：[https://mp.weixin.qq.com/s/u3Ve-zeR0GymxDKRFQRNZg](https://mp.weixin.qq.com/s/u3Ve-zeR0GymxDKRFQRNZg)
