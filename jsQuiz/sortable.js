// $(document).ready(function() {

//$(window).bind("load", function() {
$(document).ready(function() {	

  (function($){											
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);  
 $("body").css("overflow", "hidden");
		$('body').disableSelection();	
		$('ul').on('touchmove',function(e){
			e.preventDefault();
		});

		
			var isVertical = true;
			
			if (isVertical == true) {
				
				$("#jMyPuzzleId2, #jMyPuzzleId3").remove();

				$(".jMyPuzzle").css('opacity',1).jumbleScramble({
						isVertical: isVertical,
						cutOff: [9000,9000],
						//dropLimit: [800,800],   // dropLimit will set the maximum height for the container to allow items to be dropped.
						layoutComplete: function (instanceArray) {	
							//	console.log(instanceArray)
								
							//	 $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
						// $(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3, true)  
						//$(".jMyPuzzle").eq(0).find('li').eq(0).jumbleScramble('remove', '' ,true)  // add true or false to animate remove 
						//console.log ( $(".jMyPuzzle").eq(0).find('li').eq(3).text() );
								$(".jMyPuzzle").eq(0).find('li').eq(3).jumbleScramble('remove', '' ,true)  // add true or false to animate remove 
						}						
					});	
			}

			if (isVertical == false) {

				$("#jMyPuzzleId0, #jMyPuzzleId1").remove();
				
				$(".jMyPuzzle").css('opacity',1).jumbleScramble({
						isVertical: isVertical,
						setChars: false, // does not work when moving to another container
						dropLimit: [300, 300], // currently doesn't work but must be set
						cutOff: [900,900],
						layoutComplete: function (instanceArray) {	
								console.log(instanceArray)
								// $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
								//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
							//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
						}						
					});	

			}	

		
 });