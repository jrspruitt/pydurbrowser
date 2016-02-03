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
    html = ''
    items = get_items(page.config)

    for plugin in page.config.list_plugins:
        if plugin['name'] in items:
            page.items += items[plugin['name']]

    html_src = page.config.page['src']

    if html_src:
        html_path = os.path.join(page.config.path, html_src)

        if os.path.exists(html_path):
            with open(html_path, 'r') as f:
                html = f.read()

    page.config.js.append(get_js('list.js'))
    page.config.css.append(get_css('list.css', page))

    page.display = template('pages/html.tpl', page=page, html=html)