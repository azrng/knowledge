---
title: 关于蓝牙
lang: zh-CN
date: 2021-02-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guanyulanya
slug: eoynk9
docsId: '31541770'
---
```csharp
List<LanYa> lanYaList = new List<LanYa>();        //搜索到的蓝牙的集合
            BluetoothClient client = new BluetoothClient();
            BluetoothRadio radio = BluetoothRadio.PrimaryRadio; //获取蓝牙适配器
            radio.Mode = RadioMode.Connectable;
            BluetoothDeviceInfo[] devices = client.DiscoverDevices();//搜索蓝牙 10秒钟
            foreach (var item in devices)
            {
                lanYaList.Add(new LanYa { blueName = item.DeviceName, blueAddress = item.DeviceAddress, blueClassOfDevice = item.ClassOfDevice, IsBlueAuth = item.Authenticated, IsBlueRemembered = item.Remembered, blueLastSeen = item.LastSeen, blueLastUsed = item.LastUsed });//把搜索到的蓝牙添加到集合中
            }


class LanYa
    {
        public string blueName { get; set; }                  //l蓝牙名字
        public BluetoothAddress blueAddress { get; set; }        //蓝牙的唯一标识符
        public ClassOfDevice blueClassOfDevice { get; set; }      //蓝牙是何种类型
        public bool IsBlueAuth { get; set; }                  //指定设备通过验证
        public bool IsBlueRemembered { get; set; }            //记住设备
        public DateTime blueLastSeen { get; set; }
        public DateTime blueLastUsed { get; set; }
    }
```






这里需要引用一个插件
