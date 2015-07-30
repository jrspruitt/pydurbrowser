<html>
    <head>
        <title>Text Editor</title>
    </head>
<body>
<form name="texteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<textarea name="text" style="width:500px;height:500px;">{{! text }}</textarea><br />
<input type="submit" value="submit" />
</form>
</body>
</html>
    