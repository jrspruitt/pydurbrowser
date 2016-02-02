% from browser.settings import editor_prefix, creator_prefix, show_editors, config_filename
% config_action = 'New'
% if item.config.is_parent:
    % config_action = 'Edit'
% end
<a href="{{'/%s' % (os.path.join(editor_prefix, item.config.url, config_filename)) }}">{{ config_action }} Config</a> 

% if show_editors:
 | <form style="display:inline" action="/{{ creator_prefix }}" method="POST" onsubmit="return creator_valid()">
    <select id="etype" name="etype">
        <option value="">File Type</option>
        <option value="" disabled>-----------</option>
    % for eplugin in show_editors:
        <option value="{{ eplugin }}">{{ eplugin }}</option>
    % end
    </select>
    <input type="submit" value="Create" />
</form>
% end