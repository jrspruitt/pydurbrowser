var Mechcalc = function(){
    this.type_calc = "calc";
    this.type_choice = "choice";
    this.type_graph = "graph";
    this.type_label = "label";
    this.type_button = "button";
    this.type_textbox = "textbox";
    this.type_seperator = "seperator";
    this.type_diagram = "diagram";
    this._none = "None";
}

/***********************************************************
 * Build the UI for editing calculator items.
 *
 * Called externally.
 *
 * config - json object from config file or empty for new calc.
 *
 */
 
Mechcalc.prototype.init = function(config){
    var t = this;
    $("<h2 />", {text:"Calculator Config"}).appendTo("#mcalc");

    if(! config){
        config = {"rounding":0, "items":[]}
    }

    var rounding_values = [0];
    var rounding_labels = ["None"];
    for (var i = 0; i < 10; i++){
        var rounding = Math.pow(10, i);
        rounding_values.push(rounding);
        rounding_labels.push((1/rounding).toFixed(i));
    }

    var rounding_table = $("<div />", {class:"table"}).appendTo("#mcalc");
    this._html_select("Rounding", "rounding", rounding_values, rounding_labels, config.rounding).prependTo(rounding_table);

    var item_types = ["New Item", this.type_calc, this.type_choice, this.type_graph, this.type_label, this.type_button, this.type_textbox, this.type_seperator, this.type_diagram];
    this._html_select("Add Item", "add_item_type", item_types, item_types).appendTo("#mcalc");
    
    $("#mcalc").find("#add_item_type").on("change", function(){t._new_item(this.options[this.selectedIndex].value);})
    $("<input />", {id:"add_item_name"}).appendTo("#mcalc");

    $("<div />", {id:"mcalc_accordion"})
                  .appendTo("#mcalc");

    for(item in config.items){
        var i = config.items[item];
        if(i.type == this.type_calc){
            this._html_calc(i);
        }else if(i.type == this.type_choice){
            this._html_choice(i);
        }else if(i.type == this.type_graph){
            this._html_graph(i);
        }else if(i.type == this.type_diagram){
            this._html_diagram(i);
        }else{
            this._html_generic(i);
        }
    }

$(function(){$("#mcalc_accordion").accordion({collapsible: true,
                                              heightStyle: "content",
                                              animate: false,
                                              header:"> div > h3"})
                                  .sortable({axis: "y",
                                             handle: "h3",
                                             stop: function(event, ui) {
                                                ui.item.children("h3").triggerHandler("focusout");
                                                $(this).accordion("refresh");
                                                }});
      });
  $( function() {
    $("#choice_options").sortable();
    $("#choice_options").disableSelection();
  } );
}

/***********************************************************
 * Collect all item data from DOM elements to save to file.
 *
 * Called externally, so json object can be saved to file.
 *
 * returns - stringified json obect of all config data.
 */
 
Mechcalc.prototype.get_json = function(){
    var t = this;
    var items = [];
    $("div[id*='item']").each(function(i, elem){
        var id = $(elem).find("#item_id").val();
        var type = $(elem).find("#item_type").val();

        if(type == t.type_calc){
            var item = new t._parse_calc(t, id, elem);
        }else if(type == t.type_choice){
             var item = new t._parse_choice(t, id, elem);
        }else if(type == t.type_graph){
             var item = new t._parse_graph(t, id, elem);
        }else if(type == t.type_diagram){
             var item = new t._parse_diagram(t, id, elem);
        }else{
             var item = new t._parse_generic(t, id, type, elem);
        }
        items.push(item);
 });
    var retdata = {"rounding":parseInt($("#rounding").val()), "items":items}
    return JSON.stringify(retdata)
}

/***********************************************************
 * Get item data from DOM.
 */

Mechcalc.prototype._parse_calc = function(t, id, elem){
    this.id = id;
    this.type = t.type_calc;
    this.label = $(elem).find("#label").val();
    var si = $(elem).find("#si").val() || t._none;
    var udefault = $(elem).find("#udefault").val() || t._none;
    var convert_to = $(elem).find("#convert_to").val() || t._none;
    var dstatic = $(elem).find("#static").val() || "";
    var types = []
    $(elem).find("li[id*='units']").each(function(i, elem){types.push($(elem).text());});
    var units = {"si":si,
                 "udefault":udefault,
                 "types":types};
    var display = {"radix":$(elem).find("#radix").val(),
                   "value":$(elem).find("#value").val(),
                   "static":dstatic,
                   "units":units};
    this.config = {"button": $(elem).find("#button").prop("checked"),
                   "category": $(elem).find("#category").val(),
                   "convert_to":convert_to,
                   "display":display};
}

