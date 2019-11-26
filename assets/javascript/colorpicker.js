"use strict";

function sticky() {
	var siteLogo = $('.site-logo img');
	var siteLogoStickyURL = siteLogo.attr('data-sticky');
	var siteLogoURL = siteLogo.attr('src');

	$(window).scroll(function() {
		if($(window).scrollTop() > 200) {
			$('body').addClass('sticky-scroll');
			if( siteLogoStickyURL ) {
				siteLogo.attr('src', siteLogoStickyURL);
			}
		} else {
			$('body').removeClass('sticky-scroll');
			if( siteLogoStickyURL ) {
				siteLogo.attr('src', siteLogoURL);
			}
		}
	});
}

var stylesheet = $("link[href*='scheme'], link[href*='theme']");
var prefix = 'assets/css';

/* =Color schemes
-------------------------------------------------------------- */

var cookieSchemeName = "anps_kataleya_scheme";

/* Check if cookie exists and set it */
if($.cookie(cookieSchemeName)) {
	$('.colorpicker .colors li').removeClass('selected').eq($.cookie(cookieSchemeName)).addClass("selected");
	stylesheet.attr('href', prefix + '/scheme-' + $.cookie(cookieSchemeName) + '.css');
}

/* User clicks on a color scheme */
$('.colorpicker .colors button').on('click', function() {
	var parent = $(this).parent();
    $('.colorpicker .colors li').removeClass('selected');
    $.cookie(cookieSchemeName, parent.index(), { path: '/' });
    parent.addClass('selected');
    stylesheet.attr('href', prefix + '/scheme-' + parent.index() + '.css');
});

/* =Layout (boxed/wide)
-------------------------------------------------------------- */

var cookieLayoutName = "anps_kataleya_layout";

/* Check if cookie exists and set it */
if($.cookie(cookieLayoutName)) {
    var el = $("body");
    $('.layout').val($.cookie(cookieLayoutName));
    if($.cookie(cookieLayoutName) == 'boxed') {
        el.addClass("boxed");

        if( !$.cookie(cookieLayoutName) ) {
            el.addClass("pattern-1");
        }
    } else {
        el.removeClass("boxed");
    }
}

/* User changes layout */
$(".layout").on("change", function() {
    $("body").removeClass("boxed");
    var el = $("body");
    if($(this).val() == 'boxed') {
        el.addClass("boxed");
        if( !el.hasClass("pattern-1") && 
            !el.hasClass("pattern-2") && 
            !el.hasClass("pattern-3") && 
            !el.hasClass("pattern-4") && 
            !el.hasClass("pattern-5") && 
            !el.hasClass("pattern-6") && 
            !el.hasClass("pattern-7") && 
            !el.hasClass("pattern-8") &&
            !el.hasClass("pattern-9") &&
            !el.hasClass("pattern-10")) {
            el.addClass("pattern-1");
        }
        $.cookie(cookieLayoutName, $(this).val(), { path: '/' });
    } else {
        el.removeClass("boxed");
        $.cookie(cookieLayoutName, $(this).val(), { path: '/' });
    }
});

/* =Pattern
-------------------------------------------------------------- */

var cookiePatternName = "anps_kataleya_pattern";

/* Check if cookie exists and set it */
if($.cookie(cookiePatternName)) {
    $('.colorpicker .patterns li').removeClass('selected').eq($.cookie(cookiePatternName)-1).addClass("selected");
    $('body').addClass('pattern-' + $.cookie(cookiePatternName));
}

/* User clicks on pattern */
$('.colorpicker .patterns button').on('click', function() {
    $('body').removeClass('pattern-1 pattern-2 pattern-3 pattern-4 pattern-5 pattern-6 pattern-7 pattern-8 pattern-9 pattern-10');
    var parent = $(this).parent();
    $('.colorpicker .patterns li').removeClass('selected');
    $.cookie(cookiePatternName, parent.index() + 1, { path: '/' });
    parent.addClass('selected');
     $('body').addClass('pattern-' + (parent.index() + 1));
});

/* =Menu Style
-------------------------------------------------------------- */

var cookieMenuName = "anps_kataleya_menu";

/* Check if cookie exists and set it */
if($.cookie(cookieMenuName)) {
    var el = $("body");
    $(".menu-style").val($.cookie(cookieMenuName));
    if($.cookie(cookieMenuName) == 'sticky') {
        el.addClass("sticky-menu");
        sticky();
    } else {
        el.removeClass("sticky-menu");
    }
}

/* User changes menu style */
$(".menu-style").on("change", function() {
    $(".site-header").removeClass("sticky-menu");
    var el = $("body");
    if($(this).val() == 'sticky') {
        el.addClass("sticky-menu");
        $.cookie(cookieMenuName, $(this).val(), { path: '/' });
        sticky();
    } else {
        el.removeClass("sticky-menu");
        $.cookie(cookieMenuName, $(this).val(), { path: '/' });
    }
});

/* =Open/Close colorpicker
-------------------------------------------------------------- */

$('.colorpicker-close button').on('click', function() {
    $('.colorpicker').removeClass('animate');
    $('.colorpicker').toggleClass('active');

    var cookieVal = 'false';
    if( $('.colorpicker').hasClass('active') ) {
    	cookieVal = 'true';
	}

	$.cookie("anps_kataleya_closed", cookieVal, { path: '/' });
});