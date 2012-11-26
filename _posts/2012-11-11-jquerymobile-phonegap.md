---
layout: post
type: post
title: 'JQueryMobile + PhoneGap 经验小结' 
categories: ['Javascript', 'HTML5']
tags:
- jquerymobile
- javascript
- phonegap
- html5
- webapp
published: true
---

## 1. pageinit & pageshow   
JQM的官方手册重点提醒了[使用$(document).bind('pageinit')代替$(document).ready()][1.1.1]。  
但当你需要对某一个页面(page)编写其独享的Javascript脚本时, 选择器应该选择的是该**page层**, 而不是document, 并使用``live()``添加事件处理器。这在ajaxEnable=true的情况下尤为重要。  

*[View Demo][1.1.1.Demo]*  
*JS :*

	$(document).bind('pageinit', function () {
		console.log('任意一个页面初始化时响应');
	});
	$(document).bind('pageshow', function () {
		console.log('任意页面被显示时响应')
	});
	$("#hello").live('pageinit', function () {
		console.log('只响应id为hello的页面初始化');
	});
	$("#hello").live('pageshow', function () {
		console.log('只响应id为hello的页面被显示');
	});

*Html :*

	<body>
		<div id='hello' data-role='page'>
			<div data-role="content"><a href="#world" data-role="button">Next</a></div>
		</div>
		<div id='world' data-role='page'>
			<div data-role="content"><a href="#hello" data-role="button">Previous</a></div>
		</div>
	</body>

关于JQM事件的总结可以参考[JQM脚本的引用及脚本写法经验][1.1.1.event]。  

## 2. refresh  
通过脚本修改JQM页面数据时, 通常需要再进行一次refresh。可以根据不同的类型选择以下对应的方法。

	$('div#id').trigger('refresh');
	$('ul#id').listview('refresh');
	$('button#id').button('refresh');
	$('input#id[type=checkbox]').checkboxradio('refresh');

还有更多的可以参考[JQM的界面数据刷新][1.1.2]。  

## 3. tap  
JQueryMobile在Android设备上的tap事件会出现多次触发的问题, 对此可以参考[Ghost Click][1.1.3]。   
我们的解决方案是使用[Google FastButton][1.1.3.fastbutton],
将原来需要用tap的地方改用fastbutton处理。  

## 4. taphold  
检查[jquery.mobile-1.2.0.js][JQM-1.2.0], 1722行。  

	timer = setTimeout( function() {
		triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
	}, $.event.special.tap.tapholdThreshold );	

在触发taphold事件时没有清除handlers, 所以当taphold事件后, 本不应该被触发的tap事件也被触发了。  
暂时修复的方案是在1722行添加: 

	timer = setTimeout( function() {
		clearTapHandlers();		// <---- + 这一行
		triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
	}, $.event.special.tap.tapholdThreshold );	

这个bug存在于JQM1.2.0及以下版本。  

## 5. swipe  
JQM的swipe响应也是非常慢/诡异, 如果需要使用swipe事件, 建议寻找其他代替的方案, 如[TouchSwipe][1.1.5]。  

## 6. popup  
你可以选择在脚本中生成popup, 并通过``popup('open')``及``popup('close')``进行打开/关闭, 借此可以实现很多实用的功能。  
如以下模拟confirm的效果:  
	
    var confirm = function (content, title, response) {
        var html = "<div data-role='popup' id='mToast_confirm' data-theme='d' data-overlay-theme='b' style='max-width:340px;overflow:hidden;'><div class='ui-header ui-bar-a ui-corner-top'><h1 class='ui-title'>" + title + "</h1></div><div class='ui-content'><p></p>" + content + "<p></p><a data-role='button' data-inline='true' data-rel='back' data-mini='true'>取消</a><a id='mToast_confirm_response' data-role='button' data-theme='b' data-icon='check' data-inline='true' data-mini='true'>确定</a></div></div>",
            previous = $(".ui-popup-active div[data-role=popup]"),
            divConfirm = $("div#mToast_confirm");
        previous.popup('close');
        if (divConfirm.length > 0) {
            divConfirm.remove();
        }
        divConfirm = $(html).appendTo("div[data-role=page]:first");
        divConfirm.trigger('create')	// <-- 生成popup
            .trigger('refresh')
            .popup()
            .find("#mToast_confirm_response").on('fastClick', function () {
                divConfirm.popup('close');
                previous.popup('open');
                response();
            });
        divConfirm.popup('open');	// -->
	};

	confirm('are you sure?', 'Confirm', function () {
		alert('sure');
	});

