
// 云原生

export const cloudSidebar = [
    "readme.md",
    "myImages.md",
    {
        text: "CI&CD",
        prefix: "/cloud/ciAndCd/",
        collapsible: true,
        children: [
            "readme.md",
            "gitliuchenghedevopsliucheng.md",
            {
                text: "Jenkins",
                prefix: "/cloud/ciAndCd/jenkins/",
                collapsible: true,
                children: [
                    "readme.md",
                    "changyongchajian.md",
                    "yuanchengbushu.md",
                    "jenkinspeizhi.md",
                    {
                        text: "部署",
                        prefix: "/cloud/ciAndCd/jenkins/release/",
                        collapsible: true,
                        children: ["freeStyle.md",
                            "goujianliushuixianxiangmu.md",
                            "tongguogouzizidongfabu.md"]
                    },
                    {
                        text: "安装jenkins",
                        prefix: "/cloud/ciAndCd/jenkins/install/",
                        collapsible: true,
                        children: [
                            "windowsInstall.md",
                            "linuxInstall.md",
                            "dockerInstall.md",
                            "dockerInstallContainsDotNet.md",
                            "installIssue.md"]
                    }]
            },
            {
                text: "Gitlab",
                prefix: "/cloud/ciAndCd/gitlab/",
                collapsible: true,
                children:
                    [
                        "sampleOperator.md",
                        "gitlabrunner.md",
                        "pipeline.md",
                        "giitlabdeyml.md",
                        "install.md",
                        "issue.md"
                    ]
            },
            {
                text: "GitHub",
                prefix: "/cloud/ciAndCd/github/",
                collapsible: true,
                children: ["readme.md",
                    "bushu_netfuwu.md",
                    "githubactionshengchengjingxiangbingbushu.md"]
            },
            {
                text: "AzureDevOpsServer",
                prefix: "/cloud/ciAndCd/azuredevopsserver/",
                collapsible: true,
                children: ["readme.md"]
            },
            "flubucore.md",
            "teamcity.md"]
    },
    {
        text: "容器",
        prefix: "/cloud/container/",
        collapsible: true,
        children: [
            "readme.md",
            {
                text: "Docker",
                prefix: "/cloud/container/docker/",
                collapsible: true,
                children: [
                    "readme.md",
                    "concept.md",
                    "commonCommand.md",
                    "dockerfileGenerator.md",
                    "dockerfileOperator.md",
                    "images.md",
                    "dockerbushunetcore.md",
                    "markSmallImage.md",
                    "scripts.md",
                    "issue.md",
                    {
                        text: "安装",
                        prefix: "/cloud/container/docker/install/",
                        collapsible: true,
                        children:
                            [
                                "windowsInstall.md",
                                "linuxInstall.md"
                            ]
                    }]
            },
            {
                text: "Podman",
                prefix: "/cloud/container/podman/",
                collapsible: true,
                children: [
                    "readme.md",
                    "install.md"
                ]
            },
            {
                text: "Docker-Compose",
                prefix: "/cloud/container/dockerCompose/",
                collapsible: true,
                children: ["readme.md",
                    "peizhiwenjian.md",
                    "changyongjiaoben.md",
                    "linuxInstall.md",
                    "composeIssue.md"]
            },
            {
                text: "操作",
                prefix: "/cloud/container/operators/",
                collapsible: true,
                children: [
                    "readme.md",
                    "portainer.md"
                ]
            }
        ]
    },
    "dockerswarm.md",
    "dapr.md",
    {
        text: "K8s",
        prefix: "/cloud/k8s/",
        collapsible: true,
        children: [
            "readme.md",
            "commonConcepts.md",
            "networkCommunication.md",
            "serviceDiscovery.md",
            "yamlOperator.md",
            {
                text: "K3s",
                prefix: "/cloud/k8s/k3s/",
                collapsible: true,
                children: [
                    "readme.md",
                    "install.md",
                    "k3sDeployKuboard.md"
                ]
            },
            "k9s.md",
            {
                text: "示例",
                prefix: "/cloud/k8s/sample/",
                collapsible: true,
                children: [
                    "k8sBuildNetCore.md",
                ]
            },
            "gitlabk8scicd.md",
            {
                text: "安装",
                prefix: "/cloud/k8s/install/",
                collapsible: true,
                children: [
                    "readme.md",
                    "minikube.md",
                    "rancher.md",
                    "rainbond.md"]
            }]
    },
    {
        text: "Istio",
        prefix: "/cloud/istio/",
        collapsible: true,
        children: ["readme.md"]
    }];