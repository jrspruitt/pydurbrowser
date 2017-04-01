        <div class="tab">
            <h2><a href="/{{ xfile.url }}">{{ bookmark['title'] }}</a></h2>
            <div>{{ bookmark['description'] }}</div><br />

            % if bookmark['items']:
            <ul>
            % for item in bookmark['items']:
                <li><a href="{{ item['link'] }}" target="_blank">{{ item['title'] }}</a>
                % if item['description']:
                <a id="{{ item['id'] }}_sh"  href="#" onclick="show_hide('{{! item['id'] }}')">[+]</a><br />
                <div id="{{ item['id'] }}" class="desc">{{! item['description'] }}</div>
                % else:
                    <br />
                % end
                </li>
            % end
            </ul>
            % end
        <br />
        % if admin:
        <div><a href="{{ admin['url'] }}">{{ admin['name'] }}</a></div>
        % end
        </div>
        
