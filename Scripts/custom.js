// templatemo 467 easy profile

// PRELOADER

$(window).load(function(){
    $('.preloader').delay(1000).fadeOut("slow"); // set duration in brackets    
});

// HOME BACKGROUND SLIDESHOW
$(function(){
    jQuery(document).ready(function() {
		$('body').backstretch([
	 		 "../images/trans1.jpg", 
	 		 "../images/trans2.jpg",
			 "../images/trans3.jpg"
	 			], 	{duration: 3200, fade: 1300});
		});
})