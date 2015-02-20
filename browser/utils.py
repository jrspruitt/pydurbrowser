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
from browser.settings import display_prefix

def display_url(path):
    """Create display url path"""
    if not path.startswith(display_prefix):
        return '%s%s' % (display_prefix, path.lstrip('/'))


def get_filesize(path):
    """ Get print friendly file size."""
    try:
        if not os.path.isdir(path):
            size = os.path.getsize(path)

            for label in ['B','KB','MB','GB']:
                if size < 1024.0:
                    if label == 'B':
                        return '%s%s' % (int(size), label)
                    else:
                        return "%3.1f%s" % (size, label)
                size /= 1024.0

            return "%3.1f%s" % (size, 'TB')
        else:
            return ''
    except:
        return ''
        
    