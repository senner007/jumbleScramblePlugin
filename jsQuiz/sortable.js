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
		
			var isVertical = true;
			
			if (isVertical == true) {
				
				$("#jMyPuzzleId2, #jMyPuzzleId3").remove();

				$(".jMyPuzzle").css('opacity',1).jumbleScramble({
						isVertical: isVertical,
						cutOff: [600,600],
						dropLimit: [500, 500],
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
						setChars: false,
						dropLimit: [300, 300], // currently doesn't work but must be set
						cutOff: [1000,1000],
						layoutComplete: function (instanceArray) {	
								console.log(instanceArray)
								// $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
								//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
							//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
						}						
					});	

			}	

		
 });