<html>
    <head>
        <title>CGit Editor</title>
    </head>
<body>
<form name="cgiteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<input type="hidden" value="cgit" name="etype" />
<table>
    <tr>
        <td>CGit Name:</td>
        <td><input type="text" name="name" size="55" value="{{ name }}" /></td>
    </tr>
    <tr>
        <td>CGit Description:</td>
        <td><input type="text" name="desc" size="55" value="{{ desc }}" /></td>
    </tr>
</table><br />
<input type="submit" value="submit" />
</form>
</body>
</html>
    