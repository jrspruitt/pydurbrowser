<html>
    <head>
        <title>Calculator Javascript Editor</title>
    </head>
<body>
<form name="texteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<input type="hidden" value="calculator" name="etype" />
<textarea name="data" style="width:100%;height:95%;">{{! data }}</textarea><br />
<input type="submit" value="submit" />
</form>
</body>
</html>