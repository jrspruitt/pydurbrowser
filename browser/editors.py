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
import shutil
import bottle
from browser.plugins import load_plugins
from browser.settings import data_path, editor_plugins

def name_process(url, name_formatter):
    path = os.path.join(data_path(), url)
    name = '%s' % bottle.request.POST.get('name', '')
    origname = '%s' % bottle.request.POST.get('origname', '')

    if not name:
        name = 'default'

    name = name_formatter(name)

    # Dealing with a dir path, so creating new file, append file name
    if os.path.isdir(path):
        path = os.path.join(path, name)
        url = os.path.join(url, name)
    # path is a file, but we have a file name mismatch, rename file.
    # and set new url and paths to the new name
    elif origname and name != origname and os.path.isfile(path):
        dir_path = os.path.dirname(path)
        shutil.move(os.path.join(dir_path, origname), os.path.join(dir_path, name))
        path = os.path.join(dir_path, name)
        url = os.path.join(os.path.dirname(url), name)

    return url, path

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

def _get_plugin(url):
    _check_perms(url)
    plugin_name = bottle.request.POST.get('etype', '')

    if plugin_name in editor_plugins:
        module = load_plugins([plugin_name], 'editors')
        return module[0]['plugin']

    bottle.abort(403, 'Bad action requested.')

def creator(url):
        plugin = _get_plugin(url)
        return plugin.creator(url)

def editor(url):
    modules = load_plugins(editor_plugins, 'editors')

    for module in modules:
        plugin = module['plugin']

        if plugin.check(url):
            return plugin.editor(url)

    bottle.abort(403, 'Bad action requested.')

def updater(url):
        plugin = _get_plugin(url)
        return plugin.updater(url)
