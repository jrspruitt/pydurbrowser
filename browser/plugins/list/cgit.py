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
from subprocess import check_output
from bottle import template
from browser.config.rules import rules
from browser.settings import config_filename, desc_ext

name = 'cgit'
match = 100
order = 100

def cgitrc_parser(path):
    lines = []
    filename = os.path.basename(path);
    name = filename[0:-4] if filename.endswith('.git') else filename
    desc = 'cgit description'
    path = os.path.join(path, 'cgitrc')
    rgx_name = re.compile('^name[ ]*=[ ]*')
    rgx_desc = re.compile('^desc[ ]*=[ ]*')

    if os.path.exists(path):
        with open(path, 'r', encoding='utf8') as f:
            lines = f.readlines()

        for line in lines:
            line = line.rstrip()

            if re.match(rgx_name, line):
                name = re.sub(rgx_name, '', line, 1)
            elif re.match(rgx_desc, line):
                desc = re.sub(rgx_desc, '', line, 1)

    return name, desc

def check(item):
    if not os.path.isdir(item.path):
        return False

    ret = os.system('git rev-parse --resolve-git-dir "%s" 2>&1 >/dev/null' % item.path)

    if ret == 0:        
        return True
    else:
        return False

def handler(item, config):
    try:
        date = check_output('git show -s --format=%ad', cwd=item.path, shell=True)
        item.mtime = date.rpartition(' ')[0]
    except:
        pass

    item.name, item.cgit_desc = cgitrc_parser(item.path)
    item.repo = {}

    try:
        commit = check_output('git log --pretty=short -n 1', cwd=item.path, shell=True)
        if commit:
            item.repo['commit'] = {}
            item.repo['commit']['msgs'] = []

            for line in commit.split(b'\n'):
                line = line.strip()

                if line.startswith(b'commit'):
                    ghash = line.split()[1]
                    item.repo['commit']['hash'] = ghash.decode('utf-8')

                elif line.startswith(b'Author'):
                    try:
                        parts = line.split()
                        email = parts[-1]
                        name = b' '.join(parts[1:-1])

                    except Exception as e:
                        name = 'Nobody'
                        email = ''

                    email = email.lstrip(b'<').rstrip(b'>')
                    item.repo['commit']['name'] = name.decode('utf-8')
                    item.repo['commit']['email'] = email.decode('utf-8')

                elif line != b'':
                    item.repo['commit']['msgs'].append(line.decode('utf-8'))


        branches = check_output('git branch -a', cwd=item.path, shell=True)
        if branches:
            item.repo['branches'] = {}
            item.repo['branches']['names'] = []
            for branch in branches.split(b'\n'):
                branch = branch.lstrip()

                if branch.startswith(b'*'):
                    branch = branch[1:].lstrip()
                    item.repo['branches']['selected_branch'] = branch.decode('utf-8')

                item.repo['branches']['names'].append(branch)

    except:
        pass

    item.display = template('lists/cgit.tpl', item=item, config=config)
