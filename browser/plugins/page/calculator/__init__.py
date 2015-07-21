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
from browser.items import get_items
import sqlite3 as sqlite
from browser.settings import get_css, get_js

def item_display(item, measures):
    disp_tpl = os.path.join(os.path.dirname(__file__), 'templates/items/%s.tpl' % item['type'])
    return template(disp_tpl, item=item, measures=measures)
    

def handler(page):
    page.config.rules.exclude_dirs = '_calc'
    items = get_items(page.config)

    for plugin in page.config.list_plugins:
        if plugin['name'] in items:
            page.items += items[plugin['name']]

    calc = calc_load(os.path.join(page.config.path, '_calc/calc.xml'))
    calc_items = []

    if calc:
        for item in calc['items']:
            calc_items.append(item_display(item, calc['measures']))
            
        page.config.css.append('/assets/plugins/page/calculator/calc.css')
        page.config.js.append('/assets/plugins/page/calculator/calc_app.js')
        page.config.js.append(os.path.join('/%s' % page.config.url, '_calc/calc.js'))

        ext_js = []
        for cat in calc['measures']:
            if calc['measures'][cat]['ext_conv'] == '1':
                ext_js.append('%s.js' % calc['measures'][cat]['name'])

        for js in ext_js:
            page.config.js.append('/assets/plugins/page/calculator/units/%s' % js)
            
        page.config.css.append(get_css('media.css'))
        page.config.css.append(get_css('list.css'))
    
        calc_tpl = os.path.join(os.path.dirname(__file__), 'templates/calc_js.tpl')
        page.config.script = template(calc_tpl, config=calc, ext_js=ext_js)

        tpl_path = os.path.join(os.path.dirname(__file__), 'templates/template.tpl')
        page.display = template(tpl_path, page=page, calc_items=calc_items, rounding=calc['rounding'])

    else:
        tpl_path = os.path.join(os.path.dirname(__file__), 'templates/template.tpl')
        page.display = template(tpl_path, page=page, calc_items=calc_items, rounding=0)


def calc_load(path):
    try:
        root = etree.parse(path).getroot()
        rounding = int(root.findtext('rounding')) if root.findtext('rounding') else 0

        data = {'rounding':rounding, 'measures':{}, 'items':[]}

        mdb = db()
        db_cats = mdb.get_categories()
        xmeasures = root.find('units')
        measures = {}

        if xmeasures is not None:
            for cats in xmeasures.iterfind('category'):
                cat = cats.findtext('name')
                if cat in db_cats:
                    measures[cat] = {'units':[], 'convert_to':cats.findtext('convert_to'), 'name':cats.findtext('name'), 'ext_conv':db_cats[cat]['ext_conv']}
                    iids = cats.find('types')
                    units = []
                    db_units = mdb.get_units(cat)

                    for iid in iids.iterfind('id'):
                        uid = iid.text if iid.text else ''
                        label = iid.get('label') if iid.get('label') else ''
                        
                        if db_cats[cat]['ext_conv'] != '1':
                            units.append({'id':uid, 'label':label, 'conv':db_units[uid]['conversion']})
                        else:
                            units.append({'id':uid, 'label':label})
                            
    
                    measures[cats.findtext('name')]['units'] = units

        data['measures'] = measures
        
        xitems = root.find('items')

        items = []
        for item in xitems.iterfind('item'):
            iid = item.findtext('id')
            label = item.findtext('label')
            itype = item.findtext('type')

            if itype == 'seperator':
                items.append({'id':iid, 'type':itype})
            elif itype == 'label':
                items.append({'id':iid, 'type':itype, 'label':label})
                
            elif itype == 'graph':
                iconfig = item.find('config')
                gtype = iconfig.findtext('type') if iconfig.findtext('type') else 'normal'
                galign = iconfig.findtext('align') if iconfig.findtext('align') else 'left'
                gxlabel = iconfig.findtext('xlabel') if iconfig.findtext('xlabel') else ''
                gylabel = iconfig.findtext('ylabel') if iconfig.findtext('ylabel') else ''

                items.append({'id':iid, 'type':itype, 'label':label, 'config':{'type':gtype,
                                                                            'align':galign,
                                                                            'xlabel':gxlabel,
                                                                            'ylabel':gylabel}})

            elif itype == 'diagram':
                iconfig = item.find('config')
                dfile = iconfig.findtext('file') if iconfig.findtext('file') else ''
                dalt_text = iconfig.findtext('alt_text') if iconfig.findtext('alt_text') else ''

                items.append({'id':iid, 'type':itype, 'label':label, 'config':{'file':dfile,
                                                                            'alt_text':dalt_text}})
            elif itype == 'choice':
                iconfig = item.find('config')
                options = []
                xoptions = iconfig.find('options')

                for xoption in xoptions.iterfind('option'):
                    selected = 'False'
                    if 'selected' in xoption.attrib:
                        if xoption.attrib['selected'].lower() == 'true':
                            selected = 'True'
                            
                    options.append({'value':xoption.findtext('value'),
                                    'label':xoption.findtext('label'),
                                    'selected':selected})

                items.append({'id':iid, 'type':itype, 'label':label, 'config':{'options':options}})
            elif itype == 'calc':
                iconfig = item.find('config')
                ibutton = iconfig.findtext('button') if iconfig.findtext('button') else 0
                category = iconfig.findtext('category') if iconfig.findtext('category') != '' else 'None'
                display = {}
                display['value'] = iconfig.findtext('display/value') if iconfig.findtext('display/value') else ''

                if iconfig.find('display/static') is not None:
                    display['static'] = iconfig.findtext('display/static') if iconfig.findtext('display/static') else ''
                else:
                    d = iconfig.findtext('display/units/default') if iconfig.findtext('display/units/default') else ''
                    si = iconfig.findtext('display/units/si')if iconfig.findtext('display/units/si') else ''
                    display['units'] = {'default':d, 'si':si}

                items.append({
                        'id':iid,
                        'label':label,
                        'type':itype,
                        'config':{
                            'button':ibutton,
                            'category':category,
                             'display':display}})


                
        data['items'] = items
        return data
    except Exception, e:
        import traceback
        print traceback.print_exc()
        print e
        return None


