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
from browser.settings import config_filename, data_path, readme_default
from browser.config.rules import rules
from browser.plugins import load_plugins

def get_config(url):
    """Get config object

    Args:
        Str:url    requested URL.

    Returns:
        Obj:config    Config object.

    Config object contains all info for current path.

    Config object attributes:
    url                Requested URL.
    path               Abs path of requested item, parent dir if file.
    files              List of all config files in path.
    is_parent          If config found is parent.
    parent_url         Title link URL.
    show_nav           If to show Up link URL.
    head_img_link      Directory of head_img having config file.

    uid                Unique ID (future use?).
    rules              Rules object.
    page               {'type':'default, img_gallery, 'src':'filename'}

    inherit            Should sub dirs inherit from this config.
    list_plugins       List plugins.
    display_plugins    Display plugins.
    title              Title from config.
    head_img           Heading image path.
    desc               Description from config.
    meta               Additional meta data from config.
    css                Additional css.
    js                 Additional javascript.
    script             Javascript to go in script tags
    style              CSS to go in a style tag
    readme             Readme file name.
    """

    config = _config()
    config.url = url.rstrip('/')

    config.path = os.path.join(data_path(), config.url)

    if not os.path.isdir(config.path):
        config.path = os.path.dirname(config.path)

    config.files = gather_configs(config.path, [])
    config.rules = rules(config.files)
    config.parent_url = os.path.dirname(config.files[0]).replace(data_path(), '') or '/'
    config.show_nav = config.path != data_path()
    config.is_parent = config.files[0] == os.path.join(config.path, config_filename)
    cxml = parse_xml(config.files[0], config.is_parent)

    if cxml['head_img']:
        if cxml['head_img'].lower() == 'none':
            config.head_img = ''
            config.head_img_link = ''
        else:
            config.head_img = os.path.abspath(os.path.join(config.parent_url , cxml['head_img']))
            config.head_img_link = config.parent_url
    else:
        config.head_img, config.head_img_link = _get_head_img(config.files)

    config.title = cxml['title']
    config.desc = cxml['desc']
    config.readme = cxml['readme']
    config.inherit = cxml['inherit']
    config.page = cxml['page']
    config.meta = cxml['heading']['meta']
    config.js = cxml['heading']['js']
    config.script = cxml['heading']['script']
    config.css = cxml['heading']['css']
    config.style = cxml['heading']['style']        
    config.list_plugins = load_plugins(cxml['list']['plugins'], 'list')
    config.display_plugins = load_plugins(cxml['display']['plugins'], 'display')

    if config.page['src'] != '':
        config.page['src'] = os.path.join(config.path, config.page['src'])

    if config.url:
        config.nav_link = '/%s' % os.path.dirname(config.url)
    else:
        config.nav_link = ''

    return config


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
           'readme':readme_default,
           'inherit':'0',
           'page':{'src': '', 'type':'default'},
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
        return ret
        #print 'Bad page config: %s' % path
        #abort(500, 'Bad page config.')

    if root.find('title') is not None:
        ret['title'] = root.find('title').text or ''

    if root.find('head_img') is not None:
        ret['head_img'] = root.find('head_img').text or ''

    if root.find('desc') is not None:
        ret['desc'] = root.find('desc').text or ''

    if root.find('readme') is not None:
        ret['readme'] = root.find('readme').text or readme_default
  
    if root.find('inherit') is not None:
        ret['inherit'] =  root.find('inherit').text or '0'

 
    if ret['inherit'] or is_parent:
        page = root.find('page')

        if page is not None:
            if page.find('type') is not None:
                ret['page']['type'] = page.find('type').text
    
            if page.find('src') is not None:
                ret['page']['src'] = page.find('src').text or ''

        listp = root.find('list')
        if listp is not None:
            for plugin in listp.iterfind('plugin'):
                if listp.text is not None:
                    ret['list']['plugins'].append(plugin.text)

            if len(ret['list']['plugins']) == 0:
                ret['list']['plugins'] = ['dir', 'file']

        display = root.find('display')
        if display is not None:
            for plugin in display.iterfind('plugin'):
                if plugin.text is not None:
                    ret['display']['plugins'].append(plugin.text)

        
    heading = root.find('heading')
    if heading is not None:
        if heading.find('meta') is not None:
            for meta in heading.iterfind('meta'):
                ret['heading']['meta'].append(meta.text or '')

        if heading.find('js') is not None:
            for js_src in heading.iterfind('js'):
                ret['heading']['js'].append(js_src.text or '')

        if heading.find('script') is not None:
            ret['heading']['script'] = heading.find('script').text or ''

        if heading.find('css') is not None:
            for css_src in heading.iterfind('css'):
                ret['heading']['css'].append(css_src.text or '')

        if heading.find('style') is not None:
            ret['heading']['style'] = heading.find('style').text or ''

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
                 'logged_in',
                 ]

        for name in attrs:
            setattr(self, name, None)

        self.files = []
        self.css = []
        self.js = []
        self.styles = []
        self.scripts = []
        self.meta = []
        self.page = {}

    def __iter__(self):
        for key in dir(self):
            if not key.startswith('_'):
                yield key, getattr(self, key)



def gather_configs(path, files):
    path = path.rstrip('/')

    if path.startswith(data_path()):
        config_path = os.path.join(path, config_filename)
    
        if os.path.exists(config_path) and os.access(config_path, os.R_OK):
            files.append(config_path)
    
        parent_path = os.path.dirname(path)
    
        if parent_path:
            gather_configs(parent_path, files)

    return files
