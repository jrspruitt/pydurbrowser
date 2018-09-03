% from browser.settings import editor_prefix
       <div class="tr">
            <div class="items item_name td item_file">
                <a id="{{ item.name }}_sh"  href="#" onclick="show_hide('{{! item.name }}')" style="background-color:#CCC;" class="show_hide_e"></a>
                <a href="/git/{{ item.url }}/">{{ item.name }}</a>
	                <div id="{{ item.name }}" class="desc">
	                   % if config.user_admin:
	                   <a href="/{{ editor_prefix }}{{ item.url }}">Edit CGit</a><br />
	                   % end
					    {{! item.cgit_desc }}<br /><br />

						% if hasattr(item, 'repo'):
							% if 'commit' in item.repo:
								<b>Latest Commit:</b><br />
								Commit: <a href="/git/{{! item.url }}/commit/?id={{! item.repo['commit']['hash'] }}">{{ item.repo['commit']['hash'] }}</a><br />
								Author: <a href="mailto:{{! item.repo['commit']['email'] }}">{{ item.repo['commit']['name'] }}</a><br />
								% for msg in item.repo['commit']['msgs']:
									<span class="tab">{{! msg }}</span><br />
								% end
								<br />
							% end
	
							% if 'branches' in item.repo:
								<b>Branches:</b><br />
								% for name in item.repo['branches']['names']:
									<span class="tab">
									% if name == item.repo['branches']['selected_branch']:
										*
									% end
									<a href="/git/{{! item.url }}/tree/?h={{! name }}">{{ name }}</a>
									</span><br />
								% end
					    % end
					    {{! item.desc }}<br /><br />
					</div>
            </div>
            <div class="items item_size td">Git Repo</div>
            <div class="items item_date td">{{ item.mtime }}</div>
       </div>