class db():
    def __init__(self):
        self._db_con = None
        self._data_path = os.path.join(os.path.dirname(__file__), 'units.db')
        self._sql_select_all = "SELECT * FROM %s"
        self._data = ""

# internal
    def _error(self, e):
        print e


    def _fetch_results(self, sql):
        try:
            self._cur.execute(sql)
            return self._cur.fetchall()
     
        except Exception, e:
            self._error(e)

    def _db_open(self):
        try:
            self._db_con = sqlite.connect(self._data_path)
            self._cur = self._db_con.cursor()
        except Exception, e:
            self._error(e)

    def _db_close(self):
        if self._db_con:
            self._db_con.close()

# internal selects
    def _get_categories(self):
        categories = {}
        results = self._fetch_results(self._sql_select_all % "categories")
        for cat in results:
            categories[cat[1]] = {"name":cat[1], "base_unit":cat[2], "ext_conv":cat[3]}
        return categories

    def _get_units(self, category):
        units = {}
        results = self._fetch_results(self._sql_select_all % category)
        for unit in results:
            units[unit[0]] = {"id":unit[0],"name":unit[1],"description":unit[2],"conversion":unit[3],"wiki_link":unit[4]}
        return units

# external functions
    def select_all(self, table):
        sql = self.sql_select_all % table
        return self._fetch_results(sql)

    def get_categories(self):
        self._db_open()
        categories = self._get_categories()
        self._db_close()
        return categories

    def get_units(self, category):
        self._db_open()
        units = self._get_units(category)
        self._db_close()
        return units

    def get_units_array(self, category):
        self._db_open()
        units = []
        results = self._fetch_results(self._sql_select_all % category)
        for unit in results:
            units.append({"id":unit[0],
                        "name":unit[1],
                        "description":unit[2],
                        "conversion":unit[3],
                        "wiki_link":unit[4],
                        "category":unit[5]})
        self._db_close()
        return units

    def get_all(self):
        self._db_open()
        categories = self._get_categories()
        for category in categories:
            units = self._get_units(category)
            categories[category]["units"] = {}
            for unit in units:
                categories[category]["units"][unit] = units[unit]
        return categories
