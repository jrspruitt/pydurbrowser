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
from browser.description import get_desc
from browser.settings import data_path

class xfile(object):
    """Create file object

    Args:
        Str:url       url of file.
        Obj:config    Config object.

    Returns:
        Obj:file      File object

    File object contains everything needed for display page.

    File object attributes:
    config    Config object.
    url       URL of file.
    path      Abs path of file
    name      File name.
    desc      Description text.
    display   Holder for display HTML.
    """

    def __init__(self, url, config):
        self.config = config
        self.url = url
        self.path = os.path.join(data_path(), self.url)
        self.name = os.path.basename(self.path)
        self.display = None
        self.desc = get_desc(self, config, True)

        for module in config.display_plugins:
            plugin = module['plugin']

            if plugin.check(self):
                plugin.handler(self)
                break

    def __iter__(self):
        for key in dir(self):
            if not key.startswith('_'):
                yield key, getattr(self, key)
