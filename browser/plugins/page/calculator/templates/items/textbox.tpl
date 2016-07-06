% if item['label']:
<span class="mcalc_label">{{ item['label'] }}</span>
% end
<div class="mcalc_textbox_container">
    <textarea id="mcalc_{{ item['id'] }}" class="mcalc_textbox"></textarea><br />
</div>
