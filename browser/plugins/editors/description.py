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
from browser.settings import data_path, desc_ext, updater_prefix, display_prefix
from browser.editors import check_url

def check(url):
    if os.path.splitext(url)[1] == desc_ext:
        return True
    return False

def creator(url):
    check_url(os.path.dirname(url))
    text = ''
    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    return bottle.template('editors/description.tpl', url='/%s%s' % (updater_prefix, url), text=text)

def editor(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    text = ''

    if os.path.exists(path):
        with open(path, 'r') as f:
            text = f.read()

    return bottle.template('editors/description.tpl', url='/%s%s' % (updater_prefix, url), text=text)

def updater(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    text = '%s' % bottle.request.POST.get('text', '')
    redirect_url = '/%s%s' % (display_prefix, url[0:len(url) - len(desc_ext)])

    try:
        if text == '':
            if os.path.exists(path) and os.path.isfile(path):
                os.remove(path)
                redirect_url = '/%s' % (os.path.dirname(url))
        else:
            with open(path, 'w') as f:
                f.write(text)

    except:
        return "Failed to save file."

    return bottle.redirect(redirect_url)

    