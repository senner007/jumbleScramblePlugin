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
			
			var isHorizotal = true;
			
			if (isHorizotal == false) {
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
				isHorizontal: isHorizotal,
				layoutComplete: function () {	
				
						/* $(".jMyPuzzle").eq(0).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3) 
						$(".jMyPuzzle").eq(1).jumbleScramble('add', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et mi sapien.', 3)  */
				}						
			});	


				

			
 
		//$check.removeAttr('disabled');

		var score = 0;
		
		$('#check').click(function (event) {
				$(this).css('text-decoration','line-through').attr('disabled', 'disabled');
				event.preventDefault();
				var staticLi = $('#static').find('li');
				$('.imgPos').css({opacity:0});
				$splitList.find('li').each(function () {
					var $this = $(this);
						var index = $this.index();
			
						if ( completeString.indexOf(staticLi.eq(index).text() + $this.text()) >= 0  ) {
							
							$this.addClass('ui-state-disabled').find('.imgPos').attr('src','css/cssImg/checkButtonBlack.png');
							//$this.add(staticLi.eq(index)).css({color:'green'});
							score = score + 10;
							
						}
						else {
							/* console.log('hello') */
							//$this.find('.imgPos').attr('src','css/cssImg/cancelButtonSmall.png');
						}
						if ($this.hasClass('ui-state-disabled') == true) {
						//	window.parent.globalScoreVariable = window.parent.globalScoreVariable + 10;
						}
									
					}) 	
				$splitList.find('li').each(function (index2) {
				var $this = $(this);
					var index = $this.index();
		
						if ( completeString.indexOf(staticLi.eq(index).text() + $this.text()) >= 0  ) 
						{
							 $this
							.find('.imgPos').delay(index2 * 90).transition({opacity:1}).end() 
							.add(staticLi.eq(index)).delay(index2 * 100)
							.transition({
										
							},  80, function () {
							$this.add(staticLi.eq(index)).css({
							//color:'#006400',
							//backgroundColor: 'rgb(187, 187, 187)'
							})
							});
						//	$this.add(staticLi.eq(index)).css({color:'green'}); 
							
							
						}
						else {
						
						
						/* $this
						.find('.imgPos').delay(index2  * 90).transition({opacity:1}).end()
						.add(staticLi.eq(index)).delay(index2 * 120).transition({ */
						
					
						$this.add(staticLi.eq(index)).delay(index2 * 100).transition({ 
						
						
							},  0, function () {
								$(this).find('.squiggle').squiggle({
									intensity:70,
									thickness:3,
									color: 'rgb(34, 34, 34)'										
								});
								
								});
						}
						
				}).promise().done(function () {
					$feedText.transition({y: '-10px', opacity: 0}, function () {
							$(this).css({y: '10px'});
							if (score == 100) { $(this).html('Well done! Your score is ' + score + ' out of 100'); }
							if (score >= 70 && score < 100) { $(this).html('Almost. Your score is ' + score + ' out of 100'); }
							if (score < 70 ) { $(this).html('Try again. Your score is ' + score + ' out of 100'); } 
						$(this).transition({y: '0px', opacity: 1});
					});
					
				})
			
				//$scoreText.text('Score: ' + window.parent.globalScoreVariable + ' Out of 100').hide().fadeIn();
		
				
				$splitList.find('li').draggable('disable');
				
			});

		$('#restart').click(function(event) {
			
			$('#check').css('text-decoration','none');
			event.preventDefault();
			score = 0;
				
			var $splitListLi =  $splitList.find('li');		
			$('#allLists').transition({opacity: 0}, 400, function() {
				$('li').css({
			//	color:'rgb(34, 34, 34)'
				});
				randomNumbers = shuffle(answers);
				$splitListLi.each(function(i){
						
						$(this).html("<span class='squiggle'>" + randomNumbers[i] + '</span>')
						.append("<div class='imgClass'><img class='imgPos' src='css/cssImg/handleSmall.png'></div>");
						
				});
				randomNumbers = shuffle(questions);				
				$static.find('li').each(function(i){
					$(this).html("<span class='squiggle'>" + randomNumbers[i] + '</span>')
					});
			}).transition({opacity: 1}, 700, function () {
				
				$feedText.transition({y: '-10px', opacity: 0}, function () {
					$(this).css({y: '10px'});
					if (alignCenter == 'true') {
						$(this).html('Sort the words or sentences to match those on the left side.').transition({y: '0px', opacity: 1});
					}
					else {
						$(this).html('Sort the endings to create correct and meaningful sentences.').transition({y: '0px', opacity: 1});
					}
				});
			});
		
		
			$splitList.find('li').draggable('enable');

			$check.removeAttr('disabled'); 
	
		});

 });