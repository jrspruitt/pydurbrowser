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
from browser.settings import data_path, updater_prefix
from browser.editors import check_url

calc_dir = '_calc'
calc_config = 'calc.json'
calc_js = 'calc.js'

def check(url):
    if os.path.basename(url) in [calc_config, calc_js]:
        return True
    return False

def creator(url):
    check_url(url)
    return bottle.template('editors/calculator.tpl', url='/%s%s' % (updater_prefix, url))

def editor(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    text = ""

    if os.path.exists(path):
        if path.endswith(calc_config):
            return bottle.template('editors/calculator.tpl', url=url, update_url='/%s%s' % (updater_prefix, url))
        elif path.endswith(calc_js):
            with open(path, 'r') as f:
                text = f.read()
            return bottle.template('editors/calculator_js.tpl', url='/%s%s' % (updater_prefix, url), text=text)


def updater(url):
    check_url(url)
    path = os.path.join(data_path(), url)

    text = bottle.request.POST.get('data', '')
    with open(path, 'w') as f:
        f.write(text.decode('string_escape').strip("\""))
 
    return bottle.redirect('/%s' % (os.path.dirname(os.path.dirname(url))))

    