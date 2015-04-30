$(document).ready(function() {
var deviceAgent = navigator.userAgent.toLowerCase();			
var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
// remove left right arrows on ipad		
if (!agentID) {
	$('<button id="nextButton"></button><button id="prevButton"></button>').prependTo('#bottomContainer');
}

if (agentID) {
	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: "css/scrambledIpad.css"
	}).appendTo("head");
}


$('.initButton').css({opacity: 0});
$.getScript("js/jquery-ui-11.4.custom.min.js", function(data, textStatus, jqxhr) {
	$('.initButton').transition({opacity: 1});
	$.getScript("js/touchPunchPointer.min.js");	
});



var difficulty = {
	setting: 0,
	wrongPunishLimit: 0,
	multiply: 0,
	easy: function () {
			$('#wrongCount').remove();
			$('#checkButton').remove();
			difficulty.setting = 0;
			difficulty.multiply = 3
			//aler('help')
	},
	normal : function () {
			difficulty.multiply = 2
			difficulty.setting =1;
	},
	hard: function () {
			difficulty.multiply = 1
			difficulty.setting =2;
			
	}

}

$('.initButton').one('tapclick', function  () {


	switch( $(this).attr('id') )
	{
	case 'easy':
		difficulty.easy()
	  break;
	case 'normal':
		difficulty.normal()

	  break;
	case 'hard':
		difficulty.hard()

	  break;
	}


	$(this).transition({backgroundColor: 'transparent', color: 'rgb(68, 68, 68)'},200, function () {
		initAll();
	})
	
})

