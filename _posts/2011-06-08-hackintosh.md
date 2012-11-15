---
layout: post
type: post
title: '成功给机子装上snow leopard 10.6.7'
category: Mac
tags:
- amd
- geforce
- hackintosh
- mac
- MacOSx
- nvidia
- osx
published: true
---

从周一晚回来,折腾了两天多终于算是把snow leopard装得差不多,加上各种课程设计累死了.  


## 硬件信息  
- 处理器名称  	DualCore AMD Athlon 64 X2, 2100 MHz (10.5 x 200) 4000+
- 主板名称  	Biostar NF61S Micro AM2 SE (2 PCI, 1 PCI-E x1, 1 PCI-E x16, 2 DDR2 DIMM, Audio, Video, LAN)
- 主板芯片组  	nVIDIA nForce 6100-405, AMD Hammer
- 系统内存  	960 MB (DDR2-667 DDR2 SDRAM)
- 显示卡  	NVIDIA GeForce 6100 nForce 405 (256 MB)
- 声卡    Realtek ALC862 @ nVIDIA MCP61 - High Definition Audio Controller
- 键盘  	标准 101/102 键或 Microsoft 自然 PS/2 键盘
- 鼠标  	HID-compliant mouse
- 网络适配器  	NVIDIA nForce 10/100 Mbps Ethernet

老机子, AMD,NV G6系列,PS2键+USB鼠,NV nForce Ethernet


## 安装  
端午回家的时候让嘉骏帮忙下了[东皇3.2的镜像](http://bbs.pcbeta.com/viewthread-821280-1-2.html).
远景里有[详细的说明](http://www.memac.cn/read-mac-tid-8774-page-1.html).

**自定义选项**  

	建立/extra/com.apple.boot.plist
	arch=i386        // 这个很重要,因为这个选项见识了五国风火轮神马的
	timeout=3
	usbfix=yes
	chameleon rc5
	legacy
	补丁默认
	显卡NVinject
	声卡VoodooHDA v2.7
	网卡"万能"
	PS2Controller
	AppleNForceATA
	USB驱动回滚
	实用工具我是全选了,至少把OSX86Tools选上吧


为了方便安装驱动, 可以使用[kext helper](http://www.google.com.hk/search?q=kext+helper).


如果网卡有问题, 尝试[nForceLan](http://www.memac.cn/read-mac-tid-7186.html).


显卡有另一个驱动: [NVdarwin256M](http://www.memac.cn/read.php?tid=461), 
装上以后能正常显示型号. 如果不需要的话也可以只安装NVinject.


## 未解决的问题
1. 不知道为什么网卡驱动装好后,我在系统概述里也看不到网卡.  
但在系统偏好设置-网络中可以看到以太网.
2. 安装了显卡驱动, 但不能改分辨率, 也没有开启qe ci.  
分辨率设置方法: 

	进系统偏好设置-Chameleon,Peripherals,将Graphics Mode改成1280*1024*32


## 10.6.7升级

先下载[10.6.7 Combo包](http://supportdownload.apple.com/download.info.apple.com/Apple_Support_Area/Apple_Software_Updates/Mac_OS_X/downloads/061-9525.20110321.BgAsr/MacOSXUpdCombo10.6.7.dmg). (现在利用学校限速的bug下东西能上1Mb/s好爽哈哈哈哈)


升级前务必备份一次kernel和extensions(OSX86Tools派上用场).  
升级包安装完成后不能马上点重启, 必须在重启前恢复刚刚备份的kernel和extensions.

## 2011-06-10更新

### 几个kext的dbank载点
- [NVdarwin_256mb](http://dl.dbank.com/c0e9u7gktd)
- [nForceLan](http://dl.dbank.com/c0hr9idkc0)

### 用于snow leopard10.6.7的内核
[下载 legacy_kernel-10.7.0](http://dl.dbank.com/c0zlxyq3nz)  
文件名改为`mach_kernel`, 并替换至根目录即可. 
或者使用legacy_kernel.bz2内的pkg安装.  

[下载 kext_helper_b7](http://dl.dbank.com/c05d8uqx61)
