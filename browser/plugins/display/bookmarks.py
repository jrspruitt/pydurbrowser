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

from lxml import etree
from bottle import template
from browser.settings import get_css, data_path, get_js, editor_prefix

match = 100

def check(xfile):
    return xfile.name.startswith('bookmarks') and xfile.name.endswith('.xml') and os.path.isfile(xfile.path)


def handler(xfile):
    bookmark = load_bookmark(xfile)
    admin = None

    if xfile.config.logged_in:
        try:
            import browser.plugins.editors.bookmarks
            admin = {'url':'/%s%s' % (editor_prefix, xfile.url),'name':'Edit Bookmarks'}
        except ImportError, e:
            pass


    xfile.config.meta.append('<link rel="alternate" type="application/rss+xml" title="%s" href="/%s" />' % (bookmark['title'], xfile.url))
    xfile.config.js.append(get_js('list.js'))
    xfile.config.css.append(get_css('list.css', xfile))
    xfile.display = template('display/bookmarks.tpl', xfile=xfile, bookmark=bookmark, admin=admin)

def load_bookmark(xfile):
    path = xfile.path
    ret = {'id':'',
           'title':'Bookmarks',
           'description':'',
           'link':xfile.url,
           'items':[]}
    try:
        root = etree.parse(path).getroot()
        if root.find('channel/title') is not None:
            ret['title'] = root.find('channel/title').text
    
        if root.find('channel/description') is not None:
            ret['description'] = root.find('channel/description').text or ''
    
        if root.find('channel/link') is not None:
            ret['link'] = root.find('channel/link').text or xfile.url 

        i = 0
        for rssxfile in root.iterfind('channel/item'):
            i += 1
            html_id = 'bookmark_%s' % i
            title = rssxfile.find('title').text
            link = rssxfile.find('link').text
            desc = rssxfile.find('description').text
            ret['items'].append({'id':html_id, 'title':title, 'link':link, 'description':desc})
    except:
        pass

    return ret
