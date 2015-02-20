/**
 * @license Mechcalc Copyright 2013 Jason Pruitt	
 * This file is part of Mechcalc.
 *
 * Mechcalc is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Mechcalc is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mechcalc.  If not, see <http://www.gnu.org/licenses/>.
 */

function mechcalc(){
	this.i = new Object();
	this.units = new Object();
	this.rounding = 0;
	this.cur_item = '';
	this.type_calc = 'calc';
	this.type_choice = 'choice';
	this.type_graph = 'graph';
	this.type_label = 'label';
	this.type_seperator = 'seperator';
	this.type_diagram = 'diagram';
	this.no_category = 'None';
	this.err_val = 'error';
	this.err_num = 'Must be a number.';


	/**********************************************************
	 * Input Object Functions 	
	 */

	/*
	 * Input object.
	 * 
	 * t - Reference to parent this.
	 * id - input id.
	 * elem - input element.
	 */
	this._input = function(t, id, elem){
		this.type = t.type_choice;
		this.id = id;
		this.elem = elem;
		this.value = elem.value;
		this.dvalue = '';
		this.u = {'cat':'', 'unit':'', 'elem':''};
		this.u.display = {'udefault':'', 'si':''};
		this.error_msg = '';
		this.used = false;
		
		this.valid = new t._valid(t, this);

		var select = document.getElementById('mcalc_' + this.id + '_unit_select');
		if(select){
			this.u.elem = select;
			t._html_calc_add_events(t, this)
		}
	}

	/*
	 * Choice object.
	 * 
	 * t - Reference to parent this.
	 * id - input id.
	 * elem - input element.
	 */
	this._choice = function(t, id, elem){
		this.type = t.type_choice;
		this.id = id;
		this.elem = elem;
		this.value = t._get_selected_value(this);
	}

	/*
	 * Diagram object.
	 */
	this._diagram = function(t, id, elem){
		this.type = t.type_diagram;
		this.id = id;
		t._html_showhide_add_event(this.id);
	}

	/*
	 * Validation object for enhanced input testing.
	 * 
	 * t - Reference to parent this.
	 * inp - Reference to parent input object.
	 */
	this._valid = function(t, inp){
		this.gt = false;
		this.gteq = false;
		this.lt = false;
		this.lteq = false;
		this.eq = false;
		this.not = false;
		this.clear = function(){ this.gt = this.gteq = this.lt = this.lteq = this.eq = this.not = false; }
		this.func_gt = function(){ this.func(inp.value > this.gt, '> than ', this.gt); };
		this.func_gteq = function(){ this.func(inp.value >= this.gteq,  '>= to ', this.gteq); };
		this.func_lt = function(){ this.func(inp.value  < this.lt, '< than ', this.lt); };
		this.func_lteq = function(){ this.func(inp.value <= this.lteq, '<= to', this.lteq); };
		this.func_eq = function(){ this.func(inp.value == this.eq || '= to ', this.eq); };
		this.func_not = function(){ this.func(inp.value != this.not, '!= to ', this.not); };
		this.func = function(exp, msg, value){
			if(!t.is_number(value)){ return false; };
			if(inp.u.cat != t.no_category){
				var value = t.convert_value_to_selected(inp, value);
			}else{
				var value = inp.value
			}

			if(!exp){
				t._set_error(inp, msg + t._format_rounder(value));
				return false;
			}else{
				return true;
			}
		};
	}

	/*
	 * Initialize all the inputs.
	 */
	this.inputs_init = function(url){
		this._html_rounding();
		this._html_control_add_events();

		for(var i = 0; i < this.items.length; i++){
			var id = this.items[i];
			var elem = document.getElementById('mcalc_' + id);
			if (!elem){continue;}

			if(elem.className == 'mcalc_input'){
				this[id] = new this._input(this, id, elem);

			}else if(elem.className == 'mcalc_choice'){
				this[id] = new this._choice(this, id, elem);

			}else if(elem.className == 'mcalc_graph'){
				this[id] = new this.graph(this, id, elem)

			}else if(elem.className == 'mcalc_diagram'){
				this[id] = new this._diagram(this, id, elem);
				
			}else{
				this[id] = new Object();
				this[id].type = '';
			}

			this.i[id] = this[id];
		}
	}


	/**********************************************************
	 * HTML Structure Functions 	
	 */

	/*
	 * Add event listeners to control buttons
	 */
	this._html_control_add_events = function(){
		var t = this;
		var cset = document.getElementById('mcalc_control_set');
		cset.addEventListener('click', function(){t.control_units_set_defaults();})

		var cdef = document.getElementById('mcalc_control_default');
		cdef.addEventListener('click', function(){t.control_units_system('udefault');})

		var csi = document.getElementById('mcalc_control_si');
		csi.addEventListener('click', function(){t.control_units_system('si');})		
	}

	/*
	 * Add event listeners for graph mouseovers
	 * 
	 * elem - Reference to canvas element.
	 * id - id of graph.
	 */
	this._html_graph_add_events = function(elem, id){
		var t = this;
        elem.addEventListener('mousemove', function(event){t.i[id].xyfloat(event)}, false)
        elem.addEventListener('click', function(event){t.i[id].xyfloat_enable(event)}, false)
        elem.addEventListener('mouseout', function(event){t.i[id].xyfloat_off()}, false)

        var btn_elem = document.getElementById('mcalc_graph_btn_' + id);
        btn_elem.addEventListener('click', function(){t['graph_' + id]()}, false);
	}

	/*
	 * Setup rounding select box. Uses this.rounding as set in the config.
	 */
	this._html_rounding = function(){
		var opts = [1, 10, 100, 1000, 10000, 100000]
		var select = document.getElementById('mcalc_round');
		this._html_create_option(select, 'Rounding', 0);
		this._html_create_option(select, 'None', 0);

		for(var i = 0; i < opts.length; i++){
			this._html_create_option(select, 1/opts[i], opts[i]);
		}
		this._set_select_option_by_value(select, this.rounding);
	}

	/*
	 * Creates an <option> element for a select box, returns
	 * option element.
	 * 
	 * select_elem - Select element to add to.
	 * text - Text to use for option.
	 * value - Value to use for the option.
	 * 
	 * returns - new length of select options.
	 */
	this._html_create_option = function(select_elem, text, value){
		var opt_elem = document.createElement('option');
		opt_elem.text = text;
		opt_elem.value = value;
		select_elem.add(opt_elem);
		return select_elem.options.length;
	}

	/*
	 * Add javascript controls for the showhide buttons
	 * 
	 * id - id of input item.
	 */
	this._html_showhide_add_event = function(id){
		var elem = document.getElementById('mcalc_' + id + '_sh');
		elem.href = 'javascript:mc.control_showhide("' + id + '")';
	}

	/*
	 * Populate calc item units select options
	 * 
	 * id - id of input item
	 */
	this._html_calc_unit_options = function(id){
		if(this.i[id].u.cat == this.no_category){return;}
		var units = this.units[this.i[id].u.cat];
		var u = [units.length-1];

		for(unit in units){
			if(unit == "convert_to"){continue;}
			u[units[unit]['idx']] = ([unit, units[unit]['label']])
		}
		
		for(var i = 0; i < u.length; i++){
			text = u[i][1] || u[i][0];
			this._html_create_option(this.i[id].u.elem, text, u[i][0]);
		}

		this._set_select_option_by_value(this.i[id].u.elem, this.i[id].u.display.udefault);
	}

	/*
	 * Add event listeners to calc input unit select.
	 * 
	 * t - Reference to parent this.
	 * inp - input objec to us.
	 */
	this._html_calc_add_events = function(t, inp){
		inp.u.elem.addEventListener('change', function(){t.control_units_conv(inp.id);});
		document.getElementById('mcalc_' + inp.id + '_btn').addEventListener('click',function(){t.cur_item=inp.id;t['calc_' + inp.id]();});
	}

	/*
	 * Populate choice input select box.
	 * 
	 * id - id of input to use.
	 */
	this._html_choice_options = function(id){
		for(var i = 0; i < this.i[id].options.length; i++){
			this._html_create_option(this.i[id].elem, this.i[id].options[i]['label'], this.i[id].options[i]['value'])
		}
		this._set_select_option_by_value(this.i[id].elem, this.i[id].selected);
	}

	/**********************************************************
	 * User Input Functions 	
	 */

	/*
	 * Get all input objects values from GUI input boxes.
	 *    See this.get() for more info.
	 *
	 * list - List of inputs to get.
	 * gui - True show gui errors/valid (default), false do not show.
	 * Returns: True no errors, false on at least one error.
	 */
	this.get_list = function(list, gui){
		var error = false;

		for(id in list){
			if(list[id].type == this.type_calc){
				if(!this.get(list[id], gui)){
					error = true;
				}

			}else if(list[id].type == this.type_choice){
				list[id].value = this._get_selected_value(list[id]);
			}
		}

		if(error){
			return false;
		}else{
			return true;
		}
	}

	/*
	 * Get all input objects values from GUI input boxes.
	 *    Except this.cur_item which is set by calc button.
	 *    See this.get() for more info.
	 *
	 * gui - True show gui errors/valid (default), false do not show.
	 * Returns: True no errors, false on at least one error.
	 */
	this.get_all = function(gui){
		var error = false;

		for(id in this.i){
			if(this.i[id].type == this.type_calc){
				if(this.cur_item == id){
					this.i[id].valid.clear();
					this._gui_clear_decoration(this.i[id]);
					continue;
				}
	
				if(!this.get(this.i[id], gui)){
					error = true;
				}
			}else if(this.i[id].type == this.type_choice){
				this.i[id].value = this._get_selected_value(this.i[id]);
				
			}
		}

		if(error){
			return false;
		}else{
			return true;
		}
	}

	/*
	 * Get input objects value from GUI input box
	 *    Choice type input is assumed valid and there is no conversion. 
	 *    Clears gui decoration regardless of gui setting.
	 *    Clears previous error_msg.
	 *    Validation errors are first come first serve, starting with NaN
	 *        and checking the this.valid() object in order.
	 *    
	 * inp - Input object.
	 * gui - True show gui errors/valid (default), false do not show.
	 * Return: True errors, false on errors.
	 */
	this.get = function(inp, gui){
		if(typeof(gui) == 'undefined'){ var gui = true; };

		if(inp.type == this.type_choice){
			inp.value = this._get_selected_value(inp);
			return true;
		}

		if(inp.type == this.type_graph){
			console.log('Error: get - input (' + inp + ') type is graph.')
			return false;
		}

		inp.value = inp.elem.value;
		this._format_input_value(inp);

		if(!this.is_number(inp.value)){				
			this._set_error(inp, this.err_num);
			if(gui){ this._gui_set_error(inp); };
			return false;

		}else{
			if(inp.u.cat != this.no_category){
				if(!this._convert_input_to_default(inp)){
					if(gui){ this._gui_set_error(inp); };
					return false;
				}
			}

			if(!this._validate(inp)){
				if(gui){ this._gui_set_error(inp); };
				return false;
			}

			if(gui){this._gui_set_valid(inp); };
			inp.used = true;
			return true;
		}
	}

	/*
	 * Set input object's GUI input box to input.value and clean up.
	 *     Will convert back to GUI selected units.
	 *     Triggers loop that marks all the valid inputs used. (green box)
	 *     Unless input is provided, then no valid gui decorating
	 *     Clears decoration on input box that it sets.
	 *     Error gui decorating works regardless.
	 * 
	 * inp - Input object (optional will use cur_item if not specified).
	 */
	this.set = function(inp){
		var multi = false;
		if(typeof(inp) == 'undefined'){
			inp = this.i[this.cur_item]
			multi = true;
			this.cur_item = '';
		}

		if(inp.u.cat != this.no_category){
			this._convert_input_to_selected(inp);
		}

		if(inp.value == this.err_val ){
			this._set_error(inp);
			this._gui_set_error(inp);
		}else{
			if(multi){
				this._gui_set_valids();
			}
			this._gui_clear_decoration(inp);
		}
		this._gui_set_input_value(inp);
	}

	/*
	 * Clears all decoration and internal settings.
	 */
	this.clean = function(){
		for(id in this.i){
			if(this.i[id].type != this.type_calc){ continue; };
			this._gui_clear_decoration(this.i[id]);
			this.i[id].used = false;
			this.i[id].valid.clear();
			this.i[id].error_msg = '';
		}
		
	}

	/*
	 * Set input to default value and clear settings.
	 * 
	 * inp - Input object.
	 */
	this._reset_input = function(inp){
		this._gui_clear_decoration(inp);
		inp.used = false;
		inp.error_msg = '';
		inp.elem.value = inp.dvalue;
		inp.valid.clear();
	}

	/**********************************************************
	 * Validation && Error/Valid Functions 	
	 */

	/*
	 * Set all inputs to valid type and value.
	 * 
	 * vtype - type of valid, 'gt', 'lt', 'eq'...
	 * value - value to check against
	 */
	this.set_valids = function(vtype, value){
		for(id in this.i){
			if(this.i[id].type != this.type_calc){ continue; };
			if(typeof(this.i[id].valid[vtype]) == 'undefined'){ continue; };
			this.i[id].valid[vtype] = value;
		}
	}

	/*
	 * Set input to error state.
	 * 		Used from calculator scripts.
	 * 
	 * inp - input object
	 * msg - Error message
	 */
	this.error = function(inp, msg){
		this._gui_clear_decoration(inp);
		this._set_error(inp, msg);
		this._gui_set_error(inp);
	}

	/*
	 * Set input to valid state.
	 * 		Used from calculator scripts.
	 * 
	 * inp - input object
	 * value - value to set input to.
	 */
	this.valid = function(inp, value){
		this._gui_clear_decoration(inp);
		this._gui_set_valid(inp);
		inp.value = value;
		this._gui_set_input_value(inp);
	}

	/* Validate input against valid object, resets values on use.
	 * 
	 * inp - Input object.
	 * Returns: True on valid, error message on fail.
	 */
	this._validate = function(inp){	
		var msg;

		for(var v in inp.valid){
			if(typeof(inp.valid[v]) == 'function'){ continue; };
			if(inp.valid[v] === false){ continue; };
			inp.valid['func_' + v]();

			if(inp.value == this.err_val){
				return false;
			}
		}
		return true;
	}

	/* Set input to error state.
	 * 
	 * inp - Input object.
	 * msg - Error message.
	 */
	this._set_error = function(inp, msg){
		inp.value = this.err_val ;
		inp.error_msg = msg;
	}


	/**********************************************************
	 * GUI Output Functions 	
	 */

	/*
	 * Show errors in GUI for all inputs that have been set to error.
	 */
	this._gui_set_errors = function(){
		for(id in this.i){
			if(this.i[id].type != this.type_calc){continue; };

			if(this.i[id].value == this.err_val ){
				this._gui_set_error(this.i[id]);
			}
		}
	}

	/*
	 * Set output to error message and decorate for error.
	 * 
	 * inp - Input object.
	 * msg - Message to set regarding error.
	 */
	this._gui_set_error = function(inp){
		inp.elem.value = inp.error_msg;
		inp.elem.className += ' mcalc_input_error';
	}

	/* 
	 * Set input box decoratation for valid value.
	 * 
	 * inp - Input object.
	 */
	this._gui_set_valid = function(inp){
		inp.elem.className += ' mcalc_input_active';
	}

	/*
	 * Show all valid inputs that were used.
	 */
	this._gui_set_valids = function(){
		for(id in this.i){
			if(this.i[id].type != this.type_calc){ continue; };
			if(this.i[id].used){
				this._gui_set_valid(this.i[id]);
			}
		}
	}

	/*
	 * Clear output decoration for given input.
	 * 
	 * inp - Input object.
	 */
	this._gui_clear_decoration = function(inp){
		inp.elem.className = inp.elem.className.replace(/(?:^|\s)mcalc_input_active(?!\S)/g , '');
		inp.elem.className = inp.elem.className.replace(/(?:^|\s)mcalc_input_error(?!\S)/g , '');		
	}

	/*
	 * Clear all input decorations.
	 */
	this._gui_clear_decorations = function(){
		for(id in this.i){
			this._gui_clear_decoration(this.i[id])
		}
	}

	/*
	 * Set GUI input box from input.value, round if necessary.
	 * 
	 * inp - Input object.
	 */
	this._gui_set_input_value = function(inp){
		if(!this.is_number(inp.value)){
			inp.elem.value = inp.value;
		} else {
			inp.elem.value = this._format_rounder(inp.value);
		}
	}

	
	/**********************************************************
	 * Conversion Functions 	
	 */

	/*
	 * Convert given value to input's gui selected units, input non-desctructive.
	 *  
	 * inp - Input object.
	 * value - Number to convert.
	 * Returns: Converted value or conversion error string on fail.
	 */
	this.convert_value_to_selected = function(inp, value){
		return this._conversion(value, inp.u.cat, this.units[inp.u.cat].convert_to, inp.u.unit);
	}

	/*
	 * Convert given value to input default units, input non-desctructive.
	 * 
	 * inp - Input object.
	 * value - Number to convert.
	 * Returns: Converted value or conversion error string on fail.
	 */
	this.convert_value_to_default = function(inp, value){
		return this._conversion(value, inp.u.cat, inp.u.unit, this.units[inp.u.cat].convert_to);
	}

	/*
	 * Convert input object to default unit defined in calc config xml.
	 * 
	 * inp - Input object to convert.
	 * Return: True success, false failure.
	 */
	this._convert_input_to_default = function(inp){
		return this._convert_input(inp, inp.u.unit, this.units[inp.u.cat].convert_to);
	}

	/*
	 * Convert input object to units shown in it's gui select box.
	 * 
	 * inp - Input object
	 * Return: true success, false failure
	 */
	this._convert_input_to_selected = function(inp){
		return this._convert_input(inp, this.units[inp.u.cat].convert_to, inp.u.unit);
	}

	/* Convert input to specified units within inputs unit category.
	 * 
	 * inp - Input object
	 * to - units to convert to
	 * Return: true success, false failure or NaN input
	 */
	this._convert_input = function(inp, from, to){
		if(!this.is_number(inp.value)){
			this._set_error(inp, this.num_err);
			return false;
		}

		if(inp.u.cat != 'None'){
			var ret = this._conversion(inp.value, inp.u.cat, from, to);

			if(!this.is_number(ret)){
				this._set_error(inp, inp.id + ' ' + ret);
				return false
			}else{
				inp.dvalue = this._conversion(inp.dvalue, inp.u.cat, from, to);
				inp.value = ret
				return true
			}
		}
	}

	/*
	 * Convert value between units.
	 * 
	 * value - number to convert
	 * category - units category
	 * from - current units of value
	 * to - units to convert value to
	 * Returns: converted value or error message on failure
	 */
	this._conversion = function(value, category, from, to){
		if(!this.is_number(value)){
			return 'Error: conversion - Input value (' + value + ') is not a number.';
		}

		if(!this.units[category]){
			return 'Error: conversion - Category (' + category + ') does not exist.';
		}

		if(!this.units[category][to]){
			return 'Error: conversion - To units (' + to + ') does not exist.';
		}

		if(!this.units[category][from]){
			return 'Error: conversion - From units (' + from + ') does not exist.';
		}

		if(typeof(this.units[category][to].conv)=='function'){
			var ret = this.units[category][from].conv(value, to);
		}else{
			var ret = value * (this.units[category][from].conv/this.units[category][to].conv);
		}

		if(!this.is_number(ret)){
			return 'Error: conversion - return value (' + ret + ') is not a number.';
		}else{
			return ret;
		}
	}

	
	/**********************************************************
	 * Value Formatting Functions 	
	 */

	/*
	 * Format input.value.
	 *     if fraction or x10 sci notation, convert to js friendly
	 *     if isNaN set input.value=NaN
	 *
	 * inp - Input object
	 */
	this._format_input_value = function(inp){
		/* trim right/left whitespace */
		inp.value = inp.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

		var rx_frac = /^([0-9]+ ){0,1}[0-9]+\/[1-9]+$/;
		var rx_scin = /^[0-9]+[\.]{0,1}[0-9]*[ ]?x[ ]?10[ ]?[^]?[-+]?[0-9]+$/;

		if(this.is_number(inp.value)){
			inp.value = Number(inp.value);
			this._gui_set_input_value(inp);

		/* convert fractions to decimal */
		}else if(rx_frac.test(inp.value)){
			/* convert fractions */
			var int = 0;
			var fraction;
			var intcheck = inp.value.split(' ');

			if(intcheck[0] == inp.value){
				fraction = inp.value;

			}else{
				int = intcheck[0];
				fraction = intcheck[1];
			}

			var num_denom = fraction.split('/');
			inp.value = Number(int)+(num_denom[0]/num_denom[1]);
			this._gui_set_input_value(inp);

		/* convert scientific notation to e notation */
		}else if(rx_scin.test(inp.value)){
			inp.value = inp.value.replace(/ /g,'');
			inp.value = Number(inp.value.replace(/x10[^]?/,'e'));
			this._gui_set_input_value(inp);

		/* input is not a number of some sort, set to NaN and flag error */
		} else {
				inp.value = NaN;
		}

	}

	/*
	 * Round value to selected decimal place.
	 * 
	 * value - value to round
	 * Returns: rounded value
	 */
	this._format_rounder = function(value){
		if (this.rounding == 0 || !this.is_number(value)){
			return value;
		}else{
			return (Math.round(value*this.rounding)/this.rounding);
		}
	}

	
	/**********************************************************
	 * Helper Functions 	
	 */

	/*
	 * Determine if value is a number or not.
	 * 
	 * Return: true if number, false if not
	 */
	this.is_number = function(value){
		if(isNaN(Number(value))){
			return false;
		}

		if(typeof(Number(value)) != 'number'){
			return false;
		}
		return true;
	}

	/*
	 * Get selected value of choice input.
	 * 
	 * ch_inp - choice input object
	 */
	this._get_selected_value = function(ch_inp){
		for(var i = 0; i < ch_inp.elem.options.length; i++){
			if(i == ch_inp.elem.selectedIndex){
				value = ch_inp.elem.options[i].value;
				if(this.is_number(value)){
					return Number(value);
				}else{
					return value;
				}
			}
		}
	}

	/*
	 * Set input unit select box, based on value.
	 * 
	 * elem - Select element to use.
	 * value - option value to search for
	 * Return: true found and set, false not found
	 */
	this._set_select_option_by_value = function(elem, value){
		for(var i = 0; i < elem.options.length; i++){
			if(elem.options[i].value == value){
				elem.selectedIndex = i;
				return true;
			}
		}
		return false;
	}

	/*
	 * Set select box selected by an options label.
	 * 
	 * ch_inp - choice input object
	 * label - label of option to set as selected
	 * Returns: true if label found, false if not
	 */
	this._set_select_option_by_label = function(ch_inp, label){
		var select = ch_inp.elem;
		for(var i = 0; i < ch_inp.elem.options.length; i++){
			if(ch_inp.elem.options[i].innerHTML == label){
				ch_inp.elem.selectedIndex = i;
				return true;
			}
		}
		return false;
		
	}

	///////////////////////////////////////////////////////////////////////////////
	////// graphic functions

	this.graph = function(t, id, elem){
		this.id = id;
		this.elem = elem;
		t._html_showhide_add_event(this.id);
		this.enabled = true;

		if(!(this.elem.getContext && this.elem.getContext('2d'))){
			this.enabled = false;
			document.getElementById('mcalc_graph_btn_' + this.id).disabled = true
			document.getElementById('mcalc_' + this.id + '_sh').innerHTML = '';
			return false;
		}

		t._html_graph_add_events(this.elem, this.id);
		this.ctx = this.elem.getContext('2d')
		this.grid = {};
		
		this.xyfloater = document.getElementById('mcalc_xy_floater');

		// user defined parameters/functions
		this.grid.xmin = 0;
		this.grid.xmax = 1000;
		this.grid.ymin = 0;
		this.grid.ymax = 1000;

		this.grid.type = 'normal';
		this.grid.align = 'left';

		this.grid.xlines = 10;
		this.grid.ylines = 10;

		this.grid.center_major_y0 = false;
		this.grid.center_major_x0 = false;

		this.xrange = function(){ return this.grid.xmax-this.grid.xmin; }
		this.yrange = function(){ return this.grid.ymax-this.grid.ymin; }

		this.short_num_round = 1;
		this.grid.skip_xlabels = 1;
		this.grid.skip_ylabels = 1;

		this.clear = function(){
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.clearRect(this.grid.xstart-13, 0, this.elem.width, this.elem.height-10);
		}

		this.clear_all = function(){
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
		}

		// graph mouse over events and processing
		this.xyfloat_enabled = true;
		this.xyfloat_enable = function(e){
			this.xyfloat_enabled = !this.xyfloat_enabled;
			if(this.xyfloat_enabled){
				this.xyfloat(e);
			}else{
				this.xyfloater.style.display = 'none';
			}
		}

		this.xyfloat_off = function(){
			this.xyfloater.style.display = 'none';
		}

		this.xyfloat = function(e){
			e = e || window.e;
			total_offset_x = 0;
			total_offset_y = 0;
			graph_x = 0;
			graph_y = 0;
			posx = 0;
			posy = 0;
			elem = this.elem;
			if (!e) var e = window.event;

			if (e.pageX || e.pageY) 	{
				posx = e.pageX;
				posy = e.pageY;
			}
			else if (e.clientX || e.clientY) 	{
				posx = e.clientX + document.body.scrollLeft	+ document.documentElement.scrollLeft;
				posy = e.clientY + document.body.scrollTop	+ document.documentElement.scrollTop;
			}

			do{
				total_offset_x += elem.offsetLeft;
				total_offset_y += elem.offsetTop;
			}
			while(elem = elem.offsetParent)

			graph_x = posx - total_offset_x
			graph_y = posy - total_offset_y

			if(this.xoff_grid(graph_x) || !this.xyfloat_enabled){this.xyfloat_off(); return false;}
			if(this.yoff_grid(graph_y) || !this.xyfloat_enabled){this.xyfloat_off(); return false;}

			if(this.grid.type == 'log' && (graph_x) != 0){
				adjx = Math.pow(10,((graph_x-this.plot.xcenter-2)/this.grid.width)*this.log_range+this.log_min);
			}else{
				adjx = ((graph_x-this.plot.xcenter-2)/this.xpixel);
			}

			adjy =  ((this.plot.ycenter-graph_y+2)/this.ypixel);

			this.xyfloater.style.display = 'block';
			this.xyfloater.style.top = posy+15+ 'px';
			this.xyfloater.style.left = posx+15 + 'px';
			this.xyfloater.innerHTML = this.xlabel_text+'<br />'+adjx+'<br /><br />'+this.ylabel_text+'<br />'+adjy;
		}

		// internally defined parameters
		this.grid.xstart = 30;
		this.grid.ystart = this.elem.height - 50;

		this.grid.margin = 10;
		this.grid.height = this.grid.ystart - this.grid.margin;
		this.grid.width = this.elem.width - this.grid.xstart - this.grid.margin;

		this.xpixel = 1;
		this.ypixel = 1;

		if(this.grid.align == 'center'){
			this.grid.xcenter = this.grid.xstart + this.grid.width/2;
			this.grid.ycenter = this.grid.ystart - this.grid.height/2;
		}else{
			this.grid.xcenter = this.grid.xstart;
			this.grid.ycenter = this.grid.ystart;
		}

		this.plot = {};
		this.plot.xcenter = this.grid.xcenter;
		this.plot.ycenter = this.grid.ycenter;

		this.xlabel_text = '';
		this.xlabel = function(label){
			this.xlabel_text = label;
			this.ctx.fillStyle='#000000';
			this.ctx.fillText(label, (this.elem.width/2) - (label.toString().length/2)*5, this.elem.height-2);
		}
		this.ylabel_text = '';
		this.ylabel = function(label){
			this.ylabel_text = label;
			this.ctx.fillStyle='#000000';
			this.draw_ytext(label, ((this.elem.width/2) - (label.toString().length/2)*3), 20);
		}

		// log graph specific params/functions
		this.log_min = 0;
		this.log_max = 0;
		this.log_range = 0;

		this.set_log_values = function(){
				if(this.grid.xmin <= 0){
					this.log_min = 0;
				}else{
					this.log_min = Math.round(Math.log(this.grid.xmin)/Math.LN10);
				}
				if(this.grid.xmax <= 0){
					this.log_max = 0;
				}else{
					this.log_max = Math.round(Math.log(this.grid.xmax)/Math.LN10);
				}
				this.log_range = Math.round((this.log_max - this.log_min));
		}

		// x,y conversion to grid xy
		this.convertx = function(x){
			if(this.grid.type == 'log' && x != 0){
				return this.plot.xcenter + Math.round(((Math.log(x)/Math.LN10-this.log_min) / this.log_range) * this.grid.width);
			}
			return this.plot.xcenter + (this.xpixel * x);
		}

		this.converty = function(y){
			return this.plot.ycenter - (this.ypixel * y);
		}

		// set aspect ratio
		this.set_grid_pixel_size = function(){
			this.xpixel = this.grid.width/(this.grid.xmax-this.grid.xmin);
			this.ypixel = this.grid.height/(this.grid.ymax-this.grid.ymin);
		}

		// convert numbers to 1k 2k etc for grid labels
		this.short_num = function(num){
			sign = false;
			if(num==0){return num;}
			if(num<0){sign = true;}

			snum = Math.abs(num);
			if(snum<0.01){
				return num.toExponential();
			}

			if(snum<1000){ return num; }

			if(snum<1000000 && (snum/1000)>=1){
				snum = Math.round((snum/1000)*this.short_num_round)/this.short_num_round + 'K';
				if(sign){snum = '-'+snum;}
				return snum
			}
			if(snum<1000000000 && (snum/1000000)>=1){
				snum = Math.round((snum/1000000)*this.short_num_round)/this.short_num_round + 'M';
				if(sign){snum = '-'+snum;}
				return snum
			}
			if(snum<1000000000000 && (snum/1000000000)>=1){
				snum = Math.round((snum/1000000000)*this.short_num_round)/this.short_num_round + 'G';
				if(sign){snum = '-'+snum;}
				return snum
			}
			if((snum/1000000000000)>=1){
				snum = Math.round((snum/1000000000000)*this.short_num_round)/this.short_num_round + 'T';
				if(sign){snum = '-'+snum;}
				return snum
			}			
			return num;
		}
		// check if converted xy is off the grid
		this.xoff_grid = function(x){
			if(x < this.grid.xstart-2 || x > this.grid.xstart+this.grid.width+2){
				return true;
			}else{
				return false;
			}				
		}

		this.yoff_grid = function(y){
			if(y < this.grid.margin-2 || y > this.grid.height+this.grid.margin+2){
				return true;
			}else{
				return false;
			}
		}

		// convienence draw functions
		this.draw_line = function(mx, my, lx, ly, color){
			mxc = this.convertx(mx);			
			if(this.xoff_grid(mxc)){return false;}

			myc = this.converty(my);
			if(this.yoff_grid(myc)){return false;}

			lxc = this.convertx(lx);
			if(this.xoff_grid(lxc)){return false;}

			lyc = this.converty(ly);
			if(this.yoff_grid(lyc)){return false;}

			this.ctx.beginPath();
			this.ctx.strokeStyle=color;
			this.ctx.moveTo(mxc, myc);
			this.ctx.lineTo(lxc, lyc);
			this.ctx.stroke();
			return true;
		}

		this.draw_ytext = function(text, x, y){
			this.ctx.save();
			this.ctx.translate((this.elem.width/2),(this.elem.height/2))
			this.ctx.rotate(270*Math.PI/180);
			this.ctx.fillStyle='#000000';
			this.ctx.fillText(text, x-(this.elem.width/2), y-(this.elem.height/2));
			this.ctx.restore()
		}

		this.draw_grid_line = function(mx, my, lx, ly, color){
			this.ctx.beginPath();
			this.ctx.strokeStyle=color;
			this.ctx.moveTo(this.grid.xstart + mx, this.grid.ystart - my);
			this.ctx.lineTo(this.grid.xstart + lx, this.grid.ystart - ly);
			this.ctx.stroke();
		}

		// indexers for skipping to the next pixel
		this.xindexer = function(x){
			if(this.grid.type == 'log'){
				dif = (Math.floor(Math.log(this.grid.xmax)/Math.LN10)-Math.ceil(Math.log(x)/Math.LN10));
				return 1/(this.xpixel*Math.pow(10, dif+1));
			}else{
				return 1/this.xpixel;
			}
		}

		this.yindexer = function(y){
			return 1/this.ypixel;
		}

		// grid builder
		this.grid_builder = function(){
			this.set_grid_pixel_size();

			this.plot.edge = this.grid.xstart; // reset

			grid_yline_space = this.grid.height/this.grid.ylines;
			grid_xline_space = this.grid.width/this.grid.xlines;

			// draw log x grid
			w = 0;

			if(this.grid.type == 'log'){
				this.set_log_values();

				kfactor = this.grid.width/this.log_range;

				for(k=this.log_min; k<=this.log_max; k++){
					kf = kfactor * (k-this.log_min);
					
					if((w % this.grid.skip_xlabels) === 0){
						this.ctx.fillText(this.short_num(Math.pow(10, k)), (this.grid.xstart+kf)* 0.95, this.grid.ystart+10)
					}

					w++;

					for(i=1; i<=10; i++){
						ilog = kf+((Math.log(i)/Math.LN10)*kfactor)
						this.draw_grid_line(ilog, 0, ilog, this.grid.height, '#CCCCCC');
					}
				}

			}else{
				// draw normal x grid
				w = 0;
				last_label = 0;
				label_spacing = this.xrange()/this.grid.xlines;
				roundto = Math.round(1/Math.pow(10, Math.round(Math.log(this.xrange())/Math.LN10)-1));

				if(roundto<1){roundto = 1;}

				for(i=0; i<=this.grid.width+2; i+=grid_xline_space){
					label = Math.round((label_spacing * w + this.grid.xmin)*roundto)/roundto;

					if(label==0){
						this.plot.xcenter = this.grid.xstart + i;
					}else if((last_label < 0 && label > 0) || (last_label + label) == 0){
						pix_adj = grid_xline_space/Math.abs(last_label - label);
						this.plot.xcenter = this.grid.xstart + i - (pix_adj*label);
					}

					last_label = label
					label = this.short_num(label)

					if(i == 0){
						label_width = 0;
					}else{
						label_width = (label.toString().length  * 7)/2;
					}

					if((w % this.grid.skip_xlabels) === 0){
						this.ctx.fillText(label, this.grid.xstart+i-label_width, this.grid.ystart+10);
					}

					w++;
					this.draw_grid_line(i, 0, i, this.grid.height, '#CCCCCC');
				}
			}

			// draw  y grid
			w = 0;
			l = true;
			label_spacing = this.yrange()/this.grid.ylines;
			last_label = 0;
			roundto = Math.round(1/Math.pow(10, Math.round(Math.log(this.yrange())/Math.LN10)-1));

			if(roundto<1){roundto = 1;}

			for(i=0; i<=this.grid.height+2; i+=grid_yline_space){
				label = Math.round((label_spacing * w + this.grid.ymin)*roundto)/roundto;
				if(label==0){
					this.plot.ycenter = this.grid.ystart - i;
				}else if((last_label < 0 && label > 0) || (last_label + label) == 0){
						pix_adj = grid_yline_space/Math.abs(last_label - label);
						this.plot.ycenter = this.grid.ystart - i + (pix_adj*label);
				}
				last_label = label
				label = this.short_num(label)
				if(i == 0){
					label_width = 5;
				}else{
					label_width = (label.toString().length  * 8)/2;
				}

				if((w % this.grid.skip_ylabels) === 0){
					this.draw_ytext(label, (this.grid.xstart+i-label_width+15), 33);
				}
				w++;
				this.draw_grid_line(0, i, this.grid.width, i, '#CCCCCC');
			}

			// draw dark grid border
			if(this.grid.align == 'center'){
				if(this.grid.center_major_y0 == true){
					ystart = this.grid.height-this.plot.ycenter+this.grid.margin;
					this.draw_grid_line(0, ystart, this.grid.width, ystart, '#000000');
				}else{
					this.draw_grid_line(0, this.grid.height/2, this.grid.width, this.grid.height/2, '#000000');
				}

				if(this.grid.center_major_x0 == true){
					xstart = this.plot.xcenter-this.grid.xstart;
					this.draw_grid_line(xstart, 0, xstart, this.grid.height, '#000000');
				}else{
					this.draw_grid_line(this.grid.width/2, 0, this.grid.width/2, this.grid.height, '#000000');
				}

			}else{
				this.draw_grid_line(0, 0, this.grid.width, 0, '#000000');
				this.draw_grid_line(0, 0, 0, this.grid.height, '#000000');
			}


		}

		// plotting functions
		this.plot_line = function(fx, fy, tx, ty, color){
			return this.draw_line(fx, fy, tx, ty, color);
		}

		this.plot.edge = this.grid.xstart;

		this.plot_label = function(label, color){
			this.ctx.fillStyle=color;
			this.ctx.fillText(label, this.plot.edge + 10, this.grid.ystart+25);
			this.plot.edge += label.toString().length * 7;
			this.ctx.fillStyle='#000000';
		}
	}

	
	/**********************************************************
	 * GUI Control Functions 	
	 */

	/*
	 * Call for GUI unit select box conversion.
	 * 
	 * id - id of input object to convert
	 */
	this.control_units_conv = function(id){
		var select = this.i[id].u.elem;

		if(this.get(this.i[id], true)){
			this.i[id].u.unit = this.i[id].u.elem.options[this.i[id].u.elem.selectedIndex].value;
			this.set(this.i[id]);
		}
	}

	/*
	 * Call for GUI convert all boxes between SI or Default units.
	 * 
	 * sys - si or default system of units
	 */
	this.control_units_system = function(sys){
		this.clean();
		for(id in this.i){
			var inp = this.i[id];
			if(inp.type != this.type_calc){ continue; }
			var select = inp.u.elem;

			if(inp.u.display[sys] != ''){
				var units = inp.u.display[sys];
			}else{
				var units = this.units[inp.u.cat].convert_to;
			}

			this.get(inp, true);
			for(var i = 0; i < select.options.length; i++){
				if(select.options[i].value != units){ continue;	}
				select.selectedIndex = i;
				inp.u.unit = select.options[i].value;
			}
			this.set(inp);
		}
	}

	/*
	 * Call for GUI set currently selected units as default units.
	 */
	this.control_units_set_defaults = function(){
		for(id in this.i){
			if(this.i[id].type == this.type_calc){
				var select = this.i[id].u.elem;
				if(this.i[id].u.cat != this.no_category){
					this.i[id].u.display.udefault = select.options[select.selectedIndex].value;
				}
			}else if(this.i[id].type == this.type_choice){
				var select = this.i[id].elem;
				this.i[id].cdefault = select.options[select.selectedIndex].value; //innerHTML
			}
		}
	}


	/*
	 * Call for GUI set rounding amount and round all current inputs.
	 * 
	 * roundit - decimal places to round to eg 10 = .x, 100 = .xx
	 */
	this.control_round_all = function(roundit){
		this.rounding = Number(roundit);
		for(id in this.i){
			if(this.i[id].type == this.type_calc){
				this.i[id].elem.value = this._format_rounder(this.i[id].elem.value);
			}
		}
	}

	/*
	 * Call for GUI clear all inputs and input boxes.
	 */
	this.control_clear_inputs = function(){
		for(id in this.i){
			if(this.i[id].type == this.type_calc){
				this._reset_input(this.i[id]);

			}else if(this.i[id].type == this.type_choice){
				/* If default available use it, otherwise index = 0 */
				if(this.i[id].cdefault){
					this._set_select_option_by_label(this.i[id], this.i[id].cdefault)
				}else{
					this.i[id].elem.selectedIndex = 0
				}
			}else if(this.i[id].type == this.type_graph){
				this.i[id].clear();				
			}
		}
	}

	/*
	 * Call for GUI to show or hide hideable items, diagram/graph.
	 * 
	 * id - id of hideable element
	 * show - true, false or empty
	 */
	this.control_showhide = function(id, show){
		if(typeof(show) == 'undefined'){ show = '';}

		var cont = document.getElementById('mcalc_'+id+'_cont');
		var sh = document.getElementById('mcalc_'+id+'_sh');
		if(show === true){
			cont.style.display = 'block';
			sh.innerHTML = '[-]';
		}else if(show === false){
			cont.style.display = 'none';
			sh.innerHTML = '[+]';
		}else if(cont.style.display == 'none'){
			cont.style.display = 'block';
			sh.innerHTML = '[-]';
		}else{
			cont.style.display = 'none';
			sh.innerHTML = '[+]';
		}
	}
}

var mc = new mechcalc()