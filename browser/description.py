import os
import markdown as md
from browser.settings import desc_ext, editor_prefix, creator_prefix

def get_desc(item, config, is_displayed=False):
        desc_path = '%s%s' % (item.path, desc_ext)
        dtext = '' 
        display = '' if not is_displayed else 'display'
        has_desc = False

        if config.user_admin:
            if os.path.exists(desc_path):
                dtype = 'Edit'
                prefix = editor_prefix
                has_desc = True
            else:
                dtype = 'Create'
                prefix = creator_prefix

            name = os.path.basename(desc_path).replace('.', '-')
            dtext = """<div>
                <form id="dedit-%s" action="/%s%s%s" method="POST">
                <input type="hidden" value="description" name="etype" />
                <input type="hidden" value="%s" name="display">
                <a class="edit_desc_link" onclick="$('#dedit-%s').submit();">%s Description</a>
                </form></div>""" % (name, prefix, item.url, desc_ext, display, name, dtype)

        if os.path.exists(desc_path):
            has_desc = True
            with open(desc_path, 'r', encoding='utf8') as f:
                try:
                    dtext += md.markdown(f.read().decode('utf-8'), ['tables'])
                except:
                    f.seek(0)
                    dtext += f.read()

        return dtext, has_desc
