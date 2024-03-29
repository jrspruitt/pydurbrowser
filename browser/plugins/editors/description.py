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
    display = bottle.request.POST.get('display', '')
    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    return bottle.template('editors/description.tpl', url='/%s%s' % (updater_prefix, url), text=text, display=display)

def editor(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    text = ''
    display = bottle.request.POST.get('display', '')

    if os.path.exists(path):
        with open(path, 'r', encoding='utf8') as f:
            text = f.read()

    return bottle.template('editors/description.tpl', url='/%s%s' % (updater_prefix, url), text=text, display=display)

def updater(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    text = '%s' % bottle.request.POST.get('text', '')
    display = '%s' % bottle.request.POST.get('display', '')

    if display:
        redirect_url = '/%s%s' % (display_prefix, url[0:len(url) - len(desc_ext)])
    else:
        redirect_url = '/%s' % (os.path.dirname(url))


    try:
        if text == '':
            if os.path.exists(path) and os.path.isfile(path):
                os.remove(path)
        else:
            with open(path, 'w', encoding='utf8') as f:
                f.write(text)

    except:
        return "Failed to save file."

    return bottle.redirect(redirect_url)

    
