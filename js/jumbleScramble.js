(function ( $ ) {                 			    // Compliant with jquery.noConflict()
	
	var transSupport = function()  {
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
	}
	
	var ifGpu = transSupport() ? 'translate3d(0px,0px,0px) translateZ(0)' : 'translate(0px,0px)';
	var testElement = document.createElement('div');
    var transitionPrefix = "webkitTransition" in testElement.style ? "webkitTransition" : "transition";
    var transformPrefix = "webkitTransform" in testElement.style ? "webkitTransform" : "-ms-transform" in testElement.style && transSupport() == false ? "-ms-transform" : "transform";  //if ie9


	$.fn.transToZero = function () {
		var elt = this[0];
		setTimeout(function(){ 
				elt.style[transitionPrefix] = '250ms ease';					
				elt.style[transformPrefix] = ifGpu	// translateZ doesn't work for ie9	
		}, 0);
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
	
	
	var trigger = false;
	var oldPos;
	function onDrag(ui, draggie, elt, elts, o){													// Drag
		
		ui.position = {};
		//console.log(ui.position.x)
		ui.position.top = draggie.position.y;											// Redundancy - FIX ME
		ui.position.left = draggie.position.x;
		
		
		var thisElt = this;																//must be saved to a variable to avoid random 
																				//occurrences of non-moving elements in safari iPad.
		oldPos = (thisElt.eltPos != null ? thisElt.eltPos : ui.position); 			//find the old position stored on the $object 
		thisElt.eltPos = ui.position;													//its current position derived from $draggable object		
			
		if (instanceArr.length > 1 && o.isVertical) {
			adjConElts = instanceArr[elt.movesTo].elts;
			adjacentDir = instanceArr[elt.movesTo].div.offset().left -  elt.parent().offset().left;	
			var dirSwitch = (elt.belongsTo % 2 == 0 ? thisElt.eltPos.left > adjacentDir/2 : thisElt.eltPos.left < adjacentDir/2);  
		
		}
		
		if (dirSwitch && trigger == false) {								// trigger animations for adjacent container
			console.log('hello')
			trigger = true;
			var tempArr = []
			for(var i = 0; i < adjConElts.length; i++){ 			//Loop the array
					var obj = adjConElts[i]
					if (draggie.position.y  < obj.pos.top + obj.completeHeight/2) {
							
						if (obj.moved == false) {
							tempArr.push(i)
							//console.log(tempArr)
					
							obj[0].style[transitionPrefix] = '250ms ease';
							obj[0].style[transformPrefix] = 'translateY(' + elt.completeHeight + 'px)';						
							obj.moved = true;
							elt.insertPos = obj.n;
							obj.pos.top = obj.pos.top + elt.completeHeight;
							
						
						};
					};
				};
			elt.insertPos = tempArr[0] >= 0 ? tempArr[0] : adjConElts.length;
		};
		if (!dirSwitch && trigger == true && Object.keys(elts).length > 1) {											// go back to original container
			trigger = false;
			
			 for(var ind = 0; ind < adjConElts.length; ind++){ 						//Loop the array starting from the first element to be moved down
				var objectNumber = adjConElts[ind];
				
				if (objectNumber.moved == true) {
					objectNumber.transToZero();
						objectNumber.moved = false;
						objectNumber.pos.top = objectNumber.pos.top - elt.completeHeight;
				}			
			}			
		}  
		
		if(!o.isVertical && thisElt.eltPos.left != oldPos.left) { 
			move = (thisElt.eltPos.left > oldPos.left ? 'forward' : 'backward');		// check whether the move is forward or backward
		
		} 
		else if (o.isVertical && thisElt.eltPos.top != oldPos.top) {	
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
			
					eltNext[0].style[transitionPrefix] = '0s';
					eltNext[0].style.left = eltNext.pos.left + 'px';
					eltNext[0].style[transformPrefix] = 'translateX(' + elt.completeWidth  + 'px)';
					eltNext.transToZero();
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
			

					eltPrev[0].style[transitionPrefix] = '0s';
					eltPrev[0].style.left =  eltPrev.pos.left + 'px';	
					eltPrev[0].style[transformPrefix] = 'translateX(' + -(elt.completeWidth) + 'px)'; 
					eltPrev.transToZero();					
				}
			}
		} 
		if(move == 'up'){						//  move up
	
			if (trigger) {										// trigger  for animating adjacent container				
				//for(var i = 0; i < adjConElts.length; i++){ 			//Loop the array
				if (elt.insertPos > 0) {
					
					var obj = adjConElts[elt.insertPos -1]
					if (draggie.position.y  < obj.pos.top + obj.completeHeight/2 && obj.moved == false) {	
					
						obj[0].style[transitionPrefix] = '250ms ease';
						obj[0].style[transformPrefix] = 'translateY(' + elt.completeHeight + 'px)';	
						obj.moved = true;
						elt.insertPos = obj.n;
						obj.pos.top = obj.pos.top + elt.completeHeight;
					};
				};	
			}   
			else {
			
				if(elt.n > 0){
					var eltPrev = elts[elt.n - 1];					 
					var eltPrevBound = eltPrev.pos.top + parseInt(eltPrev.completeHeight / 2);
					if(thisElt.eltPos.top < eltPrevBound){	
						//if (eltPrev.hasClass('locked') ){ return; } 
						elt.insertBefore(eltPrev);							
						elt.pos.top = eltPrev.pos.top;
						eltPrev.pos.top += elt.completeHeight;			
						elts[elt.n] = eltPrev;
						elts[elt.n - 1] = elt;																						
						elts[elt.n].n = elt.n; 
						elt.n = elt.n - 1; 

						eltPrev[0].style[transitionPrefix] = '0s';
						eltPrev[0].style.top =  eltPrev.pos.top + 'px';	
						eltPrev[0].style[transformPrefix] = 'translateY(' + -(elt.completeHeight) + 'px)'; 
						eltPrev.transToZero();
	
					}
				}
			}
		}
		else if(move == 'down'){ 				//  move down	
		    if (trigger) {										// trigger  for animating adjacent container					
			//	for(var i = 0; i < adjConElts.length; i++){ //Loop the array
	
				if (elt.insertPos < adjConElts.length) {
					var obj = adjConElts[elt.insertPos]
					if (draggie.position.y  + elt.completeHeight > obj.pos.top + obj.completeHeight/2 && obj.moved == true) {
							obj.transToZero();
							obj.moved = false;
							elt.insertPos = obj.n +1;
							obj.pos.top = obj.pos.top - elt.completeHeight;										
					}
				};				
			}   
			else {
				if(elt.n < elts.length-1){
					var eltNext = elts[elt.n + 1];					
					var eltNextBound = eltNext.pos.top + parseInt(eltNext.completeHeight / 2);
					if(thisElt.eltPos.top + elt.completeHeight > eltNextBound){
						//if (eltNext.hasClass('locked') ){ return; } 
						elt.insertAfter(eltNext);
						eltNext.pos.top = elt.pos.top;
						elt.pos.top += eltNext.completeHeight;																					
						elts[elt.n] = eltNext;
						elts[elt.n + 1] = elt;																
						elts[elt.n].n = elt.n; 
						elt.n = elt.n + 1; 
						
						eltNext[0].style[transitionPrefix] = '0s';
						eltNext[0].style.top = eltNext.pos.top + 'px';
						eltNext[0].style[transformPrefix] = 'translateY(' + elt.completeHeight  + 'px)';
						eltNext.transToZero();
						
					}
				}
			}
		}
	};

	
	function onStop(evt, draggie, elt, div, o)	{									// Stop
		
		if (trigger) {													// animate lis in previous container.
			var thisWidth = (o.isVertical ? 0: elt.completeWidth);
			var thisHeight = elt.completeHeight;
			
			for (var i=elt.index() +1;i<instanceArr[elt.belongsTo].elts.length;i++) { 
				var prevElt = instanceArr[elt.belongsTo].elts[i][0];
				
				prevElt.style[transitionPrefix] = '0s';
				prevElt.style.left = parseInt(prevElt.style.left) - thisWidth + 'px';
				prevElt.style.top = parseInt(prevElt.style.top) - thisHeight + 'px';
				prevElt.style[transformPrefix] = 'translate(' + thisWidth  + 'px,' +  thisHeight + 'px)';
				instanceArr[elt.belongsTo].elts[i].transToZero();				
			};				
		}
	
		animateBack(elt, draggie);
		
		elt[0].style[transitionPrefix] = 'box-shadow 250ms';
		elt.removeClass('boxShadow');	
		elt.transToZero();	
		
		if (o.setChars)	{										// setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2
			
			setChars(div);		// setChars function	- re-align lis after uppercase/lowercase for difficulty setting  2
			
			var left=0;			
			div.find('li').each(function(ind, elem){ 					// FIX-Me : put in prototype
				var $this = $(this)
				$this.animate({left: left + 'px',top : 0}, 100);
				left += $this.outerWidth(true);
			});
					
		}		
		else {  													// for difficulty setting 0
		
			transSupport() ? elt.one('transitionend', function () { appendRemove() }) : appendRemove() // only wait for transitionend if supported (not ie9)

			function appendRemove () {
				
				if (!!o.autoValidate) {
					o.autoValidate();	 						// calls the autovalidate function in the plugin calling script						
				}
				if (trigger) {
					
					instanceArr[elt.movesTo].addLiElem(elt.text(), elt.insertPos);
					trigger = false;
					
				/* 	var vdvddv = instanceArr[elt.movesTo].elts;									// append to previous
					
					instanceArr[elt.belongsTo].addLiElem( vdvddv[vdvddv.length -1].text(), 0 )
					instanceArr[elt.movesTo].removeLiElem( vdvddv[vdvddv.length -1] )  			// append to previous end  */
					
					instanceArr[elt.belongsTo].removeLiElem(elt) 
				}  
			}; 
			
		}
		
	};
	
	function animateBack (elt, draggie) {					// FIX-ME add to prototype
		if (trigger) {
			var animateToPos = elt.insertPos == instanceArr[elt.movesTo].elts.length && elt.insertPos > 0? instanceArr[elt.movesTo].elts[elt.insertPos -1].pos.top + instanceArr[elt.movesTo].elts[elt.insertPos -1].completeHeight: elt.insertPos == 0 ? 0 :instanceArr[elt.movesTo].elts[elt.insertPos].pos.top - elt.completeHeight;
			
			var thisLeft = adjacentDir, thisTop = animateToPos, thisX = draggie.position.x - adjacentDir, thisY = draggie.position.y - animateToPos;	
		}
		else {	
			var thisLeft = elt.pos.left, thisTop = elt.pos.top, thisX = draggie.position.x - elt.pos.left, thisY = draggie.position.y - elt.pos.top;
		}
		
		elt[0].style.left = thisLeft + 'px'
		elt[0].style.top = thisTop + 'px'
		elt[0].style[transformPrefix] = 'translate(' + thisX  + 'px,' +  thisY + 'px)';
	}
	
	function getOffset(elt){												
		return {left : parseInt(elt.css('left')), top : elt.css('top') == 'auto' ? 0 : parseInt(elt.css('top'))};
	};
	
	var defaults = {
		isVertical: false,
		setChars: false,
		layoutComplete: function () {}
	}
	
	var conCount = 0;
	function JumbleScramble(element, options) {					// Constructor function 
	
		this.div = $(element);
		this.ul = this.div.find('ul');
		this.container = conCount;		
		this.adjCon = this.container % 2 == 0 ? this.container +1 : this.container -1;
		this.options = $.extend( {}, defaults, options) ;
		this.init();
		
		conCount++;
		
	};	

	JumbleScramble.prototype.removeLiElem = function () {							// Remove new li to previous collection
		
			var o = this.options;
			var elt = arguments[0];
			var n = elt.index();
			var thisElts = this.elts;
			var tempArr = [];
			
			for (var i=0;i<thisElts.length;i++) { 
				if (i > n ) {
					tempArr.push(thisElts[i])	
				}
			};
			var eObjIdLenght = thisElts.length -1
			
			this.ul.css({													// update ul size
				'width' : '-=' + (o.isVertical ? 0: elt.completeWidth) + 'px',
				'height' : '-=' + elt.completeHeight + 'px'
			});
			
			i = 0;	
			for (var i=0;i<tempArr.length;i++) { 
				tempArr[i].pos.left = tempArr[i][0].offsetLeft;
				tempArr[i].pos.top =  tempArr[i][0].offsetTop;							
				tempArr[i].n = tempArr[i].n -1;
				thisElts[n + i] = tempArr[i];

			};
			
			delete thisElts[thisElts.length -1]
			thisElts.length = eObjIdLenght;
			elt.remove();	
			
	};	
	
	
	JumbleScramble.prototype.addLiElem = function (liText, liPosition) {								// Add new li to previous collection
			
		 	var div = this.div; 
			var ul = this.ul; 
			var thisElts = this.elts;
			var n = Math.min(Math.max(parseInt(liPosition), 0), thisElts.length);
			var o = this.options;
			var elt = $("<li class='listItem'>" + liText + "</li>");
			var thisContainer = this.container;
			var adjCon = this.adjCon;
			var allBeforeWidth = 0;
			var allBeforeHeight = 0;
			var tempArr = [];
			
			
			for (var i=0;i<thisElts.length;i++) { 
				thisElts[i].moved = false;
				thisElts[i][0].style[transitionPrefix] = '0s';					
				thisElts[i][0].style[transformPrefix] = 'translate(0px,0px)';			
				if (i < n ) {
					allBeforeWidth += thisElts[i].completeWidth;
					allBeforeHeight += thisElts[i].completeHeight;
				}	
				else {	tempArr.push(thisElts[i])	}
			}
			
			var eltObj = {
				'left': allBeforeWidth + 'px', 
				'top' : allBeforeHeight + 'px'
			}
			
			if (thisElts.length == 0) {elt.css(eltObj).appendTo(ul)} 							// if there are no elements present at drop
			else (n > 0 ? elt.insertAfter( thisElts[n-1]).css(eltObj) : elt.insertBefore( thisElts[n]).css(eltObj) );
			
		
			var $thisWidth = (o.isVertical ? 0: elt.outerWidth(true));
			var $thisHeight = elt.outerHeight(true);
					
			
			ul.find('li').eq(n).nextAll().css({
				'left': '+=' + $thisWidth + 'px',
				'top' : '+=' + $thisHeight + 'px'
				});
			ul.css({
				'width' : '+=' + $thisWidth + 'px',
				'height' :' +=' + $thisHeight + 'px'
				
			})
					
			addToObject(thisElts, elt, n, $thisHeight, $thisWidth, o, thisContainer, adjCon);
			
			
			for (var i=0;i<tempArr.length;i++) { 
				tempArr[i].pos.left = tempArr[i][0].offsetLeft;
				tempArr[i].pos.top =  tempArr[i][0].offsetTop;							
				tempArr[i].n = n + i+1;
				thisElts[n + 1 + i] = tempArr[i];			
			}
			return elt;	
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
		}
		this.addHandlers();
		
		o.isVertical ? 	div.find('ul').css({height: ulSize }) : div.find('ul').css({width:ulSize, height: li.outerHeight(true) + 'px' }); 	// Update the ul size

	};
	
 	JumbleScramble.prototype.addHandlers = function () {
	
		var targetOffsetY; 
		var targetOffsetX;
		var $document = $(document);
		var div = this.div;
		var thisContainer = this.container
		var adjCon = this.adjCon;
		var o = this.options;
		var thisElts = this.elts	
		var move;
		var movePos = {};
		var elt;
		var moveIsDragged = false;
		var draggie = {};
		draggie.position = {};
		var ui = {};
		var liSelector = o.isVertical == true ? '.listItem' : '.listItem-horizontal'
	
	
		
		div.on("mousedown touchstart",liSelector,function(me){
			move = $(this);

		/* 	move[0].style[transitionPrefix] = '0.2s'; */
			move[0].style.zIndex = '5';
			instanceArr[adjCon].div[0].style.zIndex = '-1'
			div[0].style.zIndex = '1'
			
			move[0].style[transitionPrefix] = '0s';
			move.addClass('boxShadow').addClass('dragging');
		/* 	move[0].style[transformPrefix] = 'scale(0.95,1)';	 */
				 
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
			
				if (transSupport()) {
						
					move[0].style[transformPrefix] = 'translate3d(' + newDx + 'px, ' + newDy + 'px, 0px) translateZ(0)';	
						
				}
				else {
					move[0].style.top = targetOffsetY + movePos.dy + 'px'
					move[0].style.left = targetOffsetX + movePos.dx + 'px'
				}

				// we need to save last made offset
				movePos = {dx: newDx, dy: newDy };
							
				draggie.position.y = targetOffsetY + newDy
				draggie.position.x = targetOffsetX + newDx

				onDrag(ui, draggie, elt, thisElts, o); 				
		
			});
			
			$document.on("mouseup touchend",function(e){
				move[0].style.zIndex = '1';
				move.removeClass('boxShadow').removeClass('dragging');
				$document.off("mousemove touchmove mouseup touchend");
				if (moveIsDragged == false) { 	return;   }
		
				if (transSupport()) {
					move[0].style[transformPrefix] = 'translateZ(0) translate3d(' + 0 + 'px, ' + 0 + 'px, 0px)';		
				}
				move[0].style.top = targetOffsetY + movePos.dy + 'px'
				move[0].style.left = targetOffsetX + movePos.dx + 'px'
				

				draggie.position.y = targetOffsetY + movePos.dy
				draggie.position.x = targetOffsetX + movePos.dx
				moveIsDragged = false
				
				onStop(e, draggie, elt, div, o)
			});
		});
			
	}; 
	
	
	var instanceArr = [];	
	
	$.fn.jumbleScramble = function(options, arg1, arg2) { 							// jumbleScramble fn
			console.time(name)	
		if (typeof options === 'string') {											// if a metod is calles
			var self = this;
			var thisId  = ( options == 'remove' ? this.parent().parent().attr('id') : this.attr('id') );
			
			$.each(instanceArr, function (i,e){
				if (thisId == this.element.attributes.id.nodeValue) {
				instanceArr[i][options + 'LiElem'](arg1 || self, arg2)  // self is for the remove method, arg2 is then undefined.
				}
			});	
			
		}
		else {
			return this.each(function (i,e) {										
				
				instanceArr.push(new JumbleScramble(this, options, arg1, arg2)) 	
			}).promise().done(function (){
				if (!!options.layoutComplete )options.layoutComplete(instanceArr);
				console.timeEnd(name)
			});			
		}
	
	};	

})(jQuery);
