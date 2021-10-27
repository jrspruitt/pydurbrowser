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
import re
from lxml import etree
from bottle import abort, request
from browser.settings import config_filename, desc_ext

class rules(object):
    """Rules object

    Args:
        List:config_files    List of config files found in path.

    Various methods for determining if files/dirs/handlers should be
    ignored, excluded or adding rules. Rules are inherited from path,
    back to doc_root. These are not subject to page inherit, will always
    be applied.

    pdb_config.xml contains regex, which items will be checked against.

    Excluded, no access ever allowed.
    Ignore, item can be accessed directly, but won't be listed.
    Ignore Filehandle, display item will be disabled, only showing as raw file.
    """

    def __init__(self, config_files, logged_in=False):
        self._logged_in = logged_in
        self._admin_users = []
        self._ignore_filehandlers = []
        self._ignore_files = []
        self._ignore_dirs = []

        self._exclude_files = []
        self._add_rule(config_filename, self._exclude_files)
        self._add_rule('.*\%s$' % desc_ext, self._exclude_files)
        self._add_rule(config_filename, self._ignore_files)
        self._add_rule('.*\%s$' % desc_ext, self._ignore_files)
        self._exclude_dirs = []

        for config_file in config_files:
            self.add_rules(config_file)


    def _set_admin_user(self, rule):
        self._add_user(rule, self._admin_users)
    def _get_admin_user(self):
        return self._admin_users
    admin_user = property(_get_admin_user, _set_admin_user)


    def _set_ignore_dir(self, rule):
        self._add_rule(rule, self._ignore_dirs)
    def _get_ignore_dirs(self):
        return self._ignore_dirs
    ignore_dirs = property(_get_ignore_dirs, _set_ignore_dir)


    def _set_ignore_file(self, rule):
        self._add_rule(rule, self._ignore_files)
    def _get_ignore_files(self):
        return self._ignore_files
    ignore_files = property(_get_ignore_files, _set_ignore_file)


    def _set_ignore_filehandler(self, rule):
        self._add_rule(rule, self._ignore_filehandlers)
    def _get_ignore_filehandlers(self):
        return self._ignore_filehandlers
    ignore_filehandlers = property(_get_ignore_filehandlers, _set_ignore_filehandler)


    def _set_exclude_dir(self, rule):
        self._add_rule(rule, self._exclude_dirs)
    def _get_exclude_dirs(self):
        return self._exclude_dirs
    exclude_dirs = property(_get_exclude_dirs, _set_exclude_dir)


    def _set_exclude_file(self, rule):
        self._add_rule(rule, self._exclude_files)
    def _get_exclude_files(self):
        return self._exclude_files
    exclude_files = property(_get_exclude_files, _set_exclude_file)


    def _add_rule(self, rule, rules_list):
        try:
            if rule:
                rule_compiled = re.compile(r'%s' % rule)
                if rule_compiled not in rules_list:
                    rules_list.append(rule_compiled)
        except re.error:
            pass


    def _add_user(self, username, user_list):
        try:
            user_list.append(username)
        except:
            pass
 
    def is_admin(self, username):
        """If give user is an admin for this path."""
        return username in self._admin_users

    def exclude_dir(self, path):
        """If directory should be excluded."""
        if self._logged_in:
            return False

        for rule in self.exclude_dirs:
            if rule.search(path):
                return True
        return False


    def ignore_dir(self, path):
        """If directory should be ignored."""
        for rule in self.ignore_dirs:
            if rule.search(path):
                return True
        return False


    def exclude_file(self, path):
        """If file should be excluded."""
        if self._logged_in:
            return False

        parent_dir = os.path.dirname(path)
        if self.exclude_dir(parent_dir):
            return True

        for rule in self.exclude_files:
            if rule.search(path):
                return True
        return False


    def ignore_file(self, path):
        """If file should be ignored."""
        for rule in self.ignore_files:
            if rule.search(path):
                return True
        return False


    def ignore_filehandler(self, path):
        """If file should be ignored for display."""
        for rule in self.ignore_filehandlers:
            if rule.search(path):
                return True
        return False


    def add_rules(self, path):
        """Add rules in config file to rules object.

        Args:
            Str:path      Path to config file.

        Adds any new rules found in config file.
        """
        rules = parse_xml(path)

        if rules is None:
            # Full panic, shutdown rules initiated.
            self.exclude_dirs = '.*'
            self.exclude_files = '.*'

        else:
            for exclude in rules['dirs']['exclude']['regex']:
                self.exclude_dirs = exclude
    
            for ignore in rules['dirs']['ignore']['regex']:
                self.ignore_dirs = ignore
    
            for exclude in rules['files']['exclude']['regex']:
                self.exclude_files = exclude
    
            for ignore in rules['files']['ignore']['regex']:
                self.ignore_files = ignore
    
            for ignore in rules['files']['show_raw']['regex']:
                self.ignore_filehandlers = ignore

            for user in rules['users']['admin']:
                self.admin_user = user

   
def parse_xml(path):
    """Parse XML config file for rules.

    Args:
        Str:path      Path to config file.

    Return:
        Dict:rules    Dict of various rules.
    """
    ret = {'dirs':{'exclude':{'regex':[]},
                   'ignore':{'regex':[]}},
           'files':{'exclude':{'regex':[]},
                    'ignore':{'regex':[]},
                    'show_raw':{'regex':[]}},
           'users':{'admin':[]},
           }

    try:
        try:
            root = etree.parse(path).getroot().find('rules')
        except:
            ret['dirs']['exclude']['regex'].append('*')
            ret['files']['exclude']['regex'].append('*')
            ret['users']['admin'] = []
            return ret

        excluded = root.find('dirs/exclude')
        if excluded is not None:
            for exclude in excluded.iterfind('regex'):
                if not exclude.text:
                    continue
                ret['dirs']['exclude']['regex'].append(exclude.text)

        ignored = root.find('dirs/ignore')
        if ignored is not None:
            for ignore in ignored.iterfind('regex'):
                if not ignore.text:
                    continue
                ret['dirs']['ignore']['regex'].append(ignore.text)

        excludef = root.find('files/exclude')
        if excludef is not None:
            for exclude in excludef.iterfind('regex'):
                if not exclude.text:
                    continue
                ret['files']['exclude']['regex'].append(exclude.text)

        ignoref = root.find('files/ignore')
        if ignoref is not None:
            for ignore in ignoref.iterfind('regex'):
                if not ignore.text:
                    continue
                ret['files']['ignore']['regex'].append(ignore.text)

        show_raw = root.find('files/show_raw')
        if show_raw is not None:
            for show_raw in show_raw.iterfind('regex'):
                if not show_raw.text:
                    continue
                ret['files']['show_raw']['regex'].append(show_raw.text)

        admin_user = root.find('users')
        if admin_user is not None:
            for admin_user in admin_user.iterfind('admin'):
                if not admin_user.text:
                    continue
                ret['users']['admin'].append(admin_user.text)

        return ret

    except Exception as e:
        print('Bad page config: %s %s' % (path, e))
        abort(500, 'Bad page config.')
