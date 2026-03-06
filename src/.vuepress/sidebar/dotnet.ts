// dotNet代码

export const dotnetSidebar = [
  "readme.md",
  "cli.md",
  {
    text: "教程",
    prefix: "/dotnet/jiaocheng/",
    collapsible: true,
    children: [
      "jiaocheng.md",
      "ziliaojingshuarumenpian.md",
      "ziliaojingshuajinjiepian.md",
      "ziliaojingshuajiagoupian.md",
      "books.md",
      "optimize.md"
    ]
  },
  {
    text: "新增功能",
    prefix: "/dotnet/newFunction/",
    collapsible: true,
    children: [
      "readme.md",
      "dotNet6.md",
      "dotNet8.md"
    ]
  },
  "/dotnet/solutionItems.md",
  {
    text: "C#",
    prefix: "/dotnet/csharp/",
    collapsible: true,
    children: ["readme.md",
      "version.md",
      "cSharpStandard.md",
      {
        text: "核心Csharp",
        prefix: "/dotnet/csharp/hexincsharp/",
        collapsible: true,
        children: ["yudingyileixing.md",
          "string.md",
          "shuzhi.md",
          "byte.md",
          "rijiheshijian.md",
          "yuchulizhiling.md",
          "dynamic.md",
          "shuzu.md",
          "paixu.md",
          "qiyuan.md",
          "yuanzu.md"]
      },
      "changedaimajiexi.md",
      {
        text: "对象和类型",
        prefix: "/dotnet/csharp/objectAndType/",
        collapsible: true,
        children: ["accessModifiers.md",
          "class.md",
          "chouxianglei.md",
          "nimingleixing.md",
          "struct.md",
          "jiekou.md",
          "meiju.md",
          "haxi.md",
          "extension.md",
          "covariance.md",
          "shujuleixing.md",
          "fanxing.md",
          "attribute.md",
          "closure",
          "dataStruct.md"]
      },
      "cunchujiegou.md",
      "pooling.md",
      {
        text: "集合操作",
        prefix: "/dotnet/csharp/set/",
        collapsible: true,
        children: [
          "readme.md",
          "shuzu.md",
          "ienumerable.md",
          "stack.md",
          "diedaiqi.md",
          "suoyinqi.md",
          "table.md",
          {
            text: "扩展",
            prefix: "/dotnet/csharp/set/extensions/",
            collapsible: true,
            children: ["dictionaryshixianyuanli.md",
              "zhibiangengtongzhidictionary.md",
              "zidingyipaixu.md",
              "arraypoolMemorypool.md",
              "shuazepaixusuanfa.md"]
          },
          {
            text: "公共类",
            prefix: "/dotnet/csharp/set/commonClass/",
            collapsible: true,
            children: ["fenxiechuli.md",
              "piliangchulijige.md"]
          }]
      },
      "leixingzhuaihuan.md",
      "kaobeifangfa.md",
      {
        text: "定制数据结构",
        prefix: "/dotnet/csharp/dingzhishujujiegou/",
        collapsible: true,
        children: ["xingnengheshishixingchuli.md"]
      },
      "dtohepoco.md",
      "mingmingmoshi.md",
      "yasuhejieyasu.md",
      {
        text: "高级主题",
        prefix: "/dotnet/csharp/gaojizhuti/",
        collapsible: true,
        children: ["weituo.md",
          "shijian.md",
          "biaodashishu.md"]
      },
      "clr.md",
      {
        text: "运算符和表达式",
        prefix: "/dotnet/csharp/yunsuanfuhebiaodashi/",
        collapsible: true,
        children: ["readme.md",
          "switch.md"]
      },
      "jiaoyanfangfa.md",
      "zhengzebiaodashijiaoyan.md",
      "dingshiqi.md",
      {
        text: "队列",
        prefix: "/dotnet/csharp/queue/",
        collapsible: true,
        children: ["queue.md",
          "priorityqueue.md",
          "channel.md"
        ]
      },
      {
        text: "Linq",
        prefix: "/dotnet/csharp/linq/",
        collapsible: true,
        children: ["yunsuanfu.md",
          "linqhelambdaduibi.md",
          "jiaojiebingji.md",
          "lambda.md",
          "selectmany.md",
          "linqExtension.md"]
      },
      "yichang.md",
      {
        text: "反射",
        prefix: "/dotnet/csharp/reflect/",
        collapsible: true,
        children: [
          "readme.md",
          "details.md",
          "method.md",
          "reflectLoadDll.md",
          "dynamic.md",
          "newbeObjectvisitor.md"]
      },
      {
        text: "Window服务",
        prefix: "/dotnet/csharp/windowfuwu/",
        collapsible: true,
        children: ["windowfuwu.md",
          "netchuangjianwindowsfuwu.md",
          "netcorechuangjianwindowsfuwu.md"]
      },
      {
        text: "资源管理",
        prefix: "/dotnet/csharp/objectDestruction/",
        collapsible: true,
        children: [
          "readme.md"]
      },
      {
        text: "垃圾回收",
        prefix: "/dotnet/csharp/garbageCollection/",
        collapsible: true,
        children: [
          "readme.md",
          "workingMethod.md"
        ]
      },
      {
        text: "诊断",
        prefix: "/dotnet/csharp/zhenduan/",
        collapsible: true,
        children: ["tiaojianbianyi.md",
          "stopwatchlei.md"]
      },
      {
        text: "线程与并发与异步",
        prefix: "/dotnet/csharp/threadConcurrencyAndAsync/",
        collapsible: true,
        children: [
          "readme.md",
          "threadPool.md",
          "threadSync.md",
          "parallel.md",
          "concurrency.md",
          "sharedMemory.md",
          "limitingConcurrency.md",
          "sisuo.md",
          {
            text: "异步编程",
            prefix: "/dotnet/csharp/threadConcurrencyAndAsync/async/",
            collapsible: true,
            children: ["readme.md",
              "tapmoshi.md",
              "changetoken.md",
              "yibushili1.md"]
          },
          "bendecunchu.md"
        ]
      },
      {
        text: "文件和流",
        prefix: "/dotnet/csharp/wenjianheliu/",
        collapsible: true,
        children: ["dotnetliu.md",
          "wenjianyumulucaozuo.md",
          "iomoxing.md",
          "lujingwenti.md",
          "streamkuozhanlei.md"]
      },
      "dongtaishengchengdaima.md",
      "emit.md",
      {
        text: "Roslyn",
        prefix: "/dotnet/csharp/roslyn/",
        collapsible: true,
        children: ["readme.md",
          "codeanalysis.md",
          "scripting.md",
          "natasha.md"]
      },
      "wanglao.md",
      "digui.md",
      "bulongguolvqi.md"]
  },
  {
    text: "基础",
    prefix: "/dotnet/base/",
    collapsible: true,
    children: [{
      text: "日志框架",
      prefix: "/dotnet/base/logOperator/",
      collapsible: true,
      children: ["readme.md",
        "ilogger.md",
        "serilog.md",
        "nlog.md",
        {
          text: "Log4net",
          prefix: "/dotnet/base/logOperator/log4net/",
          collapsible: true,
          children: ["readme.md",
            "netFrameworkUse.md"]
        },
        "structLog.md",
        {
          text: "日志监控",
          prefix: "/dotnet/base/logOperator/compomemt/",
          collapsible: true,
          children: ["loki.md",
            "keshihualogdashboard.md",
            "watchdog.md",
            "jackremotelog.md",
            "sejil.md"]
        }]
    },
    {
      text: "配置框架",
      prefix: "/dotnet/base/peizhikuangjia/",
      collapsible: true,
      children: ["gaishu.md",
        "peizhidouqu.md",
        "wenjianpeizhi.md",
        "minglinghangpeizhi.md",
        "huanjingbianliangpeizhi.md",
        {
          text: "自定义配置源",
          prefix: "/dotnet/base/peizhikuangjia/zidingyipeizhiyuan/",
          collapsible: true,
          children: ["readme.md",
            "neicunshujuyuanpeizhi.md",
            "zidingyishujukupeizhiyuan.md",
            "zidingyipeizhishujuyuan.md",
            "jsonwenjianpeizhiyuan.md"]
        },
        "shuaxiangoption.md",
        "peizhijianchanjiami.md",
        "jimiguanliqi.md",
        {
          text: "配置开关",
          prefix: "/dotnet/base/peizhikuangjia/peizhikaiguan/",
          collapsible: true,
          children: ["featuremanagement.md",
            "dipeibanfeatureflag.md",
            "ifeaturefilter.md"]
        }]
    },
    {
      text: "依赖注入",
      prefix: "/dotnet/base/yilaizhuru/",
      collapsible: true,
      children: ["gaishu.md",
        {
          text: "默认依赖注入",
          prefix: "/dotnet/base/yilaizhuru/morenyilaizhuru/",
          collapsible: true,
          children: ["morenyilaizhuru.md",
            "zhuceduogeshixian.md",
            {
              text: "批量注册",
              prefix: "/dotnet/base/yilaizhuru/morenyilaizhuru/piliangzhuce/",
              collapsible: true,
              children: ["tongguotexingshixianpiliangzhuce.md",
                "scrutorpiliangzhuce.md",
                "guanfangpiliangzhuru.md"]
            },
            "shengmingzhoujiceshi.md"]
        },
        {
          text: "Autofac",
          prefix: "/dotnet/base/yilaizhuru/autofac/",
          collapsible: true,
          children: ["autofac.md",
            "shengmingzhouji.md",
            "zhichiaop.md"]
        },
        "huoqusuoyouzhurudefuwu.md",
        "xunhuanyilai.md",
        {
          text: "IOC控制反转",
          prefix: "/dotnet/base/yilaizhuru/iockongzhifanzhuai/",
          collapsible: true,
          children: ["iockongzhifanzhuai.md",
            "iocrongqiyuanma.md"]
        }]
    },
    {
      text: "序列化",
      prefix: "/dotnet/base/serialize/",
      collapsible: true,
      children: ["readme.md",
        {
          text: "二进制",
          prefix: "/dotnet/base/serialize/erjinzhi/",
          collapsible: true,
          children: ["binaryformatter.md",
            "messagepack.md",
            "memorypack.md",
            "binarywriter.md"]
        },
        "xmlxuliehua.md",
        {
          text: "JSON",
          prefix: "/dotnet/base/serialize/json/",
          collapsible: true,
          children: ["json.md",
            "system_text_json.md",
            "newtonsoft_json.md",
            "dynamic_json.md",
            "jsoncons_jsonpath.md",
            "javascriptserializer.md",
            "datacontractjsonserializer.md"]
        }]
    },
    {
      text: "管道模式",
      prefix: "/dotnet/base/pipeline/",
      collapsible: true,
      children: [
        "readme.md",
        {
          text: "中间件",
          prefix: "/dotnet/base/pipeline/middleware/",
          collapsible: true,
          children: ["readme.md",
            "zhongjianjiandiaoyongshunxuhepiliangzhuce.md",
            "shuchuzhihangzhongjianjian.md",
            {
              text: "静态资源中间件",
              prefix: "/dotnet/base/pipeline/middleware/jingtaiziyuanzhongjianjian/",
              collapsible: true,
              children: ["jingtaiziyuanzhongjianjian.md",
                "morentupianzhongjianjian.md",
                "qishixie.md"]
            },
            {
              text: "拓展",
              prefix: "/dotnet/base/pipeline/middleware/tazhan/",
              collapsible: true,
              children: ["httprizhizhongjianjian.md",
                "rizhizhongjianjian.md",
                "jiluqingqiushuju.md",
                "fangdaolianzhongjianjian.md",
                "yichangzhongjianjian.md",
                "lanjieqingqiuhefanhuishujubingjiami.md",
                "jingtaimdwenjianzhuaihuanshuchu.md",
                "qingqiuchaoshizhongjianjian.md",
                "qingqiutouyuanyangfanhui.md"]
            }]
        },
        {
          text: "过滤器",
          prefix: "/dotnet/base/pipeline/filter/",
          collapsible: true,
          children: ["readme.md",
            "netfguolvqishili.md",
            "filterzhucefangshi.md",
            "guolvqishixian-yichangchuli.md",
            "filterfanhuileichuli.md",
            "guolvqishixian-niminghuachuli.md",
            "guolvqishixian-rucanjiaoyan.md",
            "guolvqishixian-rizhijilu.md",
            "filterfangchong.md",
            "guolvqishixian-zidongshiwuchuli.md",
            "guolvqishixian-jiyuipqingqiuxianzhi.md"]
        },
      ]
    },
    {
      text: "静态文件",
      prefix: "/dotnet/base/jingtaiwenjian/",
      collapsible: true,
      children: ["readme.md",
        "jiangjingtaiwenjiandabao.md",
        "jingtaiwangzhanneironggengxin.md"]
    },
    {
      text: "路由",
      prefix: "/dotnet/base/luyou/",
      collapsible: true,
      children: ["luyou.md",
        "duandianluyou.md"]
    },
    {
      text: "健康检查",
      prefix: "/dotnet/base/jiankangjiancha/",
      collapsible: true,
      children: ["jiankangjiancha.md",
        "yingyongzhuangtai.md"]
    },
    {
      text: "缓存",
      prefix: "/dotnet/base/huancun/",
      collapsible: true,
      children: ["readme.md",
        "changjiangainian.md",
        "kehuduanhuancun.md",
        "fuwuqihuancunresponsecaching.md",
        "fuwuqihuancunoutputcache.md",
        "neicunhuancunmemorycahe.md",
        "fenbushihuancun.md",
        "statichuancun.md",
        "cache.md",
        "commonNuget.md"
      ]
    },
      "muiltLanguage.md",
      "diaoyongzhexinxi.md",
      "ihostedservicerenwu.md"]
  },
  {
    text: "框架解析",
    prefix: "/dotnet/kuangjiajiexi/",
    collapsible: true,
    children: ["yuanmaxuexi.md",
      "launchsettings_json.md",
      "shengmingzhoujicaozuo.md",
      "startup.md",
      "changyongprogrampeizhi.md",
      "sdkgongzuofuzai.md",
      "mono.md"]
  },
  {
    text: "项目模板",
    prefix: "/dotnet/xiangmumoban/",
    collapsible: true,
    children: ["gaishu.md",
      "xiangmumobansheji.md",
      "vue_jsdapeiwebapimoban.md"]
  },
  {
    text: "常用组件",
    prefix: "/dotnet/commonNuget/",
    collapsible: true,
    children: [
      "tongyong.md",
      "textOperation.md",
      {
        text: "对象映射",
        prefix: "/dotnet/commonNuget/objectMapper/",
        collapsible: true,
        children: [
          "automapper.md",
          "automapperdotnetf.md",
          "mapster.md",
          "mapperly.md",
          "emitmapper.md",
          "tinymapper.md"]
      },
      "file.md",
      "shijianchuli.md",
      "scriptAnalysis.md",
      "hanshushibiancheng.md",
      "minglinghang.md",
      "diaoduqi.md",
      "etlHandler.md",
      {
        text: "限流",
        prefix: "/dotnet/commonNuget/xianliu/",
        collapsible: true,
        children: ["dotnetratelimiter.md",
          {
            text: "请求限制",
            prefix: "/dotnet/commonNuget/xianliu/qingqiuxianzhi/",
            collapsible: true,
            children: ["qingqiuxianzhichuangkousuanfa.md",
              "guanfangqingqiuxianzhizhongjianjian.md"]
          }]
      },
      "kongzhitaishuchu.md",
      "fluentftp.md",
      "ikvmOperation.md",
      "communitytoolkit.md",
      "units.md"
    ]
  },
  {
    text: "程序集操作",
    prefix: "/dotnet/chengxujicaozuo/",
    collapsible: true,
    children: ["caozuo.md",
      {
        text: "动态加载程序集",
        prefix: "/dotnet/chengxujicaozuo/dongtaijiazaichengxuji/",
        collapsible: true,
        children: ["readme.md",
          "jianchandedongtaijiazaishili.md",
          "rebachadll.md",
          "dotnetcoreplugins.md",
          "plugincore.md"]
      },
      "jiangdllneiqiandll.md",
      "huoqukuangjiadebanbenhao.md",
      "nixiangfanbianyigongju.md",
      "interceptDLL.md",
      "pInvokeDLL.md"
    ]
  },
  {
    text: "Nuget",
    prefix: "/dotnet/nuget/",
    collapsible: true,
    children: ["readme.md",
      "baobanbenzidongshengji.md",
      "jiaobenfabubao.md",
      {
        text: "私有部署",
        prefix: "/dotnet/nuget/siyoubushu/",
        collapsible: true,
        children: ["readme.md",
          "baoguanlifuwubaget.md"]
      }]
  },
  {
    text: "Web应用",
    prefix: "/dotnet/webyingyong/",
    collapsible: true,
    children: [{
      text: "MVC",
      prefix: "/dotnet/webyingyong/mvc/",
      collapsible: true,
      children: ["jichuzhishi.md",
        "changyongpeizhi.md",
        "shitubianyi.md",
        "razorshitu.md",
        "taghelpers.md"]
    },
    {
      text: "WebForm",
      prefix: "/dotnet/webyingyong/webform/",
      collapsible: true,
      children: [{
        text: "单个代码解析",
        prefix: "/dotnet/webyingyong/webform/changedaimajiexi/",
        collapsible: true,
        children: ["changedaimajiexi.md",
          "webconfig.md",
          "jubushuaxin.md",
          "tiaozhuaixiemian.md",
          "shangchuanxianzhi.md",
          "guanyulanya.md",
          "checkboxlist.md",
          "suijiyanzhengma.md",
          "huoqufuwuqixinxifangfa.md",
          "huoqujitongxinxi.md"]
      },
      {
        text: "数据表",
        prefix: "/dotnet/webyingyong/webform/shujubiao/",
        collapsible: true,
        children: ["repeater.md",
          "bianligeleishujujige.md",
          "xiugaishujudeupdatefangfa.md",
          "qiantaibangdinghoutaipinjiedehtml.md"]
      },
      {
        text: "文件上传",
        prefix: "/dotnet/webyingyong/webform/wenjianshangchuan/",
        collapsible: true,
        children: ["wenjianshangchuan.md",
          "tupianshangchuan.md",
          "tupiangeshizhuaihuan.md",
          "excel.md",
          "tupianzhuaibase64.md"]
      },
      {
        text: "存储数据",
        prefix: "/dotnet/webyingyong/webform/cunchushuju/",
        collapsible: true,
        children: ["cunchushuju.md",
          "cookie.md",
          "session.md"]
      },
      {
        text: "线程",
        prefix: "/dotnet/webyingyong/webform/xiancheng/",
        collapsible: true,
        children: ["xiancheng.md",
          "xianchengthreadhetask.md",
          "jianchandexiancheng.md",
          "dingshiqi.md"]
      },
        "websocketyuxiaoxituisong.md",
        "aspxjieshoupostmanchuandejsonduixiang.md",
        "webformhuancunchuli.md"]
    }]
  },
  {
    text: "API",
    prefix: "/dotnet/api/",
    collapsible: true,
    children: [{
      text: "基于控制器的API",
      prefix: "/dotnet/api/controllerApi/",
      collapsible: true,
      children: ["readme.md",
        "routeConfig.md",
        "modelBindAndVerify.md",
        "modelfluentvalidation.md",
        "xiangyingyasu.md",
        "httpcontext.md",
        "webapijiekouqingqiuwanshan.md",
        "gechongbutongjieshougeshi.md",
        "action.md",
        "kuayuqingqiu.md",
        "banbenkongzhi.md",
        "formattedInputOutput.md",
        "httpRequestLogging.md",
        {
          text: "拓展",
          prefix: "/dotnet/api/controllerApi/extensions/",
          collapsible: true,
          children: ["leikuyunhangwebapi.md",
            "dongtaiapizhipanda_dynamicwebapi.md",
            "dongtaiapizhiplus_autoapi.md",
            "gaojichaxun.md",
            "poolAPI.md"]
        },
        {
          text: "幂等性",
          prefix: "/dotnet/api/controllerApi/idempotent/",
          collapsible: true,
          children: ["midengxing.md",
            "fangzhichongfudijiao.md",
            "monitorTryEnter.md"]
        },
        {
          text: "安全",
          prefix: "/dotnet/api/controllerApi/safe/",
          collapsible: true,
          children: ["tokenSecret.md",
            "aspNetCoreRateLimit.md",
            "refenceCheck.md",
            "ddosAttack.md"]
        },
        "jiekoufanhuilei.md"]
    },
      "miniapi.md",
    {
      text: "Swagger",
      prefix: "/dotnet/api/swagger/",
      collapsible: true,
      children: ["jibenshiyong.md",
        "renzhengfanganbiaoshi.md",
        "banbenkongzhi.md",
        "zhushishuiming.md",
        "chuli.md",
        {
          text: "拓展",
          prefix: "/dotnet/api/swagger/tazhan/",
          collapsible: true,
          children: ["zhuti.md",
            "fanhuileimingchenyingshe.md",
            "jingtaiswagger_jsonwenjian.md",
            "miniapishangchuanwenjianxianshiyichang.md",
            "dajianswaggerhub.md",
            "daochuwenjian.md"]
        },
        "nswag.md",
        "wentichuli.md"]
    },
    {
      text: "WebService",
      prefix: "/dotnet/api/webservice/",
      collapsible: true,
      children: ["readme.md",
        "qingqiushili.md",
        "dotnetzhisoapcorejianchanshiyong.md"]
    },
    {
      text: "HTTP远程调用",
      prefix: "/dotnet/api/remoteProcedureCall/",
      collapsible: true,
      children: [
        "httpRequest.md",
        "kestrel.md",
        "restfulfengge.md",
        "httpclient.md",
        "restkaiyuanku.md",
        "ftpRequest.md",
        "flurl_httpgonggonglei.md"]
    },
    {
      text: "Socket",
      prefix: "/dotnet/api/socket/",
      collapsible: true,
      children: ["readme.md",
        "touchsocket.md",
        "supersocket.md"]
    },
      "streamJsonRpc.md",
      "sse.md",
      "webTransport.md",
      "curldehttpqingqiu.md",
      "shiyonghttprepljinhangceshi.md",
      "qingqiubiaoshichuandi.md",
      "shujuchuanshujiami.md",
      "connectedservices.md"]
  },
  {
    text: "Console",
    prefix: "/dotnet/console/",
    collapsible: true,
    children: [
      "readme.md",
      "sample.md",
      {
        text: "界面",
        prefix: "/dotnet/console/jiemian/",
        collapsible: true,
        children: ["terminal_gui.md",
          "jiemiangui_cs.md"]
      },
      {
        text: "样式Nuget包",
        prefix: "/dotnet/console/yangshinugetbao/",
        collapsible: true,
        children: ["spectreconsole.md",
          "zhizuojiaohuchengxusharprompt.md",
          "biaogeconsoletables.md",
          "yansecolorful_console.md",
          "jindutiaoshellprogressbar.md"]
      },
      {
        text: "小示例",
        prefix: "/dotnet/console/xiaoshili/",
        collapsible: true,
        children: ["xiazaituchuangtupian.md"]
      }]
  },
  {
    text: "WindowsService",
    prefix: "/dotnet/windowsservice/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "WorkService",
    prefix: "/dotnet/workservice/",
    collapsible: true,
    children: ["readme.md",
      "serviceself.md"]
  },
  {
    text: "桌面程序",
    prefix: "/dotnet/desktop/",
    collapsible: true,
    children: [{
      text: "系统操作",
      prefix: "/dotnet/desktop/systemOperator/",
      collapsible: true,
      children: ["readme.md",
        "windowsapi.md",
        "rejian.md",
        "startOperator.md",
        "fangzhichongfuqidong.md",
        {
          text: "示例",
          prefix: "/dotnet/desktop/systemOperator/sample/",
          collapsible: true,
          children: ["winformzhucerejianshixianjietuxiaoguo.md",
            "wpfzhucerejianshixianjietuxiaoguo.md"]
        }]
    },
      "shangweijikaifa.md",
      "peizhicunchu.md",
    {
      text: "Winform",
      prefix: "/dotnet/desktop/winform/",
      collapsible: true,
      children: ["readme.md",
        {
          text: "基础知识",
          prefix: "/dotnet/desktop/winform/jichuzhishi/",
          collapsible: true,
          children: ["programwenjian.md",
            "jichucaozuo.md",
            "dengluxiaoguo.md",
            "guanliyuanfangshiqidongbingjudaiquanjulanjie.md",
            "shiyongyilaizhuru.md"]
        },
        {
          text: "Blazor Hybrid",
          prefix: "/dotnet/desktop/winform/blazorhybrid/",
          collapsible: true,
          children: ["readme.md"]
        },
        "winformscominterop.md",
        "scoket.md",
        "changyongkongjian.md",
        "changyongzujian.md",
        "tupiangeshizhuaihuan.md",
      ]
    },
    {
      text: "WPF",
      prefix: "/dotnet/desktop/wpf/",
      collapsible: true,
      children: ["readme.md",
        {
          text: "基础知识",
          prefix: "/dotnet/desktop/wpf/jichuzhishi/",
          collapsible: true,
          children: ["jichucaozuo.md",
            "jichukongjian.md",
            "jichubujushili.md"]
        },
        {
          text: "Mvvm组件",
          prefix: "/dotnet/desktop/wpf/mvvmzujian/",
          collapsible: true,
          children: ["readme.md",
            {
              text: "Prism",
              prefix: "/dotnet/desktop/wpf/mvvmzujian/prism/",
              collapsible: true,
              children: ["readme.md"]
            },
            {
              text: "CommunityToolkit.Mvvm",
              prefix: "/dotnet/desktop/wpf/mvvmzujian/communitytoolkit_mvvm/",
              collapsible: true,
              children: ["readme.md"]
            },
            "propertychanged_fody.md"]
        },
        {
          text: "UI",
          prefix: "/dotnet/desktop/wpf/ui/",
          collapsible: true,
          children: ["handycontrol.md",
            "materialdesign.md",
            "wpfui.md",
            "rubyer.md"]
        },
        {
          text: "扩展",
          prefix: "/dotnet/desktop/wpf/kuozhan/",
          collapsible: true,
          children: ["congshipinzhongdiqutupian.md"]
        },
        "changwenwenti.md",
        "kaiyuanzujian.md"]
    },
    {
      text: "开源组件",
      prefix: "/dotnet/desktop/kaiyuanzujian/",
      collapsible: true,
      children: ["ui.md",
        "_netnanoframework.md",
        "dotnetty.md"]
    },
    {
      text: "扩展",
      prefix: "/dotnet/desktop/kuozhan/",
      collapsible: true,
      children: ["qidongexemojiemianfangan.md"]
    },
    {
      text: "打包部署",
      prefix: "/dotnet/desktop/dabaobushu/",
      collapsible: true,
      children: ["readme.md",
        "InnoSetupBuild.md",
        "costura_fody.md",
        "clickoncebushu.md",
        "gengxin.md"]
    }]
  },
  {
    text: "MAUI",
    prefix: "/dotnet/maui/",
    collapsible: true,
    children: ["readme.md",
      "xaml.md",
      {
        text: "入门学习",
        prefix: "/dotnet/maui/rumenxuexi/",
        collapsible: true,
        children: ["jichuzhishi.md",
          "huanjingzhunbei.md",
          "shujubangding.md",
          "xiangmukuangjiajieshao.md",
          "qiantaichuangjianuihedaimachuangjianui.md"]
      },
      {
        text: "Blazor Hybrid",
        prefix: "/dotnet/maui/blazorhybrid/",
        collapsible: true,
        children: ["jieshao.md",
          "diaoshi.md"]
      },
      "pingtaiapi.md",
      {
        text: "操作",
        prefix: "/dotnet/maui/caozuo/",
        collapsible: true,
        children: ["quanjuyichangchuli.md",
          "shiyongautofac.md"]
      },
      "kaiyuanxiangmu.md",
      {
        text: "发布",
        prefix: "/dotnet/maui/publish/",
        collapsible: true,
        children: ["windowsPublish.md",
          "windowsPublishExe.md",
          "androidPublish.md",
          "iosPublish.md"]
      },
      "wenti.md"]
  },
  {
    text: "Avalonia",
    prefix: "/dotnet/avalonia/",
    collapsible: true,
    children: ["readme.md",
      "operator.md",
      {
        text: "开源项目",
        prefix: "/dotnet/avalonia/projects/",
        collapsible: true,
        children: [
          "readme.md",
          "socketTool.md",
          "mqttTool.md"]
      },
      "release.md",
      "issue.md"
    ]
  },
  {
    text: "SourceGenerator",
    prefix: "/dotnet/sourcegenerator/",
    collapsible: true,
    children: ["readme.md",
      "incrementalGenerators.md"
    ]
  },
  "dotNetAspire.md",
  "kiota.md",
  "spark.md",
  {
    text: "模板引擎",
    prefix: "/dotnet/mobanyinqing/",
    collapsible: true,
    children: ["readme.md",
      {
        text: "Razor",
        prefix: "/dotnet/mobanyinqing/razor/",
        collapsible: true,
        children: ["readme.md",
          "razorlight.md",
          "microsoft_aspnetcore_mvc_razor.md",
          "razorengine.md"]
      },
      "jntemplate.md"]
  },
  {
    text: "服务器",
    prefix: "/dotnet/server/",
    collapsible: true,
    children: [{
      text: "Kestrel",
      prefix: "/dotnet/server/kestrel/",
      collapsible: true,
      children: ["kestrel.md",
        "cuowuchuli.md"]
    },
    {
      text: "Diagnostics",
      prefix: "/dotnet/server/diagnostics/",
      collapsible: true,
      children: [
        "readme.md",
        "handle.md"
      ]
    }]
  },
  "semantickernel.md",
  {
    text: "Signalr",
    prefix: "/dotnet/signalr/",
    collapsible: true,
    children: [
      "readme.md",
      "handle.md",
      "issue.md",
    ]
  },
  {
    text: "AOP",
    prefix: "/dotnet/aop/",
    collapsible: true,
    children: ["readme.md",
      "fody.md",
      "dispatchproxy.md",
      "castle_dynamicproxy.md",
      "aspectcore_core.md",
      "rougamo.md",
      "postsharp.md",
      "mradvice.md",
      "dora_interception.md"]
  },
  {
    text: "命名管道IPC",
    prefix: "/dotnet/mingmingguandaoipc/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "T4模板",
    prefix: "/dotnet/t4moban/",
    collapsible: true,
    children: ["t4moban.md",
      "t4yufa.md"]
  },
  {
    text: "游戏引擎",
    prefix: "/dotnet/youhuyinqing/",
    collapsible: true,
    children: ["readme.md"]
  },
  {
    text: "安全和标识",
    prefix: "/dotnet/anquanhebiaoshi/",
    collapsible: true,
    children: [{
      text: "身份认证和授权",
      prefix: "/dotnet/anquanhebiaoshi/shenfenrenzhengheshouquan/",
      collapsible: true,
      children: ["gaishu.md",
        {
          text: "Identity",
          prefix: "/dotnet/anquanhebiaoshi/shenfenrenzhengheshouquan/identity/",
          collapsible: true,
          children: ["jieshao.md",
            "shenru.md"]
        },
        "claimsxiangguangainian.md",
        "huoquyonghuxinxi.md",
        "httpcontext.md",
        {
          text: "Cookie身份认证",
          prefix: "/dotnet/anquanhebiaoshi/shenfenrenzhengheshouquan/cookieshenfenrenzheng/",
          collapsible: true,
          children: ["cookieshenfenrenzheng.md",
            "netfcookie.md"]
        },
        {
          text: "Session",
          prefix: "/dotnet/anquanhebiaoshi/shenfenrenzhengheshouquan/session/",
          collapsible: true,
          children: ["session.md",
            "sessionyuanma.md",
            "sessiongongxiang.md"]
        },
        {
          text: "JWT认证",
          prefix: "/dotnet/anquanhebiaoshi/shenfenrenzhengheshouquan/jwtrenzheng/",
          collapsible: true,
          children: ["gaishu.md",
            "jianchancaozuojwttoken.md",
            "kuozhanzidingyishouquan.md",
            "jiangzhixiaxian.md",
            "peizhijwtrenzhengpeizhi.md"]
        },
        "casbinfangwenkongzhi.md",
        "shujubaohushixianxianshitoken.md",
        "changyongzujian.md",
        {
          text: "认证授权示例",
          prefix: "/dotnet/anquanhebiaoshi/shenfenrenzhengheshouquan/renzhengshouquanshili/",
          collapsible: true,
          children: ["zidingyibasicrenzhengyushouquan.md",
            "zidingyiapikeyrenzheng.md",
            "jiyuyonghujiaosedefangwenquanxiankongzhi.md"]
        }]
    },
      "shujubaohudataprotection.md"]
  },
  {
    text: "调试",
    prefix: "/dotnet/debugging/",
    collapsible: true,
    children: [
      "readme.md",
      "vs2022yuanchengdiaoshiiisfuwu.md",
      "xianchengdiaoshi.md",
      "xingnengdiaoshi.md",
      "dumpAnalyses.md",
      "issueAnalysis.md",
      {
        text: "调试工具",
        prefix: "/dotnet/debugging/jibendiaoshigongju/",
        collapsible: true,
        children: [
          "jibendiaoshigongju.md",
          "diyicizhihangmanxingnengfenxi.md"
        ]
      }
    ]
  },
  {
    text: "错误处理",
    prefix: "/dotnet/cuowuchuli/",
    collapsible: true,
    children: ["shibairenwuchongshi.md"]
  },
  {
    text: "项目迁移",
    prefix: "/dotnet/xiangmuqianyi/",
    collapsible: true,
    children: ["readme.md",
      "shengjizhushou.md"]
  },
  {
    text: "代码分析",
    prefix: "/dotnet/daimafenxi/",
    collapsible: true,
    children: [
      "readme.md",
      "fenxigongju.md",
      {
        text: "代码质量规则",
        prefix: "/dotnet/daimafenxi/daimazhiliangguize/",
        collapsible: true,
        children: ["readme.md"]
      },
      "daimazhiliang.md",
      "yuandaimafenxi.md"]
  },
  {
    text: "代码优化",
    prefix: "/dotnet/daimayouhua/",
    collapsible: true,
    children: ["daimayouhua.md",
      "quanjuxingnengzhenduangongju.md"]
  },
  {
    text: "数据访问",
    prefix: "/dotnet/shujufangwen/",
    collapsible: true,
    children: ["dotnetshengchengshujuku.md"]
  },
  {
    text: "发布部署",
    prefix: "/dotnet/buildAndRelease/",
    collapsible: true,
    children: [
      "readme.md",
      "aot.md",
      {
        text: "部署",
        prefix: "/dotnet/buildAndRelease/release/",
        collapsible: true,
        children: ["readme.md",
          {
            text: "Windows问题",
            prefix: "/dotnet/buildAndRelease/release/iis/",
            collapsible: true,
            children: [
              "serverRelease.md",
              "iisReleaseNet5.md",
              "issue.md"]
          },
          {
            text: "Linux部署",
            prefix: "/dotnet/buildAndRelease/release/linux/",
            collapsible: true,
            children: ["linuxbushu.md",
              "bushuliuchengheshouhujincheng.md",
              "anzhuanghuanjing.md",
              "ubuntuReleaseNet.md",
              "shouhujincheng.md"
            ]
          },
          {
            text: "部署工具",
            prefix: "/dotnet/buildAndRelease/release/releaseTools/",
            collapsible: true,
            children: ["nssm.md"]
          },
          "dockerReleaseNetCore.md",
          "optimizeFolder.md"]
      },
      "obfuscator.md"]
  },
  {
    text: "生产力提升",
    prefix: "/dotnet/shengchanlidisheng/",
    collapsible: true,
    children: [
      "kaifasuidaoshiyong.md",
      "vschajian.md",
      "genApiDoc.md"
    ]
  },
  {
    text: "公共方法类",
    prefix: "/dotnet/commonMethod/",
    collapsible: true,
    children: ["readme.md",
      "ipchuli.md",
      {
        text: "加解密",
        prefix: "/dotnet/commonMethod/encrypt/",
        collapsible: true,
        children: [
          "readme.md",
          "sha.md",
          "rsajiajiemi.md",
          "chinaEncrypt.md"
        ]
      },
      "downloader.md"
    ]
  }];