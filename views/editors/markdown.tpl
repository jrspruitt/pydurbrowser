<html>
    <head>
        <title>Markdown Editor</title>
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://unpkg.com/stackedit-js@1.0.7/docs/lib/stackedit.min.js"></script>
    </head>
<body>
<form name="texteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<input type="hidden" value="markdown" name="etype" />
<input type="hidden" value="{{ name }}" name="origname" />
File Name: <input type="text" value="{{ name }}" name="name" /><br />
<textarea id="textbox" name="text" style="width:500px;height:500px;">{{ text }}</textarea><br />
Delete all text and submit to delete file.<br />
<input type="submit" value="Submit" />
<button type="button" onclick="openSE();">Editor</button><br />
</form>
</body>
</html>
<script>
        const elem = document.getElementById("textbox");
        const stackedit = new Stackedit();

        function openSE() {
            stackedit.openFile({
                name: 'markdown_edit',
                content: {
                  text: elem.value
                }
            });
        }

        stackedit.on('fileChange', (file) => {
            elem.value = file.content.text;
        });


    /* Capture tab and convert it to tab space inside textarea instead of skip to next element. */
    $("#textbox").keydown(function( event ) {
        var tab = "    ";
        var keyCode = event.keyCode | event.which;
        if ( keyCode == 9 ) {
            event.preventDefault();
            var elem = $( "#textbox" );
            var caret_pos = elem[0].selectionStart;
            var text = elem.val();
            elem.val( text.substring(0, caret_pos) + tab + text.substring(caret_pos) );
            elem[0].setSelectionRange( caret_pos + tab.length, caret_pos + tab.length );                
        }
    });
</script>
