<span class="mcalc_showhide_label">{{ item['label'] }}</span>
<a id="mcalc_{{ item['id'] }}_sh">[+]</a>
<div style="display:none" id="mcalc_{{ item['id'] }}_cont" class="mcalc_diagram_container">
    <img id="mcalc_{{ item['id'] }}" class="mcalc_diagram" src="{{ item['config']['file']  }}" alt="{{ item['config']['alt_text'] }}" /><br />
</div>