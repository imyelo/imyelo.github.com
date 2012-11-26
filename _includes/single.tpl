		<div class="container ui-bg-light-img">
			<div class="content">
				<h1><a href="{{page.url}}">{{page.title}}</a></h1>
				<article class="article">
					{{content}}
				</article>
			</div>
			<aside class="aside">
				<pre>
/**
   * ctime : {{page.date | date_to_string}}
   * author : yelo
   * category : {{page.categories}}
   */
  
{% if page.previous %}<a href="{{page.previous.url}}">$this -> go(previous_post);</a>{% endif %}
{% if page.next %}<a href="{{page.next.url}}">$this -> go(next_post);</a>{% endif %}
				</pre>
			</aside>
		</div>