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
from PIL import ExifTags

from bottle import template
from browser.utils import get_filesize, process_displayimg
from browser.settings import get_css, display_prefix
from browser.items import get_items
from browser.config.config import get_config
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
    process_displayimg(xfile)
    img_plugin = 'browser.plugins.list.image'
    xfile.config.css.append(get_css('media.css', xfile))
    config = get_config(os.path.dirname(xfile.url))
    config.list_plugins = [{'name':img_plugin, 'plugin':pimage}]
    items = get_items(config)
    peer_files = []
    nexti = None
    prev = None
    exif = {}

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
        with Image.open(xfile.path) as im:
            xfile.width = im.size[0]
            xfile.height = im.size[1]
            try:
                exif = {
                    ExifTags.TAGS[k]: v
                    for k, v in im._getexif().items()
                    if k in ExifTags.TAGS
                }
            except:
                pass

        with Image.open(xfile.resized_img_path) as rim:
            xfile.display_width = rim.width
            xfile.display_height = rim.height
    except Exception, e:
        print e

    try:
        xfile.mtime = time.ctime(os.path.getmtime(xfile.path))
        xfile.size = get_filesize(xfile.path)
    except:
        xfile.mtime = ''
        xfile.size = ''

    xfile.display = template('display/image.tpl', xfile=xfile, next=nexti, prev=prev, exif=exif)