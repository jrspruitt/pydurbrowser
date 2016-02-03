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
from browser.utils import display_url

# Unique list plugin name.
name = 'file'

# Order in which to check plugins, lower numbers are lower on the list
# and should be used on more ambigious checks. 
match = 2
# Same as match, but for order items are listed on web page lower = sooner.
order = 2

def check(item):
    """Determine if item should be handled by this plugin.

    Arg:
        Obj:item    Item object.

    Returns:
        Bool    True if applies, False if not

    dir, and file are the greediest, dir only checks if directory
    and file always returns True. As such these are always checked
    last.

    Check for conflicts when creating plugins, if "all" specified
    no order is guaranteed, otherwise plugins are applied in order listed in
    pdb_config.xml page/list/plugin.    
    """

    if not os.path.isdir(item.path):
        return True
    return False

def handler(item, config):
    """List item handler

    Arg:
        Obj:item    Item object

    Get item ready and put into the list template associated
    with this handler.

    Basic needs, check ignore_filehandler, apply display_url
    if applicable.
    
    Check against rules if including information about child items.
    Rules object is a copy, adding will not effect other references.
    """

    if not config.rules.ignore_filehandler(item.path):
        item.url = display_url(item.url)

    item.display = template('lists/file.tpl', item=item)
    