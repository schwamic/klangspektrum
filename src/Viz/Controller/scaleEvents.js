'use-strict';

function scaleListener() {
    $('#scale05').on('click', function () {
        $(this).parent().children().removeClass('current_scale');
        $(this).addClass('current_scale');
        scale_value = 0.5;
    });

    $('#scale1').on('click', function () {
        $(this).parent().children().removeClass('current_scale');
        $(this).addClass('current_scale');
        scale_value = 1;
    });

    $('#scale2').on('click', function () {
        $(this).parent().children().removeClass('current_scale');
        $(this).addClass('current_scale');
        scale_value = 2;
    });

    $('#scale4').on('click', function () {
        $(this).parent().children().removeClass('current_scale');
        $(this).addClass('current_scale');
        scale_value = 4;
    });
};

module.exports = { scaleListener: scaleListener };