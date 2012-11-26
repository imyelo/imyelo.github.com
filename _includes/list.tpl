		<div class="container ui-bg-light-img">
			<div class="list">
				{% for post in site.posts %}
					<li><a href="{{ BASE_PATH }}{{ post.url }}"><span>{{ post.title }}</span> <time>{{ post.date | date_to_string }}</time></a></li>
				{% endfor %}
			</div>
		</div>