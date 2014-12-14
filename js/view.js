"use strict";

//$(document).enhanceWithin();
$(document).onPage("show", "#view", function (event, ui) {
    var search = window.location.search;
    var res = search.replace("?", "");
    var urlData = res.split('&');

    $.mobile.loading("show", {text: "Loading data..", textVisible: true, theme: "b"});

    $.when($.ajax(url + "get_torrent=" + urlData[0] + "&site=kickass")).then(function (data) {
        data = JSON.parse(data);

        $.mobile.loading("hide");

        var file = mainUrl + 'torrents/' + data.href + '.torrent';

        console.log(mainUrl + 'download.php?file=' + data.href + '.torrent');

        var downloadURL = mainUrl + 'download.php?file=' + data.href + '.torrent';

        $('#title_container').html(decodeURI(urlData[1]));
        $('#download').html('<a class="ui-btn" href="#" onclick="window.open(\'' + downloadURL + '\', \'_system\');">Download Torrent</a>');
        $('#content_container').html(data.description);

        $("img.lazyjs").lazyload();
    });

    $(this).trigger("create");
});

$(document).on("swipeleft swiperight", "#view", function (e) {
    if ($(".ui-page-active").jqmData("panel") !== "open") {
        if (e.type === "swiperight") {
            $("#left-panel-home").panel("open");
        }
    }
});