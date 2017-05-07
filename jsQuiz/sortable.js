// $(document).ready(function() {

//$(window).bind("load", function() {
$(document).ready(function() {	

$('#removeButton').on('click', function () {
	if ($('#removeButton').hasClass('deactive') ) {  return; }
		$('#removeButton').addClass('deactive');
		if ($(".jMyPuzzle").eq(0).find('li').eq(3).length ==0) { $('#removeButton').removeClass('deactive'); return; }
		
		$(".jMyPuzzle").eq(0).find('li').eq(3).jumbleScramble('remove', '' ,true, function () {
			
			$(".jMyPuzzle").eq(0).find('li').eq(0).jumbleScramble('remove', '' ,true, function () {
				
				
		
			$('#removeButton').removeClass('deactive');
			});
		});
		

});
$('#addButton').on('click', function () {
	$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolosdfdsfds fdsfdsfdsfdfdsffdsfdsfdsfdsfd sfdsfdsfdsfdsfdsfdsfdsf dsfdsfdsfdsfdsfdsf fdsfdffdsfdsfdsfdsfdsfdsfdfdf dsfdsfdsfdsfdsfdsfdsfdsfr.', 2,true);
	
});
 

  (function($){											
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);  
 //$("body").css("overflow", "hidden");
		$('body').disableSelection();	
		$('ul').on('touchmove',function(e){
			e.preventDefault();
		});

		

				//$("#jMyPuzzleId2, #jMyPuzzleId3").remove();

				$("#jMyPuzzleId0, #jMyPuzzleId1").css('opacity',1).jumbleScramble({
						isVertical: true,
						cutOff: [500,550],
						//dropLimit: [800,800],   // dropLimit will set the maximum height for the container to allow items to be dropped.
						layoutComplete: function (instanceArray) {	
							//	console.log(instanceArray)
							console.log('done');
								
							//	 $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
						// $(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3, true)  
						//$(".jMyPuzzle").eq(0).find('li').eq(0).jumbleScramble('remove', '' ,true)  // add true or false to animate remove 
						//console.log ( $(".jMyPuzzle").eq(0).find('li').eq(3).text() );
								//$(".jMyPuzzle").eq(0).find('li').eq(3).jumbleScramble('remove', '' ,true)  // add true or false to animate remove 
						}						
					});	
			

		

				//$("#jMyPuzzleId0, #jMyPuzzleId1").remove();
				
				$("#jMyPuzzleId2, #jMyPuzzleId3").css('opacity',1).jumbleScramble({
						isVertical: false,
						//setChars: false, // does not work when moving to another container
						//dropLimit: [300, 300], // currently doesn't work but must be set
						cutOff: [600,6060],
						layoutComplete: function (instanceArray) {	
								console.log(instanceArray)
								// $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
								//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
							//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
						}						
					});	
	
				$("#jMyPuzzleId4, #jMyPuzzleId5").css('opacity',1).jumbleScramble({
						isVertical: false,
						//setChars: false, // does not work when moving to another container
						//dropLimit: [300, 300], // currently doesn't work but must be set
						cutOff: [600,660],
						layoutComplete: function (instanceArray) {	
								console.log(instanceArray)
								// $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor.', 6) 
								//$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
							//	$(".jMyPuzzle").eq(0).find('li').first().jumbleScramble('remove') 
						}						
					});	
			

		
 });