Mechcalc.prototype._parse_graph = function(t, id, elem){
    this.id = id;
    this.type = t.type_graph;
    this.label = $(elem).find("#label").val();
    this.config = {"align":$(elem).find("#graph_align").val(),
                   "xlabel":$(elem).find("#graph_xlabel").val(),
                   "type":$(elem).find("#graph_type").val(),
                   "label_rounding":parseInt($(elem).find("#graph_label_rounding").val()),

                   "xlabel":$(elem).find("#graph_xlabel").val(),
                   "centerX0":$(elem).find("#graph_centerX0").val() == "true",
                   "xlines":parseInt($(elem).find("#graph_xlines").val()),
                   "skip_xlabels":parseInt($(elem).find("#graph_skip_xlabels").val()),
                   "labels_xmin":parseInt($(elem).find("#graph_labels_xmin").val()),
                   "labels_xmax":parseInt($(elem).find("#graph_labels_xmax").val()),

                   "ylabel":$(elem).find("#graph_ylabel").val(),
                   "centerY0":$(elem).find("#graph_centerY0").val() == "true",
                   "ylines":parseInt($(elem).find("#graph_ylines").val()),
                   "skip_ylabels":parseInt($(elem).find("#graph_skip_ylabels").val()),
                   "labels_ymin":parseInt($(elem).find("#graph_labels_ymin").val()),
                   "labels_ymax":parseInt($(elem).find("#graph_labels_ymax").val()),
                   };
}

Mechcalc.prototype._parse_choice = function(t, id, elem){
    this.id = id;
    this.type = t.type_choice;
    this.label = $(elem).find("#label").val();
    var options = []
    $(elem).find("li[id*='option']").each(function(i, elem){var label = $(elem).find("#label").val();
                                                            var value = $(elem).find("#value").val();
                                                            var selected = $(elem).find("#selected").prop("checked");
                                                            if(label || value){
                                                                options.push({"label":label, "value":value, "selected":selected});
                                                            }
                                                            });
    this.config = {"options":options};
}

Mechcalc.prototype._parse_diagram = function(t, id, elem){
    this.id = id;
    this.type = t.type_diagram;
    this.label = $(elem).find("#label").val();
    this.config = {"file":$(elem).find("#file").val(),
                   "alt_text":$(elem).find("#alt_text").val()};
}

Mechcalc.prototype._parse_generic = function(t, id, type, elem){
    this.id = id;
    this.type = type;
    this.label = $(elem).find("#label").val();
}

/***********************************************************
 * Initialize Item Objects
 */

Mechcalc.prototype._item_calc = function(t, id){
    this.id = id;
    this.type = t.type_calc;
    this.label = "";
    var units = {"si":"", "udefault":"", "types":[]};
    var display = {"radix":"0", "value":"0", "static":"", "units":units};
    this.config = {"button": true, "category": t._none, "convert_to": t._none, "display":display};
}

Mechcalc.prototype._item_choice = function(t, id){
    this.id = id;
    this.type = t.type_choice;
    this.label = "";
    this.config = {"options":[]};
}

Mechcalc.prototype._item_graph = function(t, id){
    this.id = id;
    this.type = t.type_graph;
    this.label = "";
    this.config = {"centerX0":false,
                   "xlabel":"",
                   "xlines":10,
                   "skip_xlabels":0,
                   "labels_xmin":0,
                   "labels_xmax":10,
                   "centerY0":false,
                   "ylabel":"",
                   "ylines":10,
                   "skip_ylabels":0,
                   "labels_ymin":0,
                   "labels_ymax":10,
                   "type":"normal",
                   "align":"left",
                   "labels_rounding":0,
                   "items":[]};
}

Mechcalc.prototype._item_diagram = function(t, id){
    this.id = id;
    this.type = t.type_diagram;
    this.label = "";
    this.config = {src:"", alt_text:""};
}

Mechcalc.prototype._item_generic = function(t, id, type){
    this.id = id;
    this.type = type;
    this.label = "";
}

