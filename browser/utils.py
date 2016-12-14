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
cleanup_counter = 0

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
    _process_image(item, 320, 240, '_thumbnails')

def process_displayimg(item):
    _process_image(item, 800, 600, '_displayimgs')

def _process_image(item, rwidth, rheight, img_dir):
    global cleanup_counter
    if cleanup_counter < 25:
        cleanup_counter += 1
    else:
        _cleanup_images(os.path.dirname(item.path))
        cleanup_counter = 0

    rimg_dir = os.path.join(os.path.dirname(item.path), img_dir)
    rimg_path = os.path.join(rimg_dir, item.name)
    rimg_url = os.path.join(os.path.dirname(item.url), img_dir, item.name)
    item.resized_img_url = rimg_url
    item.resized_img_path = rimg_path

    if os.path.exists(rimg_path):
        return

    if not os.path.exists(rimg_dir):
        try:
            os.mkdir(rimg_dir)
        except:
            return

    try:
        with Image.open(item.path) as im:
            im.thumbnail([rwidth, rheight], Image.ANTIALIAS)
            im.save(rimg_path)
    except Exception as e:
        print e
        item.resized_img_url = item.url
        item.resized_img_path = item.path

def _list_dir(path):

    items = []
    for item in os.listdir(path):
        item_path = os.path.join(path, item)

        if os.path.isfile(item_path):
            items.append(item)

    return items

def _cleanup_images(path):
    images = _list_dir(path)
    thumbs = _list_dir(os.path.join(path, '_thumbnails'))
    display = _list_dir(os.path.join(path, '_displayimgs'))

    for image in images:
        if image in thumbs:
            del thumbs[thumbs.index(image)]

        if image in display:
            del display[display.index(image)]

    if len(thumbs):
        for t in thumbs:
            tpath = os.path.join(path, '_thumbnails', t)

            if os.path.exists(tpath):
                os.remove(tpath)

    if len(display):
        for d in display:
            dpath = os.path.join(path, '_displayimgs', d)

            if os.path.exists(dpath):
                os.remove(dpath)

