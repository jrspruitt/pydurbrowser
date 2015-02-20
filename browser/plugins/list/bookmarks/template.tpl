        <link rel="alternate" type="application/rss+xml" title="{{ item.name }}" href="{{ item.url }}" />
        <div class="tr">
            <div class="items item_name td item_file">
                <a href="/{{ item.url }}">{{ item.name }}</a>
                % if item.links:
                <ul>
                % for link in item.links:
                    <li><a href="{{ link['link'] }}" target="_blank">{{ link['title'] }}</a></li>
                % end
                </ul>
                % end
            </div>
            <div class="items item_size td">{{ item.size }}</div>
            <div class="items item_date td">{{ item.mtime }}</div>
        </div>
