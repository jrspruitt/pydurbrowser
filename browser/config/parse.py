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
from bottle import request, template, abort
from browser.settings import config_filename, data_path
from browser.config.rules import rules
from browser.plugins import full_plugin_paths, load_plugin_list

def get_config(url):
    """Get config object

    Args:
        Str:url    requested URL.

    Returns:
        Obj:config    Config object.

    Config object contains all info for current path.

    Config object attributes:
    uid                Unique ID (future use?).
    url                Requested URL.
    path               Abs path of requested item, parent dir if file.
    rules              Rules object.
    files              List of all config files in path.
    type               Page type, default, img_gallery, etc.
    inherit            Should sub dirs inherit from this config.
    list_plugins       List plugins.
    display_plugins    Display plugins.
    title              Title from config.
    head_img           Heading image path.
    head_img_link      Directory of head_img having config file.
    desc               Description from config.
    meta               Additional meta data from config.
    css                Additional css.
    js                 Additional javascript.
    script             Javascript to go in script tags
    style             CSS to go in a style tag
    is_parent          If config found is parent.
    link               Up link URL.
    show_nav           If to show Up link URL.
    readme             Readme file name.
    """

    config = _config()
    config.url = url.rstrip('/')

    config.path = os.path.join(data_path(), config.url)

    if not os.path.isdir(config.path):
        config.path = os.path.dirname(config.path)

    _gather_configs(config.path, config)

    config.rules = rules(config.files)
    config.link = os.path.dirname(config.files[0]).replace(data_path(), '') or '/'
    config.show_nav = config.path != data_path()
    config.is_parent = config.files[0] == os.path.join(config.path, config_filename)
    cxml = parse_xml(config.files[0], config.is_parent)

    if cxml['head_img']:
        if cxml['head_img'].lower() == 'none':
            config.head_img = ''
            config.head_img_link = ''
        else:
            link_path = config.link or '/'
            config.head_img = os.path.abspath(os.path.join(link_path , cxml['head_img']))
            config.head_img_link = link_path
    else:
        config.head_img, config.head_img_link = _get_head_img(config.files)


    config.title = cxml['title']
    config.desc = cxml['desc']
    config.readme = cxml['readme']
    config.inherit = cxml['inherit']
    config.type = cxml['type']
    config.page_xml = cxml['page_xml']
    config.meta = cxml['heading']['meta']
    config.js = cxml['heading']['js']
    config.script = cxml['heading']['script']
    config.css = cxml['heading']['css']
    config.style = cxml['heading']['style']
    config.list_plugins = load_plugin_list(cxml['list']['plugins'])
    config.display_plugins = load_plugin_list(cxml['display']['plugins'])

    if config.url:
        config.nav_link = '/%s' % os.path.dirname(config.url)
    else:
        config.nav_link = ''

    return config


def _gather_configs(path, config):
    path = path.rstrip('/')

    if path.startswith(data_path()):
        config_path = os.path.join(path, config_filename)
    
        if os.path.exists(config_path) and os.access(config_path, os.R_OK):
            config.files.append(config_path)
    
        parent_path = os.path.dirname(path)
    
        if parent_path:
            _gather_configs(parent_path, config)


def _get_head_img(files):
    """Look through config files for parent head_img.
    
    Args:
        List:files    list of config files.
    Returns:
        Str            URL of image
    """
    try:
        for cfg in files:
            root = etree.parse(cfg).getroot()
            img = root.find('head_img')

            if img is None:
                continue

            if img.text is None or img.text == '':
                continue

            head_img_link = os.path.dirname(cfg).replace(data_path(), '') or '/'
            head_img = os.path.join(head_img_link, img.text)
            return [head_img, head_img_link]

        return ['','']
    except Exception, e:
        print e
        return ['','']


def parse_xml(path, is_parent = True):
    """Parse XML config file for rules.

    Args:
        Str:path          Path to config file.
        bool:is_parent    If this is top level config (default: True)

    Return:
        Dict:config    Dict with dicts and lists of various config params.
    """
    ret = {'title':'Site Title',
           'head_img':'',
           'desc':'Site Description',
           'readme':'',
           'inherit':False,
           'type':'default',
           'page_xml': None,
           'list':{'plugins':[]},
           'display':{'plugins':[]},
           'heading':{'meta':[],
                      'js':[],
                      'script':'',
                      'css':[],
                      'style':''},
       }
    try:
        root = etree.parse(path).getroot()
    except:
        print 'Bad page config: %s' % path
        abort(500, 'Bad page config.')

    if root.find('title') is not None:
        ret['title'] = root.find('title').text or ''

    if root.find('head_img') is not None:
        ret['head_img'] = root.find('head_img').text or ''

    if root.find('desc') is not None:
        ret['desc'] = root.find('desc').text or ''

    if root.find('readme') is not None:
        ret['readme'] = root.find('readme').text or ''

    if root.find('inherit') is not None:
        ret['inherit'] = root.find('inherit').text.lower() in ['true', '1']

    if root.find('page') is not None:
        ret['page_xml'] = root.find('page')
 
    if ret['inherit'] or is_parent:
        if root.find('type') is not None:
            ret['type'] = root.find('type').text

        listp = root.find('list')
        if listp is not None:
            for plugin in listp.iterfind('plugin'):
                if listp.text is not None:
                    ret['list']['plugins'].append(plugin.text)

            if len(ret['list']['plugins']) == 0:
                ret['list']['plugins'] = ['dir', 'file']

            ret['list']['plugins'] = full_plugin_paths(ret['list']['plugins'], 'list')

        display = root.find('display')
        if display is not None:
            for plugin in display.iterfind('plugin'):
                if plugin.text is not None:
                    ret['display']['plugins'].append(plugin.text)
    
        ret['display']['plugins'] = full_plugin_paths(ret['display']['plugins'], 'display')
    else:
        ret['display']['plugins'] = full_plugin_paths([], 'display')
        ret['list']['plugins'] = full_plugin_paths([], 'list')
        
    heading = root.find('heading')
    if heading is not None:
        if heading.find('meta') is not None:
            for meta in heading.iterfind('meta'):
                ret['heading']['meta'].append(meta.text or '')

        if heading.find('js') is not None:
            for js_src in heading.iterfind('js'):
                ret['heading']['js'].append(js_src.text)

        if heading.find('script') is not None:
            ret['heading']['script'] = heading.find('script').text

        if heading.find('css') is not None:
            for css_src in heading.iterfind('css'):
                ret['heading']['css'].append(css_src.text)

        if heading.find('style') is not None:
            ret['heading']['style'] = heading.find('style').text

    return ret


class _config(object):
    def __init__(self):
        attrs = ['is_parent',
                 'files',
                 'title',
                 'head_img',
                 'desc',
                 'inherit',
                 'uid',
                 'nav_link',
                 'css',
                 'js',
                 'script',
                 'style',
                 'meta',
                 ]

        for name in attrs:
            setattr(self, name, None)

        self.files = []
        self.css = []
        self.js = []
        self.styles = []
        self.scripts = []
        self.meta = []

    def __iter__(self):
        for key in dir(self):
            if not key.startswith('_'):
                yield key, getattr(self, key)
