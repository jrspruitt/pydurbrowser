% import os
% from browser.page import page
% from browser.settings import tracking_code, editor_prefix, config_filename
<!DOCTYPE html>
<html>
    <head>
        <title>{{ item.config.title }}</title>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    % for meta in item.config.meta:
        {{! meta }}
    % end
        <link href="/assets/css/{{ item.config.theme }}/site.css" rel="stylesheet" type="text/css">
    % for css in item.config.css:
        <link href="{{ css }}" rel="stylesheet" type="text/css">
    % end
    % if item.config.styles:
        <style>
        % for style in item.config.styles:
                {{! style }}
        % end
        </style>
    % end
	<script type="text/javascript" src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    % for js in item.config.js:
        <script type="text/javascript" src="{{! js }}"></script>
    % end
    <script type="text/javascript">
    % if item.config.logged_in and isinstance(item, page):
    function admin_create(){
        % slash = '/'
        % if item.config.url == '':
        % slash = ''
        % end
        var base_url = "/{{ editor_prefix }}{{ item.config.url }}{{ slash }}";
        var name = $("#admin_create").val();
        if(name == ""){ return False; }
        var url = base_url + name;
        window.location = url;
    }
    function admin_dir(){
        % suffix = '/'
        % if item.config.url == '':
        % slash = ''
        % end
        var base_url = "/{{ editor_prefix }}createdirectory/{{ item.config.url }}{{ slash }}";
        var name = $("#admin_dir").val();
        if(name == ""){ return False; }
        var url = base_url + name;
        window.location = url;
    }
    % end
    $( document ).ready(function(){
    % if item.config.script:
        	{{! item.config.script }}
    % end
    });
    </script>
    </head>
<body>
    % if item.config.logged_in and isinstance(item, page):
    % edit = 'Edit' if item.config.is_parent else 'New'
        <a href="{{'/%s' % (os.path.join(editor_prefix, item.config.url, config_filename)) }}">{{ edit }} Config</a> | 
        <a href="javascript:admin_create();">Create</a> <input type="text" id="admin_create" value="" width="35" />  | 
        <a href="javascript:admin_dir();">New Dir</a> <input type="text" id="admin_dir" value="" width="35" /> 
    % end
    <div class="heading_container">
    	% if item.config.head_img:
    	<div>
    		<a href="{{ item.config.head_img_link }}">
    			<img src="{{ item.config.head_img }}" />
    		</a>
    	</div>
    	%end
        <div class="heading_content">
            <a class="title first_color bolder" href="{{ item.config.parent_url }}">{{ item.config.title }}</a>
        
            <div class="description">{{! item.config.desc }}</div>
        </div>
    </div>
    <div class="nav_menu">
        % if item.config.nav_link:
        <a href="{{ item.config.nav_link }}">Up/</a>
        % end          
    </div>

    <div class="content_container">
        {{! item.display }}
    </div>

    <div class="footer_content">
        <span class="legal">Built on: <a href="https://github.com/jrspruitt/pydurbrowser">pydurbrowser</a> &copy;2014 Jason Pruitt</span>
    </div>
    %if tracking_code:
    	{{! tracking_code }}
    %end
</body>
</html>