/*
 * Add item functionality.
 * Clears inputs, and calls the HTML create function.
 */

Mechcalc.prototype._new_item = function(type){
    var id = $("body").find("#add_item_name").val();

    $("body").find("#add_item_type").val("New Item");
    $("body").find("#add_item_name").val("");
    if(id == ""){alert("No id given for item."); return; }

    if(type == this.type_calc){
        this._new_html_calc(id);
    }else if(type == this.type_choice){
        this._new_html_choice(id);
    }else if(type == this.type_graph){
        this._new_html_graph(id);
    }else if(type == this.type_diagram){
        this._new_html_diagram(id);
    }else{
        this._new_html_generic(new this._item_generic(this, id, type));
    }
    
}

/***********************************************************
 * Create Item's Editor HTML
 * 
 */

Mechcalc.prototype._new_html_calc = function(id){
    var item = new this._item_calc(this, id);
    this._html_calc(item);
    $("#mcalc_accordion").accordion("refresh");
}

Mechcalc.prototype._html_calc = function(item){
    var heading = this._html_item_heading(item);
    this._html_input_box("Label: ","label", item.label).appendTo(heading);

    this._html_input_box("Button: ","button", "button", "checkbox").appendTo(heading);
    if(item.config.button == "1" || item.config.button == true) {
        $(heading).find("#button").prop("checked", true);
    }

    $("<h4 />", {text:"Display"}).appendTo(heading.parent());
    var display_table = $("<div />", {class:"table"}).appendTo(heading.parent());
    this._html_select("Radix", "radix", [0,1,2], ["Decimal", "Binary", "Hex"], item.config.display.radix).appendTo(display_table);
    this._html_input_box("Value: ", "value", item.config.display.value).appendTo(display_table);

    this._html_units_config(item).appendTo(heading.parent());
}

Mechcalc.prototype._new_html_graph = function(id){
    var item = new this._item_graph(this, id);
    this._html_graph(item);
    $("#mcalc_accordion").accordion("refresh");
}

Mechcalc.prototype._html_graph = function(item){
    var heading = this._html_item_heading(item);
    var types = ["normal", "log"];
    var aligns = ["left", "center"];
    var centers = [true, false];
    var centers_labels = ["True","False"]
    this._html_input_box("Label: ", "label", item.label).appendTo(heading);

    this._html_input_box("X Axis Label: ", "graph_xlabel", item.config.xlabel).appendTo(heading);
    this._html_input_box("X Line Count: ", "graph_xlines", item.config.xlines).appendTo(heading);
    this._html_input_box("Skip X Labels: ", "graph_skip_xlabels", item.config.xlines).appendTo(heading);
    this._html_input_box("Label XMin: ", "graph_labels_xmin", item.config.labels_xmin).appendTo(heading);
    this._html_input_box("Label XMax: ", "graph_labels_xmax", item.config.labels_xmax).appendTo(heading);
    
    this._html_input_box("Y Axis Label: ", "graph_ylabel", item.config.ylabel).appendTo(heading);
    this._html_input_box("Y Line Count: ", "graph_ylines", item.config.ylines).appendTo(heading);
    this._html_input_box("Skip Y Labels: ", "graph_skip_ylabels", item.config.xlines).appendTo(heading);
    this._html_input_box("Label YMin: ", "graph_labels_ymin", item.config.labels_ymin).appendTo(heading);
    this._html_input_box("Label YMax: ", "graph_labels_ymax", item.config.labels_ymax).appendTo(heading);


    this._html_select("Label Rounding", "graph_label_rounding", [0,1,2,3,4,5], [0,1,2,3,4,5], item.config.label_rounding).appendTo(heading);
    this._html_select("Type", "graph_type", types, types, item.config.type).appendTo(heading);
    this._html_select("Alignment", "graph_align", aligns, aligns, item.config.align).appendTo(heading);
    this._html_select("Center X on 0", "graph_centerX0", centers, centers_labels, item.config.centerX0.toString()).appendTo(heading);
    this._html_select("Center Y on 0", "graph_centerY0", centers, centers_labels, item.config.centerY0.toString()).appendTo(heading);
}

Mechcalc.prototype._new_html_choice = function(id){
    var item = new this._item_choice(this, id);
    this._html_choice(item);
    $("#mcalc_accordion").accordion("refresh");
}

