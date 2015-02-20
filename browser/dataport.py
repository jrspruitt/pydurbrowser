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

from browser.plugins import full_plugin_paths, load_plugin_list

def dataport(url, request):
    """
        Dataport parser

    Argument:
    Str:url         URL requested at dataport.
    Obj:Request    Request object.

    Returns:
    Str:json    JSON object representing data.

    Request are made to the /dataport URL. The URL is
    passed to this function, where it is parsed to determine
    the data plugin to use. Response object is included so
    that GET and POST can be accessed also. Plugin is loaded,
    data gathered and returned.
    """
    if url[0] == '/':
        plugin_name = url[1:]
        
    p_idx = url.find('/')
    if p_idx > 0:
        plugin_name = url[0:p_idx]
        url_data = url[p_idx+1:]
    else:
        plugin_name = url
        url_data = ''


    try:
        plugins = full_plugin_paths([plugin_name], 'dataport')
        plugin = load_plugin_list(plugins)[0]
        return plugin['plugin'].get_data(url_data, request)

    except Exception, e:
        print e
        pass

    return '{"result":"false1"}'