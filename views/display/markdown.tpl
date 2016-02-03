<div class="content singling" style="margin:1em;padding:1em;width:95%;">
    % if admin:
    <a href="{{ admin['url'] }}">Edit</a><br />
    % end

    <a href="/{{ xfile.url }}">View Raw</a>
        {{! xfile.text }}

    % if xfile.desc:
    <div class="display_desc">{{! xfile.desc }}</div>
    % end
</div>