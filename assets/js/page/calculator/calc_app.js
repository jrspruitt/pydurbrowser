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

var Mechcalc = function(config_url){
this.i = new Object();
this.rounding = 0;
this.rad_dec = 0;
this.rad_bin = 1;
this.rad_hex = 2;
this.radix = this.rad_dec;
this.cur_item = "";
this.type_calc = "calc";
this.type_choice = "choice";
this.type_graph = "graph";
this.type_label = "label";
this.type_button = "button";
this.type_textbox = "textbox";
this.type_seperator = "seperator";
this.type_diagram = "diagram";
this.no_category = "None";
this.err_val = "error";
this.err_num = "Must be a number.";
this.gt = "gt";
this.gteq = "gteq";
this.lt = "lt";
this.lteq = "lteq";
this.eq = "eq";
this.not = "not";
}

/*
 * Initialize all the inputs.
 */
Mechcalc.prototype.init = function(config){
var t = this;
this._html_basic_gui();
this.rounding = config.rounding;
items = config.items;

for(var i = 0; i < items.length; i++){
    var id = items[i]["id"];

    if(items[i]["type"] == this.type_calc){
        this._html_calc_gui(t, items[i]);
        this[id] = new this._input(t, items[i]);
        this.i[id] = this[id];

    }else if(items[i]["type"] == this.type_choice){
        this._html_choice_gui(t, items[i]);
        this[id] = new this._choice(t, items[i]);
        this.i[id] = this[id];

    }else if(items[i]["type"] == this.type_graph){
        this._html_graph_gui(t, items[i]);
        this[id] = new this.graph(t, items[i]);
        this.i[id] = this[id];

    }else if(items[i]["type"] == this.type_diagram){
        this._html_diagram_gui(t, items[i]);
        this[id] = new this._diagram(t, items[i]);
        this.i[id] = this[id];

    }else if(items[i]["type"] == this.type_button){
        this._html_button_gui(t, items[i]);
        this[id] = new this._button(t, items[i]);
        this.i[id] = this[id];

    }else if(items[i]["type"] == this.type_textbox){
        this._html_textbox_gui(t, items[i]);
        this[id] = new this._textbox(t, items[i]);
        this.i[id] = this[id];

    }else if(items[i]["type"] == this.type_seperator){
        this._html_seperator_gui(t, items[i]);

    }else if(items[i]["type"] == this.type_label){
        this._html_label_gui(t, items[i]);
        
    }else{
        this[id] = new Object();
        this[id].type = "";
        this.i[id] = this[id];
    }
}

this._html_control_gui(t);
}

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

Mechcalc.prototype._input = function(t, item){
    this.type = item["type"];
    this.id = item["id"];
    this.elem = document.getElementById("mcalc_" + this.id);
    this.value = this.elem.value;
    this.imag = false;
    this.dvalue = item["config"]["display"]["value"];
    this.radix = item["config"]["display"]["radix"]

    var start_unit = "";
    if(item["config"]["category"] != "None"){
        start_unit = item["config"]["display"]["units"]["udefault"]
    }

    this.u = {"cat":item["config"]["category"],
              "unit":start_unit,
              "elem":"",
              "convert_to":item["config"]["convert_to"]};
    this.u.display = item["config"]["display"]["units"];
    this.error_msg = "";
    this.used = false;
    
    this.valid = new t._valid(t, this);

    this.u.elem = document.getElementById("mcalc_" + this.id + "_unit_select");

    this.value_as = function(unit){
        var ret = t._conversion(this.value, this.u.cat, this.u.convert_to, unit);
        
        if(t.is_number(ret)){
            return ret;
        }else{
            return false;
        }
    }
}
/*
 * Choice object.
 * 
 * t - Reference to parent this.
 * id - input id.
 * elem - input element.
 */
Mechcalc.prototype._choice = function(t, item){
    this.type = item["type"];
    this.id = item["id"];
    this.elem = document.getElementById("mcalc_" + this.id);
    this.cdefault = item["config"]["options"][0]["value"]
    this.selected = item["config"]["options"][0]["value"]
    this.options = [];

    for(var opt in item["config"]["options"]){
        var copt = item["config"]["options"][opt];
        this.options.push({"label":copt["label"], "value":copt["value"]});

        if(copt["selected"]){
            this.cdefault = copt["value"];
            this.selected = copt["value"];
        }
    }
    this.value = t._get_selected_value(this);
}

/*
 * Diagram object.
 */
Mechcalc.prototype._diagram = function(t, item){
    this.type = item["type"];
    this.id = item["id"];
}

/*
 * Button object.
 * 
 * t - Reference to parent this.
 * id - input id.
 * elem - input element.
 */
Mechcalc.prototype._button = function(t, item){
    this.type = item["type"];
    this.id = item["id"];
    this.elem = document.getElementById("mcalc_" + this.id);
}

/*
 * Textbox object.
 * 
 * t - Reference to parent this.
 * id - input id.
 * elem - input element.
 */
Mechcalc.prototype._textbox = function(t, item){
    this.type = item["type"];
    this.id = item["id"];
    this.elem = document.getElementById("mcalc_" + this.id);
    this.value = "";
}

/*
 * Validation object for enhanced input testing.
 * 
 * t - Reference to parent this.
 * inp - Reference to parent input object.
 */
Mechcalc.prototype._valid = function(t, inp){
    this.gt = false;
    this.gteq = false;
    this.lt = false;
    this.lteq = false;
    this.eq = false;
    this.not = false;
    this.clear = function(){ this.gt = this.gteq = this.lt = this.lteq = this.eq = this.not = false; }
    this.func_gt = function(){ this.func(inp.value > this.gt, "> than ", this.gt); };
    this.func_gteq = function(){ this.func(inp.value >= this.gteq,  ">= to ", this.gteq); };
    this.func_lt = function(){ this.func(inp.value  < this.lt, "< than ", this.lt); };
    this.func_lteq = function(){ this.func(inp.value <= this.lteq, "<= to", this.lteq); };
    this.func_eq = function(){ this.func(inp.value == this.eq || "= to ", this.eq); };
    this.func_not = function(){ this.func(inp.value != this.not, "!= to ", this.not); };
    this.func = function(exp, msg, value){
        if(!t.is_number(value)){ return false; };
        if(inp.u.cat != t.no_category){
            var value = t.convert_value_to_selected(inp, value);
        }else{
            var value = inp.value
        }

        if(!exp){
            t._set_error(inp, msg + t.format_rounder(value));
            return false;
        }else{
            return true;
        }
    };
}

