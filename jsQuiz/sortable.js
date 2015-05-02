// $(document).ready(function() {

//$(window).bind("load", function() {
$(document).ready(function() {	

if (!$.support.transition) {	
	$.fn.transition = $.fn.animate;	
}


var $h1text;

var a=[];
var buttonTry = 1; 
	
var sentencesArr = [];
var answers = [];
var questions = [];
var saveData; 
var quoteText;
 var friends = window.parent.shout_text;
 var saveData = window.parent.xmlDataVar
 
 
	
var $h1 = $('h1');

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
			
			var isVertical = true;
			
			if (isVertical == false) {
				$('div .jMyPuzzle').removeAttr('style').css('height', '50px')
				$('.listItem').css({
					width: 'auto',
					border: '1px solid black'
					
				})
					
			}
			/* else {
				$('div .jMyPuzzle').css('height', '430px')
				$('.splitList li').css({
					width: 'inherit'

					
				})
				
			} */
			
			
			$(".jMyPuzzle").jumbleScramble({
				isVertical: isVertical,
				layoutComplete: function () {	
				
						 $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
						//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
					//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
				}						
			});	


				

			
 
		//$check.removeAttr('disabled');

		var score = 0;
		
		
 });