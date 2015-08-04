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
from markdown import markdown
from browser.settings import get_css, editor_prefix

match = 100 

def check(xfile):
    ext = os.path.splitext(xfile.name)[1]
    exts = ['md','markdown','mkd','mkdown']

    if ext.lower()[1:] in exts:
        return True
    return False


def handler(xfile):
    xfile.config.css.append(get_css('media.css'))
    with open(xfile.path, 'r') as f:
        try:
            xfile.text = markdown(f.read().decode('utf-8'), ['tables'])
        except Exception, e:
            print e
            xfile.text = 'Load error.'

    try:
        import browser.plugins.editors.markdown
        admin = {'url':'/%s%s' % (editor_prefix, xfile.url)}
    except ImportError, e:
        admin = None

    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    xfile.display = template(tpl_path, xfile=xfile, admin=admin)
