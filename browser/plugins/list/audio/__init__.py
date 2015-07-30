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

name = 'audio'
weight = 100

def check(item):
    ext = os.path.splitext(item.name)[1]
    exts = ['oga','mp3','m4a','webma','wav']
    if ext.lower()[1:] in exts and os.path.isfile(item.path):
        return True
    return False

def handler(item, config):
    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    item.display = template(tpl_path, item=item)