

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
		<div style="width:{{! xfile.display_width }}px;">
		    <a href="/{{ xfile.url }}">
		        <img class="single" src="/{{ xfile.resized_img_url }}" width="{{! xfile.display_width }}" height="{{! xfile.display_height }}" />
		    </a>
	    </div>
    </div>
    % if xfile.desc:
    <div class="display_desc">{{! xfile.desc }}</div>
    % end
    <div class="display_desc single">
        <span style="font-weight:bold">File Info:</span>
        <table>
        <tr>
            <td><span class="first_color">Name:</span></td><td><span class="second_color">{{ xfile.name }}</span></td>
        </tr>        
        <tr>
            <td><span class="first_color">Size:</span></td><td><span class="second_color">{{ xfile.size }}</span></td>
        </tr>        
        <tr>
            <td><span class="first_color">Width x Height:</span></td><td><span class="second_color">{{ xfile.width }} x {{ xfile.height }}</span></td>
        </tr>        
        <tr>
            <td><span class="first_color">Modified Date:</span></td><td><span class="second_color">{{ xfile.mtime }}</span></td>
        </tr>
        </table>
        % if exif:
        <br />
        <span style="font-weight:bold">Exif Data:</span>
            <table>
                % for k in exif:
                % if k != 'MakerNote':
                % try:
                    <tr>
                        <td>{{ k }}</td><td><span class="second_color">{{ exif[k] }}</span></td>
                    </tr>
                % except:
                % pass
                % end
                % end
                %end
            </table>
    </div>
</div>
