       <div class="tr">
            <div class="items item_name td item_file">
                <a id="{{ item.name }}_sh"  href="#" onclick="show_hide('{{! item.name }}')" class="show_hide_e"></a>
                <a href="/{{ item.url }}/">{{ item.name }}</a>
                <div id="{{ item.name }}" class="desc">{{! item.desc }}</div>
            </div>
            <div class="items item_size td">{{ item.size }}</div>
            <div class="items item_date td">{{ item.mtime }}</div>
       </div>
