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
              '<a href="http://www.facilads.cl" target="_facil" class="workMenu__enlace">' +
                '<div class="workMenu__imageCont work__facilads"></div>' +
                '<p>Facilads</p>' +
              '</a>' +
            '</div>' +
      
            '<div class="col-xs-6 col-md-3">' +
              '<a href="http://www.heidelberghaus.cl" target="_heidelberg" class="workMenu__enlace">' +
                '<div class="workMenu__imageCont work__heidelberg"></div>' +
                '<p>Heidelberg</p>' +
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