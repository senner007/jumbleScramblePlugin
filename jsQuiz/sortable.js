// $(document).ready(function() {

//$(window).bind("load", function() {
$(document).ready(function() {	

if (!$.support.transition) {	
	$.fn.transition = $.fn.animate;	
}

 


(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
		$('body').disableSelection();	
			var isVertical = true;
			
			if (isVertical == true) {
				
				$("#jMyPuzzleId2").remove();

				$("#jMyPuzzleId0, #jMyPuzzleId1").jumbleScramble({
						isVertical: isVertical,
						layoutComplete: function (instanceArray) {	
								console.log(instanceArray)
								// $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
								//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
							//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
						}						
					});	
			}

			if (isVertical == false) {

				$("#jMyPuzzleId0, #jMyPuzzleId1").remove();
				
				$("#jMyPuzzleId2").jumbleScramble({
						isVertical: isVertical,
						setChars: true,
						layoutComplete: function (instanceArray) {	
								console.log(instanceArray)
								// $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
								//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
							//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
						}						
					});	

			}	

		
 });