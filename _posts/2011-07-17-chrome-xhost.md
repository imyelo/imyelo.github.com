---
layout: post
type: post
title: '解决chrome同步不能登录的问题'
category: Chrome
tags:
- chrome
- hostx
- '同步'
- '超时'
published: true
---

测试可用：

修改hosts文件

	#B#HostsX: HostsX Smart Direct/GoogleSync
	203.208.46.132 chrome.google.com
	203.208.46.132 clients2.google.com
	203.208.46.132 clients2.googleusercontent.com
	203.208.46.132 clients4.google.com
	74.125.39.99 clients4.google.com
	203.208.46.132 tools.google.com
	203.208.46.132 browsersync.google.com
	203.208.46.132 browsersync.l.google.com
	#E#HostsX: HostsX Smart Direct/GoogleSync

或者使用[HostX](http://orztech.com/softwares/hostsx)更新GAE转向数据

[出处](http://bbs.kafan.cn/forum.php?mod=redirect&goto=findpost&ptid=1030310&pid=20134941)