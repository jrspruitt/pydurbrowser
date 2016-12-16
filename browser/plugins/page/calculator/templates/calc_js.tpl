
window.onload=function(){
    mc.rounding = {{ config['rounding'] }};
	% items = "','".join([i['id'] for i in config['items']])
    mc.items = ['{{! items }}'];
    
    mc.inputs_init();
    
% for item in config['items']:
	mc.{{ item['id'] }}.type = "{{ item['type'] }}";
    % if item['type'] == 'graph':
        mc.{{ item['id'] }}.grid.type='{{ item['config']['type'] }}';
        mc.{{ item['id'] }}.grid.align='{{ item['config']['align'] }}';
        mc.{{ item['id'] }}.grid.center_major_x0={{ 'true' if item['config']['centerX0']=='1' else 'false' }};
        mc.{{ item['id'] }}.grid.center_major_y0={{ 'true' if item['config']['centerY0']=='1' else 'false' }};

    % elif item['type'] == 'calc':
        % if item['config']['display']['value'] == '':
        mc.{{ item['id'] }}.dvalue='';
        % else:
        mc.{{ item['id'] }}.dvalue={{ item['config']['display']['value'] }};
        % end
        mc.{{ item['id'] }}.radix={{ item['config']['display']['radix'] }};
        % if 'units' in item['config']['display']:
        % udefault = item['config']['display']['units']['default']
        % usi = item['config']['display']['units']['si']
        % utypes = '","'.join(item['config']['display']['units']['types'])
        mc.{{ item['id'] }}.u.display={udefault:'{{ udefault }}',si:'{{ usi }}', types:["{{! utypes }}"]};
        mc.{{ item['id'] }}.u.unit='{{ udefault }}';
        % end
        mc.{{ item['id'] }}.u.cat='{{ item['config']['category'] }}';
        % if item['config']['category'] != 'None':
                % if item['config']['convert_to'] != 'None':
        mc.{{ item['id'] }}.u.convert_to='{{ item['config']['convert_to'] }}';
                % else:
        mc.{{ item['id'] }}.u.convert_to=mc.units.{{ item['config']['category'] }}.convert_to;
                % end
        % end
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