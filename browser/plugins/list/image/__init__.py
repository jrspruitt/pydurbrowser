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
from bottle import template
from browser.utils import display_url

name = 'image'
weight = 100

def check(item):
    ext = os.path.splitext(item.name)[1]
    exts = ['jpg', 'jpeg',  'gif', 'png']
    if ext.lower()[1:] in exts and os.path.isfile(item.path):
        return True
    return False

def handler(item, config):
    thumbs_dir = '_thumbnails'
    turl = os.path.dirname(item.url)
    tpath = os.path.dirname(item.path)
    thumb_url = os.path.join(turl, thumbs_dir, item.name)
    thumb_path = os.path.join(tpath, thumbs_dir, item.name)

    if os.path.exists(thumb_path):
        item.thumb_url = thumb_url
    else:
        item.thumb_url = item.url

    if not config.rules.ignore_filehandler(item.path):
        item.url = display_url(item.url)    

    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    item.display = template(tpl_path, item=item)