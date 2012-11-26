//

var init = function () {
	loadWindowSize();
};
// 首页自适应浏览器高度
var resizeFullHeight = function () {
	$('.full-height').height($(window).height());
};
// 垂直居中
var verticalCenter = function ($elem) {
	var $parent = $elem.parent(),
		top;
	top = ($parent.height() - $elem.height()) / 2;
	console.log($parent.height());
	console.log($elem.height());
	$elem.css({
		'position'	: 'absolute',
		'top'		: top,
		'text-align': 'center',
		'width'		: '100%'
	});
};
// 浏览器宽高改变时的事件
var loadWindowSize = function () {
	resizeFullHeight();
	verticalCenter($(".main"));
};


// jQuery
$(function(){

	init();

	$(window).resize(loadWindowSize);

	$(".logo-arrows").click(function() {
		$('body').animate({'scrollTop': $("#page").offset().top}, 300);
	});
	$("#page > .line-header > .go-header").click(function() {
		$('body').animate({'scrollTop': 0}, 300);
	});
});
