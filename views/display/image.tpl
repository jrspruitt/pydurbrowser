

<div class="content singling">
	<div style="width:{{ xfile.display_width }}px;" class="single">
		<div style="text-align:center;padding-bottom:10px;">
		% if prev:
			<a href="/{{ prev }}">prev</a>
		% else:
			prev
		%end
		|
		% if next:
			<a href="/{{ next }}">next</a>
		% else:
			next
		% end
		</div>
		<div>
		    <a href="/{{ xfile.url }}">
		        <img class="single" src="/{{ xfile.url }}" width="{{ xfile.display_width }} height="{{ xfile.display_height }}" />
		    </a>
	    </div>
    </div>
    % if xfile.desc:
    <div class="display_desc">{{! xfile.desc }}</div>
    % end
    <div class="display_desc single">
        <span class="first_color">Name:</span> <span class="second_color">{{ xfile.name }}</span><br />
        <span class="first_color">Size:</span> <span class="second_color">{{ xfile.size }}</span><br />
        <span class="first_color">Width x Height:</span> <span class="second_color">{{ xfile.width }} x {{ xfile.height }}</span><br />
        <span class="first_color">Modified Date:</span> <span class="second_color">{{ xfile.mtime }}</span><br />
    </div>
</div>
