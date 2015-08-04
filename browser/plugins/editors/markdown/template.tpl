<html>
    <head>
        <title>Text Editor</title>
    </head>
<body>
<form name="texteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<textarea name="text" style="width:500px;height:500px;">{{! text }}</textarea><br />
Delete all text and submit to delete file.<br />
<input type="submit" value="submit" />
</form>
</body>
</html>
    