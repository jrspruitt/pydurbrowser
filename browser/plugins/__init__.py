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

def load_plugins(plugins, ptype='list'):
    """Return references to provided plugins

    Args:
        List:plugins    List of full dot path plugin names

    Returns:
        List    Of dicts, name=plugin name, plugin=plugin reference
    """
    plugins = get_dot_paths(plugins, ptype)
    modules = []

    for plugin in plugins:
        try:
            mod = __import__(plugin, globals(), locals(), ['*'], 0)
            modules.append({'name':plugin, 'plugin':mod})
        except Exception as e:
            print('%s failed to load: %s' % (plugin, e))

    try:
        modules.sort(key=lambda x: x['plugin'].match, reverse=True)
    except:
        pass

    return modules


def get_dot_paths(plugins, ptype):
    """ Get full module dot paths from plugin name list

    Args:
        List:plugins     List of plugin names
        Str:ptype        Type of plugin, list or display

    Returns:
        List    Of full module dot plugin names

    Notes: If plugin name prefixed with - and all is in list.
           That plugin will not be added.
    """

    mod_dot = 'browser.plugins.%s' % ptype
    plugin_path = 'browser/plugins/%s' % ptype
    plugin_list = []

    if 'all' in plugins:
        del plugins[plugins.index('all')]
        temp_list = []
        for item in os.listdir(plugin_path):
            temp_list.append(os.path.splitext(item)[0])

        for item in temp_list:
            if item.startswith('_'):
                continue

            if '-%s' % item not in plugins:
                mod_name = '%s.%s' % (mod_dot, item)
                if mod_name not in plugin_list:
                    plugin_list.append(mod_name)

    elif 'none' in plugins:
        pass  
    else:
        for plugin in plugins:
            if not plugin.startswith('-'):
                plugin_list.append('%s.%s' % (mod_dot, plugin))

    return plugin_list
