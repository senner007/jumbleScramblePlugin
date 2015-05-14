(function ( $ ) {                 			    // Compliant with jquery.noConflict()
	
	var transSupport = (function()  {
		var b = document.body || document.documentElement,
			s = b.style,
			p = 'transition';
		if (typeof s[p] == 'string') { return true; }
		// Tests for vendor specific prop
		var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
		p = p.charAt(0).toUpperCase() + p.substr(1);
		for (var i=0; i<v.length; i++) {
			if (typeof s[v[i] + p] == 'string') { return true; }
		}
		return false;
	})();

	
	
	var ifGpu = transSupport ? 'translate3d(0px,0px,0px) translateZ(0)' : 'translate(0px,0px)';
	var testElement = document.createElement('div');
    var transitionPrefix = "webkitTransition" in testElement.style ? "webkitTransition" : "transition";
    var transformPrefix = "webkitTransform" in testElement.style ? "webkitTransform" : "-ms-transform" in testElement.style && transSupport == false ? "-ms-transform" : "transform";  //if ie9

	$.fn.transToZero = function () {
		var elt = this[0];
	
		window.getComputedStyle(elt)[transformPrefix]	// needed to apply the transition style dynamically 
	
		elt.style[transitionPrefix] = '250ms ease';	
						
		elt.style[transformPrefix] =  ifGpu// translateZ doesn't work for ie9	
		
	};
	
	function addToObject(thisElts, elt, n, $thisHeight, $thisWidth, o, thisContainer, adjCon) {
			
		
			thisElts[n] = elt;
			thisElts[n].completeWidth = $thisWidth || 0;								// its size (with the margin)
			thisElts[n].completeHeight = $thisHeight || 0;							// its height (with the margin)
			thisElts[n].pos = getOffset(elt);												// its position (left and top position)
			o.isVertical == true  ? thisElts[n].pos.left = 0: thisElts[n].pos.left = thisElts[n].pos.left;
			thisElts[n].initialN = n;														// its initial position (as per the other elements)
			thisElts[n].n = n;																// its current position (as per the other elements)
			thisElts[n].o = o;																// its current position (as per the other elements)
			thisElts[n].moved = false;			
			thisElts[n].belongsTo = thisContainer;
			thisElts[n].movesTo = adjCon;
			thisElts[n].currentPos = {};	

	};


	function setChars (elt) {
		var left=0;	
		$.each(instanceArr[elt.belongsTo].elts, function (i,e) {	
			var v = this.text();
			if ( this.hasClass('lower') ) {
					// v = v.replace( v.charAt(0), v.charAt(0).toLowerCase()); 
					 this.text( v.replace( v.charAt(0), v.charAt(0).toLowerCase() ) );
				};
			if (i == 0) {
					//v = v.replace( v.charAt(0), v.charAt(0).toUpperCase() );
				this.text(v.replace( v.charAt(0), v.charAt(0).toUpperCase() ) );							
			};
			this.animate({left: left + 'px',top : 0}, 100);
			left += this.outerWidth(true);	
		});								
	};
	
	var crossTrigger = false;

	function onDrag(elt, elts, o){													// Drag
		
		var ui = {};	
		ui.top = elt.currentPos.top;											// Redundancy - FIX ME
		ui.left = elt.currentPos.left;
			
		var thisElt = this;															//must be saved to a variable to avoid random 
																					// occurrences of non moving objects on ipad
		var oldPos = (thisElt.eltPos != null ? thisElt.eltPos : ui); 			//find the old position stored on the $object
		thisElt.eltPos = ui;													//its current position derived from $draggable object		
		
		
		if (instanceArr.length > 1 && o.isVertical) {			
			var adjConElts = instanceArr[elt.movesTo].elts;
			var adjacentDir = instanceArr[elt.movesTo].divOffset.left -  instanceArr[elt.belongsTo].divOffset.left;	
			var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.left > adjacentDir/2 : thisElt.eltPos.left < adjacentDir/2);  				
		}
		if (instanceArr.length > 1 && !o.isVertical) {			
			var adjConElts = instanceArr[elt.movesTo].elts;
			var adjacentDir = instanceArr[elt.movesTo].divOffset.top -  instanceArr[elt.belongsTo].divOffset.top;	
			var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.top > adjacentDir/2 : thisElt.eltPos.top < adjacentDir/2);  				
		}
		
		
		
		/*--------------------------------------------------------------------*/	
		if (dirSwitch && crossTrigger == false /* && adjConElts[adjConElts.length -1].pos.top + adjConElts[adjConElts.length -1].completeHeight <= instanceArr[elt.movesTo].dropLimit */) {   // trigger animations for 
																																														// adjacent container if below 
																																														// dropLimit
			onDragAdj.triggerOn(elt, adjConElts, elts, o); 
			crossTrigger = true;
		}; 							
		if (!dirSwitch && crossTrigger == true && Object.keys(elts).length > 1) { 											// go back to originating container
			onDragAdj.triggerOff(elt, adjConElts, elts, o);
			crossTrigger = false;			
		};		
		
		/*--------------------------------------------------------------------*/	
		if(!o.isVertical && thisElt.eltPos.left != oldPos.left) { 															// check whether the move is 	
			move = (thisElt.eltPos.left > oldPos.left ? 'forward' : 'backward');										    // forward, backward, up or down
		}				
		else if (o.isVertical && thisElt.eltPos.top != oldPos.top) { 														
			move = (thisElt.eltPos.top > oldPos.top ? "down" : "up");	
		}						
		else {	return;	}																									// doing nothing

		/*--------------------------------------------------------------------*/	
		if (move == 'forward'){																    //  move forward
			if (crossTrigger) {																					
				onDragAdj.moveForward(elt, adjConElts);	
			} 
			else {
				onDragElts.eltsMoveForward(elt, elts)
			}
				
		}
		if (move == "backward"){																//  move backward
			if (crossTrigger) {																					
				onDragAdj.moveBack(elt, adjConElts);	
			}
			else {
				onDragElts.eltsMoveBack(elt, elts)
				onDragElts.eltsMoveBack(elt, elts)
				onDragElts.eltsMoveBack(elt, elts)
			}
		} 
		if (move == 'up'){																		//  move up	
			if (crossTrigger) {																					
				onDragAdj.moveUp(elt, adjConElts);	
			}   
			else {							
				onDragElts.eltsMoveUp(elt, elts)				
			}
		}	
		if (move == 'down'){ 																	//  move down	
		    if (crossTrigger) {																				
					onDragAdj.moveDown(elt, adjConElts);			
			}   
			else {
				onDragElts.eltsMoveDown(elt, elts)
			}
		}
		
	};
	
	
	var onDragElts = {
		eltsMoveUp : function (elt, elts, flag) {				// flag disregards elt position check 
			if(elt.n > 0){
				var eltPrev = elts[elt.n - 1];					 
				var eltPrevBound = eltPrev.pos.top + eltPrev.completeHeight / 2;
				if(elt.currentPos.top < eltPrevBound || flag){	
					if (eltPrev.hasClass('locked') ){ return; } 
					elt.insertBefore(eltPrev);							
					elt.pos.top = eltPrev.pos.top;
					eltPrev.pos.top += elt.completeHeight;			
					elts[elt.n] = eltPrev;
					elts[elt.n - 1] = elt;																						
					elts[elt.n].n = elt.n; 
					elt.n = elt.n - 1; 

					this.eltsAnimate(-(elt.completeHeight), eltPrev)	
				}
			}
		},
		eltsMoveDown : function(elt, elts, flag) {				
			if(elt.n < elts.length-1){
				var eltNext = elts[elt.n + 1];					
				var eltNextBound = eltNext.pos.top + eltNext.completeHeight / 2;
				if(elt.currentPos.top + elt.completeHeight > eltNextBound || flag){
					if (eltNext.hasClass('locked') ){ return; } 
					elt.insertAfter(eltNext);
					eltNext.pos.top = elt.pos.top;
					elt.pos.top += eltNext.completeHeight;																					
					elts[elt.n] = eltNext;
					elts[elt.n + 1] = elt;																
					elts[elt.n].n = elt.n; 
					elt.n = elt.n + 1; 
					
					this.eltsAnimate(elt.completeHeight, eltNext)					
				}
			}
		},
		eltsMoveBack : function(elt, elts) {
			if(elt.n > 0){
				var eltPrev = elts[elt.n - 1];			
				var eltPrevBound = eltPrev.pos.left + eltPrev.completeWidth / 2;				
				if(elt.currentPos.left < eltPrevBound){	
									
					if (eltPrev.hasClass('locked') ){ return; } 
					elt.insertBefore(eltPrev);						
					elt.pos.left = eltPrev.pos.left;
					eltPrev.pos.left += elt.completeWidth;
					elts[elt.n] = eltPrev;
					elts[elt.n - 1] = elt;										
					elts[elt.n].n = elt.n; 
					elt.n = elt.n - 1;

					this.eltsAnimate(-(elt.completeWidth), eltPrev)		
				}
			}
		},
		eltsMoveForward : function(elt, elts, flag) {
			if(elt.n < elts.length-1){
				var eltNext = elts[elt.n + 1];
				var eltNextBound = eltNext.pos.left + eltNext.completeWidth / 2;
				if(elt.currentPos.left + elt.completeWidth > eltNextBound || flag){						
					if (eltNext.hasClass('locked') ){ return; }  								// don't move beyond green colored items for difficulty setting 0
					elt.insertAfter(eltNext);
					eltNext.pos.left = elt.pos.left;
					elt.pos.left += eltNext.completeWidth;										//invert datas in the correspondence array
					elts[elt.n] = eltNext;
					elts[elt.n + 1] = elt;														//update the n of the elements
					elts[elt.n].n = elt.n; 
					elt.n = elt.n + 1;

					this.eltsAnimate(elt.completeWidth, eltNext)
				}
			}
		},
		eltsAnimate : function (eltDimension, elem) {
				var dir = elem.o.isVertical ? 'top' : 'left';
				//var dirTranslate = elem.o.isVertical ? 'translateY(' : 'translateX(';
				
				elem[0].style[transitionPrefix] = '0s';
				elem[0].style[dir] = elem.pos[dir] + 'px';
				elem[0].style[transformPrefix] = elem.o.isVertical ? 'translate3d(0px,' + eltDimension  + 'px, 0px)': 'translate3d(' + eltDimension  + 'px, 0px, 0px)'
				elem.transToZero();
		}
	}
	

	
	var onDragAdj = {
		
		triggerOn : function (elt, adjConElts, elts, o) {
			var tempArr = [];
			var objOffset = o.isVertical ? 'top' : 'left';
			var objDimension = o.isVertical ? 'completeHeight' : 'completeWidth';
			var objTranslate = o.isVertical ? 'translate3d(0px,' + elt[objDimension] + 'px,0px)' : 'translate3d(' + elt[objDimension] + 'px,0px,0px)'
			for(var i = 0; i < adjConElts.length; i++){ 							//Loop the array
				var obj = adjConElts[i]
				
				if (elt.currentPos[objOffset]  < obj.pos[objOffset] + obj[objDimension]/2) {
						
					if (obj.moved == false) {
						tempArr.push(i)
						obj[0].style[transitionPrefix] = '250ms ease';
						obj[0].style[transformPrefix] = objTranslate						
						obj.moved = true;
						elt.insertPos = obj.n;
						obj.pos[objOffset] = obj.pos[objOffset] + elt[objDimension];
							
					};
				};
			};
			elt.insertPos = tempArr[0] >= 0 ? tempArr[0] : adjConElts.length;
																								// reorder the elements in the originating container 
			 for (var i=elt.n + 1;i<elts.length;i++) {
				o.isVertical ? onDragElts.eltsMoveDown(elt, elts, true) : onDragElts.eltsMoveForward(elt, elts, true);							// third argument is a flag to override pos check in eltsMoveDown function 
			};
		
		},
		triggerOff : function (elt, adjConElts, elts, o) {									// going back to the originating container
			console.log('hello back')
			var objOffset = o.isVertical ? 'top' : 'left';
			var objDimension = o.isVertical ? 'completeHeight' : 'completeWidth';	
			for(var i = 0; i < adjConElts.length; i++){ 						//Loop over adjacentContainer elements
				var obj = adjConElts[i];
				
				if (obj.moved == true) {
					obj.moved = false;
					obj.pos[objOffset] = obj.pos[objOffset] - elt[objDimension];
					obj.transToZero();
				}
			}
		
				for (var i=0;i<elts.length-1;i++) {									// Loop over originating Container elements 	
					o.isVertical ? onDragElts.eltsMoveUp(elt, elts) : onDragElts.eltsMoveBack(elt, elts);	
				}
		
			
		},
		moveUp : function (elt, adjConElts) {
			if (elt.insertPos > 0) {				
				var obj = adjConElts[elt.insertPos -1]
				if (elt.currentPos.top  < obj.pos.top + obj.completeHeight/2 && obj.moved == false) {					
					obj[0].style[transitionPrefix] = '250ms ease';
					obj[0].style[transformPrefix] = 'translateY(' + elt.completeHeight + 'px)';	
					obj.moved = true;
					elt.insertPos = obj.n;
					obj.pos.top = obj.pos.top + elt.completeHeight;
				};
			};				
		},
		moveDown : function (elt, adjConElts) {
			if (elt.insertPos < adjConElts.length) {
				var obj = adjConElts[elt.insertPos]
				if (elt.currentPos.top  + elt.completeHeight > obj.pos.top + obj.completeHeight/2 && obj.moved == true) {
					obj.transToZero();
					obj.moved = false;
					elt.insertPos = obj.n +1;
					obj.pos.top = obj.pos.top - elt.completeHeight;		
				}
			};			
		},
		moveForward : function (elt, adjConElts) {
			if (elt.insertPos < adjConElts.length) {
				var obj = adjConElts[elt.insertPos]
				if (elt.currentPos.left  + elt.completeWidth > obj.pos.left + obj.completeWidth/2 && obj.moved == true) {
					obj.transToZero();
					obj.moved = false;
					elt.insertPos = obj.n +1;
					obj.pos.left = obj.pos.left - elt.completeWidth;		
				}
			};			
		},
		moveBack : function (elt, adjConElts) {
			
			if (elt.insertPos > 0) {
				var obj = adjConElts[elt.insertPos -1]
				
				if (elt.currentPos.left  < obj.pos.left + obj.completeWidth/2 && obj.moved == false) {
				
					obj[0].style[transitionPrefix] = '250ms ease';
					obj[0].style[transformPrefix] = 'translate3d(' + elt.completeWidth + 'px,0px,0px)';	
					obj.moved = true;
					elt.insertPos = obj.n;
					obj.pos.left = obj.pos.left + elt.completeWidth;		
				}
			};			
		}
		
	};

	
	function onStop(evt, elt, div, o)	{									// Stop
			
		animateBack(elt, o);
		
		elt.transToZero();	
		
		if (o.setChars)	{setChars(elt);	}	// setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2																
		
		transSupport ? elt.one('transitionend', function () { appendRemove() }) : appendRemove() // only wait for transitionend if supported (not ie9)

		function appendRemove () {
			
			if (!!o.autoValidate) {
				o.autoValidate();	 						// calls the autovalidate function in the plugin calling script						
			}
			if (crossTrigger) {
	
				instanceArr[elt.belongsTo].removeLiElem(elt, false) 
				instanceArr[elt.movesTo].addLiElem(elt.text(), elt.insertPos, false);
				crossTrigger = false;
				
				instanceArr[elt.movesTo].cutOffEnd()
				
					
			}  
		}; 
			
	
		
	};
	
	function animateBack (elt, o) {				
		
		if (crossTrigger) {			
			var instMovesTo = instanceArr[elt.movesTo];
			var adjEltBefore = instMovesTo.elts[elt.insertPos -1];	
			if (o.isVertical) {
				
				var adjacentDir = instMovesTo.divOffset.left - instanceArr[elt.belongsTo].divOffset.left;
				
				var animateToPos = elt.insertPos > 0 ? adjEltBefore.pos.top + adjEltBefore.completeHeight: 0;
				
				var thisLeft = adjacentDir, 
					thisTop = animateToPos, 
					thisX = elt.currentPos.left - adjacentDir, 
					thisY = elt.currentPos.top - animateToPos;
			}
			else {
				
				var animateToPos = elt.insertPos > 0 ? adjEltBefore.pos.left + adjEltBefore.completeWidth : 0;
				
				var adjacentDir = instMovesTo.divOffset.top - instanceArr[elt.belongsTo].divOffset.top;
			
				var thisLeft = animateToPos,
					thisTop =  adjacentDir,
					thisX =  elt.currentPos.left - animateToPos,
					thisY = elt.currentPos.top - adjacentDir;	
			}		
		}
		else {	
			var thisLeft = elt.pos.left, thisTop = elt.pos.top, thisX = elt.currentPos.left - elt.pos.left, thisY = elt.currentPos.top - elt.pos.top;
		}
		
		elt[0].style.left = thisLeft + 'px'
		elt[0].style.top = thisTop + 'px'
		elt[0].style[transformPrefix] = 'translate3d(' + thisX  + 'px,' +  thisY + 'px,0px)';
	}
	
	function getOffset(elt){												
		return {left : parseInt(elt.css('left')), top : elt.css('top') == 'auto' ? 0 : parseInt(elt.css('top'))};
	};
	
	var defaults = {
		isVertical: false,
		setChars: false,
		cutOff: false,
		dropLimit: false,
		layoutComplete: function () {}
		}
	
	var conCount = 0;
	function JumbleScramble(element, options) {					// Constructor function 
	
		this.div = $(element);
		this.divOffset = this.div.offset();
		this.ul = this.div.find('ul');
		this.container = conCount;		
		this.adjCon = this.container % 2 == 0 ? this.container +1 : this.container -1;
		this.options = $.extend( {}, defaults, options) ;
		this.init();
		this.cutOff = this.options.cutOff[conCount];
		this.dropLimit = this.options.dropLimit[conCount];
		this.ul[0].style[transformPrefix] = 'translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)';		
		
		
		conCount++;
		
	};	
	JumbleScramble.prototype.cutOffEnd = function () {
		var oCutOff = this.cutOff;
		
		var eltsHeight = 0;
		for (var i=0;i<this.elts.length;i++) {
				eltsHeight += this.elts[i].completeHeight;
			
		}
		while (eltsHeight > oCutOff) {
			 
			instanceArr[this.adjCon].addLiElem( this.elts[this.elts.length -1].text(), 0 , true)
			this.removeLiElem( this.elts[this.elts.length -1] , true)
			eltsHeight -=  this.elts[this.elts.length -1].completeHeight;
			
		}
	
	};

	JumbleScramble.prototype.removeLiElem = function () {							// Remove new li to previous collection
		
			var o = this.options;
			var elt = arguments[0];
			var removeTrans = arguments[1]
			
			
			var n = elt.index();
			var thisElts = this.elts;
			var tempArr = [];
			var eltHeight = thisElts[n].completeHeight;
			var eltWidth = thisElts[n].completeWidth;
			
			for (var i=0;i<thisElts.length;i++) { 
				if (i > n) {	
					thisElts[i][0].style[transitionPrefix] = removeTrans ? '250ms' : '0s';
					thisElts[i -1] = thisElts[i] 
					thisElts[i].n = i-1;
					thisElts[i][0].style.top  = parseInt(thisElts[i][0].style.top) - eltHeight + 'px'
					thisElts[i][0].style.left  = parseInt(thisElts[i][0].style.left) - eltWidth + 'px'
					thisElts[i][0].style[transformPrefix] =  'translate(0px,0px,0px)';
					thisElts[i].pos.top = thisElts[i].pos.top  - eltHeight
					thisElts[i].pos.left = thisElts[i].pos.left - eltWidth
				}
			};
			thisElts.length = thisElts.length -1
			
			
			if (removeTrans) { 
				elt[0].style[transformPrefix] = 'scale(0.5,0.5)'; 
				elt[0].style.opacity = '0'; 
				elt[0].style[transitionPrefix] = '250ms'; 
				setTimeout(function(){ 
					elt.remove()
				}, 250);
			}
			else {elt.remove()}
				
			
			this.ul.css({
				'width' : '-=' + eltWidth + 'px',
				'height' :'-=' + eltHeight + 'px'
				
			})
					
	};	
	
	
	JumbleScramble.prototype.addLiElem = function (liText, liPosition, addTrans) {								// Add new li to previous collection
			
		 	var div = this.div; 
			var ul = this.ul; 
			var thisElts = this.elts;
			var n = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length);
			var o = this.options;
			var listClass = o.isVertical ? 'listItem' : 'listItem-horizontal';
			var elt = $('<li class=' + listClass +'>' + liText + '</li>');
			if (addTrans) { elt[0].style[transformPrefix] = 'scale(0,0)'; elt[0].style.opacity = '0'; }
		
			var thisContainer = this.container;
			var adjCon = this.adjCon;
			var tempArr = [];
			
				
			for (var i=n;i<thisElts.length;i++) { 	
				tempArr.push(thisElts[i]);				
			}
			
			var eltObj = {
				'left': n > 0 ? thisElts[n -1].pos.left + thisElts[n -1].completeWidth + 'px' : 0, 
				'top' : n > 0 ? thisElts[n -1].pos.top + thisElts[n -1].completeHeight + 'px' : 0
			}
			
			if (thisElts.length == 0) {elt.css(eltObj).appendTo(ul)} 							// if there are no elements present at drop
			else (n > 0 ? elt.insertAfter( thisElts[n-1]).css(eltObj) : elt.insertBefore( thisElts[n]).css(eltObj) );
			

			var $thisWidth = o.isVertical ? 0: elt.outerWidth(true);
			var $thisHeight = o.isVertical ? elt.outerHeight(true) : 0;
		

			for (var i=n;i<thisElts.length;i++) { 
				thisElts[i].moved = false;
				thisElts[i][0].style[transitionPrefix] = '0ms';					
				thisElts[i][0].style[transformPrefix] = 'translate3d(0px,0px,0px)';		
				
				thisElts[i][0].style.left = parseInt(thisElts[i][0].style.left) + $thisWidth + 'px'
				thisElts[i][0].style.top = parseInt(thisElts[i][0].style.top) + $thisHeight + 'px' 
				
				if (addTrans) {
					thisElts[i][0].style[transformPrefix] = 'translate(' + -($thisWidth)  + 'px,' +  -($thisHeight) + 'px)';	
					thisElts[i].transToZero(); 
				}	
			}
			
				
			ul.css({
				'width' : '+=' + $thisWidth + 'px',
				'height' :'+=' + $thisHeight + 'px'
				
			})
					
			addToObject(thisElts, elt, n, $thisHeight, $thisWidth, o, thisContainer, adjCon);
			
			
			for (var i=0;i<tempArr.length;i++) { 
				tempArr[i].pos.left = tempArr[i][0].offsetLeft;
				tempArr[i].pos.top =  tempArr[i][0].offsetTop;							
				tempArr[i].n = n + i+1;
				thisElts[n + 1 + i] = tempArr[i];			
			}
			if (addTrans) {  elt[0].style[transitionPrefix] = '500ms';	elt[0].style[transformPrefix] = 'scale(1,1)'; elt[0].style.opacity = '1'; };				
		
			console.log(instanceArr)
	}

	
		
	
	JumbleScramble.prototype.init = function () {
		
		var o = this.options; 
		var div = this.div,  li = div.find('li');					// Variables declaration
		var left=0, top = 0, n = 0, ulSize = 0;	
		var thisContainer = this.container;	
		var adjCon = this.adjCon;
		var thisElts = this.elts = new Array(li.size());
			
		for (var i=0;i<thisElts.length;i++) { 
			var elt = li.eq(i);	
			
			if (o.isVertical) {
				elt.css('top', top + 'px');											// get each li height in case of individual heights.
				var $thisHeight = elt.outerHeight(true);
				top += $thisHeight;	
				
				ulSize += $thisHeight;
			}
			else {
				elt.css('left', left + 'px');										// get each li width in case of individual widths. (default)
				var $thisWidth = elt.outerWidth(true);
				left += $thisWidth;
					
				ulSize += $thisWidth; 												// calculate the size of the ul element				
			}	
			
			addToObject(thisElts, elt, n, $thisHeight, $thisWidth, o, thisContainer, adjCon);			
						
			n = n+1;
			elt[0].style[transformPrefix] = 'translate3d(0px, 0px, 0px)';			
		}
		this.addHandlers();
		
		o.isVertical ? 	div.find('ul').css({height: ulSize }) : div.find('ul').css({width:ulSize, height: li.outerHeight(true) + 'px' }); 	// Update the ul size

	};

 	JumbleScramble.prototype.addHandlers = function () {
	
		var targetOffsetY; 
		var targetOffsetX;
		var $document = $('body');
		var div = this.div;
		var ul = this.ul;
		var adjCon = this.adjCon;
		var o = this.options;
		var thisElts = this.elts	
		var move;
		var movePos = {};
		var elt;
		var moveIsDragged = false;
		
	
		var liSelector = o.isVertical == true ? '.listItem' : '.listItem-horizontal'
	
	
		
		ul.on("mousedown touchstart",liSelector,function(me){
	
			move = $(this);
	
			move[0].style[transitionPrefix] = '0s';
			

			move[0].style.zIndex = 5;
			move.addClass('dragging');

			//  instanceArr[adjCon].div[0].style.zIndex = '1'
			ul[0].style.zIndex = '2'  					// this causes a tiny lag on drag in chrome ios
 
			if (me.type == 'touchstart') { me = me.originalEvent.touches[0] }
				var startX = me.pageX, startY = me.pageY;
			
			targetOffsetY  = me.target.offsetTop;
			targetOffsetX = me.target.offsetLeft;
			
			elt = thisElts[move.index()]
	
			
			$document.on("mousemove touchmove",function(e){
				e.preventDefault();
				
				moveIsDragged = true;
				if (e.type == 'touchmove') { e = e.originalEvent.changedTouches[0]}	
				var newDx = e.pageX - startX,
					newDy = e.pageY - startY;
			
				if (transSupport) {					
					move[0].style[transformPrefix] = 'translate3d(' + newDx + 'px, ' + newDy + 'px, 0px) translateZ(0)';				
				}
				else {
					move[0].style.top = targetOffsetY + movePos.dy + 'px'
					move[0].style.left = targetOffsetX + movePos.dx + 'px'
				}

				// we need to save last made offset
				movePos = {dx: newDx, dy: newDy };
							
			
				
				elt.currentPos.top = targetOffsetY + newDy;
				elt.currentPos.left = targetOffsetX + newDx;

				onDrag(elt, thisElts, o); 				
		
			});
			
			$document.on("mouseup touchend",function(e){
			
				move[0].style[transitionPrefix] = 'box-shadow 250ms';
				move[0].style.zIndex = 1;
				instanceArr[adjCon].ul[0].style.zIndex = '1'
				ul[0].style.zIndex = '1'
				move.removeClass('dragging');
				$document.off("mousemove touchmove mouseup touchend");
				if (moveIsDragged == false) { 	return;   }
				moveIsDragged = false;				
				if (transSupport) {
					move[0].style[transformPrefix] = 'translateZ(0) translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)';		
				}
				move[0].style.top = targetOffsetY + movePos.dy + 'px'
				move[0].style.left = targetOffsetX + movePos.dx + 'px'
				
	
				onStop(e, elt, div, o)
			});
		});
			
	}; 
	
	
	var instanceArr = [];	
	
	$.fn.jumbleScramble = function(options, arg1, arg2, arg3) { 							// jumbleScramble fn
			
		if (typeof options === 'string') {											// if a metod is called
			
			var self = this
			var thisId  =  ( options == 'remove' ? this.parent().parent() : this );
			
			$.each(instanceArr, function (i,e){
		
				if (this.div[0] == thisId[0]) {
			
				instanceArr[i][options + 'LiElem'](arg1 || self, arg2, arg3)  // self is for the remove method, arg2 is then undefined.
				}
			});	
			
		}
		else {
			return this.each(function (i,e) {										
				
				instanceArr.push(new JumbleScramble(this, options, arg1, arg2)) 	
			}).promise().done(function (){
				if (!!options.layoutComplete )options.layoutComplete(instanceArr);
					
			});			
		}
	
	};	

})(jQuery);
