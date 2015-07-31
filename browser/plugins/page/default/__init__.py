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
from browser.items import get_items
from browser.settings import get_css, get_js

def handler(page):
    """Page handler

    Arg:
        Obj:page    Page object.

    Get items, order as needed for template.

    Add any needed javascript/meta/css info to config object for main.tpl.

    Get page object ready and put into template associated with this
    handler.
    """
    items = get_items(page.config)

    for plugin in page.config.list_plugins:
        if plugin['name'] in items:
            page.items += items[plugin['name']]

    page.config.js.append(get_js('list.js'))
    page.config.css.append(get_css('list.css'))
    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    page.display = template(tpl_path, page=page)