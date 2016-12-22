<html>
    <head>
        <title>Calculator Editor</title>
        <link href="/assets/css/default/page/calculator_editor.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <script type="text/javascript" src="/assets/js/page/calculator/calc_edit.js"></script>
        <script type="text/javascript" src="/assets/js/page/calculator/units.js"></script>
        <script>
            var mc = {};
            $( document ).ready(function(){
                mc = new Mechcalc();
                mc.init({{! data }});
            });
            function save_calc(){
                var name = $("input[id='calcname']").val();
                if(name){
                    if(name.search(/^[a-zA-Z0-9\-_]*$/) < 0){
                        alert("Name can contain [A-Za-z0-9-_] only.");
                        return false;
                    }
                }
                $("input[id='calcdata']").val(mc.get_json());
                return true;
            }
 
    </script>
    </head>
<body>
<form action="{{ url }}" method="POST" onsubmit="return save_calc();" accept-charset="utf-8">
% if creator:
Calcuator Name: <input name="name" id="calcname" type="text" value="" /><br />
% end
<input type="submit" value="Save" /></br>
<input name="etype" value="calculator" type="hidden">
<input name="data" id="calcdata" value="" type="hidden">
</form>
<div id="mcalc"></div>
</form>
</body>
</html>