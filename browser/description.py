import os
import markdown as md
from browser.settings import desc_ext, editor_prefix, creator_prefix

def get_desc(item, config):
        desc_path = '%s%s' % (item.path, desc_ext)
        dtext = ""

        if config.logged_in:
            if os.path.exists(desc_path):
                dtext = '<a href="/%s%s%s">Edit Description</a>' % (editor_prefix, item.url, desc_ext)

            else:
                name = os.path.basename(desc_path).replace('.', '-')
                dtext = """
                        <form id="dedit-%s" action="/%s%s%s" method="POST">
                        <input type="hidden" value="description" name="etype" />
                        <a style="cursor:pointer;" onclick="$('#dedit-%s').submit();">Create Description</a>
                        </form><br />""" % (name, creator_prefix, item.url, desc_ext, name)

        if os.path.exists(desc_path):
            with open(desc_path, 'r') as f:
                try:
                    dtext += md.markdown(f.read().decode('utf-8'), ['tables'])
                except:
                    f.seek(0)
                    dtext += f.read()

        return dtext