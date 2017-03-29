<html>
    <head>
        <title>Text Editor</title>
    </head>
<body>
<form name="texteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<input type="hidden" value="description" name="etype" />
<input type="hidden" value="{{ display }}" name="display" />
<textarea name="text" style="width:500px;height:500px;">{{ text }}</textarea><br />
Delete all text and submit to delete file.<br />
<input type="submit" value="submit" />
</form>
</body>
</html>
    
