$(document).ready(function() {
	
// deferred to be resolved when slyText has loaded
var defSlyText = new $.Deferred();

// load the external puzzle plugin as deferred
var defJMyPuzzle = new $.Deferred();

$.getScript("js/jumbleScramble.js", function(data, textStatus, jqxhr) {
		defJMyPuzzle.resolve();
});

$.getScript("js/jquery.ui.touch-punch.min.js");


var quizTitle = window.parent.shout_text;
var saveData = window.parent.xmlDataVar;


$('#quoteText').text( $(saveData).find(quizTitle).find('quoteText').text() )


function findText () {
	var textSource = $(saveData).find(quizTitle).find('textSource').text();	
	if (typeof textSource === 'string' && textSource.length > 0) { return textSource }
	else { return quizTitle }	
}


var stringData = $.ajax({
		url: "jumbledTextFiles/" + findText() + '.txt',
		async: false
	 }).responseText;
	 


var deviceAgent = navigator.userAgent.toLowerCase();			
var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
// remove left right arrows on ipad		
if (agentID) {
	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: "css/jumbledIpad.css"
	}).appendTo("head");
} 

var docWidth = window.parent.$('body').width();	
if (docWidth > 1100) {
	$('<button id="nextButton"></button><button id="prevButton"></button>').prependTo('#bottomContainer');
}

$('.initButton').transition({opacity: 1});


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

$('.initButton').one('tapclick', function  (event) {

	event.preventDefault();

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
	$(this).transition({backgroundColor: 'transparent', color: 'rgb(68, 68, 68)'}, 200,function () {
	
		$.when(defJMyPuzzle,defSlyText).done(function () {
			initAll();
		});	
	});
})

var saveData; 
var answer;
var $checkButton = $('#checkButton');
var wrongPunish = 0;
var removedLi;
var eqnumber;
var prependedSentences = [];

if (!$.support.transition) {	
	$.fn.transition = $.fn.animate;	
}

function shuffle(o){ //v1.0
				for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
				return o;
			};

	
	var answerArr = [];
	indexSuf = 0
	while ( stringData.match(/_[^_]+_*/i) != null ) {
		var blabla = stringData.match(/_[^_]+_*/i)
		var myString = blabla[0].substring(1)
		myString = myString.substring(0, myString.length - 1);
		answerArr.push(myString)
		
		var stringToArray = myString.split('');

		 var input = shuffle(stringToArray.slice(0));
		 input = input.join('');
		
		stringData = stringData.replace(blabla[0], "<span class='suffixes' id='suf" + indexSuf + "'>" + input + "</span>");
		indexSuf = indexSuf +1;
	}
	var stringArray = stringData.split("\n");
	
	var newArr = []; 											//removing empty elements in array - begin
	for (var index in stringArray) { 
		if( stringArray[index].length > 1) { 
			newArr.push( stringArray[index] ); 
		} 
	} 
	
	splitArrHelper = function (e,splitNr){							// split text helper function
				var indexChar = 0;
				var n = e.charAt(splitNr)

				while (n != ',' && n != '.' && n != '!' && n != ';' && n != '?') {
					n = e.charAt((splitNr)- indexChar)
					indexChar++;
					
				}
				var rounded = Math.round((splitNr)- indexChar +2);
				var firstPart = e.substr(0,rounded) + '-';
				var lastPart = '-' + e.substr(rounded,e.length);

			return [firstPart, lastPart];
	}

	var doItAgain = 1;
	while ( doItAgain == 1 ) {
			
		newArr = $.map(newArr, function (el,i) {
				//split paragraph if more than 500 chars.
				var splitNr = 500;
				var maxLength = 800;
				
				if (el.length > splitNr && el.length > maxLength) { 
				
						var thisSplit = splitArrHelper(el,splitNr);
						return [thisSplit[0], thisSplit[1]];
				}
				else {
					return el;
				
				}
				
		});
		// repeat the process and overwrite the array if 
		// one of the elements has more than 500 chars
		doItAgain = 0;	
		$.each(newArr, function (ind,elem) {
			if (elem.length > 800) { doItAgain = 1;	}
		}); 

	}
	var myHtml = '';
	$.each(newArr, function (i,e) {
	
			myHtml += "<li class='textLis'><p>" + $.trim(newArr[i]) + "</p></li>";

	});
	var textBox = $('#textBox');
	textBox.find('ul').html(myHtml); 
	
	
	// find lis with low height and append those to previous
	var repeat = 1;
	while (repeat == 1) {
		 textBox.find('li').each(function (i,e) {
			
				var $thisPrev = $(this).prev();
				repeat = 0;
				 if ( $thisPrev.height() + $(this).height() < 260 && i != 0 ) {
					
					
					$thisPrev.html( $thisPrev.html() + $(this).html());
					$(this).remove();
					repeat = 1
					return false;
					
				} 

		}); 
	}
	
    var textItems = textBox.find('ul > li');
    var slyText = new Sly(textBox, {
        horizontal: 1,
        itemNav: 'forceCentered',
        scrollBy: 1,
		activateMiddle: 1,
        speed: 400,
		startAt: 0,
		swingSpeed: 0.1,
		releaseSwing:  1,
		touchDragging: 1,
		elasticBounds: 1,
		/* easing: 'easeInOutCirc',  */
		dynamicHandle: 1,
		dragSource:	$('#textBox'),
		/* cycleBy:       'pages', */ // Enable automatic cycling by 'items' or 'pages'.
		/* cycleInterval: 1600, */ // Delay between cycles in milliseconds.
		pauseOnHover:  0,    // Pause cycling when mouse hovers over the FRAME.
		startPaused:   1, 
		/* activatePageOn: 'click', */
		activeClass:   'activeText'
		},
		{
		load: function () {
				defSlyText.resolve();
		}
		
		}).init(); 

