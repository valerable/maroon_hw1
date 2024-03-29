var canvas = document.getElementById('canvas');

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

var pieces = [];
var playerPieces = [];
var enemyPieces = [];
var ctx = canvas.getContext('2d');
var redButton = new Image();
var blueButton = new Image();
var board = new Image();
var logo = new Image();
var canvasOffset=$("#canvas").offset();
var offsetX=canvasOffset.left;
var offsetY=canvasOffset.top;
var canvasWidth=canvas.width;
var canvasHeight=canvas.height;
var isDragging=false;
var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
var stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
var styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
var styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
var html = document.body.parentNode;
var htmlTop = html.offsetTop;
var htmlLeft = html.offsetLeft;
var selection = null;
var dragoffx = 0;
var dragoffy = 0;
var valid = false; //Checking if the current setup is valid (if we need to redraw on the canvas)
var functionInterval = 30;
var interval = 90;
var initialX = 540;
var initialY = 200;
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
//ALL PIECES ARE 100X100
function generatePlayerPieces(array){
	let bombCount = 1;
	let scoutCount = 1;
	let minerCount = 1;
	let sergeantCount = 1;
	let lieutenantCount = 1;
	let captainCount = 1;
	let majorCount = 1;
	let colonelCount = 1;
	for (var i = 0; i < 40; i++) {
		//40 pieces
		let temp = new Image();
		if (i == 0) {
			//1 flag
			$("#flag").append('<object th:type="image/svg+xml" th:data="@{assets/stratego-flag.svg}"> <p> Your browser does not support svg</p></object>');
			temp.src = "/assets/stratego-flag.svg"
		} else if (i > 0 && i < 7) {
			//6 bombs
			let bombtag = "#bomb";
			$(bombtag + bombCount).append('<object th:type="image/svg+xml" th:data="@{/assets/stratego-bomb.svg}"> </object>');
			bombCount++;
			temp.src = "/assets/stratego-bomb.svg";
		} else if (i == 7) {
			//1 spy
			$("#spy").append('<object type="image/svg+xml" th:data="@{/assets/stratego-spy.svg}"> </object>');
			temp.src = "/assets/stratego-spy.svg";
		} else if (i >= 8 && i < 16) {
			//8 scouts
			let scouttag = "#scout";
			$(scouttag + scoutCount).append('<object type="image/svg+xml" th:data="@{/assets/stratego-scout.svg}"> </object>');
			scoutCount++;
			temp.src = "/assets/stratego-scout.svg";
		} else if (i >= 16 && i < 21) {
			//5 miners
			let minertag = "#miner";
			$(minertag + minerCount).append('<object type="image/svg+xml" th:data="@{/assets/stratego-miner.svg}"> </object>');
			minerCount++;
			temp.src = "/assets/stratego-miner.svg";
		} else if (i >= 21 && i < 25) {
			//4 sergants
			let sergeanttag = "#sergeant";
			$(sergeanttag + sergeantCount).append('<object type="image/svg+xml" th:data="@{/assets/stratego-sergeant.svg}"> </object>');
			sergeantCount++;
			temp.src = "/assets/stratego-sergeant.svg";
		} else if (i >= 25 && i < 29) {
			//4 lieutenants
			let lieutenanttag = "#lieutenant";
			$(lieutenanttag + lieutenantCount).append('<object type="image/svg+xml" th:data="@{/assets/stratego-lieutenant.svg}"> </object>');
			lieutenantCount++;
			temp.src = "/assets/stratego-lieutenant.svg";
		} else if (i >= 29 && i < 33) {
			//4 captains
			let captaintag = "#captain";
			$(captaintag + captainCount).append('<object type="image/svg+xml" th:data="@{/assets/stratego-captain.svg}"> </object>');
			captainCount++;
			temp.src = "/assets/stratego-captain.svg";
		} else if (i >= 33 && i < 36) {
			//3 majors
			let majortag = "#major";
			$(majortag + majorCount).append('<object type="image/svg+xml" th:data="../../resources/static/assets/stratego-major.svg"> </object>');
			majorCount++; 
			temp.src = "/assets/stratego-major.svg";
		} else if (i >= 36 && i < 38) {
			//2 colonels
			let coloneltag = "#colonel";
			$(coloneltag + colonelCount).append('<object type="image/svg+xml" th:data="@{/assets/stratego-colonel.svg}"> </object>');
			colonelCount++;
			temp.src = "/assets/stratego-colonel.svg";
		} else if (i == 38) {
			//1 general
			$("#general").append('<object type="image/svg+xml" th:data="@{/assets/stratego-general.svg}"> </object>');
			temp.src = "/assets/stratego-general.svg";
		} else if (i == 39) {
			//1 marshall
			$("#marshal").append('<object type="image/svg+xml" th:data="@{/assets/stratego-marshal.svg}"> </object>');
			temp.src = "/assets/stratego-marshal.svg";
		}
		//as of right now temp is a blank image object
		temp.isDragging = false;
		array.push(temp);
	}
	console.log(array);
	return array;
}

