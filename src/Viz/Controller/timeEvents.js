'use-strict';

function createTimelist() {
    // CREATE
    var ul = document.getElementById('timelist');
    var current_time = 0;
    for (let i = 0; i < datelist.length; i++) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let date_array = datelist[i].split('-');
        let y = date_array[0];
        let m = date_array[1];
        let text = document.createTextNode(`${y} — ${m}`);
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
        let length = datelist.length > 12 ? 12 * 30 : datelist.length * 30;
        $('#timeScrollbar').css('height', length + 'px');
        $('#timelist').css('height', length + 'px');
        if (datelist.length > 12) {
            $('#arrow_up').css('display', 'block');
            $('#arrow_down').css('display', 'block');
        }
    };
    var time_ele_start = $(`#timelist li:nth-child(${1})`).offset().top;
    var time_ele_end = time_ele_start + 330;    // 11*30 max-length
    $(`#timelist li:nth-child(1)`).addClass('current-time');

    // EVENTS
    $('#timelist li a').click(function (e) {
        e.preventDefault();
        if ($(this).parent().hasClass('current-time')) {
            // do nothing
        } else {
            $('#timelist li').removeClass('current-time');
            $(this).parent().addClass('current-time');
            current_time = $(this).parent().index();
        }
        t = current_time;

        $('#openInfoContainer').css('display', 'none');
        $('#noActiveNode').css('display', 'block');
    });

    $('#timelist li').click(function (e) {
        $('#openInfoContainer').css('display', 'none');
        $('#noActiveNode').css('display', 'block');
    });

    $('#timelist').on('scroll', function () {
        for (let i = 1; i <= datelist.length; i++) {
            let pos = $(`#timelist li:nth-child(${i})`).offset().top;

            // startPos - 7 && endPos + 7 && ele height = 30px  --->  max 8 dates
            if (time_ele_start <= pos && pos <= time_ele_end) {
                $(`#timelist li:nth-child(${i})`).css('opacity', 1);
            } else {
                $(`#timelist li:nth-child(${i})`).css('opacity', 0);
            }
        };
        $('#arrow_up').css('opacity', '0');
        $('#arrow_down').css('opacity', '0');
        setTimeout(function () {
            $('#arrow_up').css('display', 'none');
            $('#arrow_down').css('display', 'none');
        }, 500);
        setTimeout(function () {
            $('#arrow_up').css('display', 'none');
            $('#arrow_down').css('display', 'none');
        }, 500);
    });
};

module.exports = { createTimelist: createTimelist };
