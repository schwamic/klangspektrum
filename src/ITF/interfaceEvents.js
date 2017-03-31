'use-strict';
var playAndGenreList = require('./../Viz/View/Innerobject').playAndGenreList;


function klanginterface() {
    /*##########################################################################################################################################*/
    // Menu
    $('#nav-icon1').click(function () {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            if ($('#infoContainer').hasClass('smallIC') || $('#infoContainer').hasClass('bigIC')) {
                $('#nav-icon1').find('span').css('background', 'grey');
            }
            closeNav();
        } else {
            $(this).addClass('open');
            $('#nav-icon1').find('span').css('background', 'white');
            openNav();
        }
    });

    /*##########################################################################################################################################*/
    // Modal 
    $('#close_modal').click(function () {
        $('.modal_info').css('display', 'none');
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
        $('#mySidenav a').css('display', 'block');
        $('#legend_content').css('display', 'none');
        $('#about_content').css('display', 'none');
        if ($('#infoContainer').hasClass('smallIC') || $('#infoContainer').hasClass('bigIC')) {
            $('#canvasContainer').css('display', 'block');
            $(window).scrollTop(0);
            $('body').css('overflow', 'hidden');
        };
        $('#infoContainer').css('display', 'flex');
        $('.legend_inner').css('opacity', 0);
        $('.legend_inner').css('left', -30);
    };

    /*##########################################################################################################################################*/
    // Legend
    $('#nav_legend').click(function (e) {
        e.preventDefault();
        $('#mySidenav').css('width', '100vw');
        $('#mySidenav a').css('display', 'none');
        $('#legend_content').css('display', 'block');
        $('body').css('overflow', 'scroll');
        $(window).scrollTop(0);
        setTimeout(function () {
            $('.legend_inner').css('opacity', 1);
            $('.legend_inner').css('left', 0);
            $('#canvasContainer').css('display', 'none');
            $('#infoContainer').css('display', 'none');
        }, 200);
    });

    $('#info_legende').click(function (e) {
        e.preventDefault();
        $('#mySidenav').css('width', '100vw');
        $('#mySidenav a').css('display', 'none');
        $('#legend_content').css('display', 'block');
        $('body').css('overflow', 'scroll');
        $('#nav-icon1').find('span').css('background', 'white');
        $('#nav-icon1').addClass('open');
        $(window).scrollTop(0);
        setTimeout(function () {
            $('.legend_inner').css('opacity', 1);
            $('.legend_inner').css('left', 0);
            $('#canvasContainer').css('display', 'none');
            $('#infoContainer').css('display', 'none');
        }, 200);
    });

    /*##########################################################################################################################################*/
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
    // Info-Container
    $('#openInfoContainer').click(function (e) {
        $('#infoContainer').removeClass('bigIC');
        $('#openInfoContainer').css('display', 'none');
        $('body').css('overflow', 'scroll');
        $('#nav-icon1').find('span').css('background', 'white');
        setTimeout(function () {
            $('.info').css('opacity', '1');
            $('.info').css('padding-top', '70px');
            $('#canvasContainer').css('display', 'none');
            $('#closeInfoContainer').css('display', 'block');
            // update
            playAndGenreList(active_node_outside);
        }, 200);
    });

    $('#closeInfoContainer').click(function (e) {
        $('#canvasContainer').css('display', 'block');
        $(window).scrollTop(0);
        $('body').css('overflow', 'hidden');
        $('#infoContainer').addClass('bigIC');
        $('.info').css('opacity', '0');
        $('.info').css('padding-top', '90px');
        $('#audioPlayer')[0].pause();

        $('#playlist li').find('.icon1').css('opacity', '0');
        $('#playlist li').find('.icon2').css('opacity', '0');
        $('#playlist li').find('.id').css('opacity', '1');
        $('#playlist li').removeClass('current-song');

        $('#closeInfoContainer').css('display', 'none');
        if ($('#nav-icon1').hasClass('open')) {
            // do nothing
        } else {
            $('#nav-icon1').find('span').css('background', 'grey');
        }
        setTimeout(function () {
            $('#openInfoContainer').css('display', 'block');
        }, 80);
    });

    $('#openInfoContainer').hover(function () {
        let color = $('#infoContainer').css('backgroundColor');
        $(this).css('background', 'white');
        $(this).css('color', `${color}`);
        $('#closeInfoContainer').css('background', `${color}`);
    }, function () {
        let color = $('#infoContainer').css('backgroundColor');
        $(this).css('background', `${color}`);
        $(this).css('color', 'white');
    });

    $('#closeInfoContainer').hover(function () {
        let color = $('#infoContainer').css('backgroundColor');
        $(this).css('background', 'white');
        $(this).css('color', `${color}`);
    }, function () {
        let color = $('#infoContainer').css('backgroundColor');
        $(this).css('background', `${color}`);
        $(this).css('color', 'white');
    });

    /*##########################################################################################################################################*/
    // Finished
};

function loadingFinished() {
    $('#loadingContainer').animate({
        opacity: '0'
    }, 500, function () {
        $('#loadingContainer').css('display', 'none');
        $('.logo_viz').css('z-index', '1');
    });
};

module.exports = { klanginterface: klanginterface, loadingFinished: loadingFinished };
