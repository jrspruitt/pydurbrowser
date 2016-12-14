<html>
    <head>
        <title>Bookmarks Editor</title>
        <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
        <style>
        .table {display:table;}
        .tr {display:table-row;}
        .td {display:table-cell; padding-bottom:5px;}
        input[type=text] { width:500px;}
        </style>
        <script>
        var count = {{ len(bookmarks['items']) }};    

            function add_bookmark(){
            var html = '<div id="bookmark_' + count + '";> \
                <h3 id="bookmark_handle_' + count + '">New Bookmark</h3> \
                <div id="bookmark_' + count + '" class="table"> \
                    <div class="tr"> \
                        <div class="td">Title:</div><div class="td"><input type="text" name="bookmarks[' + count + '][0]" value="" /></div> \
                    </div> \
                    <div class="tr"> \
                        <div class="td">Description:&nbsp;&nbsp;</div><div class="td"><input type="text" name="bookmarks[' + count + '][1]" value="" /></div> \
                    </div> \
                    <div class="tr"> \
                        <div class="td">Link:</div><div class="td"><input type="text" name="bookmarks[' + count + '][2]" value="" /></div> \
                    </div> \
                <h5 id="rm_bookmark_' + count + '"><a href="javascript:rm_bookmark(\'bookmark_' + count + '\');">Remove</a></h5> \
                </div> \
            </div>';

            $("#bookmarks").append(html);
            $("#bookmarks").accordion( "refresh" );
            count++;
        }

        function rm_bookmark(bookmark){
        console.log(bookmark);
            $("#"+bookmark).remove();
            $("#rm_"+bookmark).remove();
            $("#bookmarks").accordion( "refresh" );
        }

  $( function() {
    $( "#bookmarks" )
        .accordion({
            collapsible: true,
            heightStyle: "content",
            animate: false,
            header: "> div > h3"
        })
        .sortable({
            axis: "y",
            handle: "h3",
            stop: function( event, ui ) {
            ui.item.children("h3").triggerHandler( "focusout" );
            var input_counter = 0;

            $("div[id^='bookmark_']").each(function () {
                var i = 0;
                $("input", $(this)).each( function () {
                    $(this).attr("name", "bookmarks[" + input_counter + "][" + i + "]");
                    i++;
                 });
                 input_counter++;
            });
          $(this).accordion( "refresh" );
        }
    });
  });

    function update_handle(idx) {
    console.log($("#bookmark_title_" + idx).val());
    $("#bookmark_handle_" + idx).text($("#bookmark_title_" + idx).val());
    }
        </script>
    </head>
<body>

% if name:
<form action="{{ url }}" name="update" method="POST" enctype="multipart/form-data" onsubmit="return confirm('Delete Configuration?');">
<input type="hidden" name="delete" value="delete" />
<input type="hidden" value="config" name="etype" />
<input type="submit" value="Delete"/>
</form>
% end

<form name="bookmarks_form" action="{{ url }}" method="POST" enctype="multipart/form-data">
<h2>RSS Feed Info</h2>
<input type="hidden" value="bookmarks" name="etype" />
<input type="hidden" value="{{ name }}" name="origname" />
<div class="table">
    <div class="tr">
        <div class="td">File Name:</div>
        <div class="td"><input type="text" value="{{ name }}" name="name" /></div>
    </div>
    <div class="tr">
        <div class="td">Title:</div>
        <div class="td"><input type="text" name="title" value="{{ bookmarks['title'] }}" /></div>
    </div>
    <div class="tr">
        <div class="td">Description:&nbsp;&nbsp;</div>
        <div class="td"><input type="text" name="description" value="{{ bookmarks['description'] }}" /></div>
    </div>
    <div class="tr">
        <div class="td">Link*:</div>
        <div class="td"><input type="text" name="link" value="{{ bookmarks['link'] }}" /></div>
    </div>
</div>
*Will be automatically generated if not specified.
<br />
<h2>Bookmarks:</h2>
<a href="javascript:add_bookmark();">Add Bookmark</a><br /><br /><br />
<div id="bookmarks">
% i = 0
% for item in bookmarks['items']:
    <div id="bookmark_{{ i }}">
    <h3 id="bookmark_handle_{{ i }}">{{ item['title'] }}</h3>
    <div class="table">
        <div class="tr">
            <div class="td">Title:</div><div class="td"><input oninput="update_handle('{{ i }}');" id="bookmark_title_{{ i }}" type="text" name="bookmarks[{{ i }}][0]" value="{{ item['title'] }}" /></div>
        </div>
        <div class="tr">
            <div class="td">Description:&nbsp;&nbsp;</div><div class="td"><input type="text" name="bookmarks[{{ i }}][1]" value="{{ item['description'] }}" /></div>
        </div>
        <div class="tr">
            <div class="td">Link:</div><div class="td"><input type="text" name="bookmarks[{{ i }}][2]" value="{{ item['link'] }}" /></div>
        </div>
    <h5 id="rm_bookmark_{{ i }}"><a href="javascript:rm_bookmark('bookmark_{{ i }}');">Remove</a></h5>
    </div>
    </div>
% i += 1
% end
</div>
<br />
<br />
<input type="submit" value="submit" />
</form>
</body>
</html>
    