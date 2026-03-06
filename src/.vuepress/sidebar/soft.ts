
// 软件目录

export const softSidebar = [
    "/soft/softCollection.md",
    "/soft/webAddress.md",
    "/soft/browserPlug.md",
    "/soft/game.md",
    {
        text: "开发者工具",
        collapsible: true,
        prefix: "/soft/devTools/",
        children: [
            "codeConfig.md",
            "openSourceProtocol.md",
            {
                text: "VisualStudio",
                collapsible: true,
                prefix: "/soft/devTools/VisualStudio/",
                children:
                    [
                        "readme.md",
                        "shengchanlidisheng.md",
                        "chajianjieshao.md",
                        "useSkill.md",
                        "geshihuashezhi.md",
                        "editorconfig.md",
                        "shezhimingmingguifan.md",
                        "slngenLoading.md",
                        "zhongwentishi.md",
                        "vs2019Install.md",
                        "offLineInstall.md",
                        "environmentConfig.md",
                    ]
            },
            "linqpad.md",
            "vscode.md",
            "neiwangchuantou.md",
            "communicationTest.md",
            "nodeJs.md",
            "nssm.md",
            {
                text: "数据库工具",
                collapsible: true,
                prefix: "/soft/devTools/dbTools/",
                children:
                    [
                        "readme.md",
                        "navicat.md",
                        "dbchm.md",
                    ]
            },
            {
                text: "JetBrains",
                collapsible: true,
                prefix: "/soft/devTools/JetBrains/",
                children:
                    [
                        "readme.md",
                        "rider.md",
                        "datagrip.md",
                        "dotmemery.md",
                        "dotpeek.md",
                        "dottrace.md",
                    ]
            },
            {
                text: "源代码管理",
                prefix: "/soft/devTools/sourceCodeManage/",
                collapsible: true,
                children:
                    [
                        "readme.md",
                        "gitjichucaozuo.md",
                        "commonOperator.md",
                        "gitFile.md",
                        "codeRepository.md",
                        "pagesHost.md",
                        {
                            text: "安装",
                            collapsible: true,
                            prefix: "/soft/devTools/sourceCodeManage/install/",
                            children:
                                [
                                    "windowsInstall.md",
                                    "linuxInstall.md",
                                ]
                        },
                        "gogs.md",
                        "gitea.md"
                    ]
            },
            {
                text: "Postman",
                prefix: "/soft/devTools/Postman/",
                collapsible: true,
                children:
                    [
                        "postman.md",
                        "similarity.md",
                    ]
            },
            {
                text: "项目管理",
                prefix: "/soft/devTools/projectManage/",
                collapsible: true,
                children:
                    [
                        "chandao.md",
                        "communityserver.md",
                    ]
            },
            "codeStatistics.md"
        ]
    },
    {
        text: "服务器和证书",
        prefix: "/soft/serverConfigs/",
        collapsible: true,
        children:
            [
                "readme.md",
                "dns.md",
                "ddns.md",
                "intranet.md",
                "certificate.md",
            ]
    },
    {
        text: "Windows",
        collapsible: true,
        prefix: "/soft/windows/",
        children: [
            "readme.md",
            "batmingling.md",
            "cipanqingli.md",
            "windowsStore.md",
            "sortRecommend.md",
            "mdTools.md",
            "docsWeb.md",
            "picGoImageStorage.md",
            "wslLinux.md",
            "windowsSeverInstall.md"
        ]
    },
    {
        text: "Linux",
        prefix: "/soft/Linux/",
        collapsible: true,
        children:
            [
                "linux.md",
                "shCommand.md",
                {
                    text: "Centos",
                    prefix: "/soft/Linux/Centos/",
                    collapsible: true,
                    children:
                        [
                            "centos.md",
                            "mingling.md",
                        ]
                },
                {
                    text: "Ubuntu",
                    prefix: "/soft/Linux/Ubuntu/",
                    collapsible: true,
                    children:
                        [
                            "readme.md",
                        ]
                },
                "baocunfanghuoqiangguize.md",
                "selinux.md",
                "tools.md",
                {
                    text: "安装",
                    prefix: "/soft/Linux/Install/",
                    collapsible: true,
                    children:
                        [
                            "multipass.md",
                            "centos7anzhuangjavahuanjing.md",
                            "hypervanzhuangcentos7.md",
                            "hypervInstallUbuntu.md"
                        ]
                },
            ]
    },
    {
        text: "虚拟机",
        prefix: "/soft/virtualMachine/",
        collapsible: true,
        children:
            [
                "vmwareWorkstation.md",
                "hyperv.md",
                "uos.md"
            ]
    },
    "/soft/photoshop.md"
]