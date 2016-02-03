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
import codecs
import bottle
from browser.settings import data_path, config_filename, updater_prefix, css_path
from browser.config import rules
from browser.config import config as xconfig
from browser.editors import check_url

def check(url):
    if os.path.basename(url) == config_filename:
        return True
    return False

def editor(url):
    check_url(url)
    cfg_path = os.path.join(data_path(), url)
    config = xconfig.parse_xml(cfg_path)
    config['rules'] = rules.parse_xml(cfg_path)
    return _load_editor(url, config)

def updater(url):
    check_url(url)
    path = os.path.join(data_path(), url)

    if _get_var('delete') == 'delete':
        os.remove(path)
        return bottle.redirect('/%s' % (os.path.dirname(url)))

    if _cfg_save(path):
        return bottle.redirect('/%s' % (os.path.dirname(url)))
    else:
        return "Failed to save config."

def _load_editor(url, config):
    plugins = {}
    plugins['page'] = []
    plugins['list'] = []
    plugins['display'] = []

    for plugin in plugins:
        path = os.path.join('browser/plugins', plugin)

        if not os.path.exists(path):
            continue

        for item in os.listdir(path):
            if os.path.isdir(os.path.join(path, item)):
                plugins[plugin].append(item)

    if len(config['list']['plugins']) == len(plugins['list']):
        config['list']['plugins'] = ['all']

    if len(config['display']['plugins']) == len(plugins['display']):
        config['display']['plugins'] = ['all']

    themes = []
    abs_css_path = os.path.join(os.getcwd(), css_path.lstrip('/'))
    for item in os.listdir(abs_css_path):
        themes.append(item)

    return bottle.template('edtiors/config.tpl', url='/%s%s' % (updater_prefix, url), plugins=plugins, config=config, themes=themes)

def _cfg_save(path):
    try:
        root = etree.Element('durbrowser')

        title = etree.Element('title')
        title.text = _get_var('title')
        root.append(title)

        desc = etree.Element('desc')
        desc.text = _get_var('desc')
        root.append(desc)

        head_img = etree.Element('head_img')
        head_img.text = _get_var('head_img')
        root.append(head_img)

        theme = etree.Element('theme')
        theme.text = _get_var('theme')
        root.append(theme)

        readme = etree.Element('readme')
        readme.text = _get_var('readme')
        root.append(readme)

        inherit = etree.Element('inherit')
        inherit.text = _get_var('inherit') or '0'
        root.append(inherit)

        page = etree.Element('page')
        ptype = etree.Element('type')
        ptype.text = _get_var('page_type')
        page.append(ptype)
        
        src = etree.Element('src')
        src.text = _get_var('page_src')
        page.append(src)
        
        root.append(page)
        root.append(_list_to_xml('display', 'plugin', _get_list('display')))
        root.append(_list_to_xml('list', 'plugin', _get_list('list')))

        heading = etree.Element('heading')

        for meta_data in _to_list(_get_var('meta')):
            meta = etree.Element('meta')
            meta.text = meta_data
            heading.append(meta)

        for meta_data in _to_list(_get_var('css')):
            meta = etree.Element('css')
            meta.text = meta_data
            heading.append(meta)

        for meta_data in _to_list(_get_var('js')):
            meta = etree.Element('js')
            meta.text = meta_data
            heading.append(meta)

        style = etree.Element('style')
        style.text = _get_var('style')
        heading.append(style)

        script = etree.Element('script')
        script.text = _get_var('script')
        heading.append(script)
        root.append(heading)

        rules = etree.Element('rules')
        dirs = etree.Element('dirs')
        dirs.append(_list_to_xml('exclude', 'regex', _to_list(_get_var('dirs_exclude'))))
        dirs.append(_list_to_xml('ignore', 'regex', _to_list(_get_var('dirs_ignore'))))
        rules.append(dirs)

        files = etree.Element('files')
        files.append(_list_to_xml('exclude', 'regex', _to_list(_get_var('files_exclude'))))
        files.append(_list_to_xml('ignore', 'regex', _to_list(_get_var('files_ignore'))))
        files.append(_list_to_xml('show_raw', 'regex', _to_list(_get_var('files_show_raw'))))
        rules.append(files)
        root.append(rules)

        xml_buf = etree.tostring(root, encoding=unicode, pretty_print=True)

        f = codecs.open('%s' % path, 'w', encoding="utf-8")
        f.write(xml_buf)
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

