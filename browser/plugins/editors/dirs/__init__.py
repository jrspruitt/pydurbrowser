##############################################################################
#    PyDurBrowser
#
#    Copyright (c) 2015 Jason Pruitt <jrspruitt@gmail.com>
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
from browser.settings import data_path
from browser.editors import check_url

def check(url):
    if url.startswith('createdirectory'):
        return True
    return False

def editor(url):
    url = url[len('createdirectory/'):]
    check_url(url)
    path = os.path.join(data_path(), url)

    if os.path.exists(path):
        bottle.abort(403, 'Path already exists.')

    try:
        os.mkdir(path)
    except:
        bottle.abort(403, 'Problem creating directory.')

    return bottle.redirect('/%s' % (os.path.dirname(url)))

def updater(url):
    return bottle.redirect('/%s' % (os.path.dirname(url)))
