<span class="mcalc_button_container">
    <button id="mcalc_graph_btn_{{ item['id'] }}" class="mcalc_calcbutton">Graph</button>
</span>
<span class="mcalc_input_container">
    <span class="mcalc_showhide_label">{{ item['label'] }}</span>
</span>
<span class="mcalc_units_container">
    <a id="mcalc_{{ item['id'] }}_sh">[+]</a>
</span>

<div style="display:none" id="mcalc_{{ item['id'] }}_cont" class="mcalc_graph_container">
<canvas width='380' height='400' class="mcalc_graph" id="mcalc_{{ item['id'] }}">Your Browser Does Not Support Canvas.</canvas>
</div>
