<span class="mcalc_button_container">
% if item['config']['button'] == '1':
    <button class="mcalc_calcbutton" id="mcalc_{{ item['id'] }}_btn">{{ item['label'] }}</button>
% else:
    <span class="mcalc_nobutton_label">{{ item['label'] }}</span>
% end
</span>
<span class="mcalc_input_container">
    <input onfocus="this.select();" class="mcalc_input" type="text" id="mcalc_{{ item['id'] }}" value="{{ item['config']['display']['value'] }}" />
</span>
<span class="mcalc_units_container">
    %if 'units' in item['config']['display']:
        <select class="mcalc_select" id="mcalc_{{ item['id'] }}_unit_select"></select>
    % else:
        <span class="mcalc_noselect_label">{{ item['config']['display']['static'] }}</span>
    % end
</span>