需要注意的是``popup('open')``前需要对div进行``.trigger('create').trigger('refresh').popup()``。  


此外, **``$.mobile.popup.active``**也非常实用, ``$.mobile.popup.active.element[0]``将返回当前显示的popup层对象。  

## 7. data-rel=back  
当你发现使用``data-rel=back``的返回按钮响应速度难以忍受的时候, 可以为这个按钮单独绑定一个事件处理器。  
如以下脚本将加快header上的返回按钮响应速度:

	$(document).bind('pageinit', function(){
        $("div[data-role=page] > div[data-role=header] > a[data-rel=back]").bind( "fastClick", function( event ) {
            $.mobile.back();
            return false;
        });
    });

但这并不是一个好的解决方案, 如果你对``back-rel=back``的处理感兴趣可以查看[jquery.mobile-1.2.0.js][JQM-1.2.0] : 4141行。如果有更好的解决方案请[告知我][zhihuzeye@gmail.com]^_^。  

## 8. BackButton (PhoneGap + JQM)  
在PhoneGap+JQM的方案下, 发现Android手机上的返回硬键无效或者对popup的处理不正确时(多为ajaxEnable=false的情况), 加入以下脚本: 

	document.addEventListener("deviceready", backKeyListener, false);
	function backKeyListener() {
		document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
	        try {
	            if ($.mobile.popup.active) {
	                var popupDiv = $.mobile.popup.active.element;
	                popupDiv.each(function () {   
	                    if ($(this).parent().hasClass('ui-popup-active')) {
	                        $(this).popup('close');
	                        return false;
	                    }
	                });
	            } else {
	                $.mobile.back();
	                return false;
	            }
	        } catch (e) {
	            console.log('BackButton Listener Catch : ' + e);
	        }
	    }
	} 

