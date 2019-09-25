let canvas = document.getElementById('canvas');

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

let pieces = [];
let ctx = canvas.getContext('2d');
let redButton = new Image();
let blueButton = new Image();
let board = new Image();
let logo = new Image();
let canvasOffset=$("#canvas").offset();
let offsetX=canvasOffset.left;
let offsetY=canvasOffset.top;
let canvasWidth=canvas.width;
let canvasHeight=canvas.height;
let isDragging=false;
let stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
let stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
let styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
let styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
let html = document.body.parentNode;
let htmlTop = html.offsetTop;
let htmlLeft = html.offsetLeft;
let selection = null;
let dragoffx = 0;
let dragoffy = 0;
let valid = false;
let interval = 30;
/*
 * 1 flag
 * 6 bomb
 * 1 spy
 * 8 scouts
 * 5 miners
 * 4 sergants
 * 4 lieutenants
 * 4 captains
 * 3 majors
 * 2 colonels
 * 1 general
 * 1 marshall
 */

function generatePieces(array){
	let bombCount = 1;
	let scoutCount = 1;
	let minerCount = 1;
	let sergantCount = 1;
	let lieutenantCount = 1;
	let captainCount = 1;
	let majorCount = 1;
	let colonelCount = 1;
	for (var i = 0; i < 40; i++) {
		//40 pieces
		let temp = new Image();
		if (i == 0) {
			//1 flag
			$("#flag1").append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-flag.svg"> </object>');		
		} else if (i > 0 && i < 7) {
			//6 bombs
			let bombTag = "#bomb";
			bombtag.concat(bombCount);
			$(bombtag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-bomb.svg"> </object>');
			bombCount++;
		} else if (i == 7) {
			//1 spy
			$("#spy1").append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-spy.svg"> </object>');
		} else if (i >= 8 && i < 16) {
			//8 scouts
			let scouttag = "#scout";
			scouttag.concat(scoutCount);
			$(scouttag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-scout.svg"> </object>');
			scoutCount++;
		} else if (i >= 16 && i < 21) {
			//5 miners
			let minertag = "#miner";
			minertag.concat(minerCount);
			$(minertag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-miner.svg"> </object>');
			minerCount++;
		} else if (i >= 21 && i < 25) {
			//4 sergants
			let sergeantTag = "#sergeant";
			sergeanttag.concat(sergeantCount);
			$(sergeanttag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-sergeant.svg"> </object>');
			sergeantCount++;
		} else if (i >= 25 && i < 29) {
			//4 lieutenants
			let lieutenanttag = "#miner";
			lieutenanttag.concat(lieutenantCount);
			$(lieutenanttag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-lieutenant.svg"> </object>');
			lieutenantCount++;
		} else if (i >= 29 && i < 33) {
			//4 captains
			let captaintag = "#captain";
			captaintag.concat(minerCount);
			$(captain).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-captain.svg"> </object>');
			captainCount++;
		} else if (i >= 33 && i < 36) {
			//3 majors
			let majortag = "#major";
			majortag.concat(majorCount);
			$(majortag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-major.svg"> </object>');
			majorCount++; 
		} else if (i >= 36 && i < 38) {
			//2 colonels
			let coloneltag = "#colonel";
			coloneltag.concat(colonelCount);
			$(coloneltag).append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-colonel.svg"> </object>');
			colonelCount++;
		} else if (i == 38) {
			//1 general
			$("#general1").append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-general.svg"> </object>');
		} else if (i == 39) {
			//1 marshall
			$("#marshall1").append('<object type="image/svg+xml" data="../../resources/static/assets/stratego-marshall.svg"> </object>');
		}
		temp.isDragging = false;
		array.push(temp);
		$("#canvas").mousemove(function(e){handleMouseMove(e,ctx,temp);});
	}
	return array;
}

function drawPiecesInitial(ctx, images){
	for (var i = 0; i < images.length; i++){
		if (!images[i].complete){
			setTimeout(function(){
					}, 50);
		}
		images[i].currentX = (i%5)*70;
		images[i].currentY = (Math.floor(i/5)*70)+150;
		images[i].currentWidth = 100;
		images[i].currentHeight = 100;
		ctx.drawImage(images[i], (i%5)*70, (Math.floor(i/5)*70)+150, 100, 100);
	}
}

function drawBoard(ctx, board) {
	if (!board.complete){
		setTimeout(function(){
				}, 500);
	}
	board.currentX = 150;
	board.currentY = 0;
	board.currentWidth = board.width;
	board.currentHeight = board.height;
	ctx.drawImage(board, 150, 0);	
}

function drawRedButton(ctx, redButton) {
	if (!redButton.complete){
		setTimeout(function(){
				draw(ctx, redButton);
				}, 50);
	}
	redButton.currentX = -30;
	redButton.currentY = 830;
	redButton.currentWidth = 175;
	redButton.currentHeight = 100;
	ctx.drawImage(redButton, -30, 830, 175, 100);
}

function drawBlueButton(ctx, blueButton) {
	if (!blueButton.complete){
		setTimeout(function(){
				draw(ctx, blueButton);
				}, 50);
	}
	blueButton.currentX = 1750;
	blueButton.currentY = 0;
	blueButton.currentWidth = 175;
	blueButton.currentHeight = 100;
	ctx.drawImage(blueButton, 1750, 0, 175,100);
}

function drawLogo(ctx, logo) {
	if (!logo.complete){
		setTimeout(function(){
				draw(ctx, logo);
				}, 500);
	}
	logo.currentX = 25;
	logo.currentY = -25;
	logo.currentWidth = 500;
	logo.currentHeight = 300;
	ctx.drawImage(logo, 25, -25, 500, 300);	
}

function handleMouseDown(e) {
	var mouse = getMouse(e);
	var mx = mouse.x;
	var my = mouse.y;
	var l = pieces.length;
	for (var i = l-1; i >= 0; i--) {
		if (pieces[i].currentX <= mx && pieces[i].currentX + pieces[i].currentWidth/2 >= mx && pieces[i].currentY <= my && pieces[i].currentY + pieces[i].currentHeight/2 >= my) {
			var mySel = pieces[i];
			// Keep track of where in the object we clicked
			// so we can move it smoothly (see mousemove)
			dragoffx = mx - mySel.currentX;
			dragoffy = my - mySel.currentY;
			isDragging = true;
			selection = mySel;
			valid = false;
			return;
		}
	}
	// havent returned means we have failed to select anything.
	// If there was an object selected, we deselect it
	if (selection) {
		selection = null;
		valid = false; // Need to clear the old selection border
	}
}
function handleMouseUp(e){
	//find a way to identify which piece you were previously dragging(?)
	var mouse = getMouse(e);
	var mx = mouse.x;
	var my = mouse.y;
	var l = pieces.length; 
	for (var i = l-1; i >= 0; i--) {
		if (pieces[i].currentX <= mx && pieces[i].currentX + pieces[i].currentWidth/2 >= mx && pieces[i].currentY <= my && pieces[i].currentY + pieces[i].currentHeight/2 >= my) {
			var mySel = pieces[i];
			// Keep track of where in the object we clicked
			// so we can move it smoothly (see mousemove)
			console.log(pieces[i], mx, my)
				snapOntoBoard(mouse, mySel);
			isDragging = false;
			return;
		}
	}	
	isDragging=false;
}

function handleMouseMove(e) {
	if (isDragging){
		var mouse = getMouse(e);
		// We don't want to drag the object by its top-left corner, we want to drag it
		// from where we clicked. Thats why we saved the offset and use it here
		selection.currentX = mouse.x - dragoffx;
		selection.currentY = mouse.y - dragoffy;   
		valid = false; // Something's dragging so we must redraw
	}
}

function getMouse(e) {
	var element = canvas, offsetX = 0, offsetY = 0, mx, my;
	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}
	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
	offsetY += stylePaddingTop + styleBorderTop + htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

	// We return a simple javascript object (a hash) with x and y defined
	return {x: mx, y: my};
}

board.onload = function () {
	drawBoard(ctx, board);
}

redButton.onload = function () {
	drawRedButton(ctx, redButton);
}

blueButton.onload = function () {
	drawBlueButton(ctx, blueButton);
}

logo.onload = function () {
	drawLogo(ctx, logo);
}

function drawNonMovableStuff(){
	drawBoard(ctx, board);
	drawRedButton(ctx, redButton);
	drawBlueButton(ctx, blueButton);
	drawLogo(ctx, logo);
}

function drawPieces(){
	if (!valid) {
		// CLear canvas
		ctx.clearRect(0,0,canvas.width, canvas.height);	
		// Draw background stuff
		drawNonMovableStuff();
		// draw all pieces
		var l = pieces.length;
		for (var i = 0; i < l; i++) {
			var shape = pieces[i];
			// We can skip the drawing of elements that have moved off the screen:
			if (shape.currentX > canvas.width || shape.currentY > canvas.height ||
					shape.CurrentX + shape.currentY < 0 || shape.currentY + shape.currentHeight < 0) continue;
			ctx.drawImage(pieces[i], pieces[i].currentX, pieces[i].currentY, pieces[i].currentWidth, pieces[i].currentHeight);
		}

		// draw selection
		// right now this is just a stroke along the edge of the selected Shape
		valid = true;
	}	
	return;
}

function snapOntoBoard(mousePosition, piece) {
	// Width of each tile is about 90
	// x coordinate of first is about 580
	// 10x10 board
	let initialX = 535;
	let interval = 180;
	let initialY = 60;
	let currentX = initialX;
	let currentY = initialY;
	for (var y = 0; y < 10; y++){
		for (var x = 0; x < 10; x++) {
			if (mousePosition.x <= currentX + interval/2 && mousePosition.x >= currentX - interval/2 && mousePosition.y <= currentY + interval/2 && mousePosition.y <= currentY - interval/2) {
				console.log("snapOntoBoard works");
				console.log("mousePosition: ", mousePosition.x, mousePosition.y);
				console.log("piece: ", piece);
				console.log("currentX and Y: ", currentX, currentY);
				piece.currentX = currentX;
				piece.currentY = currentY;
				return;
			}
			currentX += interval;
		}
		currentY += interval;
		currentX = initialX;
	}
}

$("#canvas").mousedown(function(e){handleMouseDown(e);});
$("#canvas").mouseup(function(e){handleMouseUp(e);});
$("#canvas").mousemove(function(e){handleMouseMove(e);});

board.src = "../../resources/static/assets/map.svg";
redButton.src = "../../resources/static/assets/redbutton.svg";
blueButton.src = "../../resources/static/assets/bluebutton.svg";
logo.src = "../../resources/static/assets/logo.svg";
pieces = generatePieces(pieces);
drawPiecesInitial(ctx, pieces);
let objects = [...pieces];
objects.push(redButton, blueButton, logo, board);
setInterval(function() { drawPieces(); }, interval);