/**********************************************************
 * HTML Structure Functions     
 */

/*
 * Create basic divs for calculator GUI.
 */
Mechcalc.prototype._html_basic_gui = function(){
    $("<div />",{class:"mcalc_xy_floater",
                 id:"mcalc_xy_floater"})
                 .appendTo("#mcalc");

    $("<div />",{class:"content singling",
                 id:"mcalc_gui"})
                 .appendTo("#mcalc");
}

/*
 * Create controls for calculator GUI.
 */
Mechcalc.prototype._html_control_gui = function(t){
    var control_container = $("<div />", {class:"mcalc_control_container"}).appendTo("#mcalc");
    var control_menu = $("<div />", {class:"mcalc_control_menu"}).appendTo(control_container);
    var button_span = $("<span/>").appendTo(control_menu);
    $("<button />", {id:"mcalc_control_set",
                     class:"mcalc_control_set",
                     text:"Set"})
                     .on("click", function(){t.control_units_set_defaults()})
                     .appendTo(button_span);

    $("<button />", {id:"mcalc_control_default",
                     class:"mcalc_control_menu_button",
                     text:"Default"})
                     .on("click", function(){t.control_units_system("udefault");})
                     .appendTo(button_span);

    $("<button />", {id:"mcalc_control_si",
                     class:"mcalc_control_menu_button",
                     text:"SI"})
                     .on("click", function(){t.control_units_system("si");})
                     .appendTo(button_span);

    var rounding_span = $("<span/>").appendTo(control_menu);
    var select = $("<select />", {class:"mcalc_select",
                                  id:"mcalc_round"})
                                  .on("change", function(){t.control_round_all(this.options[this.selectedIndex].value);})
                                  .appendTo(rounding_span);

    $("<option />", {value: 0, text:"Rounding"}).appendTo(select);
    $("<option />", {value: 0, text:"None"}).appendTo(select);

    for(var i = 0; i < 10; i++){
        var rounding = Math.pow(10, i);
        $("<option />", {value: rounding, text: (1/rounding).toFixed(i)}).appendTo(select);
    }

    $(select).val(this.rounding);

    var clear_span = $("<span/>").appendTo(control_menu);
    
    $("<button />", {class:"mcalc_control_menu_button",
                     text:"Clear"})
                     .on("click", function(){t.control_clear_inputs();})
                     .appendTo(clear_span);
}
/*
 * Base template for an input GUI line.
 */
Mechcalc.prototype._html_input_template = function(button, input, units){
    var container = $("<div/>",{"class": "mcalc_containers single"});

    var button_span = $("<span/>", { "class":"mcalc_button_container"}).appendTo(container);
    button.appendTo(button_span);

    if(input){
        var input_span = $("<span/>", { "class":"mcalc_input_container"}).appendTo(container);
        input.appendTo(input_span);
    }

    if(units){
        var units_span = $("<span/>", { "class":"mcalc_units_container"}).appendTo(container);
        units.appendTo(units_span);
    }

    return container;
}

