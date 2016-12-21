% from browser.settings import editor_prefix
% if page.config.logged_in:
<div>
    <a href="/{{ editor_prefix }}{{page.config.url}}/_calc/calc.js">Edit Javascript</a><br />
    <a href="/{{ editor_prefix }}{{page.config.url}}/_calc/calc.json">Edit Config</a>
</div>
% end

<div id="mcalc"></div>

% if page.readme:
<div class="content table">
    <div class="content_container" style="margin:1em;padding:1em;width:95%;">
        {{! page.readme }}
    </div>
</div>
<div class="content_container">
% if page.items:
    <div class="content table">
        <div class="item_heading tr">
            <div class="items item_name td">Name</div>
            <div class="items item_size td">Size</div>
            <div class="items item_date td">Date</div>
    </div>

    % for item in page.items:
        {{! item.display }}
    % end
% end
</div>
