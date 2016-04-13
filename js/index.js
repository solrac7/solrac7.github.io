/*
/ Module Dependencies
*/

// var $ = require('jquery');


$(function(){

	// PARALLAX
	$('.home.parallax-window').parallax({imageSrc: '../images/bg-home.jpg'});
	$('.about.parallax-window').parallax({imageSrc: '../images/bg-about.jpg'});
	$('.loyal.parallax-window').parallax({imageSrc: '../images/bg-hero-loyal.jpg'});
	$('.bci.parallax-window').parallax({imageSrc: '../images/bg-hero-bci.jpg'});
	$('.shapes.parallax-window').parallax({imageSrc: '../images/bg-hero-ilustraciones.jpg'});
	$('.contact.parallax-window').parallax({imageSrc: '../images/bg-contact.jpg'});


  // HEADER
  var $header = $("header");
  var lst = 0;
  $(document).on("scroll", function(){
    var st = $(document).scrollTop();
    var $hm = $(".header__menu");
    var $byeBG = $("#byeBG").offset().top;

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

  // HAMBURGER MENU
  $(".menu").click(function(){
    $(this).toggleClass('open');
    $("body").toggleClass("no__scroll")
    $(".header__menu").fadeToggle("fast");
  })

  // MENU ENLACES
  var botonera =
  	'<ul>' +
  	  '<li class="about"><a href="javascript:;">About</a></li>' +
  	  '<li class="workcito"><a href="/#works">Work</a></li>' +
  	  '<li class="contact"><a href="javascript:;">Contact</a></li>' +
  	'</ul>'
  var $header__menu = $(".header__menu");
  $header__menu.append(botonera);


 // MEDIAQUERIES PARA MENU MOBILE
  var mediaquery = window.matchMedia("(max-width: 767px)");
	function handleOrientationChange(mediaquery) {
		if (mediaquery.matches) {
		 	$(".workcito").click(function(e){
		 		e.preventDefault();
		 		$header__menu.fadeOut("fast");
		 		$(".menu").fadeOut("fast");
		 	})
		}
	}	
	handleOrientationChange(mediaquery);
	mediaquery.addListener(handleOrientationChange);


  // WORK MENU
  if ($("#work").length) {
  	$(".workcito").click(function(e){
  		e.preventDefault();

  		$header.removeClass("dn bg");
  		$header__menu.fadeOut("fast");
  		var cerrar = '<div class="close open"><span></span></div>'
  		$(".col-xs-9")
  			.prepend(cerrar)
  			.hide()
  			.delay(500)
  			.fadeIn("fast");

  		$.ajax({
  		  url: "work-menu.html",
  		  cache: true,
  			complete: function(){
  				$('.preloader').fadeOut('slow');
  			},
  		  success: function(html) {
  		  	$(".workMenu").fadeIn("fast");
  		    $(".workMenu").append(html);
  		  }
  		})  

  		setTimeout(function(){ 
  			$("body").addClass("no__scroll");
  		}, 200); 
  		
			$(".close").click(function(){
				$("body").removeClass("no__scroll")
		  	$(".workMenu").fadeOut("fast");
		  	$(".workMenu").find(".container").remove();
		  	$(this).hide();
		  	$(".header__menu").fadeIn("fast");
		  })
  	})
  }

  function workAnimate(){
  	$('html, body')
  	.animate({
  	  scrollTop: $($('#works')).offset().top}, 1000);
  	return false;
  }

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

	
	// click desde página interior
	var URLhash = window.location.hash;
	var works = '#works';
	if (URLhash == works) {
		workAnimate();
	} 

  // SLIDE BCI
	$('.slide').slick({
	  dots: false,
	  infinite: true,
	  speed: 700,
	  fade: true,
	  cssEase: 'linear',
	  autoplay: true,
	  autoplaySpeed: 2000
	});

})

$(window).load(function() {
  $('.preloader').fadeOut('slow');
})