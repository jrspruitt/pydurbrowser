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
from PIL import Image

from bottle import template
from browser.utils import get_filesize
from browser.settings import get_css, display_prefix
from browser.items import get_items
from browser.config.config import get_config
from browser.plugins import load_plugins
from browser.plugins.list import image as pimage

match = 100

def check(xfile):
    """Determine if file should be handled by this plugin.

    Arg:
        Obj:xfile    xfile object.

    Returns:
        Bool    True if applies, False if not

    Check for conflicts when creating plugins, if "all" specified
    no order is guaranteed, otherwise plugins are applied in order listed in
    pdb_config.xml config/display/plugin.    
    """
    ext = os.path.splitext(xfile.name)[1]
    exts = ['jpg', 'jpeg',  'gif', 'png']

    if ext.lower()[1:] in exts:
        return True
    return False


def handler(xfile):
    """Display/file handler

    Arg:
        Obj:xfile    Xfile object.

    Add any needed javascript/meta/css info to config object for main.tpl.

    Get xfile object ready and put into template associated with this
    handler.
    """

    img_plugin = 'browser.plugins.list.image'
    default_width = 800
    default_height = 600
    xfile.config.css.append(get_css('media.css'))
    config = get_config(os.path.dirname(xfile.url))
    config.list_plugins = [{'name':img_plugin, 'plugin':pimage}]
    items = get_items(config)
    peer_files = []
    nexti = None
    prev = None

    if 'browser.plugins.list.image' in items:
        for item in items[img_plugin]:
            if check(item):
                peer_files.append(item.url)

        file_idx = peer_files.index(os.path.join(display_prefix, xfile.url))
    
        peer_cnt = len(peer_files)
        
        if peer_cnt > 1:
            if file_idx > 0:
                prev = peer_files[file_idx - 1]
        
            if file_idx < peer_cnt - 1:
                nexti = peer_files[file_idx + 1]


    try:
        image = Image.open(xfile.path)
        xfile.width = image.size[0]
        xfile.height = image.size[1]

        if xfile.width > default_width:
            xfile.display_width = default_width
            xfile.display_height = int((float(default_width)/float(image.size[0])) * image.size[1])
        else:
            xfile.display_width = xfile.width
            xfile.display_height = xfile.height

    except Exception, e:
        print e
        xfile.width = default_width
        xfile.height = default_height

    try:
        xfile.mtime = time.ctime(os.path.getmtime(xfile.path))
        xfile.size = get_filesize(xfile.path)
    except:
        xfile.mtime = ''
        xfile.size = ''

    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    xfile.display = template(tpl_path, xfile=xfile, next=nexti, prev=prev)