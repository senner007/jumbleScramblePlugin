(function ( $ ) {                 			    // Compliant with jquery.noConflict()

	var transSupport = $.support.transition = (function(){			
		var thisBody = document.body || document.documentElement,
		thisStyle = thisBody.style,
		support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
		return support;
	})();
	
	function addToObject(eltsObject, divId, elt, n, $thisHeight, $thisWidth, o) {
			
			eltsObject[divId][n] = elt;
			eltsObject[divId][n].completeWidth = $thisWidth || 0;								// its size (with the margin)
			eltsObject[divId][n].completeHeight = $thisHeight || 0;							// its height (with the margin)
			eltsObject[divId][n].pos = getOffset(elt);												// its position (left and top position)
			eltsObject[divId][n].pos.left = 0;
			eltsObject[divId][n].initialN = n;														// its initial position (as per the other elements)
			eltsObject[divId][n].n = n;																// its current position (as per the other elements)
			eltsObject[divId][n].o = o;																// its current position (as per the other elements)
			eltsObject[divId][n].moved = false;	
	};
	
	function addHandlers(eltsObject, divId, elt, o, div) {
			var parentContainment = ( $('#frame').length ? $('#frame') : div );		// use '.#frame' if it exists
			if (o.isHorizontal ? axis = 'y' : axis = 'false')
			elt.draggable({															// make the element draggable
				iframeFix: true,
				addClasses: false,
				//axis: axis,
				containment: 'html',
				cancel: '.locked',
				drag: function(evt, ui){ onDrag(evt, ui, elt, eltsObject[divId], o);}, 			
				start: function(evt, ui){ onStart(elt, o); },								
				stop:function(evt, ui){ onStop(evt, ui, elt, div, o);}
			});
	
	};
	
	function setChars (div) {
		div.find('li').each(function (i,e) {	
			var $this = $(this);
			var v = $this.text();
			if ( $this.hasClass('lower') ) {
					// v = v.replace( v.charAt(0), v.charAt(0).toLowerCase()); 
					 $this.text( v.replace( v.charAt(0), v.charAt(0).toLowerCase() ) );
				};
			if (i == 0) {
					//v = v.replace( v.charAt(0), v.charAt(0).toUpperCase() );
				$this.text(v.replace( v.charAt(0), v.charAt(0).toUpperCase() ) );							
			};			
		});							
	};
	
	function onStart(elt, o) {																// Start			
		var	inAnim = ( o.isHorizontal && transSupport ? ({'box-shadow': '0px 2px 10px rgba(0,0,0,.7)'}) : ({'opacity': 0.4, 'z-index':200}) );				
		elt.css(inAnim);
	};
	
	function closest(arr, closestTo){

		var closest = Math.max.apply(null, arr); //Get the highest number in arr in case it match nothing.

		for(var i = 0; i < arr.length; i++){ //Loop the array
			if(arr[i] >= closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
		}
	
		return closest; // return the value
	}
	
	function closest2(arr, closestTo){

		var closest = Math.min.apply(null, arr); //Get the highest number in arr in case it match nothing.

		for(var i = 0; i < arr.length; i++){ //Loop the array
			if(arr[i] >= closestTo && arr[i] < closest) closest = arr[i]; //Check if it's higher than your number, but lower than your closest value
		}
	
		return closest; // return the value
	}
 	
	
	var nToAnimate
	var tempArr 
	
	var trigger = false;
	
	function onDrag(e, ui, elt, elts, o){													// Drag
		
		var thisElt = this;																//must be saved to a variable to avoid random 
																					//occurrences of non-moving elements in safari iPad.
		var oldPos = (thisElt.eltPos != null ? thisElt.eltPos : ui.position); 			//find the old position stored on the $object 
		thisElt.eltPos = ui.position;													//its current position derived from $draggable object		
	
		if (thisElt.eltPos.left > 400 && trigger == false) {
			console.log('hello')
			trigger = true;
		 	tempArr = [];
			
			for(var i = 0; i < eltsObject.jMyPuzzleId1.length; i++){ 						//Loop the array
			
					tempArr.push(Math.abs(eltsObject.jMyPuzzleId1[i].pos.top))
			
				
			}
			
			nToAnimate = tempArr.indexOf(closest(tempArr, thisElt.eltPos.top)); 

			 for(var ind = nToAnimate; ind < eltsObject.jMyPuzzleId1.length; ind++){ 						//Loop the array starting from the first element to be moved down
				var objectNumber = eltsObject.jMyPuzzleId1[ind];
				
				if (objectNumber.moved != true) {
					objectNumber.transition({y: '+=' + elt.completeHeight},200);
						objectNumber.moved = true;
						objectNumber.pos.top = objectNumber.pos.top + elt.completeHeight;
				}
					
				
			}	 	
					
				
		};
		if (thisElt.eltPos.left < 300 && trigger == true) {
			
			trigger = false;
			
			 for(var ind = 0; ind < eltsObject.jMyPuzzleId1.length; ind++){ 						//Loop the array starting from the first element to be moved down
				var objectNumber = eltsObject.jMyPuzzleId1[ind];
				
				if (objectNumber.moved == true) {
					objectNumber.transition({y: 0},200);
						objectNumber.moved = false;
						objectNumber.pos.top = objectNumber.pos.top - elt.completeHeight;
				}
					
				
			}
			
			
		}

		
	 	
		
				
		if(!o.isHorizontal && thisElt.eltPos.left != oldPos.left) { 
			move = (thisElt.eltPos.left > oldPos.left ? 'forward' : 'backward');		// check whether the move is forward or backward
			console.log('dsfdsfdfdf')
		} 
		else if (o.isHorizontal && thisElt.eltPos.top != oldPos.top) {	
			move = (thisElt.eltPos.top > oldPos.top ? "down" : "up");					// check whether the move is down or up													
		}
		else {
			return;																		// Not moving = doing nothing
		}

		if(move == 'forward'){					//  move forward
			if(elt.n < elts.length-1){
				var eltNext = elts[elt.n + 1];
				var eltNextBound = eltNext.pos.left + parseInt(eltNext.completeWidth / 2);
				if(thisElt.eltPos.left + elt.completeWidth > eltNextBound){
					if (eltNext.hasClass('locked') ){ return; }  						// don't move beyond green colored items for difficulty setting 0
					elt.insertAfter(eltNext);
					eltNext.pos.left = elt.pos.left;
					elt.pos.left += eltNext.completeWidth;												//invert datas in the correspondence array
					elts[elt.n] = eltNext;
					elts[elt.n + 1] = elt;																	//update the n of the elements
					elts[elt.n].n = elt.n; 
					elt.n = elt.n + 1;
					eltNext.transition({'left': eltNext.pos.left + 'px', x: '+=' + elt.completeWidth},0, function () {	
						$(this).transition({x: 0}, 250);						
					});
				}
			}
		}
		else if(move == "backward"){			//  move backward	
			if(elt.n > 0){
				var eltPrev = elts[elt.n - 1];
				var eltPrevBound = eltPrev.pos.left + parseInt(eltPrev.completeWidth / 2);				
				if(thisElt.eltPos.left < eltPrevBound){								
					if (eltPrev.hasClass('locked') ){ return; } 
					elt.insertBefore(eltPrev);						
					elt.pos.left = eltPrev.pos.left;
					eltPrev.pos.left += elt.completeWidth;
					elts[elt.n] = eltPrev;
					elts[elt.n - 1] = elt;																						// update the n of the elements
					elts[elt.n].n = elt.n; 
					elt.n = elt.n - 1;
					eltPrev.transition({'left': eltPrev.pos.left + 'px', x: '-=' + elt.completeWidth},0, function () {						
						$(this).transition({x: 0}, 250);							
					});								
				}
			}
		} 
		if(move == 'up'){						//  move up
	
			  if (trigger) {										// trigger  for animating adjacent container
				
				for(var i = 0; i < eltsObject.jMyPuzzleId1.length; i++){ 			//Loop the array
					var obj = eltsObject.jMyPuzzleId1[i]
					if (ui.position.top  < obj.pos.top + obj.completeHeight/2) {
							
						if (obj.moved == false) {
						
							obj.transition({y: '+=' + elt.completeHeight}, 250)
								obj.moved = true;
							obj.pos.top = obj.pos.top + elt.completeHeight;
						
						}
					}
				};
	
			}   
			else {
			
				if(elt.n > 0){
					var eltPrev = elts[elt.n - 1];					 
					var eltPrevBound = eltPrev.pos.top + parseInt(eltPrev.completeHeight / 2);
					if(thisElt.eltPos.top < eltPrevBound){	
						if (eltPrev.hasClass('locked') ){ return; } 
						elt.insertBefore(eltPrev);							
						elt.pos.top = eltPrev.pos.top;
						eltPrev.pos.top += elt.completeHeight;			
						elts[elt.n] = eltPrev;
						elts[elt.n - 1] = elt;																						
						elts[elt.n].n = elt.n; 
						elt.n = elt.n - 1; 
						eltPrev.transition({'top': eltPrev.pos.top + 'px', y: '-=' + elt.completeHeight},0, function () {	
							$(this).transition({y: 0}, 250);							
						});																	
					}
				}
			}
		}
		else if(move == 'down'){ 				//  move down
		
		    if (trigger) {										// trigger  for animating adjacent container
						
				for(var i = 0; i < eltsObject.jMyPuzzleId1.length; i++){ //Loop the array
					var obj = eltsObject.jMyPuzzleId1[i]
					if (ui.position.top  + elt.completeHeight > obj.pos.top + obj.completeHeight/2) {
							
						if (obj.moved == true) {
						
							obj.transition({y: 0}, 250)
								obj.moved = false;
							obj.pos.top = obj.pos.top - elt.completeHeight;
						
						}
					}
				};
				
			}   
			else {
					if(elt.n < elts.length-1){
						var eltNext = elts[elt.n + 1];					
						var eltNextBound = eltNext.pos.top + parseInt(eltNext.completeHeight / 2);
						if(thisElt.eltPos.top + elt.completeHeight > eltNextBound){
							if (eltNext.hasClass('locked') ){ return; } 
							elt.insertAfter(eltNext);
							eltNext.pos.top = elt.pos.top;
							elt.pos.top += eltNext.completeHeight;																					
							elts[elt.n] = eltNext;
							elts[elt.n + 1] = elt;																
							elts[elt.n].n = elt.n; 
							elt.n = elt.n + 1; 
							eltNext.transition({'top': eltNext.pos.top + 'px', y: '+=' + elt.completeHeight},0, function () {		
								$(this).transition({y: 0}, 250);						
							});
						}
					}
				}
			}
	};
	
	function onStop(evt, ui, elt, div, o)	{									// Stop
	
		var	outAnim = ( o.isHorizontal && transSupport ? ({x: 0, y: 0, 'box-shadow': 'none'}) : ({ x: 0, y: 0, 'opacity': 1.0, 'z-index':5 }) );

		if (o.setChars) {	 setChars(div);	}			// calls the setChars function	
		
		elt.transition({'left': elt.pos.left + 'px', top : elt.pos.top, x:  ui.position.left - elt.pos.left, y:  ui.position.top - elt.pos.top },0, function () {
		
		if (o.setChars)	{										// re-align lis after uppercase/lowercase for difficulty setting  2	
		
			outAnim = { x: 0, y: 0, 'opacity': 1.0, 'z-index':5 };
		
			$(this).transition(outAnim,270);
			
			var left=0;			
			div.find('li').each(function(ind, elem){ 	
				var $this = $(this)
				$this.transition({left: left + 'px',top : 0}, 100);
				left += $this.outerWidth(true);
			});
					
		}		
		else {  													// for difficulty setting 0
			
			$(this).transition(outAnim,240, function () {       // auto color lis when difficulty set to 0 - Senner
				if (!!o.autoValidate) {
					o.autoValidate();	 						// calls the autovalidate function in the plugin calling script
				}
			});
		}
		});
	};
	
	/*
	 * modified offset function to handle the local position
	 * @param elt: the jquery element
	 */
	function getOffset(elt){												
		return {left : parseInt(elt.css('left')), top : elt.css('top') == 'auto' ? 0 : parseInt(elt.css('top'))};
	};
	
	var defaults = {
		isHorizontal: false,
		setChars: false,
		layoutComplete: function () {}
	}
	
	var eltsObject = {};											// object used for storing and updating data on each ul array with lis
	
	function JumbleScramble(element, options, liText, liPosition) {					// Constructor function 
	
		this.element = element;
		this.options = options;
		if (typeof options === 'string') {
			this.liText = liText;
			this.liPosition = liPosition;
			this[options + 'LiElem']()
		}
		else {
			this.options = $.extend( {}, defaults, options) ;
			this.init();
		}		
	};																		
	
	
	JumbleScramble.prototype.addLiElem = function () {								// Add new li to previous collection
		
		 	var div = $(this.element), ul = $("ul", div), divId = div.attr('id'), n= Math.min(Math.max(parseInt(this.liPosition), 0), eltsObject[divId].length);
			o = eltsObject[divId][0].o;		
	
			var elt = $("<li class='listItem'>" + this.liText + "</li>");
			var allBeforeWidth = 0;
			var allBeforeHeight = 0;
			var allAfterWidth = 0;
			var tempArr = []
			for (var i=0;i<eltsObject[divId].length;i++) { 
				if (i < n ) {
					allBeforeWidth += eltsObject[divId][i].completeWidth;
					allBeforeHeight += eltsObject[divId][i].completeHeight;
				}	
				else {	tempArr.push(eltsObject[divId][i])	}
			}
			
			if (n > 0) {
				elt.insertAfter( eltsObject[divId][n-1]).css({
					'left': allBeforeWidth + 'px', 
					'top' : allBeforeHeight + 'px'
					});
			}
			else {
				elt.insertBefore( eltsObject[divId][n]).css({
					'left' : allBeforeWidth + 'px', 
					'top' : allBeforeHeight + 'px'
					});
			}
		
			var $thisWidth = (o.isHorizontal ? 0: elt.outerWidth(true));
			var $thisHeight = elt.outerHeight(true);
			ul.find('li').eq(n).nextAll().css({
				'left': '+=' + $thisWidth + 'px',
				'top' : '+=' + $thisHeight + 'px'
				});
			ul.css({
				'width' : parseInt( ul.css('width')) + parseInt($thisWidth) + 'px',
				'height' : parseInt( ul.css('height')) + parseInt($thisHeight) + 'px'
				
			})
			
			
			
			addToObject(eltsObject, divId, elt, n, $thisHeight, $thisWidth, o)
			addHandlers(eltsObject, divId, elt, o, div);
			
			for (var i=0;i<tempArr.length;i++) { 
				tempArr[i].pos.left = tempArr[i][0].offsetLeft;
				tempArr[i].pos.top = tempArr[i][0].offsetTop;
				tempArr[i].n = n + i+1;
				eltsObject[divId][n + 1 + i] = tempArr[i];			
			}
					
	}

	JumbleScramble.prototype.removeLiElem = function () {							// Remove new li to previous collection
		
			
	};
		
	
	JumbleScramble.prototype.init = function () {
		
		var o = this.options; 
		var div = $(this.element), ul = $("ul", div), li = $("li", ul), divId = div.attr('id');						// Variables declaration
		var left=0, top = 0, n = 0, ulSize = 0;;	
		eltsObject[(divId.toString())] = new Array(li.size());
	
		li.each(function(liInd, liElem){ 											// Loop over each li, position, store object data and bind draggable handlers. 
			var elt = $(this);	
			
			if (o.isHorizontal) {
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
			
			addToObject(eltsObject, divId, elt, n, $thisHeight, $thisWidth, o);		
			addHandlers(eltsObject, divId, elt, o, div);			
			n = n+1;		
		});
			
		if (!o.isHorizontal) {	
			ul.css({width:ulSize, height: li.outerHeight(true) + 'px' });	 		// Update the ul size	
		}
		else {
			ul.css({height: ulSize });
		}
		//console.log(eltsObject)	
	};
			
	$.fn.jumbleScramble = function(options, arg1, arg2) { 							// jumbleScramble fn
		
		return this.each(function () {
			new JumbleScramble(this, options, arg1, arg2) 	
		}).promise().done(function (){
			if (!!options.layoutComplete )options.layoutComplete();
				
		});
	};																			

})(jQuery);
