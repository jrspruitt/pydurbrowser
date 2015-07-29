<div class="content table">
    <a href="/{{ xfile.url }}">View Raw</a>
    <pre class="prettyprint linenums" style="border:solid 0px #FFFFFF;">
        {{ xfile.code }}
    </pre>
    % if xfile.desc:
    <div class="display_desc">{{! xfile.desc }}</div>
    % end
</div>