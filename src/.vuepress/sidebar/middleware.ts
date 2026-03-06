
// 中间件

export const middlewareSidebar = ["readme.md",
  {
    text: "Office",
    prefix: "/middleware/office/",
    collapsible: true,
    children: [
      "readme.md",
      "spire.md",
      "aspose.md",
      "nsoup.md",
      "towersoft_htmltoexcel.md",
      "htmlagilitypack.md",
      "anglesharp.md",
      "puppeteersharp.md",
      "npoi.md",
      {
        text: "NPOI",
        prefix: "/middleware/office/npoi/",
        collapsible: true,
        children: [
          "npoicaozuoexcel.md",
          "npoipeizhi.md",
          "npoiyiwen.md"]
      },
      "miniword.md",
      "epplus.md",
      "closedxml.md",
      "miniexcel.md",
      "onlyoffice.md",
      "epubHandle.md",
      {
        text: "PPT",
        collapsible: true,
        children: [
          "/middleware/office/openxml.md",
          "/middleware/office/ppt/shapeCrawler.md",
        ]
      },
      {
        text: "HTML",
        collapsible: true,
        children: [
          "/middleware/office/html/readme.md",
        ]
      },
      {
        text: "PDF",
        prefix: "/middleware/office/pdf/",
        collapsible: true,
        children: [
          "pdfSample.md",
          "magick_net.md",
          "ironpdf.md",
          "questpdf.md",
          "spire_pdf.md",
          "aspose_pdf.md",
          "itextsharp.md",
          "itext7.md",
          "haukcode_wkhtmltopdfdotnet.md",
          "pdfsharp.md",
          "dinkToPdf.md"
        ]
      },
      {
        text: "CSV",
        prefix: "/middleware/office/csv/",
        collapsible: true,
        children: ["gaishu.md",
          "csvhelper.md",
          "csvfile.md"]
      },
      {
        text: "邮件",
        prefix: "/middleware/office/youjian/",
        collapsible: true,
        children: ["mailkit.md",
          "fluentemail.md"]
      },
      {
        text: "YAPI",
        prefix: "/middleware/office/yapi/",
        collapsible: true,
        children: ["readme.md",
          "neiwangbushu.md"]
      },
      {
        text: "IP",
        prefix: "/middleware/office/ip/",
        collapsible: true,
        children: ["maxmind.md",
          "ip2region.md"]
      },
      {
        text: "Markdown",
        prefix: "/middleware/office/markdown/",
        collapsible: true,
        children: ["markdig.md",
          "markdownsharp.md"]
      },
      {
        text: "文本对比",
        prefix: "/middleware/office/wenbenduibi/",
        collapsible: true,
        children: ["diffplex.md",
          "htmldiff_net.md"]
      }]
  },
  {
    text: "仓库",
    prefix: "/middleware/cangku/",
    collapsible: true,
    children: ["octokit.md"]
  },
  {
    text: "分词",
    prefix: "/middleware/fenci/",
    collapsible: true,
    children: ["jieba_net.md",
      "zhizuociyuntu.md",
      "mingancizujian.md"]
  },
  {
    text: "节点编辑器",
    prefix: "/middleware/jiedianbianjiqi/",
    collapsible: true,
    children: ["stnodeeditor.md"]
  },
  {
    text: "gRPC",
    prefix: "/middleware/grpc/",
    collapsible: true,
    children: ["grpc.md",
      "grpcsichongmoshi.md",
      "grpchttpapi.md",
      "protowenjian.md",
      "yichanglanjieqi.md",
      "jianquan.md",
      "dotnetdaimayouxiangrpcfuwu.md",
      "grpcliu.md",
      "grpc-web.md",
      "grpcdiaoshigongju.md",
      {
        text: "Rpc框架",
        prefix: "/middleware/grpc/rpckuangjia/",
        collapsible: true,
        children: ["dotnetcorerpc.md"]
      },
      {
        text: "部署",
        prefix: "/middleware/grpc/bushu/",
        collapsible: true,
        children: ["kaifabushu.md"]
      }]
  },
  {
    text: "图像处理",
    prefix: "/middleware/images/",
    collapsible: true,
    children: ["readme.md",
      "systemDrawingCommon.md",
      "duochongmazxing_net.md",
      "barcodelib.md",
      "skiasharpQrcode.md",
      "imagesharp.md",
      "magick_net.md",
      "qrcodegenerator.md",
      "huoqushexiangtoupaizhao.md",
      {
        text: "验证码",
        prefix: "/middleware/images/qrcode/",
        collapsible: true,
        children: ["readme.md",
          "tuxingyanzhengmalazycaptcha.md",
          "tuxingyanzhengmaimagesharp.md",
          "huakuaiyanzhengmalazyslidecaptcha.md",
          "huakuaiyanzhengmaverificationcode.md",
          "chumoyanzhengmasimcaptcha.md"]
      },
      {
        text: "OCR",
        prefix: "/middleware/images/ocr/",
        collapsible: true,
        children: ["paddleocrsharp.md",
          "rapidocr.md"]
      },
      {
        text: "人脸识别",
        prefix: "/middleware/images/renlianshibie/",
        collapsible: true,
        children: [
          "facerecognitiondotnet.md",
          "arcsoft.md",
          "luxandfacesdk.md",
          "viewfacecore.md"]
      },
      {
        text: "手势识别",
        prefix: "/middleware/images/shoushishibie/",
        collapsible: true,
        children: ["mediapipe_net.md"]
      },
      {
        text: "OpenCV",
        prefix: "/middleware/images/opencv/",
        collapsible: true,
        children: [
          "opencvsharp.md",
          "emgu_cv.md",
          "openVino.md"
        ]
      }
    ]
  },
  {
    text: "音频视频",
    prefix: "/middleware/yinpinshipin/",
    collapsible: true,
    children: ["whisper_net.md",
      "yuyinliaotian.md",
      "speechsynthesizeryuyin.md",
      {
        text: "ffmpeg",
        prefix: "/middleware/yinpinshipin/ffmpeg/",
        collapsible: true,
        children: ["jichujieshao.md",
          "shipinjietu.md",
          "ffmpeg_autogen.md",
          "sdcb_ffmpeg.md"]
      },
      {
        text: "流媒体服务",
        prefix: "/middleware/yinpinshipin/liumeitifuwu/",
        collapsible: true,
        children: ["readme.md",
          "zlmediakit.md"]
      }]
  },
  {
    text: "全文检索",
    prefix: "/middleware/fullTextSearch/",
    collapsible: true,
    children: ["gaishu.md",
      {
        text: "Lucene",
        prefix: "/middleware/fullTextSearch/lucene/",
        collapsible: true,
        children: ["lucene_net.md",
          "lucene-searchextensions.md"]
      },
      {
        text: "ElasticSearch",
        prefix: "/middleware/fullTextSearch/elasticsearch/",
        collapsible: true,
        children: [
          "readme.md",
          "struct.md",
          "operator.md",
          "install.md"
        ]
      },
      {
        text: "MeiliSearch",
        prefix: "/middleware/fullTextSearch/meilisearch/",
        collapsible: true,
        children: ["readme.md"]
      },
      "redisearch.md",
      {
        text: "Solr",
        prefix: "/middleware/fullTextSearch/solr/",
        collapsible: true,
        children: ["jieshao.md"]
      }]
  },
  {
    text: "分布式文件系统",
    prefix: "/middleware/oss/",
    collapsible: true,
    children: ["readme.md",
      "minio.md",
      "aliyunoss.md",
      "qiniuyuncunchu.md",
      "fastdfs.md",
      "tfs.md",
      "httpfileserver.md",
      "fluentftp.md",
      "filebrowser.md"]
  },
  {
    text: "自动化操作",
    prefix: "/middleware/zidonghuacaozuo/",
    collapsible: true,
    children: ["readme.md",
      "netautogui.md",
      "flaUIAutomation.md",
      "uiautomation.md",
      "cliwrap.md"]
  },
  {
    text: "规则引擎",
    prefix: "/middleware/guizeyinqing/",
    collapsible: true,
    children: ["rulesengine.md"]
  },
  "graphql.md",
  "shujuqianyi.md",
  {
    text: "打印插件",
    prefix: "/middleware/printPlugin/",
    collapsible: true,
    children: ["readme.md",
      {
        text: "前端打印",
        prefix: "/middleware/printPlugin/frontPrint/",
        collapsible: true,
        children: ["default.md",
          "httpprinter.md",
          "jcp.md",
          "lodop.md"]
      },
      "fastreport.md"]
  },
  {
    text: "消息队列",
    prefix: "/middleware/messageQueue/",
    collapsible: true,
    children: [
      "readme.md",
      {
        text: "RabbitMQ",
        prefix: "/middleware/messageQueue/rabbitmq/",
        collapsible: true,
        children: [
          "readme.md",
          "rabbitmqtuli.md",
          "rabbitmqMode.md",
          "other.md",
          "use.md",
          {
            text: "扩展",
            prefix: "/middleware/messageQueue/rabbitmq/kuozhan/",
            collapsible: true,
            children: ["rabbitmqsixin.md",
              "rabbitmqyanchiduilie.md",
              "rabbitmqxiaoxikekaoxingfenxiheyingyong.md"]
          },
          "easynetq.md",
          "install.md",
          "issue.md"]
      },
      {
        text: "RocketMq",
        prefix: "/middleware/messageQueue/rocketmq/",
        collapsible: true,
        children: ["readme.md"]
      },
      "redis.md",
      "kafka.md",
      "pulsar.md",
      "mqtt.md",
      "issue.md"]
  },
  {
    text: "事件总线",
    prefix: "/middleware/eventBus/",
    collapsible: true,
    children: ["readme.md",
      "inmemoryMode.md",
      "masstransit.md",
      "zack_eventbusrabbitmq.md",
      "jaina.md",
      "masaframework.md",
      "mediatr.md",
      "slimmessagebus.md"]
  },
  {
    text: "语法解析",
    prefix: "/middleware/yufajiexi/",
    collapsible: true,
    children: ["sqljiexi.md",
      "irony.md"]
  },
  {
    text: "工作流",
    prefix: "/middleware/gongzuoliu/",
    collapsible: true,
    children: [
      "readme.md",
      "workflow-core.md",
      "elsa.md",
      "ccflow.md",
      "mxgraph.md",
      "visor_js.md"]
  },
  {
    text: "爬虫",
    prefix: "/middleware/reptile/",
    collapsible: true,
    children: ["readme.md",
      "fuzhugongju.md",
      "anglesharp.md",
      "htmlagilitypack.md",
      "puppeteersharp.md",
      "sample.md",
      "commonNuget.md"]
  },
  "zhifuzujian.md",
  {
    text: "认证授权",
    prefix: "/middleware/authorize/",
    collapsible: true,
    children: [{
      text: "OAuth",
      prefix: "/middleware/authorize/oauth/",
      collapsible: true,
      children: ["readme.md",
        "sichongshouquanmoshi.md",
        "sample.md"]
    },
      "openidconnect.md",
    {
      text: "IdentityServer4",
      prefix: "/middleware/authorize/identityserver4/",
      collapsible: true,
      children: ["readme.md",
        "kuaisudajianxiangmu.md",
        {
          text: "模式",
          prefix: "/middleware/authorize/identityserver4/mode/",
          collapsible: true,
          children: [
            "clientCredentialsMode.md",
            "resourceOwnerPasswordMode.md",
            "implicitMode.md",
            "codeMode.md",
            "hybridMode.md",
          ]
        },
        "shujuchijiuhua.md",
        "ui.md",
        "chijiuhuabiaoshuiming.md",
        "ziyuanfuwurenzheng.md",
        "issue.md"]
    },
    {
      text: "OpenIddict",
      prefix: "/middleware/authorize/openiddict/",
      collapsible: true,
      children: ["readme.md"]
    },
      "keycloak.md"]
  },
  {
    text: "任务调度",
    prefix: "/middleware/renwudiaodu/",
    collapsible: true,
    children: ["readme.md",
      "timerlei.md",
      {
        text: "Quartz",
        prefix: "/middleware/renwudiaodu/quartz/",
        collapsible: true,
        children: ["quartz.md",
          "netfshiyong.md",
          "gzy_quartz_mui.md"]
      },
      "hangfire.md",
      "coravel.md",
      "schedulemaster.md",
      "fluentscheduler.md",
      "easyquartz.md",
      "xxl-job.md",
      "antjob.md"]
  },
  {
    text: "延迟队列",
    prefix: "/middleware/yanchiduilie/",
    collapsible: true,
    children: ["jianjie.md",
      "hangfireyanchiduilie.md",
      "redishuancunguojishijian.md",
      "zidingyiyanchiduilie.md",
      "jishiguanliqi.md"]
  },
  {
    text: "通知服务",
    prefix: "/middleware/notification/",
    collapsible: true,
    children: [
      "notificationService.md",
      "notificationCollect.md"
    ]
  },
  "sonar.md",
  {
    text: "标识ID",
    prefix: "/middleware/identityId/",
    collapsible: true,
    children: [
      "fenbushiweiyibiaoshi.md",
      "newidshunxuguid.md",
      "yitterxuehuaid.md",
      "idhelperxuehuaid.md",
      "jiyushujukufenbushiid.md",
      "hashidsjianduanzifuchuanid.md",
      "ulid.md",
      "xuehuaidgonggonglei.md",
    ]
  },
  {
    text: "短信",
    prefix: "/middleware/duanxin/",
    collapsible: true,
    children: ["readme.md",
      "aliyunduanxin.md",
      "yunlianrongtongxunduanxin.md"]
  },
  {
    text: "管理和测试工具",
    prefix: "/middleware/testMange/",
    collapsible: true,
    children: ["readme.md",
      {
        text: "基准测试",
        prefix: "/middleware/testMange/jizhunceshi/",
        collapsible: true,
        children: ["benchmarkdotnet.md"]
      },
      {
        text: "单元测试",
        prefix: "/middleware/testMange/unitTest/",
        collapsible: true,
        children: ["readme.md",
          "testSpecification.md",
          "cliTest.md",
          "xunitTest.md",
          "msTest.md",
          "xunitDependencyInjection.md"
        ]
      },
      {
        text: "集成测试",
        prefix: "/middleware/testMange/integrationTest/",
        collapsible: true,
        children: ["readme.md",
          "testserver.md",
        ]
      },
      {
        text: "负载测试",
        prefix: "/middleware/testMange/fuzaiceshi/",
        collapsible: true,
        children: ["readme.md",
          "k6.md"]
      },
      {
        text: "端到端测试",
        prefix: "/middleware/testMange/duandaoduanceshi/",
        collapsible: true,
        children: ["readme.md",
          {
            text: "Playwright",
            prefix: "/middleware/testMange/duandaoduanceshi/playwright/",
            collapsible: true,
            children: ["readme.md",
              "caozuo.md",
              "bushu.md"]
          }]
      },
      "qiyaoceshi.md",
      {
        text: "压力测试",
        prefix: "/middleware/testMange/pressureTest/",
        collapsible: true,
        children: [
          "readme.md",
          "jmeter.md",
          "nbomberyace.md",
          "webapibenchmark.md"
        ]
      },
      {
        text: "模糊测试",
        prefix: "/middleware/testMange/mohuceshi/",
        collapsible: true,
        children: ["sharpfuzz.md"]
      },
      "commonNuget.md",
      "monihttpxiangying.md",
      "specflowhangweiceshi.md"]
  },
  {
    text: "短连接",
    prefix: "/middleware/duanlianjie/",
    collapsible: true,
    children: ["duanlianjie.md",
      "hashidsshixianduanlianjie.md"]
  },
  {
    text: "反向代理",
    prefix: "/middleware/reverseProxy/",
    collapsible: true,
    children: [
      {
        text: "Nginx",
        prefix: "/middleware/reverseProxy/nginx/",
        collapsible: true,
        children: ["nginx.md",
          "peizhiwenjian.md",
          "localhostyingshelujing.md",
          "dongjingfenli.md",
          "gaokeyong.md",
          "shiyonggongneng.md",
          "nginxpeizhinetcore.md",
          {
            text: "WebUI",
            prefix: "/middleware/reverseProxy/nginx/webui/",
            collapsible: true,
            children: ["nginxconfig.md",
              "nginxwebui.md"]
          },
          {
            text: "安装",
            prefix: "/middleware/reverseProxy/nginx/anzhuang/",
            collapsible: true,
            children: ["dockeranzhuangnginx.md",
              "windowsanzhuangnginx.md",
              "linuxanzhuangnginx.md"]
          },
          "issue.md"]
      },
      "yarp.md",
      "traefik.md"
    ]
  },
  {
    text: "微服务",
    prefix: "/middleware/smallService/",
    collapsible: true,
    children: [
      "readme.md",
      "jiagoutu.md",
      "xianliu.md",
      "rongduanjiangji.md",
      "polly.md",
      {
        text: "网关",
        prefix: "/middleware/smallService/wangguan/",
        collapsible: true,
        children: [
          "wangguan.md",
          "wangguan-ocelot.md",
          "wangguan-kong.md",
          "wangguan-yarp.md"
        ]
      },
      {
        text: "服务注册与发现",
        prefix: "/middleware/smallService/fuwuzhuceyufaxian/",
        collapsible: true,
        children: [
          "fuwuzhuceyufaxian.md",
          "eureka.md",
          "consul.md"
        ]
      },
      {
        text: "统一配置管理",
        prefix: "/middleware/smallService/tongyipeizhiguanli/",
        collapsible: true,
        children: [
          "apollo.md",
          "zookeeper.md",
          "agileconfig.md",
          "nacos.md"
        ]
      },
      {
        text: "分布式可观测性",
        prefix: "/middleware/smallService/distributedObservability/",
        collapsible: true,
        children: [
          {
            text: "分布式日志",
            prefix: "/middleware/smallService/distributedObservability/distributedLogger/",
            collapsible: true,
            children: [
              "readme.md",
              "seq.md",
              "efk.md",
              "exceptionless.md",
              "elk.md",
              "loki.md",
              "splunk.md"]
          },
          {
            text: "分布式追踪Tracing",
            prefix: "/middleware/smallService/distributedObservability/distributedTrace/",
            collapsible: true,
            children: [
              "readme.md",
              "skywalking.md",
              "jaeger.md",
              "zipkin.md",
              "butterfly.md"
            ]
          },
          {
            text: "分布式监控Metrics",
            prefix: "/middleware/smallService/distributedObservability/distributedMonitoring/",
            collapsible: true,
            children: [
              "readme.md",
              "prometheus.md",
              "opentelemetry.md",
              "openTelemetryStartedCombat.md",
              "grafana.md",
              "jitongjiankonghttpreportsapm.md",
              "czglProcessmetrics.md"
            ]
          }]
      },
      {
        text: "错误追踪和性能监控",
        prefix: "/middleware/smallService/cuowuzhuizonghexingnengjiankong/",
        collapsible: true,
        children: [
          "sentry.md"
        ]
      },
      {
        text: "分布式事务",
        prefix: "/middleware/smallService/fenbushishiwu/",
        collapsible: true,
        children: [
          "fenbushishiwu.md",
          "fenbushishiwu-zuizhongyizhixingcap.md"
        ]
      },
      {
        text: "分布式锁",
        prefix: "/middleware/smallService/fenbushisuo/",
        collapsible: true,
        children: [
          "fenbushisuo.md",
          "redisfenbushisuo.md",
          "shujukufenbushisuo.md"
        ]
      }]
  }];