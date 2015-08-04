##############################################################################
#    PyDurBrowser
#
#    Copyright (c) 2015 Jason Pruitt <jrspruitt@gmail.com>
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
import bottle
from browser.plugins import load_plugins
from browser.settings import data_path

def _check_perms(url):
    path = os.path.join(data_path(), url)
    tpath = path
    if not os.path.exists(path):
        tpath = os.path.dirname(path)

    if not os.access(tpath, os.W_OK):
        bottle.abort(403, 'Need write privileges.')

def check_url(url):
    _check_perms(url)
    path = os.path.join(data_path(), url)

    if not os.path.abspath(path).startswith(data_path()):
        bottle.abort(403, 'This path is outside my comfort zone.')
    
def editor(url):
    modules = load_plugins(['all'], 'editors')

    for module in modules:
        plugin = module['plugin']

        if plugin.check(url):
            return plugin.editor(url)

    bottle.abort(403, 'Bad action requested.')

def updater(url):
    modules = load_plugins(['all'], 'editors')

    for module in modules:
        plugin = module['plugin']

        if plugin.check(url):
            return plugin.updater(url)

    bottle.abort(403, 'Bad action requested.')