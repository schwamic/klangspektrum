'use-strict'
var _ = require('underscore');
var s = require('underscore.string');

function playAndGenreList(node) {
    // CREATE
    $("#audioPlayer")[0].pause();
    var ul = document.getElementById("playlist");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    };

    var ul_genre = document.getElementById("genrelist");
    let genres = [];
    while (ul_genre.firstChild) {
        ul_genre.removeChild(ul_genre.firstChild);
    };

    if (node != null && node != undefined) {
        let count = 1;

        for (var s_id in active_node_outside.songs) {
            let song = active_node_outside.songs[s_id];
            let li = document.createElement("li");
            let a = document.createElement("a");
            let use = document.createElement("use");
            let p1 = document.createElement("p");
            let p2 = document.createElement("p");
            let p3 = document.createElement("p");

            if (song.preview_url == null) {
                li.className = "hrefNull";
            };
            a.href = `${song.preview_url}`;
            p1.className = 'id';
            p2.className = 'name';
            p3.className = "time";
            a.innerHTML = '<svg viewBox="460 -10 280 280" class="player_icon icon1"><use xlink:href="#shape-icon-2"></use></svg><svg viewBox="610 -10 280 280" class="player_icon icon2"><use xlink:href="#shape-icon-4"></use></svg>';
            let id = document.createTextNode(`${count++}`);
            let text = document.createTextNode(`${song.title} - ${song.artist}`);
            let time = document.createTextNode(`0:30`);
            p1.appendChild(id);
            p2.appendChild(text);
            p3.appendChild(time);
            a.appendChild(p1);
            a.appendChild(p2);
            a.appendChild(p3);
            li.appendChild(a);
            ul.appendChild(li);

            for (let genre of song.genre) {
                genres.push(genre);
            }
        }
        genres = s.toSentence(_.uniq(genres));
        let li_g = document.createElement("li");
        let p_g = document.createElement("p");
        let text_g = document.createTextNode(genres + '.');
        p_g.appendChild(text_g);
        li_g.appendChild(p_g);
        ul_genre.appendChild(li_g);
        audioPlayer();
    }
}

function audioPlayer() {
    $("#audioPlayer")[0].src = $('#playlist li a')[0];
    $('#playlist li a').click(function (e) {
        e.preventDefault();
        if ($(this).attr('href') != 'null') {
            if ($(this).parent()[0].className == '') {
                $('#audioPlayer')[0].src = this;
                $("#audioPlayer")[0].play();
                $('#playlist li').removeClass('current-song');
                $(this).parent().addClass('current-song');

                $('#playlist li').find(".icon1").css('opacity', '0');
                $('#playlist li').find(".icon2").css('opacity', '0');
                $('#playlist li').find(".id").css('opacity', '1');
                $(this).find(".icon2").css('opacity', '1');
                $(this).find(".id").css('opacity', '0');
            } else {
                $("#audioPlayer")[0].pause();
                $(this).find(".icon1").css('opacity', '1');
                $(this).find(".icon2").css('opacity', '0');
                $('#playlist li').removeClass('current-song');
            }
        }
    });

    $('#playlist li a').hover(function () {
        if ($(this).attr('href') != 'null') {
            if ($(this).parent()[0].className == '') {
                $(this).find(".icon1").css('opacity', '1');
                $(this).find(".icon2").css('opacity', '0');
                $(this).find(".id").css('opacity', '0');
            }
        }
    }, function () {
        if ($(this).parent()[0].className == '') {
            $(this).find(".icon1").css('opacity', '0');
            $(this).find(".icon2").css('opacity', '0');
            $(this).find(".id").css('opacity', '1');
        }
    });

    $('#audioPlayer')[0].addEventListener('ended', function () {
        $('#playlist li').removeClass('current-song');
        $('#playlist li').find(".icon1").css('opacity', '0');
        $('#playlist li').find(".icon2").css('opacity', '0');
        $('#playlist li').find(".id").css('opacity', '1');
    });
};

module.exports = { playAndGenreList: playAndGenreList }