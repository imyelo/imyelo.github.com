---
layout: post
type: post
title: 'XCode中修改缺省公司名称/开发人员名称'
category: Objective-C
tags: 
- obejctive-c
- xcode
- organization 
- '注释'
published: true
---
**原文出处**: [http://wooce.iteye.com/blog/1071459](http://wooce.iteye.com/blog/1071459)


1. XCode新建文件后，头部会有开发人员名称，公司名称等信息  

		// Created by y on 7/30/11.  
		// Copyright 2011 imYelo.com. All rights reserved.

	要修改这两个名称可通过在terminal中运行以下命令：

		defaults write com.apple.Xcode PBXCustomTemplateMacroDefinitions'{"ORGANIZATIONNAME" = "imYelo.com";}'
		defaults write com.apple.Xcode ORGANIZATIONNAME "Yelo"

		defaults write com.apple.Xcode FULLUSERNAME "your name"
		defaults write com.apple.Xcode PBXCustomTemplateMacroDefinitions'{FULLUSERNAME = "your name" ; }'

		使用defaults write com.apple.Xcode ... 其实是在修改~/Library/Preferences/com.apple.Xcode.plist

2. Xcode3.2开始，右击项目 -> Get Info -> General里面可以为每个项目设置Organization Name