initAll = function () {

	if (!$.support.transition) {	
				$.fn.transition = $.fn.animate;	
			}
	var $checkButton = $('#checkButton');
	var sentencesArr = [];
	var friends = window.parent.shout_text;
	var saveData = window.parent.xmlDataVar
	var wrongPunish = 0;
	var selectWordsArr;
	var prependedSentences = [];

	var selectWords = $(saveData).find(friends).find('selectWords').text();

	inputText = $(saveData).find(friends).find('inputText').text();
	var quoteText = $(saveData).find(friends).find('quote').text();
	var dontBindWords = $(saveData).find(friends).find('dontBindWords').text();
	var lowerCaseCharacters = $(saveData).find(friends).find('lowerCaseCharacters').text();
	$(saveData).find(friends).find('sentences').children().each(function () {
		sentencesArr.push($(this).text());
	});
	
	var senLength = sentencesArr.length;
	var frame = $('#frame');
	selectWordsArr = selectWords.replace(/ /g, " ").split(" ");
	
	if (quoteText.length > 0) {
	$('#quoteText').text(quoteText);
	}
	else {
	$('#quoteText').remove();
	}
	
	
	difficulty.wrongPunishLimit = (senLength * difficulty.multiply );
	
	var $progInner = $('#progInner'),
	$progOuterWidth = $('#progOuter').outerWidth(); 
	$progInner.css({x: -$progOuterWidth});
	
	var progTransit = function (qCount) {
	
		var increment = $progOuterWidth / qCount
		
			if (wrongPunish == difficulty.wrongPunishLimit || frame.find('.solved').size() == prependedSentences.length ) {
					$progInner.transit({x: 0}, 1000);
			}
			else {
			$progInner.transit({x: '+=' + increment}, 1000);
			}

	} 
				
	function shuffle(o){ //v1.0
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	
	// Prepend selected words 
	// (example west if sentence: ...west and east...)		
	prependSelect = function (arr,selectW) {		
		
		var splitNumber = arr.length
			var anumber = (jQuery.inArray(selectW, arr));
				// if the selected must be bound word is the
				// first in the sentence ( arr[0] ), then append 
				// next word. Else prepend previous word.						
				if (anumber == 0) {	
					  arr.splice(anumber,2, (arr[anumber] + ' ' + arr[anumber + 1])) ;
				}
				else {
				//arr[anumber - 1] = arr[anumber-1] + ' ' + arr[anumber] ;	
					 arr.splice((anumber - 1),2, (arr[anumber-1] + ' ' + arr[anumber])) ;
				}	
		return arr;
																					
	 };				
	
	randomPrepend = function (arr) {

		var splitNumber = arr.length
		var anumber = Math.floor((Math.random()*splitNumber * 1));
			if (anumber == splitNumber -1) {
				arr.splice((anumber - 1),2, (arr[anumber - 1] + ' ' + arr[anumber]) );
			}
			else {
				arr.splice(anumber,2, (arr[anumber] + ' ' + arr[anumber+1]) );	
			}	
		return arr;
	 };	
	autoValidate = function () {	
		if (difficulty.setting == 0) {
			
			var activeIndex = $('.slidee').find('.active').index();
			var uniqueNames = prependedSentences[activeIndex];
			$('.active').find('.jMyPuzzle').find('li').not('.locked').each(function (ins,spqr) {
									
				var elIndex = $(this).index();

				if ( $(spqr).text() == uniqueNames[elIndex] ) { 
					// delay is needed or else the css will not be applied
					$(spqr).addClass('locked').delay(100 * ins).transition({color: '#006400'}, 300);
					
				};
				if (elIndex == uniqueNames.length -1 ) {
					$(spqr).parent().addClass('solved');
					progTransit(prependedSentences.length);
					$(this).parent().delay(500).transition({y: -100, opacity: 0},500, 'easeInOutCubic',function () {
						$(this).html( "<p class='solvedToString'>" + uniqueNames.join(' ') + "</p>" + "<img class='solvedImg' src='css/cssImg/check2.png'/>").delay(200).transition({y: 0, opacity: 1}, 800,'easeOutQuad');
						
					});
					
				}; 
				if (frame.find('.solved').size() == prependedSentences.length ) {
					finalFeedback();
				}
				if ( $(spqr).text() != uniqueNames[elIndex] ) {
					return false;
				};
			});

		};
	};
	finalFeedback = function () {
			$checkButton.remove();
			var items = frame.find('.lis').size();
			var thisIndex = $('.active').index();
			var solved = frame.find('.solved').size();
			
			appendSly = function () {
				var myHtml = "<p id='feedback'>You finished: " + solved + "<br>" + "Your score is: " + Math.round((100/items) * solved) + " out of 100" + "</p>" ;
				sly.add("<li class='lis'><div class='jMyPuzzle'><div class='ulBorder'><ul class='splitList'></ul></div></div></li>");
				frame.find('li').last().find('.splitList').append(myHtml);
				setTimeout(function(){
					sly.nextPage();
					sly.off('moveEnd');
					sly.on('moveEnd', function () { 
						sly.set('speed', 400);
					});
			
				},300);		
			};
			
			sly.set('speed', 1500);
			
			if (items == thisIndex + 1) {
				appendSly();	
			
			}
			else {
				sly.on('moveEnd', function () {
					appendSly();
				});	
				sly.toEnd();
			};
			
	};	

				
	var myHtmlLis = '';
	$.each(sentencesArr, function (ind,e) {
	
		var arr = e.split(" ");
		
		// Uppercase the correct first word for setting 1,2
		if (difficulty.setting != 2 ) {
			var arrMinusFirst = arr[0].slice(1,arr[0].length);
			var arrFirst = arr[0].charAt(0).toUpperCase();
			arr[0] = (arrFirst + arrMinusFirst);
		} 
		
		var noLower = [];	
		if (lowerCaseCharacters == 'true') {	
			$.each(arr, function(i, el){
				if ( el.charAt(0) == el.charAt(0).toUpperCase() ) {
					noLower.push(el)
				}
			});
		};
		
		$.each(selectWordsArr, function(i,e) {	
			if (jQuery.inArray(selectWordsArr[i], arr) != -1) { 
				// while loop if there are more than one
				// of the selected word in the sentence
				// ex. (I) : I looked and I walked...
				while (jQuery.inArray(selectWordsArr[i], arr) != -1) { 
					arr = prependSelect(arr,selectWordsArr[i]);
				}
			}
		});
		
		for (var i=0;i<(difficulty.multiply +1);i++) { 
		
			if (arr.length > 7) {
				arr = randomPrepend(arr);
		/* 		console.log('randomP'); */
				
			}
		}
		
		// prepend modified arr in correct order
		// to storage array for checking				
		prependedSentences.push(arr);
		
		
		// create shuffled array and add class 'lower'
		// to items where the first letter is to be
		// lowercased or uppercased when shifting pos.
		var mixed =  shuffle ( arr.slice(0) ) ;
		var myHtml = "";
		$.each(mixed, function(index, elem){
			var array = elem.split(' ');
			var myClass = 'lower';
			$.each(noLower, function (i,e) {			
				if (array[0] == e) {
					myClass = 'dontLower';					
				}							
			})
		
			 if (difficulty.setting == 2 && index == 0) {         // Uppercase first letter in first word for hard difficulty
				
				var mixedArrMinusFirst = mixed[index].slice(1,mixed[index].length);
				var mixedArrFirst = mixed[index].charAt(0).toUpperCase();
				mixed[index] = (mixedArrFirst + mixedArrMinusFirst);
			}  
			
			
			myHtml += "<li class=" + myClass + ">" + mixed[index] + "</li>";
			
							
		});
					
		myHtmlLis += "<li class='lis'><div class='jMyPuzzle' id='jMyPuzzleId" + ind  + "'><ul class='splitList'>" + myHtml + "</ul></div></li>";
			
			
	});
							
			
		frame.find('.slidee').append(myHtmlLis);
		
		var pagesInteract = 'click';
		if (agentID) {
			pagesInteract = 'touchstart';
		}	
			

  //  var items = frame.find('ul > li');
    var sly = new Sly(frame, {
        horizontal: 1,
		itemNav: 'forceCentered',
        scrollBy: 1,
        speed: 400,
		startAt: 0,
		activateMiddle: 1,
		touchDragging: 1,
		mouseDragging: 1,
		interactive: '.jMyPuzzle ul li',
		releaseSwing:  1,
		elasticBounds: 1,
		easing: 'easeInOutCirc', 
		dynamicHandle: 1,
		clickBar: 1,
		dragSource:	$('#frame'),
		//cycleBy:       'pages', // Enable automatic cycling by 'items' or 'pages'.
		//cycleInterval: 1600, // Delay between cycles in milliseconds.
		//pauseOnHover:  0,    // Pause cycling when mouse hovers over the FRAME.
	//	startPaused:   1, 
		pagesBar: $('.pages'),
		activatePageOn: pagesInteract,
		keyboardNavBy: 'pages'
		
    }).init();	
    	
 	$(function() {
					frame.find(".jMyPuzzle").jumbleScramble({
						autoValidate: autoValidate,
						setChars: (difficulty.setting == 2),
						isHorizontal: false,
						layoutComplete: function () {
								//frame.find(".jMyPuzzle").eq(1).jumbleScramble('add', 'qfdfddfdwe', 6) 
						}
					});						
				}); 
			

				
		frame.find(".lis:first-child").find('li').each(function(index2) {
				$(this).css({y: 100}).delay(160 * index2).transition({y: 0, opacity: 1}, 400);
				
			}).promise().done(function () {
				$('#quoteText,#progressbar,#checkButton,#wrongCount').transition({opacity: 1}, 800);
				if (difficulty.setting == 0 ) {
					autoValidate();
				}
			});
			
			$('#initButtonContainer').transition({opacity: 0}, 1300,function () {
				$(this).remove();
			})	
			
			
/* 		
	frame.find('.jMyPuzzle').on('touchend touchstart','li', function(e) {
	 e.preventDefault();
	}, false); */

var wrongCount = $('#wrongCount');
function setWrongCounter() {
	$('#wrongCount').text('Tries left: ' + (difficulty.wrongPunishLimit - wrongPunish))

}
setWrongCounter()



sly.on('change', function () {	// listen for when sly is at beginning and end and add class to prev/next buttons
	autoValidate();		

	// Check whether Sly is at the start
	$('#prevButton')[this.pos.start === this.pos.dest ? 'addClass' : 'removeClass']('ButtonDisabled');
	// Check whether Sly is at the end
	$('#nextButton')[this.pos.end === this.pos.dest ? 'addClass' : 'removeClass']('ButtonDisabled');

	// Check whether the first item is active
   $('#prevButton')[this.rel.activeItem === 0 ? 'addClass' : 'removeClass']('ButtonDisabled');
	// Check whether the last item is active
	$('#nextButton')[this.rel.activeItem === this.items.length - 1 ? 'addClass' : 'removeClass']('ButtonDisabled');
});

sly.on('active', function () {	// listen for when sly is at beginning and end and add class to prev/next buttons
	

	if ( !$('.active').find('.splitList').hasClass('solved') ) {
		$checkButton.css('text-decoration','none');
		answerSwitch = 0;
	}
	else {
		$checkButton.css('text-decoration','line-through');
		
	}

});



// prev button hidden by default
$('#prevButton').addClass('ButtonDisabled');	
	
$('#prevButton').on('tapclick', function (e) {
e.preventDefault();
	sly.prevPage();
}); 	
  
$('#nextButton').on('tapclick', function (e) {
  e.preventDefault();
	sly.nextPage();
}); 
//var docBody = $(document.body);	

var answerSwitch = 0;		// to disable check button
$('#checkButton').on('tapclick',function (e) {

	e.preventDefault();
	
	if (answerSwitch == 1 || $('.active').find('.splitList').hasClass('solved')) { 
		return; 
	}

	var lis = $('.active').find('.splitList').find('li');	

	var easingOut = 'easeInQuad';
	if (!$.support.transition) {
		easingOut = 'easeInQuad';
	}
	var easingIn = 'easeOutQuad';

	answerSwitch = 1;
	$checkButton.css('text-decoration','line-through');
	
	
	var activeIndex = $('.slidee').find('.active').index()
	var sent = sentencesArr[activeIndex].toLowerCase();
	var uniqueNames = prependedSentences[activeIndex];
		
		var i = 0;
		var preValidIndex = 0;
		var	blaLength = 0;
		var correctNumber = 0;

		wrongPunish++;
		wrongCount.html('Tries left: ' + Math.abs((difficulty.wrongPunishLimit - wrongPunish))).transition({display : 'block'}, 100,function () {
	
	
		// helper function for orange coloring
		myArray = []
				
		lis.each(function (myIndex, myElem) {
			
			myArray.push(lis.eq(myIndex).text().toLowerCase())				

		})
		
		// helper function for orange coloring
		function getAdjacentElements (currentIndex, conElements) {
			var string = '';
			for (xyz = 0; xyz < conElements; xyz++) { 
				
						string += myArray[currentIndex +xyz]
						if (xyz != conElements) { 
							string = string + ' ';
						}
	
			}
			string = $.trim(string);
			return string;
		}
		
		var iteDelay = 180;
		var animSpeed = 130;
		// skip animation when all are correct
		if (myArray.join(' ').toLowerCase() == uniqueNames.join(' ').toLowerCase() ) {
			
			iteDelay = 0;
			animSpeed = 0;
			
			
		}
	
		lis.each(function(index2) {  //beginning of lis each function
			var $this = $(this); 
			var $thisText = $this.text().toLowerCase();
				
			if ($thisText.toLowerCase() == uniqueNames[i].toLowerCase()) {
				correctNumber++;
				
				var options = {
					color : "#006400",
					y: '+=10' 
				}
				
				$this.delay(index2 * iteDelay)
				.transition(options,animSpeed,easingOut)
				.transition({y: '-=10'},animSpeed,easingIn, function () {
					
				});		
			
			}
			else if ($thisText.toLowerCase() != uniqueNames[i].toLowerCase() || preValidIndex != 0  ) {
			
				// function for orange coloring
				var blabla = 0;
			
				for (myI = (myArray.length - index2); myI > 2; myI--) { 

					var temp = getAdjacentElements (index2, myI)
					if (sent.indexOf(temp) >= 0) {
						blabla = myI;
						myI = 0;
					}
			
				}
			
				
				if ( blabla > 2 && blabla > blaLength) {
					blaLength = blabla;
					preValidIndex = 0;
			
				}
				
		
				
				if (preValidIndex < blaLength) {
					preValidIndex++;
				}
				else { 
					 blaLength = 0;
					 preValidIndex = 0;
				}
			
		
				if ( (sent.indexOf(blabla) >= 0) && blaLength > 2 || preValidIndex != 0) {
				
				var options = {
					color : "#CC9900",
					y: '+=10' 
				}
				
				$this.delay(index2 * iteDelay)
				.transition(options,animSpeed,easingOut)
				.transition({y: '-=10'},animSpeed,easingIn);
				 
			}
			else {
			
				var options = {
					color : "#A80000",
					y: '+=10' 
				}
					$this.delay(index2 * iteDelay)
					.transition(options,animSpeed,easingOut)
					.transition({y: '-=10'},animSpeed,easingIn);
				
			}
		
		}
		i++;
		
		if (correctNumber == uniqueNames.length) {
			$this.parent().addClass('solved');
		}
		
	}).promise().done(function () {
		answerSwitch = 0;		
		$this = $(this);
		
		if (correctNumber == uniqueNames.length) {
			progTransit(prependedSentences.length);
			var arr = uniqueNames;
			if (difficulty.setting == 2 ) {
					var arrMinusFirst = arr[0].slice(1,arr[0].length);
					var arrFirst = arr[0].charAt(0).toUpperCase();
					arr[0] = (arrFirst + arrMinusFirst);
				} 
			$this.parent().children().each(function (counter) {
					$(this).delay(counter * 50 + 200).transition({opacity: 0},200);
			}).promise().done(function () {
					$(this).parent().html( "<p class='solvedToString'>" + prependedSentences[activeIndex].join(' ') + "</p>" + "<img class='solvedImg' src='css/cssImg/checkButton.png'/>").css({opacity: 0, y: 100}).transition({opacity: 1, y: 0}, 500, 'easeOutQuad');	
			});			
		}
		else {
			if ( !$('.active').find('.splitList').hasClass('solved') && activeIndex == sly.rel.activePage) {

				$checkButton.css('text-decoration','none');
			}
		}
	
		if (wrongPunish == difficulty.wrongPunishLimit || frame.find('.solved').size() == prependedSentences.length ) {
			answerSwitch = 1;
			frame.find('.splitList').find('li').draggable('disable');
			$checkButton.css('text-decoration','line-through');
			finalFeedback();
		}
		
	});
	});
	
});
}

});
