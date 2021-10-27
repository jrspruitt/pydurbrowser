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
import json
from bottle import template
from browser.items import get_items
from browser.settings import get_css, get_js

def handler(page):
    page.config.rules.ignore_files ='calc.json*'
    page.config.rules.ignore_files = 'calc.js*' 
    config_path = os.path.join(page.config.path, 'calc.json')
    if os.path.exists(config_path):
        data = {"items":[]}
        with open(config_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for item in data['items']:
            if (item['type'] == 'diagram'):
                page.config.rules.ignore_files = item['config']['file']

    items = get_items(page.config)

    for plugin in page.config.list_plugins:
        if plugin['name'] in items:
            page.items += items[plugin['name']]

    page.config.css.append(get_css('page/calculator.css', page))
    page.config.js.append(get_js('page/calculator/calc_app.js'))
    page.config.js.append(get_js('page/calculator/units.js'))
    page.config.js.append(os.path.join('/%s' % page.config.url, 'calc.js'))
        
    page.config.css.append(get_css('media.css', page))
    page.config.css.append(get_css('list.css', page))
    with open(os.path.join(page.config.path, 'calc.json'), 'r', encoding='utf-8') as f:
        page.config.script = 'mc.init(%s);' % f.read()
    page.display = template("pages/calculator.tpl", page=page)