如果这段脚本不起作用, 请再参考[第十条经验](#10-mobileback), 对phonegapNavigation进行设置。  

## 9. $.mobile.loading  
建议把``$.mobile.showPageLoadingMsg()``以及``$.mobile.hidePageLoadingMsg()``的脚本改为``$.mobile.loading('show')``以及``$.mobile.loading('hide')``。  
这个方法同样可以配置内容、样式等参数: ``$.mobile.loading('show', {text : 'test', theme : 'a'});``。  
更多的信息参考[JQM API - methods中的描述][1.1.9]。  

## 10. $.mobile.back()  
如果你是使用PhoneGap + JQueryMobile进行开发, 设定了``ajaxEnable=false``, 并且发现``$.mobile.back()``无效, 那么请尝试设定``phonegapNavigationEnable=true``。  
当该值为true时, $mobile.back()会使用``nav.app.backHistory();``, 否则使用``window.history.back();``。  
但这个参数也 **仅** 建议在ajaxEnable=false的情况下进行设置。  
更多的信息可以参考[JQM API - globalConfig中的描述][1.1.10]。  

## 11. ajaxEnable  
如果希望使用PhoneGap将应用打包为app, 我的建议是, **尽量使用``ajaxEnable=true``**, 否则体验十分不好, 而且你还会遇到更多的问题。  
此外应该给每一个page设定id, 并遵循[第一条建议](#1-pageinit-pageshow)。

## 12. 页面跳转    
请使用``$.mobile.changePage()``代替``window.location.href``。  
如果要刷新当前页面呢? 我的方法是: 
		
	$.mobile.changePage($.mobile.activePage.jqmData('url'), {reloadPage : true});

但这理应不是最好的方法, 如果你有更好的方法请[告知我^_^][zhihuzeye@gmail.com]。

## 13. 慎重选择JQueryMobile
如你所见, 使用JQM + PhoneGap进行WebApp开发会遇到许多问题。
但JQM目前还是只适合做简单的WebApp, 如果坚持做复杂, 其效率将会十分堪忧。  
当然, 如果你选择了一个正确的方式, 那其中大部分都可以避免。  
此外, Github上有许多项目对基于JQM的开发会有很大的帮助。  

1. [The-M-Project][The-M-Project]  
The-M-Project的UI基于JQM, 但其拥有更好的结构, 并实现了一些你可能会需要的功能。[其文档][1.1.13.m.doc]也十分健全, 你可以查看其[更详细的介绍][1.1.13.m.intro]。你不一定使用这个框架, 但在JQM的开发上, 这个项目有许多值得借鉴的地方。
2. [persistencejs][persistencejs]  
离线数据的库, 这里有一个[结合JQM的Demo][1.1.13.p.demo]。
3. [artTemplate][artTemplate]  
出自腾讯CDC的javascript模板引擎。


尽管如此, 我在上一个JQMApp中并没有用到这几个项目^_^。  




# Releaese: 
first version @ 2012.11.10  
[yelo][0]



[0]: 	http://imyelo.com 	"imYelo"
[zhihuzeye@gmail.com]: 	mailto:zhihuzeye@gmail.com 	"zhihuzeye@gmail.com"
[JQM-1.2.0]: 	http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.js 	"jquery.mobile-1.2.0.js"
[1.1.1]: 	http://jquerymobile.com/demos/1.2.0/docs/api/events.html 	"Use $(document).bind('pageinit'), not $(document).ready()"
[1.1.1.Demo]: 	./111demo.html	"111 Demo"
[1.1.1.event]: 	http://blog.csdn.net/lyatzhongkong/article/details/6969913 	"JQM脚本的引用及脚本写法经验"
[1.1.2]: 	http://blog.csdn.net/lyatzhongkong/article/details/6969948	"JQM的界面数据刷新"
[1.1.3]: 	https://developers.google.com/mobile/articles/fast_buttons#ghost 	"Creating Fast Buttons for Mobile Web Applications"
[1.1.3.fastbutton]: 	https://github.com/alexblack/google-fastbutton 	"Google FastButton"
[1.1.5]: 	https://github.com/mattbryson/TouchSwipe-Jquery-Plugin 	"TouchSwipe-Jquery-Plugin"
[1.1.9]: 	http://jquerymobile.com/demos/1.2.0/docs/api/methods.html 	"JQueryMobile API - Methods"
[1.1.10]: 	http://jquerymobile.com/demos/1.2.0/docs/api/globalconfig.html 	"JQueryMobile API - GlobalConfig"
[1.1.13.m.doc]: 	http://panacodalabs.github.com/The-M-Docs/ 	"The-M-Docs"
[1.1.13.m.intro]: 	http://panacodalabs.github.com/The-M-Docs/#introduction/what_is_the_m_project "What is The-M-Project?"
[1.1.13.p.demo]: 	https://github.com/zefhemel/persistencejs/tree/master/demo/jquerymobile 	"Demo of Persistencejs + JQueryMobile "
[The-M-Project]: 	https://github.com/mwaylabs/The-M-Project 	"The-M-Project"
[persistencejs]: 	https://github.com/zefhemel/persistencejs 	"persistencejs"
[artTemplate]: 	https://github.com/aui/artTemplate 	"artTemplate"

[2.1.1]: 	https://www.ibm.com/developerworks/cn/web/1011_guozb_html5off/ 	"使用 HTML5 开发离线应用"