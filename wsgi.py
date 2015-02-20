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
import sys
import mimetypes

sys.path.append(os.path.dirname(__file__))
os.chdir(os.path.dirname(__file__))

import bottle

from browser.settings import display_prefix, data_path
from browser.config.parse import get_config
from browser.page import page
from browser.xfile import xfile
from browser.dataport import dataport


@bottle.route('/favicon.ico')
def favicon():
    return bottle.static_file('favicon.ico', root=data_path())


@bottle.route('/robots.txt')
def robots():
    return bottle.static_file('robots.txt', root=data_path())


@bottle.route('/assets/<path:path>')
def assets(path):
    return bottle.static_file(path, root=os.path.join(os.path.dirname(__file__), 'assets'))


@bottle.route('/dataport/<url:path>')
def dataport_entry(url=''):
    if url:
        return dataport(url, bottle.request)
    else:
        bottle.abort(404, 'No such file.')


@bottle.route('/%s<url:path>' % display_prefix)
def show_display(url=''):
    path = os.path.join(data_path(), url)
    cfg = get_config(url)

    if not os.path.isdir(path) and os.path.exists(path):
        if cfg.rules.ignore_filehandler(url):
            return bottle.static_file(url, root=data_path())
        else:
            xf = xfile(url, cfg)
            if xf.display:
                return bottle.template('main.tpl', item=xf)

            if mimetypes.guess_type(path)[0] or mimetypes.guess_type(path)[1]:
                return bottle.static_file(url, root=data_path())
            else:
                return bottle.static_file(url, root=data_path(), mimetype='application/octet-stream', download=True)

    bottle.abort(404, 'No such file.')

   
@bottle.route('/')
@bottle.route('/<url:path>')
def index(url=''):
    path = os.path.join(data_path(), url)

    if not path.endswith('/') and os.path.isdir(path):
        bottle.redirect('/%s/' % (url))

    url = url.rstrip('/')
    path = path.rstrip('/')
    cfg = get_config(url)

    if not os.path.exists(path):
        bottle.abort(404, 'Bad path.')

    if os.path.isdir(path):
        if not cfg.rules.exclude_dir(url):
            pg = page(cfg)
            return bottle.template('main.tpl', item=pg)
    
    elif not cfg.rules.exclude_file(url):
        if not cfg.rules.exclude_file(path):
            return bottle.static_file(url, root=data_path())

    bottle.abort(404, 'Bad path.')

application = bottle.default_app()