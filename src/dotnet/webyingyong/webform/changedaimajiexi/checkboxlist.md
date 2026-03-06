---
title: CheckBoxList
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: checkboxlist
slug: nl6p4a
docsId: '31541768'
---
后台让CheckBoxList默认一下选项 选中
 string[] reasons = info.h_reason.Split(new char[] { ',' });
                        for (int i = 0; i < reasons.Length; i++)
                        {
                            for (int j = 0; j < CheckBoxList1.Items.Count; j++)
                            {
                                if (reasons[i] == CheckBoxList1.Items[j].Value)
                                {
                                   CheckBoxList1.Items[j].Selected = true;
                                }
                            }
                        }
后台获取选中项
     string reason = ",";
            for (int i = 0; i < CheckBoxList1.Items.Count; i++)
            {
                if (CheckBoxList1.Items[i].Selected)
                {
                    reason = reason + CheckBoxList1.Items[i].Value + ",";
                }
            }
 
