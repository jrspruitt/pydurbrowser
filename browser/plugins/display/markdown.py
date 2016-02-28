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

# Fixes markdown name conflict.
from __future__ import absolute_import

import os
import time

from bottle import template
from markdown import markdown as md
from browser.settings import get_css, editor_prefix

match = 100 

def check(xfile):
    ext = os.path.splitext(xfile.name)[1]
    exts = ['md','markdown','mkd','mkdown']

    if ext.lower()[1:] in exts:
        return True
    return False


def handler(xfile):
    xfile.config.css.append(get_css('media.css', xfile))
    with open(xfile.path, 'r') as f:
        try:
            xfile.text = md(f.read().decode('utf-8'), ['tables'])
        except Exception, e:
            print e
            xfile.text = 'Load error.'

    try:
        admin = None
        if xfile.config.logged_in:
            import browser.plugins.editors.markdown
            admin = {'url':'/%s%s' % (editor_prefix, xfile.url)}
    except ImportError, e:
        admin = None

    xfile.display = template('display/markdown.tpl', xfile=xfile, admin=admin)
