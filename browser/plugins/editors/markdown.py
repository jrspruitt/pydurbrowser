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
import shutil
import bottle
from browser.settings import data_path, updater_prefix, display_prefix
from browser.editors import check_url, name_process

def check(url):
    if os.path.splitext(url)[1] in ['.md','.markdown','.mkd','.mkdown']:
        return True
    return False

def name_formatter(name):
    if check(name):
        return name
    else:
        return '%s.md' % name

def creator(url):
    check_url(url)
    return bottle.template('editors/markdown.tpl', url='/%s%s' % (updater_prefix, url), text='', name='')

def editor(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    text = ''

    if os.path.exists(path):
        with open(path, 'r') as f:
            text = f.read()

    return bottle.template('editors/markdown.tpl', url='/%s%s' % (updater_prefix, url), text=text, name=os.path.basename(path))

def updater(url):
    check_url(url)
    text = '%s' % bottle.request.POST.get('text', '')
    url, path = name_process(url, name_formatter)
    redirect_url = '/%s%s' % (display_prefix, url)

    try:
        if text == '':
            if os.path.exists(path) and os.path.isfile(path):
                os.remove(path)
                redirect_url = '/%s' % (os.path.dirname(url))
        else:
            with open(path, 'w') as f:
                f.write(text)

    except Exception, e:
        print e
        return "Failed to save file."

    return bottle.redirect(redirect_url)

    