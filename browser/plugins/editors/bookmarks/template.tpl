<html>
    <head>
        <title>Bookmarks Editor</title>
    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <style>
        .table {display:table;}
        .tr {display:table-row;}
        .td {display:table-cell; padding-bottom:5px;}
        input[type=text] { width:500px;}
        </style>
        <script>
        var count = {{ len(bookmarks['items']) }};    

            function add_bookmark(){
            var html = '<div id="bookmark_' + count + '" class="table"> \
                <div class="tr"> \
                    <div class="td">Title:</div><div class="td"><input type="text" name="bookmarks[' + count + '][0]" value="" /></div> \
                </div> \
                <div class="tr"> \
                    <div class="td">Description:&nbsp;&nbsp;</div><div class="td"><input type="text" name="bookmarks[' + count + '][1]" value="" /></div> \
                </div> \
                <div class="tr"> \
                    <div class="td">Link:</div><div class="td"><input type="text" name="bookmarks[' + count + '][2]" value="" /></div> \
                </div> \
            </div> \
            <div id="rm_bookmark_' + count + '"><a href="javascript:rm_bookmark(\'bookmark_' + count + '\');">Remove</a></div> \
            <hr id="hr_bookmark_' + count + '" align="left" width="50%" />'

            $("#bookmarks").append(html);
            count++;
        }

        function rm_bookmark(bookmark){
            $("#"+bookmark).remove();
            $("#rm_"+bookmark).remove();
            $("#hr_"+bookmark).remove();
        }
        </script>
    </head>
<body>
<form name="texteditor" action="{{ url }}" method="POST" enctype="multipart/form-data">
<h2>RSS Feed Info</h2>
<table>
    <tr>
        <td>Title:</td><td><input type="text" name="title" value="{{ bookmarks['title'] }}" /></td>
    </tr>
    <tr>
        <td>Description:&nbsp;&nbsp;</td><td><input type="text" name="description" value="{{ bookmarks['description'] }}" /></td>
    </tr>
    <tr>
        <td>Link*:</td><td><input type="text" name="link" value="{{ bookmarks['link'] }}" /></td>
    </tr>
</table>
*Will be automatically generated if not specified.
<br />
<h2>Bookmarks:</h2>
<a href="javascript:add_bookmark();">Add Bookmark</a><br /><br /><br />
<div id="bookmarks">
% i = 0
% for item in bookmarks['items']:
    <div id="bookmark_{{ i }}" class="table">
        <div class="tr">
            <div class="td">Title:</div><div class="td"><input type="text" name="bookmarks[{{ i }}][0]" value="{{ item['title'] }}" /></div>
        </div>
        <div class="tr">
            <div class="td">Description:&nbsp;&nbsp;</div><div class="td"><input type="text" name="bookmarks[{{ i }}][1]" value="{{ item['description'] }}" /></div>
        </div>
        <div class="tr">
            <div class="td">Link:</div><div class="td"><input type="text" name="bookmarks[{{ i }}][2]" value="{{ item['link'] }}" /></div>
        </div>
    </div>
    <div id="rm_bookmark_{{ i }}"><a href="javascript:rm_bookmark('bookmark_{{ i }}');">Remove</a></div>
    <hr id="hr_bookmark_{{ i }}" align="left" width="50%" />

% i += 1
% end
</div>
<input type="submit" value="submit" />
</form>
</body>
</html>
    