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
from lxml import etree
from bottle import template
from browser.utils import display_url
from browser.settings import display_prefix

name = 'bookmarks'
match = 100
order = 1000

def check(item):
    return item.name.startswith('bookmarks') and item.name.endswith('.xml') and os.path.isfile(item.path)

def handler(item, config):
    try:
        root = etree.parse(item.path).getroot()
        title = '' 
    
        if root.find('channel/title') is not None:
            title = root.find('channel/title').text or item.name.replace('bookmarks', '').replace('.xml', '')

    except:
        title = 'Bookmarks'

    if not 'bookmarks' in title.lower():
        title = 'Bookmarks/%s' % title

    bookmark = load_bookmark(item)


    item.name = title
    item.url = display_url(item.url)
    item.display = template('lists/bookmarks.tpl', item=item, config=config, bookmark=bookmark)



def load_bookmark(xfile):
    path = xfile.path
    ret = {'id':'',
           'title':'Bookmarks',
           'description':'',
           'items':[]}
    try:
        root = etree.parse(path).getroot()
        if root.find('channel/title') is not None:
            ret['title'] = root.find('channel/title').text
    
        if root.find('channel/description') is not None:
            ret['description'] = root.find('channel/description').text or ''

        for rssxfile in root.iterfind('channel/item'):
            title = rssxfile.find('title').text
            link = rssxfile.find('link').text
            ret['items'].append({'title':title, 'link':link})
    except:
        pass

    return ret

