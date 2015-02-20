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
import time
from markdown import markdown
from browser.utils import get_filesize
from browser.settings import desc_ext

class item_desc(object):
    """Item object

    Each file/dir found in path that isn't excluded has an
    item_desc object created for it, these attributes are used
    in creating the the HTML for the page list.

    Attributes:      
    name        item's base name.
    path        Abs path to item.
    url         URL/Path relative to doc root.
    desc        Description text.
    display     Holder for list HTML
    size        Size of item B, KB, MB
    mtime       Modified date.
    """

    def __init__(self):
        attrs = ['name',
                 'path',
                 'url',
                 'display',
                 'size',
                 'mtime']

        for name in attrs:
            setattr(self, name, None)


def get_items(config):
    """Load all items found in config.path

    Args:
        Obj:config      Config object.
        List:plugins    List of plugin names to check.

    Return:
        Dict:items    Dict of items organized by plugin name.
    """

    items = {}

    for name in os.listdir(config.path):
        item_path = os.path.join(config.path, name)
        item_url = os.path.join(config.url, name)

        if os.path.isdir(item_path):
            if config.rules.exclude_dir(item_url) or config.rules.ignore_dir(item_url):
                continue
        elif config.rules.exclude_file(item_url) or config.rules.ignore_file(item_url):
            continue

        mod_name, item = _create_item(name, item_url, item_path, config)

        if mod_name is None or item is None:
            continue

        if mod_name and item:
            if mod_name not in items:
                items[mod_name] = []
            items[mod_name].append(item)

    for itype in items:
        items[itype] = sorted(items[itype], key=lambda x: x.name)

    return items


def _create_item(name, url, path, config):
    mod_name = None
    item = item_desc()
    item.path = path
    item.name = name
    item.url = url
    item.desc = ''

    try:
        item.mtime = time.ctime(os.path.getmtime(path))
        item.size = get_filesize(path)
    except:
        item.mtime = ''
        item.size = ''

    desc_path = '%s%s' % (item.path, desc_ext)

    if os.path.exists(desc_path):
        with open(desc_path, 'r') as f:
            try:
                item.desc = markdown(f.read().decode('utf-8'), ['tables'])
            except:
                f.seek(0)
                item.desc = f.read()

    for module in config.list_plugins:
        plugin = module['plugin']
        mod_name = module['name']

        if plugin.name not in ['dir', 'file'] and plugin.check(item):
            plugin.handler(item, config)
            return [mod_name, item]
    else:
        # These run last, because so greedy.
        for module in config.list_plugins:
            plugin = module['plugin']
            mod_name = module['name']

            if plugin.name in ['dir', 'file'] and plugin.check(item):
                plugin.handler(item, config)
                return [mod_name, item]

    return [None, None]