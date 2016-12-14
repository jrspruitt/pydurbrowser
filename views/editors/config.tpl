<html>
    <head>
        <title>Config Editor</title>
        <style>
        .table { display:table; padding:2px; border-collapse: seperate; border-spacing:10px; border:solid 1px black; }
        .row { display:table-row; padding:2px; }
        .cell { display:table-cell;}
        textarea { height:45px; width:500px; }
        input[type="text"] { width:500px; }
        h4 { margin-bottom:-2px; margin-top:10px;}
        </style>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
    <script>
    $( function() {
        $( "#accordion" ).accordion({
            collapsible: true,
            heightStyle: "content",
            animate: false
        });
    });
    </script>
    </head>
<body>
<h1>Configuration Editor</h1>
% if config['init']:
<form action="{{ url }}" name="update" method="POST" enctype="multipart/form-data" onsubmit="return confirm('Delete Configuration?');">
<input type="hidden" name="delete" value="delete" />
<input type="hidden" value="config" name="etype" />
<input type="submit" value="Delete"/>
</form>
% end

<form action="{{ url }}" name="update" method="POST" enctype="multipart/form-data">
<input type="hidden" value="config" name="etype" />
<div id="accordion">

<h2>General</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            <h4>Title:</h4>
            <input type="text" name="title" value="{{ config['title'] }}" />
        </div>
   </div>
   <div class="row">
        <div class="cell">
            <h4>Description:</h4>
            <textarea name="desc">{{ config['desc'] }}</textarea>
        </div>
   </div>
   <div class="row">
        <div class="cell">
            <h4>Heading Image:</h4>
            <input type="text" name="head_img" value="{{ config['head_img'] }}" />
        </div>
   </div>
   <div class="row">
        <div class="cell">
            <h4>Readme:</h4>
            <input type="text" name="readme" value="{{ config['readme'] }}" />
        </div>
   </div>
   <div class="row">
        <div class="cell">
            <h4>Theme:</h4>
            <select name=theme>
                <option value=""{{ ' selected=selected' if config['theme'] == '' else '' }}>Inherit</option>
            % for theme in themes:
                <option value="{{ theme }}"{{ ' selected=selected' if theme == config['theme'] else '' }}>{{ theme }}</option>
            % end
            </select>
        </div>
   </div>
   <div class="row">
        <div class="cell">
            % checked = 'checked="checked"' if config['inherit'] == '1' else ''
            <h4>Children Inherit Config:
            <input type="checkbox" name="inherit" value="1" {{! checked }}/></h4>
        </div>
    </div>
</div>


<h2>Heading</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            <h4>Javascript Code:</h4>
            <textarea name="script">{{ config['heading']['script'] }}</textarea>
        </div>
    </div>    
   <div class="row">
        <div class="cell">
            <h4>Javascript Included Files (one per line):</h4>
            <textarea name="js">{{ '\n'.join(config['heading']['js']) }}</textarea>
        </div>
   </div>
   <div class="row">
        <div class="cell">
            <h4>CSS Style Code:</h4>
            <textarea name="style">{{ config['heading']['style'] }}</textarea>
        </div>
    </div>    
   <div class="row">
        <div class="cell">
            <h4>CSS Included Files (one per line):</h4>
            <textarea name="css">{{ '\n'.join(config['heading']['css']) }}</textarea>
        </div>
    </div>    
   <div class="row">
        <div class="cell">
            <h4>Meta:</h4>
            <textarea name="meta">{{ '\n'.join(config['heading']['meta']) }}</textarea>
        </div>
    </div>
</div>


<h2>Page</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            <h4>Page Source File:</h4>
            <input type="text" name="page_src" value="{{ config['page']['src'] }}" /><br />
        </div>
    </div>
    <div class="row">
        <div class="cell">
            <h4>Page Type:</h4> 
            <select name="page_type">
                %for type in plugins['page']:
                    % selected = 'selected="selected"' if type == config['page']['type'] else ''
                    <option value="{{ type }}" {{! selected }}>{{ type }}</option>
                %end
            </select>
            % plugins.pop('page', None)
        </div>
    </div>
</div>

<h2>Plugins</h2>
<div class="table">
        % for plugin in plugins:
    <div class="row">
        <div class="cell">
            <h4>{{ plugin.capitalize() }}:</h4>
            <select name="{{ plugin }}" multiple="multiple" style="height:150px;">
                % selected = 'selected="selected"' if 'all' in config[plugin]['plugins'] else ''
                <option value="all" {{! selected }}>all</option>
                % for type in plugins[plugin]:
                    % selected = 'selected="selected"' if type in config[plugin]['plugins'] else ''
                    <option value="{{ type }}" {{! selected }}>{{ type }}</option>
                    % type_neg = '-%s' % type
                    % selected = 'selected="selected"' if type_neg in config[plugin]['plugins'] else ''
                    <option value="{{ type_neg }}" {{! selected }}>{{ type_neg }}</option>
                %end
           </select>
           <br />
        </div>
    </div>
        % end
</div>


<h2>Rules</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            * One regex entry per line.
        </div>
    </div>
        % for itemtype in config['rules']:
                <h4>{{ itemtype }}</h4>
                <div class="table">
                    <div class="row">
                        <div class="cell">
                            %   for ruletype in config['rules'][itemtype]:
                                    <h4>{{ ruletype }}</h4>
                            %   if not isinstance(config['rules'][itemtype][ruletype], list):
                            %       for regexs in config['rules'][itemtype][ruletype]:
<textarea name="{{ itemtype }}_{{ ruletype }}">
                            %           for regex in config['rules'][itemtype][ruletype][regexs]:
{{! regex or ''}}
                            %           end
</textarea><br />
                            %       end
                            %   else:
<textarea name="{{ itemtype }}_{{ ruletype }}">
                            %       for rule_item in config['rules'][itemtype][ruletype]:
{{! rule_item or ''}}
                            %       end
</textarea><br />
                            %   end
                            %   end
                        </div>
                    </div>
                </div>
        % end
</div>
</div>
<br />
<br />
<input type="submit" value="Submit" />
</form>
</body>
</html>