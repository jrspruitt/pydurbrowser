        <div class="tab">
            <h2><a class="first_color" href="/{{ xfile.url }}">{{ bookmark['title'] }}</a></h2>
            % if bookmark['description']:
            <div>{{ bookmark['description'] }}</div><br />
            % end

            % if bookmark['items']:
            <ul>
            % for item in bookmark['items']:
            
                <li>
                % has_desc = 'show_hide_has_desc' if item['description'] else ''
                <a id="{{ item['id'] }}_sh"  href="#" onclick="show_hide('{{! item['id'] }}')" class="show_hide_e {{ !has_desc }}"></a>
                <a href="{{ item['link'] }}" target="_blank">{{ item['title'] }}</a>
                % if item['description']:
                <div id="{{ item['id'] }}" class="desc">{{! item['description'] }}</div>
                % else:
                    <br />
                % end
                </li>
            % end
            </ul>
            % end
            <hr />
        <br />
        % if admin:
        <div><a href="{{ admin['url'] }}">{{ admin['name'] }}</a></div>
        % end
        </div>
        
