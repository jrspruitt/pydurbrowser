<div class="content singling">
    <a href="/{{ xfile.url }}">Show Raw</a>
    <video class="single" width="{{ xfile.width }}" controls>
        <source src="/{{ xfile.url }}" />
    </video>
    <div class="media_desc single">
        <span class="first_color">Name:</span> <span class="second_color">{{ xfile.name }}</span><br />
        <span class="first_color">Size:</span> <span class="second_color">{{ xfile.size }}</span><br />
        <span class="first_color">Modified Date:</span> <span class="second_color">{{ xfile.mtime }}</span><br />
    </div>
    <div class="display_desc">{{! xfile.desc }}</div>
</div>