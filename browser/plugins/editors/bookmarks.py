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
import re
from lxml import etree
import codecs
import bottle
from browser.settings import data_path, updater_prefix, display_prefix
from browser.editors import check_url, name_process

def check(url):
    return os.path.basename(url).startswith('bookmarks') and url.endswith('.xml')

def name_formatter(name):
    if check(name):
        return name

    if not name.startswith('bookmarks_'):
        name = 'bookmarks_%s' % name

    if not name.endswith('.xml'):
        name = '%s.xml' % name

    return name

def creator(url):
    check_url(url)
    return _load_editor(url)

def editor(url):
    check_url(url)
    return _load_editor(url, os.path.basename(url))

def updater(url):
    check_url(url)
    url, path = name_process(url, name_formatter)

    if _get_var('delete') == 'delete':
        os.remove(path)
        return bottle.redirect('/%s' % (os.path.dirname(url)))

    if _cfg_save(path):
        return bottle.redirect('/%s' % (os.path.dirname(url)))
    else:
        return "Failed to save config."

def _load_editor(url, name=''):
    bookmarks = {'title':'Bookmarks',
                'description':'',
                'link':'',
                'items':[]}
    try:
        path = os.path.join(data_path(), url)
        if os.path.exists(path):
            root = etree.parse(path).getroot()
    
            if root.find('channel/title') is not None:
                bookmarks['title'] = root.find('channel/title').text or 'Bookmarks'
    
            if root.find('channel/description') is not None:
                bookmarks['description'] = root.find('channel/description').text or ''
    
            if root.find('channel/link') is not None:
                bookmarks['link'] = root.find('channel/link').text or ''
    
            for item in root.iterfind('channel/item'):
                bookmarks['items'].append({'title':item.find('title').text or '',
                                           'link':item.find('link').text or '',
                                           'description':item.find('description').text or ''})

    except Exception, e:
        print e

    return bottle.template('editors/bookmarks.tpl', url='/%s%s' % (updater_prefix, url), bookmarks=bookmarks, name=name)

def _cfg_save(path):
    try:
        arr_re = re.compile(r'bookmarks\[([0-9]+)\]\[([0-9]+)\]')
        root = etree.Element('channel')

        title = etree.Element('title')
        title.text = _get_var('title')
        root.append(title)

        desc = etree.Element('description')
        desc.text = _get_var('description')
        root.append(desc)

        link = etree.Element('link')
        link.text = _get_var('link')
        root.append(link)

        items_dict = {}
        for p in bottle.request.POST:
            m = re.match(arr_re, p)
            if not m:
                continue

            ftype = ''

            if m.group(2) == '0':
                ftype = 'title'
            elif m.group(2) == '1':
                ftype = 'description'
            elif m.group(2) == '2':
                ftype = 'link'
            else:
                continue

            if m.group(1) not in items_dict:
                items_dict[m.group(1)] = {'idx': int(m.group(1))}

            items_dict[m.group(1)][ftype] = _get_var(p)

        items = []
        for item in items_dict:
            items.append(items_dict[item])

        items.sort(key=lambda x: x['idx'])
        
        for item in items:
            item_xml = etree.Element('item')

            title_xml = etree.Element('title')
            title_xml.text = item['title']
            item_xml.append(title_xml)

            link_xml = etree.Element('link')
            link_xml.text = item['link']
            item_xml.append(link_xml)

            desc_xml = etree.Element('description')
            desc_xml.text = item['description']
            item_xml.append(desc_xml)

            root.append(item_xml)

        rss_xml = etree.Element('rss')
        rss_xml.attrib['version'] = '2.0'
        rss_xml.append(root)

        xml_buf = etree.tostring(rss_xml, encoding=unicode, pretty_print=True)
        f = codecs.open('%s' % path, 'w', encoding="utf-8")
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n%s' % xml_buf)
        f.close()
        return True
    except Exception, e:
        print e
        import traceback
        print traceback.print_exc()
        return False

def _get_var(name, default=''):
    return '%s' % bottle.request.POST.get(name, default).strip()

def _get_list(name):
    return bottle.request.POST.getlist(name)

def _to_list(s):
    return [i.strip() for i in s.split('\r\n')]

def _list_to_xml(name, subname, vlist):
    elem = etree.Element(name)
    
    for item in vlist:
        item_xml = etree.Element(subname)
        item_xml.text = item
        elem.append(item_xml)

    return elem

