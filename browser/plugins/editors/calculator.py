# -*- coding: utf-8 -*-
##############################################################################
#    PyDurBrowser
#
#    Copyright (c) 2016 Jason Pruitt <jrspruitt@gmail.com>
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
import bottle
import json
from browser.settings import data_path, updater_prefix, config_filename, editor_prefix
from browser.editors import check_url

calc_config = 'calc.json'
calc_js = 'calc.js'

def check(url):
    if os.path.basename(url) in [calc_config, calc_js]:
        return True
    return False

def creator(url):
    check_url(url)
    update_url = '/%s%s' % (updater_prefix, url)
    return bottle.template('editors/calculator.tpl', url=update_url, data="{}", creator=True)

def editor(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    update_url = '/%s%s' % (updater_prefix, url)
    buf = ''

    if os.path.exists(path):
        with open(path, 'r', encoding='utf8') as f:
            buf = f.read();

    if path.endswith(calc_config):
        return bottle.template('editors/calculator.tpl', url=update_url, data=buf, creator=False)

    elif path.endswith(calc_js):
        return bottle.template('editors/calculator_js.tpl', url=update_url, data=buf)

def updater(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    retpath = '/%s' % (os.path.dirname(url))
    data = bottle.request.POST.get('data', '')

    if os.path.isdir(path):
        name = bottle.request.POST.get('name', '')
        if name:
            mk_path = os.path.join(path, name)
            if not os.path.exists(mk_path):
                os.mkdir(mk_path)
            else:
                return bottle.template("Error - Path already exists.")

            path = os.path.join(mk_path, calc_config)
            retpath = '/%s%s/%s/%s' % (editor_prefix, url, name, config_filename)
            create_js(os.path.join(mk_path, calc_js), data)

    if path.endswith(calc_js):
        with open(path, 'w', encoding='utf8') as f:
            f.write(data)
    else:
        with open(path, 'w', encoding='utf8') as f:
            f.write(data.decode('string_escape').strip("\""))
 
    return bottle.redirect(retpath)

def create_js(path, data):
    buf = 'var mc = new Mechcalc();\n\n'
    jdata = json.loads(data)

    for item in jdata['items']:
        if item['type'] in ['calc', 'button', 'graph']:

            if item['type'] == 'graph':
                buf += 'mc.graph_%s = function(){\n' % item['id']
                buf += '\tif(!this.get_all(true)){ return false; }\n'
                buf += '\tthis.%s.grid.build();\n' % item['id']

                for pitem in item['config']['items']:
                    buf += '\tthis.%s.plot.draw(fromX, fromY, toX, toY, "%s");\n' % (item['id'], pitem['label'])

            else:
                buf += 'mc.calc_%s = function(){\n' % item['id']
                buf += '\tif(!this.get_all(true)){ return false; }\n'

            if item['type'] in ['calc', 'button']:
                buf += '\tthis.%s.value = 1234;\n' % item['id']
                buf +='\tthis.set();\n'

            buf += '}\n\n'

    with open(path, 'w', encoding='utf8') as f:
        f.write(buf)




