    <div class="tr">
        <div class="items item_name td item_file">
            <a href="/{{ item.url }}">
                <img class="group" src="/{{ item.thumb_url }}" width="100" /> {{ item.name }}                
            </a>
            % if item.desc:
            <a id="{{ item.name }}_sh"  href="#" onclick="show_hide('{{! item.name }}')">[+]</a>
            <div id="{{ item.name }}" class="desc">{{! item.desc }}</div>
            % end
        </div>
        <div class="items item_size td">{{ item.size }}</div>
        <div class="items item_date td">{{ item.mtime }}</div>
    </div>
