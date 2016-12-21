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
                mc = new Mechcalc("/{{ url }}", "{{update_url}}");
            });
            function save_calc(){
                $("input[id='data']").val(mc.get_json());
                return true;
            }
 
    </script>
    </head>
<body>
<form action="{{update_url}}" method="POST" onsubmit="return save_calc();" accept-charset="utf-8">
<input type="submit" value="Save" /></br>
<input name="etype" value="calculator" type="hidden">
<input name="data" id="data" value="" type="hidden"> 
</form>
<div id="mcalc"></div>
</form>
</body>
</html>