function drawPlayerPiecesInitial(ctx, images){
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
			dragoffx = mx - pieces[i].currentX;
			dragoffy = my - pieces[i].currentY;
			isDragging = true;
			selection = pieces[i];
			valid = false;
			return;
		}
	}
	//This checks if we went iterated through all the pieces and it has not returned
	//Meaning if no piece has been selected, make selection = null and redraw canvas
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
	var l = playerPieces.length; 
	for (var i = l-1; i >= 0; i--) {
		if (pieces[i].currentX <= mx && pieces[i].currentX + pieces[i].currentWidth/2 >= mx && pieces[i].currentY <= my && pieces[i].currentY + pieces[i].currentHeight/2 >= my) {
			var mySel = pieces[i];
			//After getting the piece currently selected, snap it onto the board
			snapOntoBoard(mouse, mySel);
			//You let go of the mouse, therefore you are no longer dragging
			isDragging = false;
			valid = false;
			return;
		}
	}	
	isDragging=false;
}

function handleMouseMove(e) {
	if (isDragging){
		var mouse = getMouse(e);
		selection.currentX = mouse.x - dragoffx;
		selection.currentY = mouse.y - dragoffy;   
		valid = false; // A piece is dragging so we must redraw
	}
}

function getMouse(e) {
	let element = canvas, offsetX = 0, offsetY = 0, mx, my;
	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while (element = element.offsetParent);
	}
	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
	offsetY += stylePaddingTop + styleBorderTop + htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

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
		// Clear canvas
		ctx.clearRect(0,0,canvas.width, canvas.height);	
		// Draw background stuff
		drawNonMovableStuff();
		// draw all pieces
		for (var i = 0; i < pieces.length; i++) {
			//if any of the pieces go out of bounds of the canvas then skip
			if (pieces[i].currentX > canvas.width || pieces[i].currentY > canvas.height ||
					pieces[i].currentX + pieces[i].currentY < 0 || pieces[i].currentY + pieces[i].currentHeight < 0) continue;
			//otherwise redraw the image
			ctx.drawImage(pieces[i], pieces[i].currentX, pieces[i].currentY, pieces[i].currentWidth, pieces[i].currentHeight);
		}
		// draw selection
		valid = true;
	}	
	return;
}

function generateEnemyPieces(enemyarray) {
	// First let's generate the array of enemy pieces
	for (var i = 0; i < 40; i++) {
		let temp = new Image();
		temp.src = "/assets/blue_block.svg";
		console.log("temp = ", temp);
		enemyarray.push(temp);
		//Add the enemy pieces onto the enemyPieces array
		console.log(enemyarray);
	}
	console.log("enemyPieces = ", enemyarray);
	return enemyarray;
}

function drawEnemyPieces(ctx, enemyPieces) {
	//Let's draw each enemy piece.
	let currentX = initialX;
	let currentY = initialY;
	for (var y = 0; y < 4; y++){
		for (var x = 0; x < 10; x++) {
			let piece = enemyPieces[(10*y)+x];
			if (!piece.complete){
				setTimeout(function(){
						}, 50);
			}

			piece.currentX = currentX;
			piece.currentY = currentY - (2*interval);
			piece.currentWidth = 85;
			piece.currentHeight = 85;
			currentX += interval;
			ctx.drawImage(piece, piece.currentX, piece.currentY, piece.currentHeight, piece.currentWidth);
		}
		currentY += interval;
		currentX = initialX;
	}
}

function snapOntoBoard(mousePosition, piece) {
	// Width of each tile is about 90
	// x coordinate of first is about 580
	// 10x10 board
	let currentX = initialX;
	let currentY = initialY;
	for (var y = 0; y < 10; y++){
		for (var x = 0; x < 10; x++) {
			if (mousePosition.x <= currentX + interval && mousePosition.x >= currentX - interval && mousePosition.y <= currentY + interval && mousePosition.y <= currentY - interval){
				piece.currentX = currentX;
				piece.currentY = currentY - (2*interval);
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
$(window).on("load", function() {
		board.src = "/assets/map.svg";
		redButton.src = "/assets/redbutton.svg";
		blueButton.src = "/assets/bluebutton.svg";
		logo.src = "/assets/logo.svg";
		playerPieces = generatePlayerPieces(playerPieces);
		enemyPieces = generateEnemyPieces(enemyPieces);
		console.log("enemyPieces after function = ", enemyPieces);
		drawEnemyPieces(ctx, enemyPieces);
		drawPlayerPiecesInitial(ctx, playerPieces);
		pieces= [...playerPieces].concat(enemyPieces);
		setInterval(function() { drawPieces(); }, functionInterval);
		});
