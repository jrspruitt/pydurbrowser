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
from bottle import template
from lxml import etree

name = 'bookmarks'

def check(item):
    return item.name.startswith('pdb_bookmarks') and item.name.endswith('.xml') and os.path.isfile(item.path)

def handler(item, config):
    root = etree.parse(item.path).getroot()
    item.name = root.find('channel/title').text
    item.desc = root.find('channel/description').text
    item.links = []

    for rssitem in root.iterfind('channel/item'):
        title = rssitem.find('title').text
        link = rssitem.find('link').text
        desc = rssitem.find('description').text
        item.links.append({'title':title, 'link':link, 'desc':desc})

    tpl_path = os.path.join(os.path.dirname(__file__), 'template.tpl')
    item.display = template(tpl_path, item=item)