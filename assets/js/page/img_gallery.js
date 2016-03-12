function generate_height() {
    var elem = $(".gallery a div");
    var last = elem.last();
    var height = last.offset().top - elem.first().offset().top + last.outerHeight() + parseFloat(elem.css("padding-top")) + parseFloat(elem.css("padding-bottom"));
    $( ".content > .gallery" ).height(height);
    console.log(height)
}


function resize_event() {
    var resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(generate_height, 100);
    });
}
