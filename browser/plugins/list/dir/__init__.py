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
from browser.config.rules import rules
from browser.settings import config_filename

name = 'dir'
match = 1
order = 1

def check(item):        
    return os.path.isdir(item.path)

def handler(item, config):
    cpath = os.path.join(item.path, config_filename)
    subitems = 0

    if os.path.exists(cpath):
        dir_rules = rules([cpath] + config.files)
    else:
        dir_rules = config.rules

    for subitem in os.listdir(item.path):
        subitem_path = os.path.join(item.path, subitem)
        if os.path.isdir(subitem_path):
            if dir_rules.exclude_dir(subitem_path) or dir_rules.ignore_dir(subitem_path):
                continue
            subitems += 1
        elif dir_rules.exclude_file(subitem_path) or dir_rules.ignore_file(subitem_path):
            continue
        else:
            subitems += 1
    
    item.size = '%s Items' % subitems
    item.name = '%s/' % item.name.rstrip('/')
    item.display = template('lists/directory.tpl', item=item)