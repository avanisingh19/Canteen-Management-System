"use strict";
/* Order Menu */

(function($, undefined) {
    $.expr[":"].containsNoCase = function(el, i, m) {
        var search = m[3];
        if (!search) return false;
        return new RegExp(search, "i").test($(el).text());
    };

    $.fn.searchFilter = function(options) {
        var opt = $.extend({
            // target selector
            targetSelector: "",
            // number of characters before search is applied
            charCount: 1
        }, options);

        return this.each(function() {
            var $el = $(this);
            $el.keyup(function() {
                var search = $(this).val();

                var $target = $(opt.targetSelector);
                $target.show();

                if (search && search.length >= opt.charCount) {
                	$target.not(":containsNoCase(" + search + ")").hide();
                }

                $('.order-menu section').each( function(index) {
                	var temp = $('.order-menu section').eq(index);

	                if( temp.children('.food-item:visible').length === 0 ) {
	                	if( !temp.children('.no-results').length ) {
	                		temp.append('<span class="no-results">No results found!</span>');
	                	}
	                } else {
	                	temp.children('.no-results').remove();
	                }
                });

				if( $('.order-menu section').children(':visible').length == 0 ) {
					$('.order-menu section').append('test');
				}
            });
        });
    };
})(jQuery);

jQuery.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
	    if (o[this.name]) {
	        if (!o[this.name].push) {
	            o[this.name] = [o[this.name]];
	        }
	        o[this.name].push(this.value || '');
	    } else {
	        o[this.name] = this.value || '';
	    }
	});
	return o;
};

