/*
Klangspektrum - by Michael Schwarz
Hochschule Augsburg 2016/2017
 */

'use-strict';
var domain;
window.onload = function () {
    $('#nav-icon1').css('position', 'fixed');
    domain = document.location.host;
};

document.getElementById('login_button').addEventListener('click', function () {
    var user = createUser();
    localStorage.setItem('user_id', user);
    window.location.href = `http://${domain}/api/login/${user}`;
});

function createUser() {
    return Math.random().toString(36).substr(2, 20);
};

/*##########################################################################################################################################*/
// Menu
$('#nav-icon1').click(function () {
    if ($(this).hasClass('open')) {
        $(this).removeClass('open');
        closeNav();
    } else {
        $(this).addClass('open');
        openNav();
    }

});

/*##########################################################################################################################################*/
// Navigation
function openNav() {
    $('#mySidenav').css('width', '200px');

    setTimeout(function () {
        $('#mySidenav').find('a').css('left', '0px');
        $('#mySidenav').find('a').css('opacity', '1');
    }, 100);
};

function closeNav() {
    $('#mySidenav').css('width', '0px');
    $('#mySidenav').find('a').css('left', '-20px');
    $('#mySidenav').find('a').css('opacity', '0');
    $('#nav-icon1').css('position', 'fixed');
    // Legend
    $('#mySidenav a').css('display', 'block');
    $('#legend_content').css('display', 'none');
    $('#about_content').css('display', 'none');
    $('#main').css('display', 'flex');
    $('.legend_inner').css('opacity', 0);
    $('.legend_inner').css('left', -30);
};

// Legend
$('#nav_legend').click(function (e) {
    e.preventDefault();
    $('#mySidenav').css('width', '100vw');
    $('#mySidenav a').css('display', 'none');
    $('#legend_content').css('display', 'block');
    $(window).scrollTop(0);
    $('#nav-icon1').css('position', 'absolute');
    setTimeout(function () {
        $('.legend_inner').css('opacity', 1);
        $('.legend_inner').css('left', 0);
        $('#main').css('display', 'none');
    }, 200);
});

// About
$('#nav_about').click(function (e) {
    e.preventDefault();
    $('#mySidenav').css('width', '100vw');
    $('#mySidenav a').css('display', 'none');
    $('#main').css('display', 'none');
    $('#about_content').css('display', 'block');
    $('body').css('overflow', 'scroll');
    $(window).scrollTop(0);
    setTimeout(function () {
        $('.legend_inner').css('opacity', 1);
        $('.legend_inner').css('left', 0);
        $('#canvasContainer').css('display', 'none');
        $('#infoContainer').css('display', 'none');
    }, 200);
});

/*##########################################################################################################################################*/
//Main-arrow
$(window).scroll(function () {
    if ($(this).scrollTop() > 30) {
        $('#arrow_main').css('opacity', '0');
    } else {
        $('#arrow_main').css('opacity', '1');
    }
});