/*
 * Contstructs "calc" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_calc_gui = function(t, item){
    if(item.config.button == "1"){
        var button = $("<button />", {class:"mcalc_calcbutton",
                                      id:"mcalc_" + item.id +"_btn",
                                      text:item.label})
                                      .on("click",function(){t.cur_item=item.id;
                                                             t.clean();
                                                             t["calc_" + item.id]();});
    }else{
        var button = $("<span />", {class:"mcalc_nobutton_label", "text":item.label});
    }

    var input = $("<input />", {id:"mcalc_" + item.id,
                                class:"mcalc_input",
                                type:"text",
                                value:item.config.display.value});

    if(item.config.category == this.no_category){
        var units = $("<span />", {class:"mcalc_noselect_label", text:item.config.display.static});

    }else{
        var units = $("<select />", {class:"mcalc_select",
                                     id:"mcalc_" + item.id + "_unit_select"})
                                      .on("change", function(){t.control_units_conv(item.id);});

        for(var unit in item.config.display.units.types){
            $("<option />", {value: item.config.display.units.types[unit], text: item.config.display.units.types[unit]}).appendTo(units);

            if(item.config.display.units.types[unit] == item.config.display.units.udefault){
                $(units).val(item.config.display.units.types[unit]);
            }
        }
    }
    
    var input_line = this._html_input_template(button, input, units);
    input_line.appendTo("#mcalc_gui");
}
/*
 * Contstructs "graph" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_graph_gui = function(t, item){
    var t = this;
    var button = $("<button />", {class:"mcalc_calcbutton",
                                  id:"mcalc_" + item.id +"_btn",
                                  text:"Graph"})
                                  .on("click",function(){t.clean();
                                                         t.control_showhide(item.id, true);
                                                         t["graph_" + item.id]();});

    var label = $("<span />", {class:"mcalc_showhide_label",
                               text:item.label});

    var showhide = $("<a />", {id:"mcalc_" + item.id + "_sh",
                               text:"[+]"})
                               .on("click", function(){t.control_showhide(item.id)});
    
    var input_line = this._html_input_template(button, label, showhide);

    var canvas_container = $("<div />", {style:"display:none;",
                  id:"mcalc_" + item.id + "_cont",
                  class:"mcalc_graph_container"})
                  .appendTo(input_line);

    var canvas = $("<canvas/>", {class:"mcalc_graph",
                                  id:"mcalc_" + item.id,
                                  text:"Your Browser Does Not Support Canvas."})
                                  .on("mousemove", function(event){t.i[item.id]._xyfloat(event);})
                                  .on("mouseout", function(event){t.i[item.id]._xyfloat_off();})
                                  .appendTo(canvas_container);

    canvas.prop("width", 380).prop("height", 400);
    input_line.appendTo("#mcalc_gui");
}

/*
 * Contstructs "choice" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_choice_gui = function(t, item){
    var label = $("<span />", {class:"mcalc_nobutton_label",
                               text:item.label});

    var select = $("<select />",{id:"mcalc_" + item.id,
                                 class:"mcalc_choice"});

    for(var option in item.config.options){
        $("<option />", {value: item.config.options[option].value, text: item.config.options[option].label}).appendTo(select);

        if(item.config.options[option].selected){
            $(select).val(item.config.options[option].value);
        }
    }

    var input_line = this._html_input_template(label, select);
    input_line.appendTo("#mcalc_gui");
}

/*
 * Contstructs "diagram" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_diagram_gui = function(t, item){
    var container = $("<div/>",{"class": "mcalc_containers single"}).appendTo("#mcalc_gui");
    var label = $("<span />", {class:"mcalc_showhide_label",
                               text:item.label})
                               .appendTo(container);

    var showhide = $("<a />", {id:"mcalc_" + item.id + "_sh",
                               text:"[+]"})
                               .on("click", function(){t.control_showhide(item.id)})
                               .appendTo(container);

    var diagram_div = $("<div/>", {style:"display:none;",
                                   id:"mcalc_" +  item.id + "_cont",
                                   class:"mcalc_diagram_container"})
                                   .appendTo(container);

    var diagram_img = $("<img />", {id:"mcalc_" + item.id,
                                    class:"mcalc_diagram",
                                    src:item.config.file,
                                    alt:item.config.alt_text})
                                    .appendTo(diagram_div);

}

/*
 * Contstructs "button" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_button_gui = function(t, item){
    var button = $("<button />",{class:"mcalc_calcbutton",
                                 id:"mcalc_" + item.id + "_btn",
                                 text:item.label})
                                 .on("click",function(){t.cur_item=item.id;
                                                        t.clean();
                                                        t["calc_" + item.id]();});

    var input = $("<input />", {type:"hidden",
                                class:"mcalc_button",
                                id:"mcalc_" + item.id});

    var input_line = this._html_input_template(button, input);
    input_line.appendTo("#mcalc_gui");
}

/*
 * Contstructs "textbox" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_textbox_gui = function(t, item){
    var container = $("<div/>",{"class": "mcalc_containers single"}).appendTo("#mcalc_gui");
    if(item.label){
        var label = $("<span />", {class:"mcalc_label",
                                   text:item.label}).appendTo(container);
    }

    var textarea_div = $("<div/>",{"class": "mcalc_textbox_container"}).appendTo(container);
    $("<textarea />", {id:"mcalc_" + item.id,
                       class:"mcalc_textbox"})
                       .appendTo(textarea_div);
                       
    
}

/*
 * Contstructs "seperator" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_seperator_gui = function(t, item){
    var container = $("<div/>",{"class": "mcalc_containers single"}).appendTo("#mcalc_gui");
    $("<div />", {id:"mcalc_" + item.id,
                  class:"mcalc_seperator"})
                  .appendTo(container);
}

/*
 * Contstructs "label" GUI elements.
 *
 * t - Reference to this.
 * item - item object from calc.json
 *
 */
