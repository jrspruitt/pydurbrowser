# pydurbrowser #
## Python/bottle.py based dynamic web index page generator. ##

January 2014

**Description**

Pydurbrowser allows configuring a per directory index page styling. Plugins are used to define the style of each listed element and page type. There is also functionality for displaying individual file types, such as an image, that includes text from a file to add a description. The pages look for readme.md files, and display the contents along with the file list, making it nice for easy project display. Each directory configuration includes provisions for excluding and ignore files with regular expressions. Exclude prevents any access of the file or directory, while ignore simply means you must have a direct link, as it will not get listed. You can also specify with a regular expression if a file should not be displayed with a display plugin, for example, an html page you want to show instead of displayed with the source code plugin.

## Install ##
### Requirements: ###
* Python, bottle.py, python-markdown
* Web server, Apache used here.

### Configuring ###

Clone pydurbrowser to a directory outside of the document root you want to serve files from.

Rename browser/settings.py.sample to browser/settings.py and configure as needed.

Create a vhost file in /etc/apache2/sites-available/

Everything is fairly standard except we'll need to create Directory entries for pydurbrowser and its assets folder as shown below. /var/www is the document root where the files to serve are, /var/pydurbrowser is the application root directory, where we cloned the app to. /var/pydurbrowser/assets/ is where the sites CSS and Javascript files are held.

**Note**
If you have other services in in this vhost, like a Git repo page, Trac, Redmine, blog, wiki, etc. Be sure to configure those in here, so Apache passes off requests to the right service, otherwise pydurbrowser will capture the URLs and process them itself.

Apache Vhost Config
        <VirtualHost *:80>
            ServerName server_name
            DocumentRoot /var/www/mysite

            <Directory /var/www/mysite>
                Options -Indexes
                AllowOverride None
                order allow,deny
                Allow from all
            </Directory>

            WSGIDaemonProcess pydurbrowser user=www-data group=www-data processes=1 threads=5
            WSGIScriptAlias / /var/www/pydurbrowser/app.wsgi
            <Directory /var/www/pydurbrowser>
                WSGIProcessGroup pydurbrowser
                WSGIApplicationGroup %{GLOBAL}
                Options -Indexes
                Order deny,allow
                Allow from all
            </Directory>

            Alias /assets "/var/www/pydurbrowser/assets"
            <Directory /var/www/pydrubrowser/assets>
                Options -Indexes
                Order deny,allow
                Allow from all
            </Directory>
        </VirtualHost>

Next step is to put the pdb\_config.xml configuration file in document root /var/www/pdb\_config.xml. Only this one is absolutely required for the site to work. If for some reason pdb\_config.xml clashes with other file names, you can change pydurbrowser/browser/settings.py config\_fileaname to use a different name. These config files are excluded from listing. This is a sample config file.

        <durbrowser>
	        <uid>Unique ID</uid>
            <title>Title</title>
            <desc>Description.</desc>
            <heading>
                <meta>HTML tag to include in page heading, use CDATA around it.</meta>
            </heading>
            <page>
            	<type>Page Type</type>
		        <inherit>[True, False] or [1, 0]</inherit>
		        <list>
			        <plugin>Plugins for list items.</plugin>
		        </list>
            </page>
	        <display>
		        <plugin>Plugins for file display.</plugin>
	        </display>
	        <files>
		        <exclude>
	                <regex>Reguler Expressions</regex>
		        </exclude>
		        <ignore>
			        <regex></regex>
		        </ignore>
		        <show_raw>
			        <regex></regex>
		        </show_raw>
            </files>
	        <dirs>
		        <exclude>
		                <regex></regex>
		        </exclude>
		        <ignore>
				        <regex></regex>
		        </ignore>
            </dirs>
        </durbrowser>

**uid** - Currently unused, but could be useful if adding plugin with database requirements.

**Title** - Title to display on page, and all child directories with out their own configurations.

**Desc** - Page description below title.

**Heading/Meta** - code to insert into head area of webpage, must be wrapped in CDATA

**Page**
* **Type** - Page type, currently default, or img\_gallery. This determines which plugin is used for page display
* **Inherit** - True, False, 1, or 0, if unconfigured child directories should inherit page type and list plugins.
* **List/plugin** - Ordered list of plugins to use for the listed items, empty = directory and file defaults only, "all" uses all available, Or specify which ones with the plugin element. They will be applied in order, as each plugin checks if the file/dir applies to it or not. You can use "all" then add plugin elements, prefixing "-" to the plugin in name, to remove that one from the selection. Of note, "all" will only gurauntee that dir and file are applied last, as they are the greediest, with file always being applied, and dir merely checking if it is a directory or not.

**Display/Plugin** - These are the plugins to enable showing specific file types in their own page, such source code, show with highlighting, instead of letting the browser show it just as text.

**Files/Exclude/Regex** - Exclude file from being accessed, either by listing, or direct URL.

**Files/Include/Regex** - Ignore file from listing, but allow direct URL access.

**Files/Show_raw/Regex** - Never use a display plugin on files matching this regular expression.


**Dirs/Exclude/Regex** - Exclude directory from being accessed, either by listing, or direct URL.

**Dirs/Include/Regex** - Ignore directory from listing, but allow direct URL access.

### Basic Concepts ###

**Config** - This is the main set of config options, title, desc, meta, etc. These are carried from the directory the pdb\_config.xml file to every child directory, unless another pdb\_config.xml file is found in the path. This is the main HTML container, found in views/main.tpl, which is responsible for the page heading display, HTML head/body tags, and internally several other generic settings. Internally this is found in browser/config/parse.py and is passed to xfile and page objects.

**Include/Exclude** - Exclude prevents all access to a file/dir, where Ignore only prevents the file/dir from being listed. These settings are always inherited by child configs. So file/exclude/regex (.*).bak in the main config, will exclude/ignore every file matching that expression, regardless of other config files found in the path. Internally found in browser/config/rules.py

**Display** - Display plugins, these are plugins that accessing a file directly will check to see if it applies, and use it for creating page HTML. This is similar to how a Page works, except it is for files, instead of directories. URLs prefaced with /display will be checked in this system. Internally this applies to the browser/xfile.py file object and found in browser/plugins/display/* with plugins having thier own template for generated HTML.

**Page** - This configures the page shown, such as the list of files in a directory, or image gallery. Page has a list of "items" files, or directories, that have been marked up with a list plugin. Internally found in browser/page.py and browser/plugins/page/* each pluging has its own template for creating the container for items.

**items** - These are files or directories found in the directory requested. They get processed to see which list plugins apply, and will apply the template and any processing to the item found in the plugin. Internally found in browser/plugins/list/* the Page plugin gathers all the items, for insertion into the page.
