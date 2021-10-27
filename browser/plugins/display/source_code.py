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
import time

from bottle import template
from browser.settings import config_filename

match = 2

def check(xfile):
    if xfile.name == config_filename:
        return False

    ext = os.path.splitext(xfile.name)[1]
    exts = ["abap","asp","asax","ascx","ashx","asmx","aspx","axd","as","adb","ads","apacheconf","cls",
            "applescript","arc","ino","asm","aug","ahk","awk","gawk","mawk","nawk","bat","cmd","befunge","bmx","boo",
            "b","bf","bro","c","w","cs","cpp","c","c++","cxx","h","h++","hh","hxx","tcc","c-objdump","chs","clp",
            "cmake","cmake.in","txt","css","ceylon","ck","clj","cljs","coffee","_coffee","cson","cfm","cfc","lisp",
            "asd","lsp","ny","coq","cppobjdump","c++objdump","cxx-objdump","feature","pyx","pxd","pxi","d","di","d-objdump",
            "dot","gv","darcspatch","dpatch","dart","pas","dfm","lpr","dasm16","dasm","diff","dylan","epj","ecl","eclxml",
            "e","ex","exs","elm","el","emacs","erl","hrl","fs","fsi","fsx","f90","f","f03","f08","f77","f90","f95","for",
            "fpp","f","f03","f08","f77","f95","for","fpp","factor","fy","fancypack","fan","fth","4th","s","s","kid","ebuild",
            "eclass","po","pot","go","gs","man","1'","2'","3'","4'","5'","6'","7'","groovy","gsp","html","htm","xhtml",
            "mustache","mustache","erb","erb.deface","html.erb","html.erb.deface","phtml","http","haml","haml.deface",
            "html.haml.deface","handlebars","hs","hsc","hx","hxsl","cfg","ini","prefs","properties","ini","irclog","weechatlog",
            "io","ik","json","java","pde","jsp","js","_js","bones","jake","jsfl","jsm","jss","jsx","pac","sjs","ssjs","jl","kt",
            "ktm","kts","ll","lasso","less","ly","ily","litcoffee","lhs","ls","_ls","xm","x","xi","xmi","lgt","lua","nse","mak",
            "mk","mak","mako","mao","ron","matlab","mxt","maxhelp","maxpat","minid","druby","duby",
            "mir","mirah","monkey","moo","moon","myt","nsi","n","nginxconf","nim","nimrod","nu","numpy","numpyw","numsc","ml",
            "eliomi","mli","mll","mly","objdump","m","mm","j","sj","omgrofl","opa","cl","opencl","p","php","aw","ctp","php3","php4",
            "php5","phpt","parrot","pir","pasm","patch","pl","pl","perl","ph","plx","pm6","pod","psgi","pike","pmod","pogo","ps1",
            "prolog","pro","pp","pp","pd","py","gyp","pyw","py","xpy","pytb","r","rhtml","rkt","rktd","rktl","rl","raw","rebol",
            "r2","r3","cw","rg","rb","builder","gemspec","god","irbrc","podspec","rbuild","rbw","rbx","ru","thor","watchr","rs",
            "scss","sql","sage","sass","scala","scm","sls","ss","sci","self","sh","tmux","st","tpl","sml","sc","toml","txl","tcl",
            "tcsh","csh","tex","aux","dtx","ins","ltx","sty","toc","tea","textile","t","tu","twig","ts","vhdl","vala","vapi","v",
            "sv","svh","vh","vim","net","vb","bas","frx","vba","vbs","xml","ccxml","dita","ditamap","ditaval","glade","grxml","kml",
            "mxml","plist","pt","rdf","rss","scxml","svg","tmcommand","tmlanguage","tmpreferences","tmsnippet","tml","vxml","wsdl",
            "wxi","wxl","wxs","xaml","xlf","xliff","xsd","xul","zcml","classpath","project","xpl","xproc","xquery","xq","xqy","xs",
            "xslt","xsl","xtend","yml","yaml","ec","eh","edn","fish","mu","ooc","rst","rest"]

    if ext.lower()[1:] in exts:
        return True
    return False

def handler(xfile):
    xfile.code = 'Load Error.'
    with open(xfile.path, 'r', encoding='utf8') as f:
        xfile.code = f.read()

    xfile.config.js.append('https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js?skin=sunburst')
    xfile.display = template('display/source_code.tpl', xfile=xfile)
