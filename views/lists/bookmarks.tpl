        <link rel="alternate" type="application/rss+xml" title="{{ item.name }}" href="{{ item.url }}" />
        <div class="tr">
            <div class="items item_name td item_file">
                <a id="{{ item.name }}_sh"  href="#" onclick="show_hide('{{! item.name }}')" class="show_hide_e show_hide_has_desc">{{ item.name }}</a>
                <div id="{{ item.name }}" class="desc">
                    % if bookmark['description']:
                        {{! bookmark['description'] }}<br />
                        <hr />
                    % end
                    % if bookmark['items']:
                        <ul>
                        % for bmark in bookmark['items']:
                            <li><a title="{{! bmark['description'] }}" href="{{! bmark['link'] }}" target="_blank">{{! bmark['title'] }}</a></li>
                        % end
                        </ul>
                    % else:
                        No Bookmarks to Display.
                    % end
                    <hr />
                    % if admin:
                    <div><a class="edit_desc_link" href="{{ admin['url'] }}">{{ admin['name'] }}</a></div>
                    % end
                    {{! item.desc }}
                </div>
            </div>
            <div class="items item_size td">{{ item.size }}</div>
            <div class="items item_date td">{{ item.mtime }}</div>
        </div>