function map(element, location, zoom) {
	jQuery(element).gmap3({
		map: {
			options: {
				zoom: zoom,
				scrollwheel: false
			}
		},
		getlatlng:{
			address: location,
			callback: function(results) {
			if ( !results ) { return; }
			jQuery(this).gmap3('get').setCenter(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
			jQuery(this).gmap3({
				marker: {
					latLng:results[0].geometry.location,
				}
			});
			}
		}
	});
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

jQuery.fn.isOnScreen = function(){
     
    var win = $(window);
     
    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
     
    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();
     
    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};

jQuery(function($) {


	$(".site-navigation a").on("click", function(){    
          $('body').toggleClass('mobile-menu');
    });

	var SITE_URL = $('#site-url').val();

	$('.navbar-toggle').on('click', function() {
		$('.site-navigation').height($(window).height() - 97);
		$('body').toggleClass('mobile-menu');
		return false;
	});

	$(window).resize(function() {
		if( $('.mobile-menu').length ) {
			$('.site-navigation').height($(window).height() - 97);
		}
	});
	
	addNewStyle('@media (min-width: 1200px) {.ls-container, .ls-inner, .ls-slide {height: ' + $(window).height() + 'px !important;}}');


	var siteLogo = $('.site-logo img');
	var siteLogoStickyURL = siteLogo.attr('data-sticky');
	var siteLogoURL = siteLogo.attr('src');

	if($('.sticky-menu').length) {
		if( $('.container').width() < 940 ) {
			siteLogo.attr('src', siteLogoStickyURL);
		}
		$(window).scroll(function() {
			if($(window).scrollTop() > 200) {
				$('body').addClass('sticky-scroll');
				if( siteLogoStickyURL ) {
					siteLogo.attr('src', siteLogoStickyURL);
				}
			} else {
				$('body').removeClass('sticky-scroll');
				if( siteLogoStickyURL && $('.container').width() >= 940 ) {
					siteLogo.attr('src', siteLogoURL);
				}
			}
		});
	}
    


	//Enable swiping...
	$(".carousel-inner").swipe( {
		//Generic swipe handler for all directions
		swipeLeft:function(event, direction, distance, duration, fingerCount) {
			$(this).parent().carousel('prev'); 
		},
		swipeRight: function() {
			$(this).parent().carousel('next'); 
		},
		//Default is 75px, set to 0 for demo so any distance triggers swipe
		threshold:0
	});

	//Enable autoplay

	$('.carousel').carousel({
	  interval: 4000
	});

	/* Navigation links (smooth scroll) */

	$('.site-navigation a[href*=#]:not([href=#])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
	      || location.hostname == this.hostname) {

	    var target = $(this.hash);
	    var href = $.attr(this, 'href');
	    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	    if (target.length) {
	      $('html,body').animate({
	        scrollTop: target.offset().top
	      }, 1000, function () {
	          window.location.hash = href;
	      });
	      return false;
	    }
	  }
	});

	var navLinkIDs = [];

	$('.site-navigation a[href*=#]:not([href=#])').each(function(index) {
		var temp = $('.site-navigation a[href*=#]:not([href=#])').eq(index).attr("href").split('#');
		temp = '#' + temp[1];
		// Check if the element exits
		if($(temp).length) {
			navLinkIDs.push(temp);
		}
	});

	function siteNavigation() {
		$.each(navLinkIDs, function(i, val) {
			if( $(val).isOnScreen() ) {
				$('.site-navigation > li').removeClass('active');
				$('.site-navigation a[href*="' + val + '"]').parent().addClass('active');
				return false;
			}
		});
	}

	siteNavigation();

	$(window).scroll(function() {
		siteNavigation();
	});

	/* Blog load more */

	if( !$('.load-more.no-ajax').length ) {
		var blogPage = 1;

		$('.load-more .btn').on('click', function() {
			$('.load-more .btn').attr('disabled', 'disabled');

			$.ajax({
				url: SITE_URL + "/blog/page-" + (blogPage + 1) + ".html",
				cache: false
			}).done(function(html) {
				$('.blog-loop > .container > .row > div').append(html);
				$('.blog-loop .blog-new-page:last-of-type').hide();
				$('.blog-loop .blog-new-page:last-of-type').slideDown();
				blogPage++;

				if( !UrlExists( SITE_URL + "/blog/page-" + (blogPage + 1) + ".html" ) ) {
					$('.load-more').remove();
				}

				$('.load-more .btn').removeAttr('disabled');
			});
		});
	}

	/* Masonry */
	var masonry = $('.masonry');
	if(masonry.length) {
		masonry.imagesLoaded(function() {
			masonry.isotope({
				itemSelector: '.masonry > article',
	            animationOptions: {
	                duration: 750,
	                queue: false,
	            }
			});
		});
	}

	/* Flickr Widget */

	if( $('.flickr-widget').length ) {
		$('.flickr-widget').jflickrfeed({
			limit: 9,
			qstrings: {
				id: $('.flickr-widget').attr('data-account')
			},
			useTemplate: false,
			itemCallback: function(item) {
				$(this).append('<a target="_blank" href="' + item.link + '"><img src="' + item.image_q + '" alt="' + item.title + '"/></a>');
			}
		});
	}

	/* Hover */

	var hoverEl = $('.hover');

	$('img').imagesLoaded(function() {
		hoverEl.each(function(index) {
			hoverEl.eq(index).addClass('hover-align');
			hoverEl.eq(index).css({
				'margin-top' : '-' + ((hoverEl.eq(index).innerHeight() + 50) / 2) + 'px',
			});
		});
	});


	/* Portfolio Filtering */

	try {
		$('img').imagesLoaded(function() {
			var $container = $('.portfolio');
			if($container.length) {

			  /* Settings Up Isotope */

			  $container.isotope({
			      itemSelector : '.portfolio article',
			      layoutMode: 'fitRows',
			      animationOptions: {
			          duration: 750,
			          queue: false,
			      }
			  });

			  /* On Filter Click */

			  $('.filter button').on('click', function() {
			      $('.filter button').removeClass('selected');
			      $(this).addClass("selected");
			      var item = "";
			      if( $(this).attr('data-filter') != '*' ) {
			          item = ".";
			      }
			      item += $(this).attr('data-filter');
			      $container.isotope({ filter: item });
			  });

			  /* On Scroll */

			  var first_scroll = true;

			  $(window).scroll(function() {
			      if(first_scroll) {
			          $container.isotope();
			          first_scroll = false;
			      }
			  });

			  /* On Resize */

			  $(window).resize(function(){
			      $container.isotope();
			  });
			}
		});
	} catch (e) { }

	/* Order Menu */

	$('#order-search').searchFilter({ targetSelector: ".order-menu .food-item", charCount: 3});

	$('.close-order').on('click', function() {
		$('body').toggleClass('order-open');
		$('.order-menu-wrapper').toggleClass('active');

		if ('WebkitTransform' in document.body.style || 'MozTransform' in document.body.style || 'OTransform' in document.body.style || 'transform' in document.body.style) {} else {
		    $('.order-menu-wrapper').toggleClass('show-ie');
		}
	});

	$('.mobile-close').on('click', function(e) {
		$('.close-order').click();
	});

	$('.order-menu .quantity button').on('click', function() {
		var el = $(this).parent().children('.num');
		var parent = $(this).parent().parent().parent();
		var previousPrice = parseFloat($('.order-footer .price span').html().replace(',', '.'));
		var price = parseFloat($(this).parent().parent().children('.price').clone().children().remove().end().text().replace(',', '.'));
		var val = parseInt(el.html());

		if( $(this).hasClass('plus') ) {
			el.html(val + 1);
			$('.order-footer .price span, .order-review .price span').html((previousPrice + price).toFixed(1));
		} else {
			if( val > 0 ) {
				el.html(val - 1);
				$('.order-footer .price span, .order-review .price span').html((previousPrice - price).toFixed(1));
			} else {
				el.html('0');
			}
		}

		if( parseInt(el.html()) > 0 ) {
			parent.addClass('active');
		} else {
			parent.removeClass('active');
		}
	});

	$('button[data-menu-order="review"]').on('click', function() {
		$('.order-summary').html('');
		var vals = '';
		$('.order-menu .food-item.active').each(function(index) {
			var el = $('.order-menu .food-item.active').eq(index);
			if( vals != '' ) {
				vals += ';';
			}
			vals += el.attr('id') + ':' + el.find('.num').html();

			$('.order-summary').append('<li><h3><span class="pull-left">' + el.find('h3').html() + '</span><span class="pull-right color">×' + el.find('.num').html() + '</span></h3></li>');
		});

		$.cookie('kataleya-order', vals, { expires: 365, path: '/' });

		var notes = $('.order-menu .order-notes').val();
		if( notes ) {
			$.cookie('kataleya-order-notes', notes, { expires: 365, path: '/' });
			$('.order-review .order-notes').val(notes);
		}

		$('.order-header, .order-menu section, .order-footer, .order-review').toggleClass('hidden');
	});

	$('button[data-menu-order="notes"]').on('click', function() {
		$('.order-notes').toggleClass('hidden');
	});

	$('button[data-menu-order="back"]').on('click', function() {
		$('.order-header, .order-menu section, .order-footer, .order-review').toggleClass('hidden');
		return false;
		e.preventDefault();
	});

	if( $.cookie('kataleya-order') ) {
		var vals = $.cookie('kataleya-order').split(';');
		var total = 0;

		$.each(vals, function(index) {
			var eachVal = vals[index].split(':');
			$('.order-menu #' + eachVal[0]).addClass('active').find('.num').html(eachVal[1]);

			total += parseInt(eachVal[1]) * parseFloat($('.order-menu #' + eachVal[0]).find('.price').clone().children().remove().end().text().replace(',', '.'));
		});

		$('.order-footer .price span, .order-review .price span').html(total);
		if( total > 0 ) {
			$('.order-menu-wrapper').addClass('cookie-content');
		}
	}

	if( $.cookie('kataleya-order-notes') ) {
		var notes = $.cookie('kataleya-order-notes');
		$('.order-menu .order-notes').val(notes).removeClass('hidden');
	}

	/* Content Form */

	$('button[data-menu-order="content-form-submit"]').on('click', function(e) {
		var vals = '';
		var menuOrderCustomer = $('form[data-menu-order="customer"]');
		$('form[data-menu-order="content-form"] input').each(function(index) {
			var el = $('form[data-menu-order="content-form"] input').eq(index);
			if( vals != '' ) {
				vals += ';';
			}
			vals += el.attr('id') + ':' + el.val();

			menuOrderCustomer.find('#order-' + el.attr('id')).val(el.val());
		});
		$('.close-order').click();
		$.cookie('kataleya-order-customer', vals, { expires: 365, path: '/' });
		return false;
		e.preventDefault();
	});

	/* Customer Cookie */

	if( $.cookie('kataleya-order-customer') ) {
		var vals = $.cookie('kataleya-order-customer').split(';');
		var menuOrderCustomer = $('form[data-menu-order="customer"]');

		$.each(vals, function(index) {
			var eachVal = vals[index].split(':');
			menuOrderCustomer.find('#order-' + eachVal[0]).val(eachVal[1]);
		});
	}

	/* Reservation */

	$('form[data-form="reservation"]').on('submit', function(e) {
		$(".contact-success").remove();

		var el = $(this);
      	var formData = el.serializeObject();

		try {
			$.ajax({
				type: "POST",
				url: $('#site-url').val() + '/assets/php/reservation.php',
				data: {
			  		form_data : formData,
				}
			}).success(function(msg) {
				el.append('<div class="row"><div class="col-md-12"><div class="alert alert-success contact-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-check"></i>' + $(el).attr("data-success") + '</div></div></div>');
			});
		} catch(e) { console.log(e); }

		e.preventDefault();
		return false;
	});

	/* Order form submit */

	$('form[data-menu-order="customer"]').on('submit', function(e) {
		$(".contact-success").remove();
		var el = $(this);
      	var formData = el.serializeObject();

      	var orderItems = {  };

      	$('.order-summary li').each(function(index) {
      		var tempEl = $('.order-summary li').eq(index);
      		orderItems[tempEl.find('.pull-left').html()] = tempEl.find('.pull-right').html();
      	});

      	orderItems['TOTAL'] = '$' + $('.order-review .price span').html();

		try {
			$.ajax({
				type: "POST",
				url: $('#site-url').val() + '/assets/php/order.php',
				data: {
			  		form_data 	 : formData,
			  		order_items : orderItems
				}
			}).success(function(msg) {
				el.append('<div class="row"><div class="col-md-12"><div class="alert alert-success contact-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-check"></i>' + $(el).attr("data-success") + '</div></div></div>');
			});
		} catch(e) { console.log(e); }

		e.preventDefault();
		return false;
	});

	/* Twitter */

	try {

	$("[data-twitter]").each(function(index) {
	    var el = $("[data-twitter]").eq(index);

	    $.ajax({
	        type: "POST",
	        url: $('#site-url').val() + '/assets/php/twitter.php',
	        data: {
	          account : el.attr("data-twitter")
	        },

	        success: function(msg) {
	          el.find(".carousel-inner").html(msg);
	        }
	    });
	    
	});
	} catch(e) {}

	/* Mailing */

	$('form[data-form="contact"]').on("submit", function(e) {
	  $(".contact-success").remove();
	  var el = $(this);
	  var formData = el.serializeObject();

	  if(checkFormValidation(el)) {
	      try {
	          $.ajax({
	              type: "POST",
	              url: $('#site-url').val() + '/assets/php/mail.php',
	              data: {
	                  form_data : formData,
	              }
	          }).success(function(msg) {
	            $("form.contact-form").append('<div class="row"><div class="col-md-12"><div class="alert alert-success contact-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><i class="fa fa-check"></i>' + $("form.contact-form").attr("data-success") + '</div></div></div>');
	          });
	      } catch(e) { console.log(e); }
	  }

	  e.preventDefault();
	  return false;
	});

	/* Portfolio recent AJAX */

	if( $("a[data-rel^='prettyPhoto']").length > 0 ) {
	    $("a[data-rel^='prettyPhoto']").prettyPhoto({
	    	show_title: false,
	    	social_tools: '',
	    	default_width: 1200,
	    	callback: function(){
	    		$('body').removeClass('portfolio-open');
	    	},
	    	changepicturecallback: function(){
	    		$('body').addClass('portfolio-open');
	    	},
			markup: '<div class="pp_pic_holder"> \
				<div class="ppt">&nbsp;</div> \
				<div class="pp_top"> \
					<div class="pp_left"></div> \
					<div class="pp_middle"></div> \
					<div class="pp_right"></div> \
				</div> \
				<div class="pp_content_container"> \
					<div class="pp_left"> \
					<div class="pp_right"> \
						<div class="pp_content"> \
							<div class="pp_loaderIcon"></div> \
							<div class="pp_fade"> \
								<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
								<div class="pp_hoverContainer"> \
									<a class="pp_next" href="#">next</a> \
									<a class="pp_previous" href="#">previous</a> \
								</div> \
								<div id="pp_full_res"></div> \
								<div class="pp_details"> \
									<div class="pp_nav"> \
										<a href="#" class="pp_arrow_previous">Previous</a> \
										<p class="currentTextHolder">0/0</p> \
										<a href="#" class="pp_arrow_next">Next</a> \
									</div> \
									<p class="pp_description"></p> \
									{pp_social} \
									<a class="pp_close" href="#">×</a> \
								</div> \
							</div> \
						</div> \
					</div> \
					</div> \
				</div> \
				<div class="pp_bottom"> \
					<div class="pp_left"></div> \
					<div class="pp_middle"></div> \
					<div class="pp_right"></div> \
				</div> \
			</div> \
			<div class="pp_overlay"></div>',
	    });
	}
});