Mechcalc.prototype._html_choice = function(item){
    var heading = this._html_item_heading(item);
    var types = ["normal", "log"];
    var aligns = ["left", "center"];
    var centers = ["1", "0"];
    var centers_labels = ["True","False"]
    $("<div />",{text:"Value - Label - Selected"}).appendTo(heading.parent());
    var option_list = $("<ul />",{id:"choice_options"}).appendTo(heading.parent());
    var t = this;
    $("<a />",{text:"Add Option"}).appendTo(heading.parent()).on("click", function(){t._html_choice_options("", "", false).appendTo(option_list);});

    for(option in item.config.options){
        var o = item.config.options[option];
        if(o.selected == "False"){
            o.selected = false;
        }else{
            o.selected = true;
        }
        this._html_choice_options(o.value, o.label, o.selected).appendTo(option_list);
    }
}

Mechcalc.prototype._new_html_diagram = function(id){
    var item = new this._item_diagram(this, id);
    this._html_diagram(item);
    $("#mcalc_accordion").accordion("refresh");
}

Mechcalc.prototype._html_diagram = function(item){
    var heading = this._html_item_heading(item);
    this._html_input_box("Label: ", "label", item.label).appendTo(heading);
    this._html_input_box("file: ", "file", item.config.file).appendTo(heading);
    this._html_input_box("alt_text: ", "alt_text", item.config.alt_text).appendTo(heading);
}

Mechcalc.prototype._new_html_generic = function(item){
    this._html_generic(item);
    $("#mcalc_accordion").accordion("refresh");
}

Mechcalc.prototype._html_generic = function(item){
    var heading = this._html_item_heading(item);
    if(item.type != this.type_seperator){
        this._html_input_box("Label: ", "label", item.label).appendTo(heading);
    }
}


/***********************************************************
 * HTML create helper functions
 */

/*
 * Create item heading for accordion.
 *
 * returns heading element to appendTo.
 */

Mechcalc.prototype._html_item_heading = function(item){
    var heading = $("<div />", {id:"item"}).appendTo("#mcalc_accordion");
    var label = $("<h3 />", {text:"Type: " + item.type + " ID: " + item.id})
                 .appendTo(heading);

    $("<a />",{text:"Remove",style:"float:right;"}).on("click", function(){heading.remove();}).appendTo(label);

    var item_container = $("<div />").appendTo(heading);
    var item_table = $("<div />", {class:"table"}).appendTo(item_container);
    $("<input />", {type:"hidden", id:"item_id", value:item.id}).appendTo(item_container);
    $("<input />", {type:"hidden", id:"item_type", value:item.type}).appendTo(item_container);

    return item_table;
}

/*
 * Create select element.
 *
 * elem_id - Name of the select element.
 * items_list - Array of values for options.
 * selected - Value of selected option or undefined.
 *
 * returns select html element.
*/

Mechcalc.prototype._html_select = function(label, elem_id, values_list, text_list, selected){
 
    if(typeof(selected) == "undefined"){
        selected = values_list[0];
    }

    var item_row = $("<div />", {class:"tr"});
    $("<span />", {class:"td", text:label}).appendTo(item_row);
    var item_td_input = $("<span />", {class:"td"}).appendTo(item_row);
    var select = $("<select />", {class:"mcalc_select",
                                  id:elem_id}).appendTo(item_td_input);

    for (var i = 0;  i < values_list.length; i++){
        $("<option />", {value: values_list[i], text: text_list[i]}).appendTo(select);
    }
        
    select.val(selected);

    return item_row;
}
/* 
 * Create simple input box and label for a table div.
 *
 * label - Label value to show next to input box.
 * id - id to give input box.
 * value - value to give input box.
 * type - type of input box to create.
 *
 * returns all elements attached to table row div.
 */

Mechcalc.prototype._html_input_box = function(label, id, value, type="text"){
    var item_row = $("<div />", {class:"tr"});
    var item_td_label = $("<span />", {class:"td", text:label}).appendTo(item_row);
    var item_td_input = $("<span />", {class:"td"}).appendTo(item_row);

    $("<input />", {type:type,
                    id:id,
                    value:value||""})
                    .appendTo(item_td_input);
    return item_row;
}

/*
 * Create units config elements.
 *
 * item - input item object.
 *
 */
