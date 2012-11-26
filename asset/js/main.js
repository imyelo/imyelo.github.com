// jQuery
$(function(){

	// init();

	// $(window).resize(loadWindowSize);

	// arrows
	$(".logo-arrow").click(function() {
		$('body').animate({'scrollTop': $(".header").offset().top}, 400, 'linear');
	});

	// Code highlight
	$("pre > code").each(function () {
		var html = $(this).html(),
			$parent = $(this).parent('pre');
		$(this).empty().remove();
		$parent.html(html).addClass('brush: js');
	});
	SyntaxHighlighter.all();

	// icon link
	$(".icon-sina").wrap('<a href="http://weibo.com/iimyelo" target="_blank"></a>');
	$(".icon-github").wrap('<a href="https://github.com/imyelo" target="_blank"></a>');
	$(".logo-letter").wrap('<a href="http://imyelo.github.com"></a>');
});
