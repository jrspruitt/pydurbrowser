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

def editor(url):
    filename = os.path.basename(url)
    modules = load_plugins(['all'], 'editors')

    for module in modules:
        plugin = module['plugin']

        if plugin.check(filename):
            return plugin.editor(url)

    bottle.abort(404)

def updater(url):
    filename = os.path.basename(url)
    modules = load_plugins(['all'], 'editors')

    for module in modules:
        plugin = module['plugin']

        if plugin.check(filename):
            return plugin.updater(url)

    bottle.abort(404)