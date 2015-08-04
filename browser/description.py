import os
from markdown import markdown
from browser.settings import desc_ext, editor_prefix

def get_desc(item, config):
        desc_path = '%s%s' % (item.path, desc_ext)
        dtext = ''

        if config.logged_in:
            try:
                import browser.plugins.editors.markdown
                dtext = '<a href="/%s%s%s">Edit</a><br />' % (editor_prefix, item.url, desc_ext)
            except ImportError, e:
                pass

        if os.path.exists(desc_path):
            with open(desc_path, 'r') as f:
                try:
                    dtext += markdown(f.read().decode('utf-8'), ['tables'])
                except:
                    f.seek(0)
                    dtext += f.read()

        return dtext