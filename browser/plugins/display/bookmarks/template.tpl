        <div class="tr">
            <div class="items item_name td item_file">
                <h2><a href="/{{ xfile.url }}">{{ bookmark['title'] }}</a></h2>
                <div>{{ bookmark['description'] }}</div><br />

                % if bookmark['items']:
                <ul>
                % for item in bookmark['items']:
                    <li><a href="{{ item['link'] }}" target="_blank">{{ item['title'] }}</a>
                    % if item['description']:
                    % id = item['title'].replace(' ', '')
                    <a id="{{ id }}_sh"  href="#" onclick="show_hide('{{! id }}')">[+]</a><br />
                    <div id="{{ id }}" class="desc">{{! item['description'] }}</div>
                    % else:
                        <br />
                    % end
                    </li>
                % end
                </ul>
                % end
            </div>
        </div>
