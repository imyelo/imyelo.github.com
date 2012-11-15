---
layout: post
type: post
title: '列表堕加载autoLoadNextPage.js'
categories: ['Javascript', 'HTML5']
tags:
- jquerymobile
- thinkphp
- thinksns
- lazy
- '堕加载'
published: true
---

最近的写了一个堕加载列表的脚本, 适用于thinkphp&jquerymobile的框架. 如果不是这个组合, 稍作修改也同样适用。

## 使用

### 0. 导入

导入autoLoadNextPage.js:  

	<script src="https://github.com/imyelo/autoLoadNextPage/blob/master/autoLoadNextPage.js"></script>

### 1. 调用

调用十分简单, 如:

	var autoLoad = new autoLoadNextPage("{:U('w3g/Message/load')}&type={$_REQUEST['type']}&{:C('VAR_PAGE')}=", "ul#msgUl", "nav#more").updateList().bindBottom();

当然也可以这么写:

	dataUrl = "{:U('w3g/Message/load')}&type={$_REQUEST['type']}&{:C('VAR_PAGE')}=";
	dataUl = "ul#msgUl";
	dataMore = "nav#more";
	var autoLoad = new autoLoadNextPage(dataUrl, dataUl, dataMore);
	autoLoad.updateList();
	autoLoad..bindBottom();

提供分页内容的文件输出JSON，格式为`{html:"分页内容", nextpage:下一页页码}`, 若使用thinkphp框架, 可以在tpl内照常编写html文件, action的最后不使用`$this->display();`而是 :

	output['html'] = $this->fetch();
	output['nextpage'] = nextPage;
	json_encode($output);

## 源码
[Github](https://github.com/imyelo/autoLoadNextPage)  
2012.09.23, @yelo
