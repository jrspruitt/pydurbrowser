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
from PIL import Image
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
        

def process_thumbnail(item):
    twidth = 320
    theight = 240
    thumbs_dir = os.path.join(os.path.dirname(item.path), '_thumbnails')
    thumb_path = os.path.join(thumbs_dir, item.name)
    thumb_url = os.path.join(os.path.dirname(item.url), '_thumbnails', item.name)
    item.thumb_url = thumb_url

    if not os.path.exists(thumbs_dir):
        try:
            os.mkdir(thumbs_dir)
        except:
            return


    try:
        im = Image.open(item.path)
        width = im.size[0]
        height = im.size[1]

        if height > width:
            width = int((float(theight) / float(height)) * width)
            height = int(theight)
        else:
            height = int((float(twidth) / float(width)) * height)
            width = twidth

        item.width = width
        item.height = height

        if os.path.exists(thumb_path):
            return

        size = (width, height)
        im_resize = im.resize(size, Image.ANTIALIAS)
        im_resize.save(thumb_path)
    except:
        item.thumb_url = item.url