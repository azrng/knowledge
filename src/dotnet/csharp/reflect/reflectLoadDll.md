---
title: 反射加载dll
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: fanshejiazaidll
slug: ri4qs4
docsId: '31014192'
---

## 操作
Assembly.LoadFile()只会加载指定的一个程序集； 
Assembly.LoadFrom 会加载一个程序集，然后自动加载此程序集依赖的其它程序集。

### NetF
Assembly.LoadFile只载入相应的dll文件，比如Assembly.LoadFile("a.dll")，则载入a.dll，假如a.dll中引用了b.dll的话，b.dll并不会被载入。
Assembly.LoadFrom则不一样，它会载入dll文件及其引用的其他dll，比如上面的例子，b.dll也会被载入。
示例：
我们先创建一个类库，里面包含一个方法
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 
namespace Common
{
    public class Class
    {
        public string GetInfo()
        {
            return DateTime.Now + "调用成功";
        }
    }
}
```
然后我们把生成的dll文件放到一个目录下，我们要实现通过绝对路径找到这个dll文件，然后调用dll文件里面指定类的方法
```csharp
Assembly assembly = Assembly.LoadFile("E://Common.dll");
            Type type = assembly.GetType("Common.Class");//加载  命名空间+类名称
            MethodInfo methodInfo = type.GetMethod("GetInfo");
            object obj = assembly.CreateInstance("Common.Class");
            object[] parts = new object[0];
            var value = methodInfo.Invoke(obj, parts);//第二个参数是调用方法要传的参数
            Console.WriteLine(value);
```
公共方法
```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Comm
{

    /// <summary>
    /// 反射类
    /// 利用反射动态调用DLL类库。
    /// </summary>
    public class ReflectionLesson
    {
        private string strDllName = "";
        private string strClaName = "";
        private string[] strMetName = null;
        /// <summary>
        /// 构造方法
        /// </summary>
        /// <param name="DllName">调用的DLL类库名</param>
        /// <param name="ClaName">调用的类名</param>
        /// <param name="MetName">调用的方法名(数组)</param>
        public ReflectionLesson(string DllName, string ClaName, string[] MetName)
        {
            //获取调用的DLL类库
            this.strClaName = ClaName;
            this.strDllName = DllName;
            this.strMetName = MetName;
        }
        /// <summary>
        /// 利用反射动态调用DLL类库
        /// </summary>
        public void ReflectionTest()
        {
            Assembly ass;
            Type type;
            object obj;
            if (File.Exists("C:\\dll" + "\\" + this.strDllName + ".dll"))
            {

                ass = Assembly.LoadFile("C:\\dll" + "\\" + "\\" + this.strDllName + ".dll");

                type = ass.GetType(this.strDllName + "." + this.strClaName);

                MethodInfo method1 = type.GetMethod(this.strMetName[0]);


                obj = ass.CreateInstance(this.strDllName + "." + this.strClaName);

                method1 = type.GetMethod(this.strMetName[0]);//方法的名称1

                object[] parts = new object[0];


                var Number = method1.Invoke(obj, parts);
                Console.WriteLine(string.Format("调用的方法{0}，结果{1}", this.strMetName[0], Number));



            }
        }
    }
}
```

### NetCore
如果是动态加载第三方程序集，需要开启配置，否则会提示“缺少某某dll”的问题。
解决上述问题，需要在该类库项目的.csproj文件中，在标签中加入true标志，该属性将告诉编译器，该项目是动态加载的组件。
相关链接：https://docs.microsoft.com/zh-cn/dotnet/core/project-sdk/msbuild-props#enabledynamicloading
```csharp
<PropertyGroup>
  <EnableDynamicLoading>true</EnableDynamicLoading>
</PropertyGroup>
```
对于类库项目来说，通常会引用解决方案中其他通用项目，而主体程序也会引用这些通用项目，所以对于类库来说，在编译生成的文件中，并不需要这些文件。这种情况下，也需要修改.csproj项目文件，如下图，生成的类库文件将不会包含pluginBase.csproj类库及其所有的依赖；
![](/common/1644217993922-9819b7f6-52c5-42d9-8194-5faed6a08f55.webp)
示例公共类
```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Runtime.Loader;

namespace LoadDLL
{
    /// <summary>
    /// 程序集加载器
    /// </summary>
    public class AssemblyLoader
    {
        private string _basePath;
        private AssemblyLoadContext context;


        public AssemblyLoader(string basePath)
        {
            _basePath = basePath;
        }

        public Type Load(string dllFileName, string typeName)
        {
                context = new AssemblyLoadContext(dllFileName);
                context.Resolving += Context_Resolving;
                //需要绝对路径
                string path = Path.Combine(_basePath, dllFileName);
                if (File.Exists(path))
                {
                    try
                    {
                        using (var stream = File.OpenRead(path))
                        {
                            Assembly assembly = context.LoadFromStream(stream);
                            Type type = assembly.GetType(typeName);
                            dicTypes.Add(typeName, type);
                            return type;
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"加载节点{dllFileName}-{typeName}发生异常：{ex.Message},{ex.StackTrace}");
                    }

                }
                else
                {
                    Console.WriteLine($"节点动态库{dllFileName}不存在：{path}");
                }            
            return null;
        }

        /// <summary>
        /// 加载依赖文件
        /// </summary>
        /// <param name="context"></param>
        /// <param name="assemblyName"></param>
        /// <returns></returns>
        private Assembly Context_Resolving(AssemblyLoadContext context, AssemblyName assemblyName)
        {
            string expectedPath = Path.Combine(_basePath, assemblyName.Name + ".dll"); ;
            if (File.Exists(expectedPath))
            {
                try
                {
                    using (var stream = File.OpenRead(expectedPath))
                    {
                        return context.LoadFromStream(stream);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"加载节点{expectedPath}发生异常：{ex.Message},{ex.StackTrace}");
                }
            }
            else
            {
                Console.WriteLine($"依赖文件不存在：{expectedPath}");
            }
            return null;
        }
    }
}
```
其中Context_Resolving()，是用于加载类库文件过程中，处理触发加载相关依赖文件的事件的方法，通过上述代码，可以保证将类库的完整地动态加载进程序，并且不会与其他动态加载类库项目发生程序集冲突的问题：比如A类库和B类库都有共同的依赖C，但两者的引用的C版本不同，通过AssemblyLoadContext可以保证A/B类库加载自己需要的版本。

## 资料
[https://mp.weixin.qq.com/s/qDYdkOoj1Kfxalb5yXi5_A](https://mp.weixin.qq.com/s/qDYdkOoj1Kfxalb5yXi5_A) | .NET Core 利用反射动态加载类库的方法
