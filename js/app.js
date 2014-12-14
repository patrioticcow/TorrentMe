"use strict";

var mainUrl = "http://torentz.massinflux.com/";
var url = mainUrl + "index.php?";

$(document).onPage("show", "#home", function (event, ui) {
    console.log('home');

    localStorage.setItem("page", 1);
    localStorage.setItem("order_by", 'seeders-desc');

    homePage();

    $("body>[data-role='panel']").panel();
});

function homePage() {
    $('#order_by').on("change", function () {
        localStorage.setItem("order_by", $(this).val());

        getAjaxData();
    });

    $('#prev').on("click", function () {
        var currentPage = parseInt(localStorage.getItem("page"));
        var p = currentPage === 1 ? 1 : currentPage - 1;

        localStorage.setItem("page", p);

        getAjaxData();
    });

    $('#next').on("click", function () {
        var currentPage = parseInt(localStorage.getItem("page"));
        var p = isNaN(currentPage) ? 1 : currentPage + 1;

        localStorage.setItem("page", p);

        getAjaxData();
    });

    $('#search').on("click", function (e) {
        e.preventDefault();

        var searchValue = $('#search_field');

        if (searchValue.val() === '') {
            alert('please enter a search value');
            return false;
        }
        if (searchValue.val().length < 3) {
            alert('search term needs to be at least 3 characters');
            return false;
        }

        localStorage.setItem("searchValue", searchValue.val());

        getAjaxData(searchValue.val());
    });
}

function getAjaxData(searchValue, orderBy) {
    $.mobile.loading("show", {text: "Loading data..", textVisible: true, theme: "b"});

    var val = searchValue || localStorage.getItem("searchValue");
    var order = localStorage.getItem("order_by");
    var page = parseInt(localStorage.getItem("page")) === 1 ? '' : parseInt(localStorage.getItem("page"));

    console.log(url + "search=" + val + "&site=kickass&order=" + order + "&page=" + page);

    $.when($.ajax(url + "search=" + val + "&site=kickass&order=" + order + "&page=" + page)).then(function (data) {
        data = JSON.parse(data);

        $.mobile.loading("hide");

        var html = '';
        $.each(data, function (index, value) {
            html += '<li>';
            html += '   <a style="background: #ffffff;" href="view.html?' + value.href + '&' + value.text + '">';
            html += '       <p class="no_elipsis"><strong>' + value.text + '</strong></p>';
            html += '       <p>' + value.size + ' | ' + value.files + ' | ' + value.age + ' | ' + value.seed + ' | ' + value.leech + '</p>';
            html += '   </a>';
            html += '</li>';
        });

        var listPlaceholder = $('#list_placeholder');

        listPlaceholder.html(html);
        listPlaceholder.listview("refresh");
    });
}

$(document).on("swipeleft swiperight", "#home", function (e) {
    if ($(".ui-page-active").jqmData("panel") !== "open") {
        if (e.type === "swiperight") {
            $("#left-panel-home").panel("open");
        }
    }
});

$("#listview").listview();