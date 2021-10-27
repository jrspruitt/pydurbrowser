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
from browser.settings import data_path, desc_ext, updater_prefix
from browser.editors import check_url

def check(url):
    if url.endswith('.git'):
        return True
    return False

def editor(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    cgitrc = os.path.join(path, 'cgitrc')
    name = ''
    desc = ''

    if os.path.exists(cgitrc):
        with open(cgitrc, 'r', encoding='utf8') as f:
            for line in f.readlines():
                if line.startswith('name='):
                    name = line[len('name='):]
                elif line.startswith('desc='):
                    desc = line[len('desc='):]
        
    return bottle.template('editors/cgit.tpl', url='/%s%s' % (updater_prefix, url), name=name, desc=desc)

def updater(url):
    check_url(url)
    path = os.path.join(data_path(), url)
    cgitrc = os.path.join(path, 'cgitrc')
    name = '%s' % bottle.request.POST.get('name', '').strip()
    desc = '%s' % bottle.request.POST.get('desc', '').strip()

    if not os.path.exists(path):
        try:
            os.mkdir(path)
            os.system('git init --bare %s' % path)
            with open(os.path.join(path, 'description'), 'w', encoding='utf8') as f:
                f.write(desc)
        except:
            bottle.abort(403, 'Failed to create git directory.')

    try:
        with open(cgitrc, 'w', encoding='utf8') as f:
            f.write('name=%s\ndesc=%s' % (name, desc))

    except:
        return "Failed to save cgitrc."

    return bottle.redirect('/%s' % (os.path.dirname(url)))

    
