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

from bottle import template
from browser.utils import get_filesize
from browser.settings import get_css

def check(xfile):
    ext = os.path.splitext(xfile.name)[1]
    exts = ['ogv', 'm4v', 'mp4', 'webmv']

    if ext.lower()[1:] in exts:
        return True
    return False


def handler(xfile):
    xfile.config.css.append(get_css('media.css'))
    xfile.desc = ''
    xfile.width = 720
    try:
        xfile.mtime = time.ctime(os.path.getmtime(xfile.path))
        xfile.size = get_filesize(xfile.path)
    except:
        xfile.mtime = ''
        xfile.size = ''

    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    xfile.display = template(tpl_path, xfile=xfile)