Mechcalc.prototype._html_label_gui = function(t, item){
    var container = $("<div/>",{"class": "mcalc_containers single"}).appendTo("#mcalc_gui");
    $("<div />", {id:"mcalc_" + item.id,
                  class:"mcalc_label",
                  text:item.label})
                  .appendTo(container);
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
Mechcalc.prototype._html_create_option = function(select_elem, text, value){
    var opt_elem = document.createElement("option");
    opt_elem.text = text;
    opt_elem.value = value;
    select_elem.add(opt_elem);
    return select_elem.options.length;
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
Mechcalc.prototype.get_list = function(list, gui){
    var error = false;

    for(id in list){
        if(list[id].type == this.type_calc){
            if(this.cur_item == list[id].id){
                list[id].valid.clear();
                this._gui_clear_decoration(list[id]);
                continue;
            }

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
Mechcalc.prototype.get_all = function(gui){
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
 * Return: True if no errors, false on errors.
 */
Mechcalc.prototype.get = function(inp, gui){
    if(typeof(gui) == "undefined"){ var gui = true; };

    if(inp.type == this.type_choice){
        inp.value = this._get_selected_value(inp);
        return true;
    }

    if(inp.type == this.type_graph){
        console.log("Error: get - input (" + inp + ") type is graph.")
        return false;
    }

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
 * Set input object"s GUI input box to input.value and clean up.
 *     Will convert back to GUI selected units.
 *     Triggers loop that marks all the valid inputs used. (green box)
 *     Unless input is provided, then no valid gui decorating
 *     Clears decoration on input box that it sets.
 *     Error gui decorating works regardless.
 * 
 * inp - Input object (optional will use cur_item if not specified).
 */
Mechcalc.prototype.set = function(inp){
    var multi = false;
    if(typeof(inp) == "undefined"){
        inp = this.i[this.cur_item]
        multi = true;
        this.cur_item = "";
    }

    if(inp.u && inp.u.cat != this.no_category){
        this._convert_input_to_selected(inp);
    }

    if(inp.value == this.err_val){
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
Mechcalc.prototype.clean = function(){
    for(id in this.i){
        if(this.i[id].type != this.type_calc){ continue; };
        this._gui_clear_decoration(this.i[id]);
        this.i[id].imag = false;
        this.i[id].used = false;
        this.i[id].valid.clear();
        this.i[id].error_msg = "";
    }
    
}

/*
 * Set input to default value and clear settings.
 * 
 * inp - Input object.
 */
Mechcalc.prototype._reset_input = function(inp){
    this._gui_clear_decoration(inp);
    inp.imag = false;
    inp.used = false;
    inp.error_msg = "";
    inp.elem.value = inp.dvalue;
    inp.valid.clear();
}

/**********************************************************
 * Validation && Error/Valid Functions     
 */

/*
 * Set all inputs to valid type and value.
 * 
 * vtype - type of valid, "gt", "lt", "eq"...
 * value - value to check against
 */
Mechcalc.prototype.set_valids = function(vtype, value){
    for(id in this.i){
        if(this.i[id].type != this.type_calc){ continue; };
        if(typeof(this.i[id].valid[vtype]) == "undefined"){ continue; };
        this.i[id].valid[vtype] = value;
    }
}

/*
 * Set input to error state.
 *         Used from calculator scripts.
 * 
 * inp - input object
 * msg - Error message
 */
Mechcalc.prototype.error = function(inp, msg){
    this._gui_clear_decoration(inp);
    this._set_error(inp, msg);
    this._gui_set_error(inp);
}

/*
 * Set input to valid state.
 *         Used from calculator scripts.
 * 
 * inp - input object
 * value - value to set input to.
 */
Mechcalc.prototype.valid = function(inp, value){
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
Mechcalc.prototype._validate = function(inp){    
    var msg;

    for(var v in inp.valid){
        if(typeof(inp.valid[v]) == "function"){ continue; };
        if(inp.valid[v] === false){ continue; };
        inp.valid["func_" + v]();

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
Mechcalc.prototype._set_error = function(inp, msg){
    inp.value = this.err_val;
    inp.error_msg = msg;
}


/**********************************************************
 * GUI Output Functions     
 */

/*
 * Show errors in GUI for all inputs that have been set to error.
 */
Mechcalc.prototype._gui_set_errors = function(){
    for(id in this.i){
        if(this.i[id].type != this.type_calc){ continue; };
        if(this.i[id].value == this.err_val){
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
Mechcalc.prototype._gui_set_error = function(inp){
    inp.elem.value = inp.error_msg;
    inp.elem.className += " mcalc_input_error";
}

/* 
 * Set input box decoratation for valid value.
 * 
 * inp - Input object.
 */
Mechcalc.prototype._gui_set_valid = function(inp){
    inp.elem.className += " mcalc_input_active";
}

/*
 * Show all valid inputs that were used.
 */
Mechcalc.prototype._gui_set_valids = function(){
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
Mechcalc.prototype._gui_clear_decoration = function(inp){
    inp.elem.className = inp.elem.className.replace(/(?:^|\s)mcalc_input_active(?!\S)/g , "");
    inp.elem.className = inp.elem.className.replace(/(?:^|\s)mcalc_input_error(?!\S)/g , "");        
}

/*
 * Clear all input decorations.
 */
Mechcalc.prototype._gui_clear_decorations = function(){
    for(id in this.i){
        if(this.i[id].type == this.type_calc){
            this._gui_clear_decoration(this.i[id])
        }
    }
}

/*
 * Set GUI input box from input.value, round if necessary.
 * 
 * inp - Input object.
 */
Mechcalc.prototype._gui_set_input_value = function(inp){
    if(!this.is_number(inp.value) || inp.type == this.type_textbox){
        inp.elem.value = inp.value;
    }else{
        var rounded = this.format_rounder(inp.value);

        if(inp.radix == this.rad_dec){
            inp.elem.value = rounded;
        }else if(inp.radix == this.rad_bin){
            inp.elem.value = "0b" + rounded.toString(2);
        }else if(inp.radix == this.rad_hex){
            inp.elem.value = "0x" + rounded.toString(16);
        }
        if(inp.imag){
            var imag = this.format_rounder(inp.imag);
            inp.elem.value = inp.elem.value + imag + 'i';
        }
    }
}


/**********************************************************
 * Conversion Functions     
 */

/*
 * Convert given value to input"s gui selected units, input non-desctructive.
 *  
 * inp - Input object.
 * value - Number to convert.
 * Returns: Converted value or conversion error string on fail.
 */
Mechcalc.prototype.convert_value_to_selected = function(inp, value){
    return this._conversion(value, inp.u.cat, inp.u.convert_to, inp.u.unit);
}

/*
 * Convert given value to input default units, input non-desctructive.
 * 
 * inp - Input object.
 * value - Number to convert.
 * Returns: Converted value or conversion error string on fail.
 */
Mechcalc.prototype.convert_value_to_default = function(inp, value){
    return this._conversion(value, inp.u.cat, inp.u.unit, inp.u.convert_to);
}

/*
 * Convert input object to default unit defined in calc config xml.
 * 
 * inp - Input object to convert.
 * Return: True success, false failure.
 */
Mechcalc.prototype._convert_input_to_default = function(inp){
    return this._convert_input(inp, inp.u.unit, inp.u.convert_to);
}

/*
 * Convert input object to units shown in it"s gui select box.
 * 
 * inp - Input object
 * Return: true success, false failure
 */
Mechcalc.prototype._convert_input_to_selected = function(inp){
    return this._convert_input(inp, inp.u.convert_to, inp.u.unit);
}

/* Convert input to specified units within inputs unit category.
 * 
 * inp - Input object
 * to - units to convert to
 * Return: true success, false failure or NaN input
 */
Mechcalc.prototype._convert_input = function(inp, from, to){
    if(!this.is_number(inp.value)){
        this._set_error(inp, this.num_err);
        return false;
    }

    if(inp.u.cat != "None"){
        var ret = this._conversion(inp.value, inp.u.cat, from, to);

        if(!this.is_number(ret)){
            this._set_error(inp, inp.id + " " + ret);
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
Mechcalc.prototype._conversion = function(value, category, from, to){
    if(!this.is_number(value)){
        return "Error: conversion - Input value (" + value + ") is not a number.";
    }

    if(!this.units[category]){
        return "Error: conversion - Category (" + category + ") does not exist.";
    }

    if(!this.units[category][to]){
        return "Error: conversion - To units (" + to + ") does not exist.";
    }

    if(!this.units[category][from]){
        return "Error: conversion - From units (" + from + ") does not exist.";
    }

    if(typeof(this.units[category][to].conv)=="function"){
        var ret = this.units[category][from].conv(value, to);
    }else{
        var ret = value * (this.units[category][from].conv/this.units[category][to].conv);
    }

    if(!this.is_number(ret)){
        return "Error: conversion - return value (" + ret + ") is not a number.";
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
Mechcalc.prototype._format_input_value = function(inp){
    /* trim right/left whitespace */
    inp.value = inp.elem.value.replace(/^\s\s*/, "").replace(/\s\s*$/, "");

    var rx_frac = /^([0-9]+ ){0,1}[0-9]+\/[1-9]+$/;
    var rx_scin = /^[0-9]+[\.]{0,1}[0-9]*[ ]?x[ ]?10[ ]?[^]?[-+]?[0-9]+$/;
    var rx_cmplx = /^(.*)([+-]{1})(?:[ij]{1}(\d\.?\d*)|(\d\.?\d*)[ij]{1})$/;

    if(this.is_number(inp.value)){
        inp.value = Number(inp.value);
        this._gui_set_input_value(inp);
    /* check if complex and parse parts */
    }else if(cmatch = inp.value.match(rx_cmplx)){
        inp.imag = cmatch[3] || cmatch[4];
        if(this.is_number(cmatch[1]) && this.is_number(inp.imag)){
            inp.value = Number(cmatch[1])
            inp.imag = Number(inp.imag);
            if(cmatch[2] == '-') inp.imag = inp.imag * -1;
            this._gui_set_input_value(inp);
        }else{
            inp.value = NaN
        }
    /* convert fractions to decimal */
    }else if(rx_frac.test(inp.value)){
        /* convert fractions */
        var int = 0;
        var fraction;
        var intcheck = inp.value.split(" ");

        if(intcheck[0] == inp.value){
            fraction = inp.value;

        }else{
            int = intcheck[0];
            fraction = intcheck[1];
        }

        var num_denom = fraction.split("/");
        inp.value = Number(int)+(num_denom[0]/num_denom[1]);
        this._gui_set_input_value(inp);

    /* convert scientific notation to e notation */
    }else if(rx_scin.test(inp.value)){
        inp.value = inp.value.replace(/ /g,"");
        inp.value = Number(inp.value.replace(/x10[^]?/,"e"));
        this._gui_set_input_value(inp);

    /* input is not a number of some sort, set to NaN and flag error */
    }else{
            inp.value = NaN;
    }

}

/*
 * Round value to selected decimal place.
 * 
 * value - value to round
 * Returns: rounded value
 */
Mechcalc.prototype.format_rounder = function(value){
    if(this.rounding == 0 || !this.is_number(value)){
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
Mechcalc.prototype.is_number = function(value){
    if(isNaN(Number(value))){
        return false;
    }

    if(typeof(Number(value)) != "number"){
        return false;
    }
    return true;
}

/*
 * Get selected value of choice input.
 * 
 * ch_inp - choice input object
 */
Mechcalc.prototype._get_selected_value = function(ch_inp){
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
Mechcalc.prototype._set_select_option_by_value = function(elem, value){
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
Mechcalc.prototype._set_select_option_by_label = function(ch_inp, label){
    var select = ch_inp.elem;
    for(var i = 0; i < ch_inp.elem.options.length; i++){
        if(ch_inp.elem.options[i].innerHTML == label){
            ch_inp.elem.selectedIndex = i;
            return true;
        }
    }
    return false;
    
}

/**********************************************************
 * Graphing functions
 */

Mechcalc.prototype.graph = function(t, item, elem){
    /************************
     * Init
     */
    this.id = item.id;
    this.elem = document.getElementById("mcalc_" + this.id);
    this.t = t
    this.enabled = true;

    if(!(this.elem.getContext && this.elem.getContext("2d"))){
        this.enabled = false;
        document.getElementById("mcalc_graph_btn_" + this.id).disabled = true
        document.getElementById("mcalc_" + this.id + "_sh").innerHTML = "";
        return false;
    }

    this._xyfloater = document.getElementById("mcalc_xy_floater");
    this.ctx = this.elem.getContext("2d");
    this.grid = {};
    this.grid.t = this;
    this.grid.log = {};
    this.plot = {};
    this.plot.t = this;
    this.plot.items = {};

    this.plot.colors = {"red":[255,0,0,1],
                        "green":[0,255,0,1],
                        "blue":[0,0,255,1],
                        "yellow":[255,255,0,1],
                        "orange":[255,127,0,1],
                        "purple":[127,0,127,1],
                        "pink":[255,0,255,1],
                        "aqua":[0,255,255,1],
                        "gray":[127,127,127,1],
                        "black":[0,0,0,1],
                            }
    
    /*
     * type - "log" (x-axis) or "normal"
     * align - "left" or "center" major grid line locations (normal only)
     */
    this.grid.type = item.config.type || "normal";
    this.grid.align = item.config.align || "left";

    /************************
     * User calc.json options
     */


    /*
     * if this.grid.align == "center" these will center the major grid line
     * on the label with a value of 0.
     */
    this.grid.center_major_y0 = item.config.centerY0 || false;
    this.grid.center_major_x0 = item.config.centerX0 || false;

    /*
     * Graph labels running along the left and bottom sides respectively.
     */
    this.grid.xlabel = item.config.xlabel || "";
    this.grid.ylabel = item.config.ylabel || "";

    for(plot_item in item.config.items){
        var i = item.config.items[plot_item];
        var rgba = this.plot.colors[i.color];
        var rgba_str = "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+",1)";
        this.plot.items[i.label] = [i.label, i.yunit, i.xunit, rgba, rgba_str];
    }

    /*
     * This will skip ever Nth label, used if spacing gets tight and labels overlap.
     */
    this.grid.skip_xlabels = item.config.skip_xlabels || 1;
    this.grid.skip_ylabels = item.config.skip_ylabels || 1;

    /*
     * Number of divisions per given axis.
     */
    this.grid.xlines = item.config.xlines || 10;
    this.grid.ylines = item.config.ylines || 10;

    /*
     * Min/Max values to use for grid labels.
     * In betweens will be calculated by xmax/xlines
     */
    this.grid.xmin = item.config.labels_xmin || 0;
    this.grid.xmax = item.config.labels_xmax || 100;
    this.grid.ymin = item.config.labels_ymin || 0;
    this.grid.ymax = item.config.labels_ymax || 100;

    /*
     * Number of decimal places to display on labels.
     */
    this.grid.label_rounding = item.config.label_rounding || 0;


    /************************
     * Internally defined and calculated options
     */

    this.grid.log.min = 0;
    this.grid.log.max = 0;
    this.grid.log.range = 0;

    this.grid.xstart = 30;
    this.grid.ystart = this.elem.height - 50;
    this.grid.margin = 10;
    this.grid.height = this.grid.ystart - this.grid.margin;
    this.grid.width = this.elem.width - this.grid.xstart - this.grid.margin;

    if(this.grid.align == "center"){
        this.grid.xcenter = this.grid.xstart + this.grid.width/2;
        this.grid.ycenter = this.grid.ystart - this.grid.height/2;
    }else{
        this.grid.xcenter = this.grid.xstart;
        this.grid.ycenter = this.grid.ystart;
    }

    this.xpixel = 1;
    this.ypixel = 1;

    this.plot.xcenter = this.grid.xcenter;
    this.plot.ycenter = this.grid.ycenter;
    this.plot.edge = this.grid.xstart;

    /************************
     * User runtime options and functions
     */

    /*
     * Creates an item to plot on the graph
     * label - Name displayed color keyed on graph and a reference for drawing.
     * yunit - Y Axis units. (for hover over box)
     * xunit - X Axis units. (for hover over box)
     * color - red, green, blue, yellow, orange, purple, pink, aqua, gray
     */
   
    this.plot.add_item = function(label, xunit, yunit, color){
        var rgba = this.colors[color];
        var rgba_str = "rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+",1)";
        this.items[label] = [label, yunit, xunit, rgba, rgba_str];
    }

    /*
     * Draw from fx,fy to tx,ty, for plot item "label"
     */
    this.plot.line = function(fx, fy, tx, ty, label){
        var color =  this.items[label][4];
        fxc = this.t._convertx(fx);            
        if(this.t.xoff_grid(fxc)){return false;}

        fyc = this.t._converty(fy);
        if(this.t.yoff_grid(fyc)){return false;}

        txc = this.t._convertx(tx);
        if(this.t.xoff_grid(txc)){return false;}

        tyc = this.t._converty(ty);
        if(this.t.yoff_grid(tyc)){return false;}

        this.t.ctx.clearRect(fxc, fyc, 1, 1);

        this.t.ctx.beginPath();
        this.t.ctx.strokeStyle=color;
        this.t.ctx.moveTo(fxc, fyc);
        this.t.ctx.lineTo(txc, tyc);
        this.t.ctx.stroke();
        return true;
    }

    this.plot.circle = function(x, y, diameter, label){
        var color =  this.items[label][4];
        xc = this.t._convertx(x);            
        if(this.t.xoff_grid(xc)){return false;}

        yc = this.t._converty(y);
        if(this.t.yoff_grid(yc)){return false;}

        this.t.ctx.beginPath();
        this.t.ctx.strokeStyle=color;
        this.t.ctx.arc(xc, yc, (diameter/2)/this.t.xindexer(), 0, 2 * Math.PI);
        this.t.ctx.stroke();
        return true;
    }

    this.plot.arc = function(x, y, radius, start_rads, end_rads, label){
        var color =  this.items[label][4];
        xc = this.t._convertx(x);            
        if(this.t.xoff_grid(xc)){return false;}

        yc = this.t._converty(y);
        if(this.t.yoff_grid(yc)){return false;}

        this.t.ctx.beginPath();
        this.t.ctx.strokeStyle=color;
        this.t.ctx.arc(xc, yc, radius/this.t.xindexer(), 2*Math.PI-start_rads, 2*Math.PI-end_rads, true);
        this.t.ctx.stroke();
        return true;
    }

    this.plot.text = function(text, x, y, label){
        var color =  this.items[label][4];
        xc = this.t._convertx(x);            
        if(this.t.xoff_grid(xc)){return false;}

        yc = this.t._converty(y);
        if(this.t.yoff_grid(yc)){return false;}

        this.t.ctx.fillStyle=color;
        var lines = text.split('\n');
        for(var i = 0; i < lines.length; i++) {
            var offset = (10 * i);
            this.t.ctx.fillText(lines[i], xc, yc + offset);
        }
    }
    /*
     * Min/Max values to use for grid labels.
     * In betweens will be calculated by xmax/xlines
     */
    this.grid.labels = function(xmin, xmax, ymin, ymax){
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }

    /*
     * Loop index helpers.
     * Greatly reduces calculations, as it returns the index of the next
     * pixel. If each pixel accounts for 500 units, the step is 500.
     */
    this.xindexer = function(x){
        if(this.grid.type == "log"){
            dif = (Math.floor(Math.log(this.grid.xmax)/Math.LN10)-Math.ceil(Math.log(x)/Math.LN10));
            return 1/(this.xpixel*Math.pow(10, dif+1));
        }else{
            return 1/this.xpixel;
        }
    }

    this.yindexer = function(y){
        return 1/this.ypixel;
    }

    /*
     * Check if x or y input is off the grid or not.
     */
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

    /************************
     * Internal fuctions
     */

     this.grid._draw = function(mx, my, lx, ly, color){
        this.t.ctx.beginPath();
        this.t.ctx.strokeStyle=color;
        this.t.ctx.moveTo(this.xstart + mx, this.ystart - my);
        this.t.ctx.lineTo(this.xstart + lx, this.ystart - ly);
        this.t.ctx.stroke();
    }
    
    /*
     * Convert x or y absolute position to relative to grid position
     */
    this._convertx = function(x){
        if(this.grid.type == "log" && x != 0){
            return this.plot.xcenter + Math.round(((Math.log(x)/Math.LN10-this.grid.log.min) / this.grid.log.range) * this.grid.width);
        }
        return this.plot.xcenter + (this.xpixel * x);
    }

    this._converty = function(y){
        return this.plot.ycenter - (this.ypixel * y);
    }


    /*
     * log graph specific functions.
     */

    this.grid.log.init = function(gxmin, gxmax){
            if(this.xmin <= 0){
                this.min = 0;
            }else{
                this.min = Math.round(Math.log(gxmin)/Math.LN10);
            }
            if(gxmax <= 0){
                this.max = 0;
            }else{
                this.max = Math.round(Math.log(gxmax)/Math.LN10);
            }
            this.range = Math.round((this.max - this.min));
    }

    /*
     * Convert numbers to K M G or T and set decimal precision for grid labels
     */
    this._short_num = function(num){
        if(num==0){return num;}

        if(snum<0.01){ return num.toExponential(); };

        if(snum<1000){ return snum.toFixed(this.grid.label_rounding); };

        var sign = false;
        if(num<0){sign = true;}
        var snum = Math.abs(num);

        if(snum<1000000 && (snum/1000)>=1){
            snum = (snum/1000).toFixed(this.grid.label_rounding) + "K";
            if(sign){snum = "-"+snum;}
            return snum
        }
        if(snum<1000000000 && (snum/1000000)>=1){
            snum = (snum/1000000).toFixed(this.grid.label_rounding) + "M";
            if(sign){snum = "-"+snum;}
            return snum
        }
        if(snum<1000000000000 && (snum/1000000000)>=1){
            snum = (snum/1000000000).toFixed(this.grid.label_rounding) + "G";
            if(sign){snum = "-"+snum;}
            return snum
        }
        if((snum/1000000000000)>=1){
            snum = (snum/1000000000000).toFixed(this.grid.label_rounding) + "T";
            if(sign){snum = "-"+snum;}
            return snum
        }            
        return num;
    }

    this._draw_ytext = function(text, x, y){
        this.ctx.save();
        this.ctx.translate((this.elem.width/2),(this.elem.height/2))
        this.ctx.rotate(270*Math.PI/180);
        this.ctx.fillStyle="rgba(0, 0, 0, 255)";
        this.ctx.fillText(text, x-(this.elem.width/2), y-(this.elem.height/2));
        this.ctx.restore()
    }

    /*
     * Grid builder, called after all this.graph.grid.*
     * user config options are set and before plotting begins.
     */
    this.grid.build = function(){
        this.t.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.t.ctx.clearRect(0, 0, this.t.elem.width, this.t.elem.height);

        this.t.ctx.fillStyle="rgba(0, 0, 0, 255)";
        this.t.ctx.fillText(this.xlabel, (this.t.elem.width/2) - (this.xlabel.toString().length/2)*5, this.t.elem.height-2);
        this.t.ctx.fillStyle="rgba(0, 0, 0, 255)";
        this.t._draw_ytext(this.ylabel, ((this.t.elem.width/2) - (this.ylabel.toString().length/2)*3), 20);

        for(item in this.t.plot.items){
            this.t.ctx.fillStyle=this.t.plot.items[item][4];
            this.t.ctx.fillText(this.t.plot.items[item][0], this.edge + 10, this.t.grid.ystart+25);
            this.edge += this.t.plot.items[item][0].toString().length * 7;
            this.t.ctx.fillStyle="rgba(0, 0, 0, 1)";
        }

        if(this.type == "log"){
            this.log.init(this.xmin, this.xmax);
        }


        this.t.xpixel = this.width/(this.xmax-this.xmin);
        this.t.ypixel = this.height/(this.ymax-this.ymin);
        this.t.plot.edge = this.xstart;
        var grid_yline_space = this.height/this.ylines;
        var grid_xline_space = this.width/this.xlines;
        var w = 0;

        if(this.type == "log"){
            var kfactor = this.width/this.log.range;

            for(k=this.log.min; k<=this.log.max; k++){
                var kf = kfactor * (k-this.log.min);
                
                if((w % this.skip_xlabels) === 0){
                    this.t.ctx.fillText(this.t._short_num(Math.pow(10, k)), (this.xstart+kf)* 0.95, this.ystart+10)
                }

                w++;

                for(i=1; i<=10; i++){
                    ilog = kf+((Math.log(i)/Math.LN10)*kfactor)
                    this._draw(ilog, 0, ilog, this.height, "rgba(0, 0, 0, 0.2)");
                }
            }

        }else{
            w = 0;
            var last_label = 0;
            var label_spacing = (this.xmax-this.xmin)/this.xlines;

            for(i=0; i<=this.width+2; i+=grid_xline_space){
                var label = label_spacing * w + this.xmin;

                if(label==0){
                    this.t.plot.xcenter = this.xstart + i;
                }else if((last_label < 0 && label > 0) || (last_label + label) == 0){
                    pix_adj = grid_xline_space/Math.abs(last_label - label);
                    this.t.plot.xcenter = this.xstart + i - (pix_adj*label);
                }

                last_label = label
                label = this.t._short_num(label_spacing * w + this.xmin)

                if(i == 0){
                    label_width = 0;
                }else{
                    label_width = (label.toString().length  * 7)/2;
                }

                if((w % this.skip_xlabels) === 0){
                    this.t.ctx.fillText(label, this.xstart+i-label_width, this.ystart+10);
                }

                w++;
                this._draw(i, 0, i, this.height, "rgba(0, 0, 0, 0.2)");
            }
        }

        w = 0;
        var l = true;
        var label_spacing = (this.ymax-this.ymin)/this.ylines;
        var last_label = 0;

        for(i=0; i<=this.height+2; i+=grid_yline_space){
            var label = label_spacing * w + this.ymin;
            if(label==0){
                this.t.plot.ycenter = this.ystart - i;
            }else if((last_label < 0 && label > 0) || (last_label + label) == 0){
                    pix_adj = grid_yline_space/Math.abs(last_label - label);
                    this.t.plot.ycenter = this.ystart - i + (pix_adj*label);
            }

            last_label = label
            label = this.t._short_num(label_spacing * w + this.ymin)

            if(i == 0){
                label_width = 5;
            }else{
                label_width = (label.toString().length  * 8)/2;
            }

            if((w % this.skip_ylabels) == 0){
                this.t._draw_ytext(label, (this.xstart+i-label_width+15), 33);
            }

            w++;
            this._draw(0, i, this.width, i, "rgba(0, 0, 0, 0.2)");
        }

        if(this.align == "center"){
            if(this.center_major_y0 == true){
                var ystart = this.height-this.t.plot.ycenter+this.margin;
                this._draw(0, ystart, this.width, ystart, "rgba(0,0,0,1)");
            }else{
                this._draw(0, this.height/2, this.width, this.height/2, "rgba(0, 0, 0, 1)");
            }

            if(this.center_major_x0 == true){
                var xstart = this.t.plot.xcenter-this.xstart;
                this._draw(xstart, 0, xstart, this.height, "rgba(0, 0, 0, 1)");
            }else{
                this._draw(this.width/2, 0, this.width/2, this.height, "rgba(0, 0, 0, 1)");
            }

        }else{
            this._draw(0, 0, this.width, 0, "rgba(0, 0, 0, 1)");
            this._draw(0, 0, 0, this.height, "rgba(0, 0, 0, 1)");
        }
    }


    /*
     * Floating box over graph lines functions.
     */

    this._xyfloat_off = function(){
        this._xyfloater.style.display = "none";
    }

    this._xyfloat_color_check = function(rgba, against){
        for(var r = 0; r < rgba.length; r+=4){
            var passes = 0;
            for(var i = 0; i < 3; i++){
                if( rgba[r+i] > against[i]-5 && rgba[r+i] < against[i]+5){ passes++; }
            }
            if(passes > 2){return true;}
        }
        return false;
    }

    this._xyfloat = function(e){
        if(this.plot.items.length < 1){return false; }
        var e = e || window.e;
        var total_offset_x = 0;
        var total_offset_y = 0;
        var graph_x = 0;
        var graph_y = 0;
        var posx = 0;
        var posy = 0;
        var elem = this.elem;

        if(!e) var e = window.event;

        if(e.pageX || e.pageY)     {
            posx = e.pageX;
            posy = e.pageY;
        }else if(e.clientX || e.clientY)     {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        do{
            total_offset_x += elem.offsetLeft;
            total_offset_y += elem.offsetTop;
        }
        while(elem = elem.offsetParent)

        graph_x = posx - total_offset_x
        graph_y = posy - total_offset_y

        if(this.xoff_grid(graph_x)){this._xyfloat_off(); return false;}
        if(this.yoff_grid(graph_y)){this._xyfloat_off(); return false;}

        var plot_item = "";
        var rgba_size = 4;
        var rgba = this.ctx.getImageData(graph_x-(rgba_size/2), graph_y-(rgba_size/2), rgba_size, rgba_size).data;

        for(pitem in this.plot.items){
            if(this._xyfloat_color_check(rgba, this.plot.items[pitem][3])){
                plot_item = this.plot.items[pitem];
                break;
            }
        }

        if(plot_item == ""){ this._xyfloat_off(); return false; }

        if(this.grid.type == "log" && (graph_x) != 0){
            adjx = this.t.format_rounder(Math.pow(10,((graph_x-this.plot.xcenter)/this.grid.width)*this.grid.log.range+this.grid.log.min));
        }else{
            adjx = this.t.format_rounder(((graph_x-this.plot.xcenter)/this.xpixel));
        }

        adjy =  this.t.format_rounder((this.plot.ycenter-graph_y+2)/this.ypixel);

        this._xyfloater.style.display = "block";
        this._xyfloater.style.top = posy+15+ "px";
        this._xyfloater.style.left = posx+15 + "px";
        this._xyfloater.innerHTML = plot_item[0]+"<br /><hr>"+adjy+plot_item[1]+"<br />"+adjx+plot_item[2];
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
Mechcalc.prototype.control_units_conv = function(id){
    var select = this.i[id].u.elem;
    this._gui_clear_decoration(this.i[id]);
    if(this.get(this.i[id], true)){
        this.i[id].u.unit = select.options[select.selectedIndex].value;
        this.set(this.i[id]);
    } else {
        for(var i = 0; i < select.options.length; i++){
            if(select.options[i].value != this.i[id].u.unit){ continue; }
            select.selectedIndex = i;
        }
    }
}

/*
 * Call for GUI convert all boxes between SI or Default units.
 * 
 * sys - si or default system of units
 */
Mechcalc.prototype.control_units_system = function(sys){
    this.clean();
    for(id in this.i){
        var inp = this.i[id];
        if(inp.type != this.type_calc){ continue; }
        var select = inp.u.elem;

        if(inp.u.display[sys] != ""){
            var units = inp.u.display[sys];
        }else{
            var units = inp.u.convert_to;
        }

        this.get(inp, true);
        for(var i = 0; i < select.options.length; i++){
            if(select.options[i].value != units){ continue; }
            select.selectedIndex = i;
            inp.u.unit = select.options[i].value;
        }
        this.set(inp);
    }
}

/*
 * Call for GUI set currently selected units as default units.
 */
Mechcalc.prototype.control_units_set_defaults = function(){
    for(id in this.i){
        if(this.i[id].type == this.type_calc){
            var select = this.i[id].u.elem;
            if(this.i[id].u.cat != this.no_category){
                this.i[id].u.display.udefault = select.options[select.selectedIndex].value;
            }
        }else if(this.i[id].type == this.type_choice){
            var select = this.i[id].elem;
            this.i[id].cdefault = select.options[select.selectedIndex].value;
        }
    }
}


/*
 * Call for GUI set rounding amount and round all current inputs.
 * 
 * roundit - decimal places to round to eg 10 = .x, 100 = .xx
 */
Mechcalc.prototype.control_round_all = function(roundit){
    this.rounding = Number(roundit);
    for(id in this.i){
        if(this.i[id].type == this.type_calc){
            this.i[id].elem.value = this.format_rounder(this.i[id].elem.value);
        }
    }
}

/*
 * Call for GUI clear all inputs and input boxes.
 */
Mechcalc.prototype.control_clear_inputs = function(){
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
Mechcalc.prototype.control_showhide = function(id, show){
    if(typeof(show) == "undefined"){ show = "";}

    var cont = document.getElementById("mcalc_"+id+"_cont");
    var sh = document.getElementById("mcalc_"+id+"_sh");
    if(show === true){
        cont.style.display = "block";
        sh.innerHTML = "[-]";
    }else if(show === false){
        cont.style.display = "none";
        sh.innerHTML = "[+]";
    }else if(cont.style.display == "none"){
        cont.style.display = "block";
        sh.innerHTML = "[-]";
    }else{
        cont.style.display = "none";
        sh.innerHTML = "[+]";
    }
}
