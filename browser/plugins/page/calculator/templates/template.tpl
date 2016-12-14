% from browser.settings import editor_prefix

<div id="mcalc">
    <div id="mcalc_xy_floater" class="mcalc_xy_floater"></div>
    <div class="content singling">
    
    % for item in calc_items:
    <div class="mcalc_containers single">
        {{! item }}
    </div>
    % end
    
        <div class="mcalc_control_container">
            <div class="mcalc_control_menu">
                <span> 
                    <button id="mcalc_control_set" class="mcalc_control_set">Set</button>
                    <button id="mcalc_control_default" class="mcalc_control_menu_button">Defaults</button>&nbsp;&nbsp;
                    <button id="mcalc_control_si" class="mcalc_control_menu_button">SI</button>&nbsp;
                </span>
                <span>
                    <select id="mcalc_round" onclick="mc.control_round_all(this.options[this.selectedIndex].value);"></select>
                </span>
                <span> 
                    <button class="mcalc_control_menu_button" onclick="mc.control_clear_inputs();">Clear</button>
                </span>
            </div>
        </div>
    </div>
</div>
% if page.config.logged_in:
<div>
    <a href="/{{ editor_prefix }}{{page.config.url}}/_calc/calc.js">Edit Javascript</a>
</div>
% if page.readme:
<div class="content table">
    <div class="content_container" style="margin:1em;padding:1em;width:95%;">
        {{! page.readme }}
    </div>
</div>
% end
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
