
window.onload=function(){
    mc.rounding = {{ config['rounding'] }};
	% items = "','".join([i['id'] for i in config['items']])
    mc.items = ['{{! items }}'];

    % for cat in config['measures']:
            % add_units = ''
            % idx = 0
            % for unit in config['measures'][cat]['units']:
                % if config['measures'][cat]['ext_conv'] != '1':
                    % add_units += '"%s":{label:"%s", conv:%s, idx:%s},' % (unit['id'], unit['label'], unit['conv'], idx)
                    % idx += 1
                % end
            % end
           mc.units["{{ config['measures'][cat]['name'] }}"]={convert_to:"{{ config['measures'][cat]['convert_to'] }}", {{! add_units }}};
    % end

% for js in ext_js:
        {{ js.strip('.js') }}();
% end
    
    mc.inputs_init();
    
% for item in config['items']:
	mc.{{ item['id'] }}.type = "{{ item['type'] }}";
    % if item['type'] == 'graph':
        mc.{{ item['id'] }}.grid.type='{{ item['config']['type'] }}';
        mc.{{ item['id'] }}.grid.align='{{ item['config']['align'] }}';
        mc.{{ item['id'] }}.xlabel('{{ item['config']['xlabel'] }}');
        mc.{{ item['id'] }}.ylabel('{{ item['config']['ylabel'] }}');

    % elif item['type'] == 'calc':
        % if item['config']['display']['value'] == '':
        mc.{{ item['id'] }}.dvalue='';
        % else:
        mc.{{ item['id'] }}.dvalue={{ item['config']['display']['value'] }};
        % end
        % if 'units' in item['config']['display']:
        % udefault = item['config']['display']['units']['default']
        % usi = item['config']['display']['units']['si']
        mc.{{ item['id'] }}.u.display={udefault:'{{ udefault }}',si:'{{ usi }}'};
        mc.{{ item['id'] }}.u.unit='{{ udefault }}';
        % end
        mc.{{ item['id'] }}.u.cat='{{ item['config']['category'] }}';
        mc._html_calc_unit_options('{{ item['id'] }}');

    % elif item['type'] == 'choice':
    % options = ''
    % cdefault = ''
    % selected = ''
    % for option in item['config']['options']:
        % if cdefault == '' or selected == '':
            % cdefault = option['value']
            % selected = option['value']
        % end
        % options += '{label:"%s", value:"%s"},' % (option['label'], option['value'])
        % if option['selected'].lower() == 'true':
            % cdefault = option['value']
            % selected = option['value']
        % end
    % end

    mc.{{ item['id'] }}.cdefault = '{{ cdefault }}';
    mc.{{ item['id'] }}.selected = '{{ selected }}';
    mc.{{ item['id'] }}.options = [{{! options }}];
    mc._html_choice_options('{{ item['id'] }}');
    % end
% end
};