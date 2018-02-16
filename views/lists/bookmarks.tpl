        <link rel="alternate" type="application/rss+xml" title="{{ item.name }}" href="{{ item.url }}" />
        <div class="tr">
            <div class="items item_name td item_file">
                <a id="{{ item.name }}_sh"  href="#" onclick="show_hide('{{! item.name }}')" style="background-color:#CCC;" class="show_hide_e"></a>
                <a href="/{{ item.url }}">{{ item.name }}</a>
                <div id="{{ item.name }}" class="desc">
                    % if bookmark['description']:
                        {{! bookmark['description'] }}<br />
                        <hr />
                    % end
                    <ul>
                    % for bmark in bookmark['items']:
                        <li><a href="{{! bmark['link'] }}" target="_blank">{{! bmark['title'] }}</a></li>
                    % end
                    </ul>
                    <hr />
                    {{! item.desc }}
                </div>
            </div>
            <div class="items item_size td">{{ item.size }}</div>
            <div class="items item_date td">{{ item.mtime }}</div>
        </div>