initAll = function () {							// initAll start
			
	answers = answerArr;

	$container = $('#container');			

	
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
	autoValidate = function () {	
		if (difficulty.setting == 0) {
			
			
			var activeIndex = $('.slidee').find('.active').index();
			var uniqueNames = prependedSentences[activeIndex];
			frame.find('.active').find('.jMyPuzzle').find('li').not('.locked').each(function (ins,spqr) {
									
				var elIndex = $(this).index();
				var $this = $(this);
				var $thisText = $(this).text()
				if ($thisText == '_') { $thisText = ' ' }
				
				if ( $thisText == uniqueNames[elIndex] ) { 
					// delay is needed or else the css will not be applied
					$(spqr).addClass('locked').delay(70 * ins).transition({color: '#006400'}, 250, function () {

						if (elIndex == uniqueNames.length -1 ) {
							$this.parent().addClass('solved');
							$('.suffixes').eq(activeIndex).addClass('suffixDone').css('text-decoration','none').text( prependedSentences[activeIndex].join('') );
							progTransit(prependedSentences.length);	
						
							
							$this.parent().children().each(function (counter) {	
								$(this).delay(counter * 70).transition({opacity: 0},200);
		
							}).promise().done(function () {

									$(this).parent().html( "<p class='solvedToString'>" + prependedSentences[activeIndex].join('') + "</p>" + "<img class='solvedImg' src='css/cssImg/checkButton.png'/>").css({opacity: 0, y: 150}).transition({opacity: 1, y: 0}, 500, 'easeOutQuad');
									if (frame.find('.solved').size() == prependedSentences.length ) {
										finalFeedback();
									}
							
							});
											
						}; 
					});
				}
				else {
					return false;
				};
			});

		};
	};
	finalFeedback = function () {
			$checkButton.remove();
			var items = frame.find('.lis').size();
			var thisIndex = frame.find('.active').index();
			var solved = frame.find('.solved').size();
			sly.off('active');
			
			appendSly = function () {
				var myHtml = "<p id='feedback'>You finished: " + solved + "<br>" + "Your score is: " + Math.round((100/items) * solved) + " out of 100" + "</p>" ;
				sly.add("<li class='lis finalFeedback'><div class='jMyPuzzle'><div class='ulBorder'><ul class='splitList'></ul></div></div></li>");
				frame.find('li').last().find('.splitList').append(myHtml);
				setTimeout(function(){
					sly.nextPage();
					sly.off('moveEnd');
					sly.on('moveEnd', function () { 
						sly.set('speed', 400);
						//$('.textLis').css({opacity:1});
						$('#textBox').find('.suffixes').css('outline', 0);
						sly.on('active', function () { 
							var thisIndex = this.rel.activeItem;
							var suffixParent = $textBoxSuffixes.eq(thisIndex).parent().parent().index();
							if (slyText.rel.activeItem != suffixParent && frame.find('.slidee').find('.lis').eq(thisIndex).hasClass('finalFeedback') != true) { 
									
									slyText.activatePage( suffixParent );
									
							};
								
							$textBoxSuffixes.css({outline: 0});
							$textBoxSuffixes.eq(thisIndex).css({outline: '2px solid black'});
												
						})
					});
			
				},300);		
			};
			
			sly.set('speed', 1500);
			
			if (items == thisIndex + 1) {
				appendSly();
				//slyText.toEnd();						
			
			}
			else {
				sly.on('moveEnd', function () {
					appendSly();
				});	
				sly.toEnd();
				//slyText.toEnd();
			};
			
			
		
			
	};
	arraysEqual = function(arr1, arr2) {			//are the original and the mixed array equal
				if(arr1.length !== arr2.length)
					return false;
				for(var i = arr1.length; i--;) {
					if(arr1[i] !== arr2[i])
						return false;
				}

				return true;
	}			
	

		
	removedLi = 0;
	var myHtmlLis = '';
	$.each(answers, function (ind,e) {
		var arr = e.split("");
		//console.log(arr);
		
		$.each(arr, function(index, value) {
				if (arr[index] == ' ') {
				arr[index] = ' ' 
				//console.log( arr[index] );
				}
		}); 
		
		prependedSentences.push(arr.slice(0));	
		var mixed;
		if (difficulty.setting != 2) {
			var newArr = arr.slice(0);
			var arrFirst = newArr.shift();
		
			mixed = shuffle(  newArr.slice(0) );
			while ( arraysEqual(newArr, mixed)  == true ) { 
				mixed = shuffle(mixed);
				}						
			
			mixed.unshift(arrFirst);	
			
		}
		else {
			mixed = shuffle(  arr.slice(0) );
			while ( arraysEqual(arr, mixed)  == true ) { 
				mixed = shuffle(mixed); 
				}
		};
		

		var myHtml = "";
		
		for (var i=0;i<mixed.length;i++) { 
			if (mixed[i] == ' ') { myHtml += "<li class='whiteSpace'>" + '_' + "</li>";  }
			else { myHtml += "<li>" + mixed[i] + "</li>"; } 
			
		}
		myHtmlLis += "<li class='lis'><div class='jMyPuzzle' id='jMyPuzzleId" + ind  + "'><ul class='splitList'>" + myHtml + "</ul></div></li>"
		
		/*   var newMarkup = $('#textBox').html().replace(/\.\.\./, "<span class='suffixes' id='suf" + index + "'>"  + mixed.join('') + "</span>")
		$('#textBox').html(newMarkup);  */
	

		
	});
	$('.slidee').append(myHtmlLis);
			

	var $textBoxSuffixes = textBox.find('.suffixes');
	var frame = $('#frame');
	var items = frame.find('ul > li');

	var sly = new Sly(frame, {
		horizontal: 1,
		itemNav: 'forceCentered',
		scrollBy: 1,
		speed: 400,
		startAt: 0,
		activateMiddle: 1,
		touchDragging: 1,
		interactive: '.splitList li',
		releaseSwing:  1,
		elasticBounds: 1,
		easing: 'easeInOutCirc', 
		dynamicHandle: 1,
		clickBar: 1,
		dragSource:	$('#frame'),
		//cycleBy:       'pages', // Enable automatic cycling by 'items' or 'pages'.
		//	cycleInterval: 1600, // Delay between cycles in milliseconds.
		//	pauseOnHover:  0,    // Pause cycling when mouse hovers over the FRAME.
		//	startPaused:   1, 
		pagesBar: $('.pages'),
		activatePageOn: 'click',
		keyboardNavBy: 'pages'
		},{
		load: function () {
				// when sly is loaded it performs the same
				// as with every moveEnd callback
				var thisIndex = this.rel.activeItem;
				var suffixParent = $textBoxSuffixes.eq(thisIndex).parent().parent().index();	
				if (slyText.rel.activeItem != suffixParent ) { 

						slyText.activatePage( suffixParent );
				};
				
				//textBox.find('.suffixDone').css('outline', 0);
				//$textBoxSuffixes.not('.suffixDone').css({textDecoration: 'line-through', outline: 0});
				$textBoxSuffixes.eq(thisIndex).css({outline: '2px solid black'});
			
		},
		active : function () {

				var thisIndex = this.rel.activeItem;
				var suffixParent = $textBoxSuffixes.eq(thisIndex).parent().parent().index();
				//$('#frame').find('.active').find('.splitList').find('li').not('.locked').css('opacity','1').draggable('enable');
				
				if (slyText.rel.activeItem != suffixParent ) { 
						
						slyText.activatePage( suffixParent );
						
				};
				
				
				$textBoxSuffixes.css({outline: 0});
				
					$textBoxSuffixes.eq(thisIndex).css({outline: '2px solid black'});
			

				if ( !$('.active').find('.splitList').hasClass('solved') ) {
					$checkButton.css('text-decoration','none');
					answerSwitch = 0;
				}
				else {
					$checkButton.css('text-decoration','line-through');
					
				}

				

		},
		change: function () {
				autoValidate();	
			
				$('#prevButton')[this.pos.start === this.pos.dest ? 'addClass' : 'removeClass']('ButtonDisabled');
				// Check whether Sly is at the end
				$('#nextButton')[this.pos.end === this.pos.dest ? 'addClass' : 'removeClass']('ButtonDisabled');

				// Check whether the first item is active
				   $('#prevButton')[this.rel.activeItem === 0 ? 'addClass' : 'removeClass']('ButtonDisabled');
				// Check whether the last item is active
				$('#nextButton')[this.rel.activeItem === this.items.length - 1 ? 'addClass' : 'removeClass']('ButtonDisabled');

			
		}		
	}).init();
		


	difficulty.wrongPunishLimit = (answerArr.length * difficulty.multiply );
		
	

	
	frame.find(".jMyPuzzle").jumbleScramble({	
		autoValidate: autoValidate,
		layoutComplete: function () {
				
				
				
				frame.find(".jMyPuzzle").eq(0).jumbleScramble('add', 'qwe', 1) 
				
				
				
				//frame.find(".splitList").eq(0).jumbleScramble('remove')
				
		}
	});	
	
	
	if ( difficulty.setting != 2 ) { 				
		frame.find(".jMyPuzzle").each(function () {				
			$(this).find('li').first().css('opacity','0.5').addClass('locked'); 			
		});					
	};
			

	frame.find(".lis:first-child").find('li').each(function(index2) {
		$(this).css({opacity: 1});

	}).promise().done(function () {
		$('#quoteText,#progressbar,#checkButton,#wrongCount,.textSlidee').delay(300).transition({opacity: 1}, 600);

		if (difficulty.setting != 2 ) {
			frame.find(".lis:first-child").find('li').first().transition({opacity : '0.5'}, 500);		
		}

	});
				
	 
				
	$('#initButtonContainer').transition({opacity: 0}, 1300,function () {
		$(this).remove();
	})	

	$('#prevButton').addClass('ButtonDisabled');			

	$('#prevButton').on('tapclick', function (e) {
		e.preventDefault();
		sly.prevPage();
	}); 	
	  
	$('#nextButton').on('tapclick', function (e) {
		e.preventDefault();
		sly.nextPage();
	}); 

				
	/* frame.find('.jMyPuzzle').on('touchstart touchend','li', function(e) {
		e.preventDefault();
	}, false);  */

	function setWrongCounter() {
		$('#wrongCount').text('Tries left: ' + (difficulty.wrongPunishLimit - wrongPunish))
	}
	setWrongCounter()


	var answerSwitch = 0;
				
	$('#checkButton').on('tapclick',function (e) {											// check function
		$(this).css('text-decoration','line-through');
		e.preventDefault();
		
		
		if (answerSwitch == 1 || $('.active').find('.splitList').hasClass('solved')) { 
			return; 
		}

		var activeIndex = frame.find('.active').index();
		var sent = prependedSentences[activeIndex].join(' ').toLowerCase();
		var uniqueNames = prependedSentences[activeIndex];
		
	/* 	console.log( 'sent:  '  + sent ) */
		
		var lis = frame.find('.active').find('.splitList').find('li');

		answerSwitch = 1;
		
		var i = 0;
		
		var preValidIndex = 0;
		var	blaLength = 0;
		removedLi = 0;
		var correctNumber = 0;
		
			// helper function for orange coloring
			myArray = []
					
			lis.each(function (myIndex, myElem) {
				var thisLi = lis.eq(myIndex).text().toLowerCase()
				
				if (thisLi == '_') { thisLi = ' '}
				myArray.push(thisLi)				
			
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

			lis.each(function(index2, elem) { //beginning of lis each function
				
				
				var $this = $(this); 
				var $thisText = $this.text().toLowerCase();
				if ($thisText == '_') { $thisText = ' '}
				
				
				
					
				if ($thisText.toLowerCase() == uniqueNames[i].toLowerCase()) {
					correctNumber++;

						var options = {
							color : "#006400",
							y: '+=10' 
						}
				
					$this.delay(index2 * iteDelay)
					.animate(options,animSpeed)
					.animate({y: '-=10'},animSpeed);
				
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
					.animate(options,animSpeed)
					.animate({y: '-=10'},animSpeed);
					 
				}
				else {

					var options = {
						color : "#A80000",
						y: '+=10' 
					}
				
					$this.delay(index2 * iteDelay)
					.animate(options,animSpeed)
					.animate({y: '-=10'},animSpeed);
					
				}
			
			}
			i++;
			
			if (correctNumber == uniqueNames.length) {
				$this.parent().addClass('solved');
			}
			
		}).promise().done(function () {
			answerSwitch = 0;
			
			$this = $(this);
			
			wrongPunish++;
			setWrongCounter();
			
			if (correctNumber == uniqueNames.length) {
				
				
		
				$textBoxSuffixes.eq(activeIndex).text( prependedSentences[activeIndex].join('') ).addClass('suffixDone');
				progTransit(prependedSentences.length);
				
				$this.parent().children().each(function (counter) {
						$(this).delay(counter * 50 + 200).transition({opacity: 0},200);
				}).promise().done(function () {
						$(this).parent().html( "<p class='solvedToString'>" + prependedSentences[activeIndex].join('') + "</p>" + "<img class='solvedImg' src='css/cssImg/checkButton.png'/>").css({opacity: 0, y: 200}).transition({opacity: 1, y: 0}, 500, 'easeOutQuad');	
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
				$('#checkButton').css('text-decoration','line-through');
				finalFeedback();
			}
			
		});
		
	});
} // initAll end
				
}); // document ready end
	
	
