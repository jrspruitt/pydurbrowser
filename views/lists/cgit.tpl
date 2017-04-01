% from browser.settings import editor_prefix
       <div class="tr">
            <div class="items item_name td item_file">
                <a href="/git/{{ item.url }}/">{{ item.name }}</a>
                % if hasattr(item, 'repo') or item.desc:
                % style = 'style="background-color:#CCC;"' if item.has_desc else ''
                <a id="{{ item.name }}_sh"  href="#" onclick="show_hide('{{! item.name }}')" {{! style }} class="show_hide_e"></a>
	                <div id="{{ item.name }}" class="desc">
	                   % if config.logged_in:
	                   <a href="/{{ editor_prefix }}{{ item.url }}">Edit CGit</a><br />
	                   % end
					    % if item.desc:
					    	{{! item.desc }}<br /><br />
					    % end

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
					</div>
                % end
            </div>
            <div class="items item_size td">Git Repo</div>
            <div class="items item_date td">{{ item.mtime }}</div>
       </div>
