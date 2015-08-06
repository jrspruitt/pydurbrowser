<html>
    <head>
        <title>Config Editor</title>
        <style>
        .table { display:table; padding:10px; border-collapse: seperate; border-spacing:10px; border:solid 1px black; }
        .row { display:table-row; padding:10px; }
        .cell { display:table-cell;}
        textarea { height:250px; width:500px; }
        </style>
    </head>
<body>
<form action="{{ url }}" name="update" method="POST" enctype="multipart/form-data">
<h2>General</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            Title:
        </div>
    
        <div class="cell">
            <input type="text" name="title" value="{{ config['title'] }}" />
        </div>
   </div>
   <div class="row">
        <div class="cell">
            Desc:
        </div>
    
        <div class="cell">
            <textarea name="desc">{{ config['desc'] }}</textarea>
        </div>
   </div>
   <div class="row">
        <div class="cell">
            Head_Img:
        </div>
    
        <div class="cell">
            <input type="text" name="head_img" value="{{ config['head_img'] }}" />
        </div>
   </div>
   <div class="row">
        <div class="cell">
            Readme:
        </div>
        
        <div class="cell">
            <input type="text" name="readme" value="{{ config['readme'] }}" />
        </div>
   </div>
   <div class="row">
        <div class="cell">
            Theme:
        </div>
        
        <div class="cell">
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
            Inherit:
        </div>
        <div class="cell">
            <input type="checkbox" name="inherit" value="1" {{! checked }}/>
        </div>
    </div>
</div>


<h2>Heading</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            <h4>Script:</h4>
            <textarea name="script">{{ config['heading']['script'] }}</textarea>
        </div>
        <div class="cell">
            <h4>JS*:</h4>
            <textarea name="js">{{ '\n'.join(config['heading']['js']) }}</textarea>
        </div>
   </div>
   <div class="row">
        <div class="cell">
            <h4>Style:</h4>
            <textarea name="style">{{ config['heading']['style'] }}</textarea>
        </div>
        <div class="cell">
            <h4>CSS*:</h4>
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





* One file path per line.
<br />
<br />
<h2>Plugins</h2>
<div class="table">
    <div class="row">
        <div class="cell">
            <h3>Page:</h3>
            Page_Src: <input type="text" name="page_src" value="{{ config['page']['src'] }}" /><br />
            Page_Type: 
            <select name="page_type">
                %for type in plugins['page']:
                    % selected = 'selected="selected"' if type == config['page']['type'] else ''
                    <option value="{{ type }}" {{! selected }}>{{ type }}</option>
                %end
            </select><br />
            % plugins.pop('page', None)
        </div>
        % for plugin in plugins:
        <div class="cell">
            <h3>{{ plugin.capitalize() }}:</h3>
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
        </div>
        % end
    </div>
</div>

<h2>Rules</h2>
* One entry per line in each box

<div class="table">
    <div class="row">
        % for itemtype in config['rules']:
        <div class="cell">
                <h3>{{ itemtype }}</h3>
                <div class="table">
                    <div class="row">
                        <div class="cell">
                            %   for ruletype in config['rules'][itemtype]:
                                    <h4>{{ ruletype }}</h4>
                            %       for regexs in config['rules'][itemtype][ruletype]:
<textarea name="{{ itemtype }}_{{ ruletype }}">
                            %           for regex in config['rules'][itemtype][ruletype][regexs]:
{{! regex or ''}}
                            %           end
</textarea><br />
                            %       end
                            %   end
                        </div>
                    </div>
                </div>
        </div>
        % end
    </div>
</div>
Delete File:<input type="checkbox" name="delete" value="delete" /><br />
<input type="submit" value="submit" />
</form>
</body>
</html>