Mechcalc.prototype._html_units_config = function(item){
    var t = this;
    var units_config_container = $("<div />");
    $("<h4 />", {text:"Units Select"}).appendTo(units_config_container);
    var select_box = $("<div />", {class:"table",
                                   style:"font-size:1.2em;"}).appendTo(units_config_container);

    var items_list = ["None"];
    for(u in this.units){
        items_list.push(u);
    }

    var units_config_table = $("<div />", {class:"table"}).appendTo(units_config_container);

    var category_select = this._html_select("Category", "category", items_list, items_list, item.config.category).appendTo(select_box);
    $(select_box).find("#category").on("change", function(){t._populate_units(this.options[this.selectedIndex].value, units_config_table, item);})

    this._populate_units(item.config.category, units_config_table, item);
    return units_config_container;
}

/*
 * Create and populate the units drop downs and unit lists.
 *
 * category - Category name or "None" (static) to create.
 * units_eleme - Parent element to empty before creating.
 * item - input item object.
 *
 */
Mechcalc.prototype._populate_units = function(selected, units_elem, item){
    units_elem.empty();

    if(selected == this._none){
        this._html_input_box("Static", "static", item.config.display.static).appendTo(units_elem);
        return;
    }


    var items_list = [];
    for(u in this.units[selected]){
        if(u == "convert_to") continue;
        items_list.push(u);
    }

    if(item.config.category != selected || item.config.category == this._none){
        var units_default = this.units[selected].convert_to;
        var units_si = this.units[selected].convert_to;
        var convert_to = this.units[selected].convert_to;
    }else if(item.config.category != this._none){
        units_si = item.config.display.units.si;
        units_default = item.config.display.units.udefault;
        var convert_to = item.config.convert_to;
    }

    this._html_select("Default", "udefault", items_list, items_list, units_default).appendTo(units_elem);
    this._html_select("SI", "si", items_list, items_list, units_si).appendTo(units_elem);
    this._html_select("Convert_To", "convert_to", items_list, items_list, convert_to).appendTo(units_elem);

    var unit_lists_row = $("<div />", {class:"tr"}).appendTo(units_elem);
    var units_td = $("<span />", {class:"td"}).appendTo(unit_lists_row);
    $("<h4 />", {text:"Units List"}).appendTo(units_td);
    var units_list = $("<ul />",{id:"units_sort", class:"unit_sort_connect"}).appendTo(units_td);

    for(var unit in this.units[selected]){
        if(unit == "convert_to" || $.inArray(unit, item.config.display.units.types) >= 0) continue;
        $("<li />", {text:unit})
                     .appendTo(units_list);
    }

    var item_units_td = $("<span />", {class:"td"}).appendTo(unit_lists_row);
    $("<h4 />", {text:"Item Units"}).appendTo(item_units_td);
    var item_units_list = $("<ul />",{id:"item_units_sort", class:"unit_sort_connect"}).appendTo(item_units_td);

    if(selected == item.config.category){
        for(var unit in item.config.display.units.types){
            $("<li />", {id:"units", text:item.config.display.units.types[unit]})
                         .appendTo(item_units_list);
        }
    }

  $(function(){
    $("#units_sort, #item_units_sort").sortable({
      connectWith: ".unit_sort_connect",
      update: function(event, ui) {console.log(ui)
                                    if(event.target.id == "units_sort") {
                                        ui.item[0].id = "";
                                    }else{
                                       ui.item[0].id = "units";
                                   }}
    }).disableSelection();
  });
}


/*
 * Create choice item option inputs.
 *
 * returns element with choice inputs.
 */
 
 Mechcalc.prototype._html_choice_options = function(value, label, checked){
    if(typeof(value) == "undefined"){
        value = "";
    }
    if(typeof(label) == "undefined"){
        label = "";
    }
    if(typeof(checked) == "undefined"){
        checked = false;
    }
    var container = $("<li />", {id:"options", class:"ui-state-default"});
    var handle = $("<span />",{class:"ui-icon ui-icon-arrowthick-2-n-s"}).appendTo(container);
    $("<input />", {id:"value",value:value, type:"text"}).appendTo(container);  
    $("<input />", {id:"label",value:label, type:"text"}).appendTo(container); 
    $("<input />", {id:"selected",name:"selected", value:value, type:"radio", checked:checked}).appendTo(container);
    return container;
 }
 
 
 
 
 
