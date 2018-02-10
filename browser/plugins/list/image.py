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
from browser.utils import display_url, process_thumbnail

name = 'image'
match = 100
order = 1000

def check(item):
    ext = os.path.splitext(item.name)[1]
    exts = ['jpg', 'jpeg',  'gif', 'png', 'svg']
    if ext.lower()[1:] in exts and os.path.isfile(item.path):
        return True
    return False

def handler(item, config):
    process_thumbnail(item)

    if not config.rules.ignore_filehandler(item.path):
        item.url = display_url(item.url)    

    item.display = template('lists/image.tpl', item=item)

