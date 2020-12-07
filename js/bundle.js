(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                        /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

},{}],2:[function(require,module,exports){
/*
/ Module Dependencies
*/

// var $ = require('jquery');
// var Tuty = require('src/js/alert.js');
// var parallax = require('src/js/parallax.js');
// var slick = require('./slick.min.js');
// var retina = require('./retina.min.js');
var lazy = require('jquery-lazyload');


$(function(){
	// PARALLAX
	$('.home.parallax-window').parallax({imageSrc: '../images/bg-home.jpg'});
	$('.about.parallax-window').parallax({imageSrc: '../images/bg-about.jpg'});
	$('.loyal.parallax-window').parallax({imageSrc: '../images/bg-hero-loyal.jpg'});
  $('.bci.parallax-window').parallax({imageSrc: '../images/bg-hero-bci.jpg'});
  $('.shapes.parallax-window').parallax({imageSrc: '../images/bg-hero-ilustraciones.jpg'});
  $('.one.parallax-window').parallax({imageSrc: '../images/bg-one.jpg'});
	$('.contact.parallax-window').parallax({imageSrc: '../images/bg-contact.jpg'});


  // HEADER OCULTAR/MOSTRAR SEGUN SCROLL
  var $header = $("header"), 
      $header__menu = $(".header__menu"),
      $hamburgerMenu = $(".menu"),
      lst = 0;

  $(document).on("scroll", function(){
    var st = $(document).scrollTop(),
        $byeBG = $("#byeBG").offset().top;

    if(st > lst){
    	$header.addClass("dn");
    }else{
    	$header.removeClass("dn");
    }
   
    if(st > $byeBG + -70){
      $header.addClass("bg");
    }else{
    	$header.removeClass("bg");
    }	
    lst = st
  })

  // MENU BOTONERA
  var botonera =
  	'<ul class="header__menuLista">' +
  	  '<li class="about"><a href="acerca.html">Acerca</a></li>' +
  	  '<li class="workcito"><a href="/#works">Trabajos</a></li>' +
  	  '<li class="contact"><a href="contacto.html">Contacto</a></li>' +
  	'</ul>' +
    '<div class="workMenu">' +
      '<div class="container">' +
        '<div class="row">' +
          '<div class="workMenu__container">' +
            
            '<div class="col-xs-6 col-md-3">' +
              '<a href="loyal.html" class="workMenu__enlace">' +
                '<div class="workMenu__imageCont work__loyal"></div>' +
                '<p>Loyal</p>' +
              '</a>' +
            '</div>' +
      
            '<div class="col-xs-6 col-md-3">' +
              '<a href="bci.html" class="workMenu__enlace">' +
                '<div class="workMenu__imageCont work__bci"></div>' +
                '<p>Bci</p>' +
              '</a>' +
            '</div>' +
      
            '<div class="col-xs-6 col-md-3">' +
              '<a href="https://www.figma.com/proto/ZXYtoTMMJBQTfd2AFWxyIn/Feed?node-id=631%3A4297&scaling=scale-down-width" target="_myad" class="workMenu__enlace">' +
                '<div class="workMenu__imageCont work__facilads"></div>' +
                '<p>MyAD</p>' +
              '</a>' +
            '</div>' +
      
            '<div class="col-xs-6 col-md-3">' +
              '<a href="one.html" target="_one" class="workMenu__enlace">' +
                '<div class="workMenu__imageCont work__heidelberg"></div>' +
                '<p>ONE Newsletter</p>' +
              '</a>' +
            '</div>' +
          
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' 
  $header__menu.html(botonera);
  var $workMenu = $(".workMenu")

  // MEDIAQUERIES PARA MENU MOBILE
  var mediaquery = window.matchMedia("(max-width: 767px)");
	function handleOrientationChange(mediaquery) {
    
    if (mediaquery.matches) {
      // CLICK MAS TRABAJOS
      $(".moreWorks").click(function(){
        $header
          .removeClass("dn bg");
        
        $hamburgerMenu
          .toggleClass('open');
        
        $("body")
          .toggleClass("no__scroll")
       
        if ($hamburgerMenu.hasClass("open")){
          $header__menu
            .fadeToggle("fast")
            .find(".header__menuLista")
            .addClass("left-100")
            .removeClass("left0");

          $header__menu
            .find($workMenu)
            .removeClass("mgLeft100")
            .addClass("mgLeft0");

          $hamburgerMenu.click(function(){
            $header__menu
              .find(".header__menuLista")
              .removeClass("left-100")
              .addClass("left0");
            
            $header__menu
              .find($workMenu)
              .removeClass("mgLeft0")
              .addClass("mgLeft100");
          })
        } 
      })

      // CLICK HAMBURGER MENU
      $hamburgerMenu.click(function(){
        $header__menu
          .toggleClass("bg");
        
        $(this)
          .toggleClass('open');
        
        $("body")
          .toggleClass("no__scroll")
        
        $header__menu
          .fadeToggle("fast");
        
        if ($hamburgerMenu.hasClass("open")) {
          $(".menu, .icon-arrow-back").click(function(){
            $header__menu
              .find(".header__menuLista")
              .removeClass("left-100")
              .addClass("left0");
            
            $header__menu
              .find($workMenu)
              .removeClass("mgLeft0")
              .addClass("mgLeft100");
           
            $(".logo__container")
              .addClass("upDown");
            
            $(".icon-arrow-back")
              .removeClass("rightLeft");
          })
        }
      })
    }else if($("body").hasClass("workeando")){
      $(".moreWorks, .workcito").click(function(e){
        e.preventDefault();
        $hamburgerMenu
          .fadeIn("fast")
          .toggleClass('open');
        
        $header
          .removeClass("dn bg");
        
        $("body")
          .toggleClass("no__scroll")
        
        $(".header__menuLista")
          .fadeOut("fast")
        
        $($workMenu)
          .fadeIn("fast");


        $($hamburgerMenu).click(function(){
          $(this)
            .hide()
            .removeClass("open")
          
          $($workMenu)
            .fadeOut("fast")
          
          $("body")
            .removeClass("no__scroll")
          
          $header
            .addClass("bg");
          
          $(".header__menuLista")
            .fadeIn("fast")
        })
      })
    }


    // CLICK BOTÓN TRABAJOS
    if (mediaquery.matches && $("body").hasClass("workeando")) {
		 	$(".workcito").click(function(e){
		 		e.preventDefault();
		 		$header__menu
        .find(".header__menuLista")
        .addClass("left-100")
        .removeClass("left0");
         
        $header__menu.find($workMenu)
        .removeClass("mgLeft100")
        .addClass("mgLeft0");
        
        $(".logo__container").removeClass("upDown");
        $(".icon-arrow-back").addClass("rightLeft");
		 	})
		}
	}	
	handleOrientationChange(mediaquery);
	mediaquery.addListener(handleOrientationChange);

  // Ascensor MENÚ (botón WORK)
	// click desde home
	if ($("#home").length) {
		$(".workcito").click(function(e){
  		e.preventDefault();
  		$(".menu").removeClass('open');
  		$("body").removeClass("no__scroll")
  		$header__menu.fadeOut("fast");
	  	workAnimate();
		});
	}

  function workAnimate(){
    $('html, body')
    .animate({
      scrollTop: $($('#works')).offset().top}, 1000);
    return false;
  }

	
	// click desde página interior no works
	var URLhash = window.location.hash;
	var works = '#works';
	if (URLhash == works) {
		workAnimate();
	} 
  

  // SLIDE BCI
  if ($("body").hasClass("ws")) {
    $('.slide').slick({
      dots: false,
      infinite: true,
      speed: 700,
      fade: true,
      cssEase: 'linear',
      autoplay: true,
      autoplaySpeed: 7000
    });
  }
  
})

$(window).load(function() {
  $('.preloader').fadeOut('slow');
  setTimeout(function(){ 
    $(".logo__container").addClass("upDown");
   }, 500);
})
},{"jquery-lazyload":1}]},{},[2]);
