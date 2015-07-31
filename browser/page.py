##############################################################################
#    PyDurBrowser
#
#    Copyright (c) 2014 Jason Pruitt <jrspruitt@gmail.com>
#
#    This file is part of PyDurBrowser.
#    PyDurBrowser is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    PyDurBrowser is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with PyDurBrowser.  If not, see <http://www.gnu.org/licenses/>.
##############################################################################

import os
from markdown import markdown

class page(object):
    """Page object

    Args:
        Obj:config    Config object.

    Page object contains base info for page creation.
    Defined in <page> elements in pdb_config.xml

    Page object attributes:
    config    Config object.
    items     List for items to be loaded into.    
    """

    def __init__(self, config):
        self.config = config
        self.items = []
        _load_readme(self)
        _load_page_config(self)


    def __iter__(self):
        for key in dir(self):
            if not key.startswith('_'):
                yield key, getattr(self, key)


def _open_readme(path, page):
    try:
        with open(path, 'r') as f:
            page.readme = markdown(f.read().decode('utf-8'), ['tables'])
    except:
        page.readme = ''

    
def _load_readme(page):
    page.readme = ''

    if page.config.readme:
        readme_path = os.path.join(page.config.path, page.config.readme)
        if os.path.exists(readme_path):
            _open_readme(readme_path, page)


def _load_page_config(page):
    module = 'browser.plugins.page'
    try:
        mod = __import__(module, globals(), locals(), [page.config.page['type']], -1)
        handler = getattr(mod, page.config.page['type'])
    except:
        try:
            mod = __import__(module, globals(), locals(), ['default'], -1)
            handler = getattr(mod, 'default')
        except Exception, e:
            print e
    finally:
        handler.handler(page)
