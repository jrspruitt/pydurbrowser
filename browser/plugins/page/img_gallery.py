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
from browser.plugins.page.img_gallery_items import img_gallery_item

def handler(page):
    img_plugin = 'browser.plugins.page.img_gallery_items.item'

    page.config.list_plugins.insert(0, {'name':img_plugin, 'plugin':img_gallery_item})
    items = get_items(page.config)

    for plugin in page.config.list_plugins:
        if plugin['name'] in items and plugin['name'] != img_plugin:
            page.items += items[plugin['name']]

    if img_plugin in items:
        page.images = items[img_plugin]
    else:
        page.images = []

    page.config.css.append(get_css('list.css', page))
    page.config.css.append(get_css('page/img_gallery.css', page))
    page.config.css.append(get_css('media.css', page))
    page.config.js.append(get_js('page/img_gallery.js'))
    page.config.script += """
    resize_event();
    generate_height();
    """
    page.display = template("pages/img_gallery.tpl", page=page)
