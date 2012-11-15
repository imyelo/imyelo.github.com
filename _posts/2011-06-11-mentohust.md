---
layout: post
type: post
title: '在OSX使用锐捷认证的校园网'
category: Mac
tags:
- MacOSx
- mentohust
- ruijie
published: true
---

华立上网用的客户端叫安腾网络,应该和锐捷差不多吧


下载[mentohust_mac.tar.gz](http://code.google.com/p/mentohust/downloads/list)

解压后用终端执行：

	sudo su
	/mentohust_mac/mentohust -ugg110109010xx -ppassword -nen0 -a0 -d2 -l1 -i10.110.83.xx -m255.255.255.0 -g10.110.83.254 -s10.110.3.3 202.96.128.86 -e780 -r120 -o8.8.8.8 -w

详细的说明在用mentohust -h查看  
似乎华立现在的网可以选不使用dhcp，也就是-d0  

目前测试的结果是，提示发送心跳包以后，会一直发送用户名超时(原因不清楚)，但已经可以上网。  
这时心跳包应该是发送失败的，之后再过14分钟后必定会断网（服务器的设置吧），重新执行一次/mentohust_mac/mentohust 即可。  
虽然麻烦，不过目前只能这样了，不知道有没有更好的解决方法。


另外在osx下的客户端还有一个叫[RuijieClient](http://code.google.com/p/ruijieclient/), 不知道好用不。
