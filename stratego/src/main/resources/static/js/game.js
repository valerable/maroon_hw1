// Turn 0 = Setup
// Turn 1 = Player 1 and Turn 2 = Player 2 and so on....

var testing = false;

$(function() {

    if (window.location.hash) {
        var hash = window.location.hash.substring(1);
        if (hash == "test") {
            testing = true;
        }
    } else {
        // No hash found
    }

    // Render Map
    renderMap(initGame(setMap()), true, false);
});

// Set the Map
function setMap() {
    var map = Array.from(Array(10), () => Array(10));

    for (var y = 0; y < 10; y++) {
        for (var x = 0; x < 10; x++) {
            if (((1 < x && x < 4) || (5 < x && x < 8)) && (3 < y && y < 6)) {
                map[y][x] = "-1";
            } else {
                map[y][x] = "0";
            }

        }
    }

    return map;
}


function initGame(Map) {
    var p1pieces = [];
    var p2pieces = [];

    // Add 1 Marshall
    p1pieces.push(makePiece("10", "0"));
    p2pieces.push(makePiece("10", "0"));

    // Add 1 General
    p1pieces.push(makePiece("9", "0"));
    p2pieces.push(makePiece("9", "0"));

    // Add 2 Marshall
    for (var i = 0; i < 2; i++) {
        p1pieces.push(makePiece("8", i));
        p2pieces.push(makePiece("8", i));
    }

    // Add 3 Major
    for (var i = 0; i < 3; i++) {
        p1pieces.push(makePiece("7", i));
        p2pieces.push(makePiece("7", i));
    }

    // Add 4 Captains
    for (var i = 0; i < 4; i++) {
        p1pieces.push(makePiece("6", i));
        p2pieces.push(makePiece("6", i));
    }

    // Add 4 Lieutenants
    for (var i = 0; i < 4; i++) {
        p1pieces.push(makePiece("5", i));
        p2pieces.push(makePiece("5", i));
    }

    // Add 4 Sergeants
    for (var i = 0; i < 4; i++) {
        p1pieces.push(makePiece("4", i));
        p2pieces.push(makePiece("4", i));
    }

    // Add 5 Miners
    for (var i = 0; i < 5; i++) {
        p1pieces.push(makePiece("3", i));
        p2pieces.push(makePiece("3", i));
    }

    // Add 8 Scouts
    for (var i = 0; i < 8; i++) {
        p1pieces.push(makePiece("2", i));
        p2pieces.push(makePiece("2", i));
    }

    // Add 1 Spy
    p1pieces.push(makePiece("1", "0"));
    p2pieces.push(makePiece("1", "0"));

    // Add 6 Bombs
    for (var i = 0; i < 6; i++) {
        p1pieces.push(makePiece("B", i));
        p2pieces.push(makePiece("B", i));
    }

    // Add 1 Flag
    p1pieces.push(makePiece("F", "0"));
    p2pieces.push(makePiece("F", "0"));


    var game = {
        map: Map,
        p1: p1pieces,
        p2: p2pieces,
        turn: 0
    }

    return game;
};

function getSVG(piece, player) {
    var svg = $("<img>");

    if (player == 1) {
        svg.attr("class", ' piece');
        svg.attr("id", 'player1' + piece.id);
    } else {
        svg.attr("class", 'enemypiece');
        svg.attr("id", 'player2' + piece.id);
    }

    var charVal = piece.value;
    switch (charVal) {
        case "2":
            svg.attr("src", "../assets/stratego-scout.svg")
            break;
        case "3":
            svg.attr("src", "../assets/stratego-miner.svg")
            break;
        case "4":
            svg.attr("src", "../assets/stratego-sergeant.svg")
            break;
        case "5":
            svg.attr("src", "../assets/stratego-lieutenant.svg")
            break;
        case "6":
            svg.attr("src", "../assets/stratego-captain.svg")
            break;
        case "7":
            svg.attr("src", "../assets/stratego-major.svg")
            break;
        case "8":
            svg.attr("src", "../assets/stratego-colonel.svg")
            break;
        case "9":
            svg.attr("src", "../assets/stratego-general.svg")
            break;
        case "10":
            svg.attr("src", "../assets/stratego-marshal.svg")
            break;
        case "B":
            svg.attr("src", "../assets/stratego-bomb.svg")
            break;
        case "F":
            svg.attr("src", "../assets/stratego-flag.svg")
            break;
        case "1":
            svg.attr("src", "../assets/stratego-spy.svg")
            break;
    }

    return svg;
}

// Prints Map
function renderMap(game, init, noTurn) {
    var n = 10;
    var m = 10;
    var player = ((game.turn + 1) % 2) + 1;

    if (init == true) {
        var table = $("<table></table>");
        table.attr("class", "gameBoard");

        for (i = 0; i < n; i++) {
            var row = $("<tr></tr>");
            for (j = 0; j < m; j++) {
                var block = $("<td></td>");
                var mapVal = game.map[i][j];
                block.attr("id", "X" + j + "Y" + i);
                if (mapVal == -1) {
                    block.attr("class", "noMove boardPlace");
                } else {
                    block.attr("class", "empty boardPlace");
                }
                row.append(block);
            }
            table.append(row);
        }

        $("#gameBoard").append(table);

        // Takes Pieces from array and sets on board
        for (var i = 0; i < game.p1.length; i++) {
            $("#P1SideBoard").append(getSVG(game.p1[i], 1));
        }

        for (var i = 0; i < game.p2.length; i++) {
            $("#P2SideBoard").append(getSVG(game.p2[i], 2));
        }

        playerTurn(game);
    } else {

        for (i = 0; i < n; i++) {
            for (j = 0; j < m; j++) {
                var mapVal = game.map[i][j];
                $("#X" + j + "Y" + i).removeClass("empty");
                if (mapVal == "-1") {
                    $("#X" + j + "Y" + i).attr("class", "noMove boardPlace");
                    $("#X" + j + "Y" + i).html("");
                } else if (mapVal == "0") {
                    $("#X" + j + "Y" + i).attr("class", "empty boardPlace");
                    $("#X" + j + "Y" + i).html("");
                }
            }
        }

        if (game.turn != 0) {
            $("#P1SideBoard").html("");
            $("#P2SideBoard").html("");
        }

        for (var z = 0; z < game.p1.length; z++) {
            var piece = game.p1[z];
            var x = piece.X;
            var y = piece.Y;

            if (piece.lost == true) {
                $("#P2SideBoard").append(getSVG(piece, 2));
            } else {
                $("#X" + x + "Y" + y).removeClass("empty");
                $("#X" + x + "Y" + y).addClass("player");
                if ($("#X" + x + "Y" + y).html() == "") {
                    $("#X" + x + "Y" + y).attr("class", "player boardPlace");
                    $("#X" + x + "Y" + y).append(getSVG(piece, 1));
                }
            }
        }

        for (var z = 0; z < game.p2.length; z++) {
            var piece = game.p2[z];
            var x = piece.X;
            var y = piece.Y;

            if (piece.lost == true) {
                $("#P1SideBoard").append(getSVG(piece, 2));
            } else {
                $("#X" + x + "Y" + y).removeClass("empty");
                $("#X" + x + "Y" + y).addClass("hide enemy");
                if ($("#X" + x + "Y" + y).html() == "") {
                    $("#X" + x + "Y" + y).attr("class", "hide enemy boardPlace");
                    $("#X" + x + "Y" + y).append(getSVG(piece, 2));
                }
            }
        }

        if (game.turn != 0 && noTurn == false) {
            clearDrags(player);
            nextTurn(game);
        }
    }
}

function makePiece(charVal, multiVal) {
    var piece = {
        placed: false,
        lost: false,
        X: -1,
        Y: -1,
        value: "",
        id: ""
    }

    switch (charVal) {
        case "2":
            piece.value = "2";
            piece.id = "Scout" + multiVal;
            break;
        case "3":
            piece.value = "3";
            piece.id = "Miner" + multiVal;
            break;
        case "4":
            piece.value = "4";
            piece.id = "Sergeant" + multiVal;
            break;
        case "5":
            piece.value = "5";
            piece.id = "Lieutenant" + multiVal;
            break;
        case "6":
            piece.value = "6";
            piece.id = "Captain" + multiVal;
            break;
        case "7":
            piece.value = "7";
            piece.id = "Major" + multiVal;
            break;
        case "8":
            piece.value = "8";
            piece.id = "Colonel" + multiVal;
            break;
        case "9":
            piece.value = "9";
            piece.id = "General" + multiVal;
            break;
        case "10":
            piece.value = "10";
            piece.id = "Marshall" + multiVal;
            break;
        case "B":
            piece.value = "B";
            piece.id = "Bomb" + multiVal;
            break;
        case "F":
            piece.value = "F";
            piece.id = "Flag" + multiVal;
            break;
        case "1":
            piece.value = "1";
            piece.id = "Spy" + multiVal;
            break;
    }

    return piece;
}

function placePiece(player, pieceIndex, game, newXStr, newYStr) {
    var piece;
    var newX = parseInt(newXStr);
    var newY = parseInt(newYStr);

    if (player == 1) {
        piece = game.p1[pieceIndex];
    } else {
        piece = game.p2[pieceIndex];
    }

    if (piece.placed == false) {
        if (player == 1 && newY < 10 && newY > 5 && newX < 10 && newX > -1 && isEmpty(newX, newY)) {
            //Player 1
            game.map[newY][newX] = player + piece.value;
            piece.X = newX;
            piece.Y = newY;
            piece.placed = true;
            return 0;
        } else if (player == 2 && newY > -1 && newY < 4 && newX < 10 && newX > -1 && isEmpty(newX, newY)) {
            //Player 2
            //If the piece have not been placed yet
            game.map[newY][newX] = player + piece.value;
            piece.X = newX;
            piece.Y = newY;
            piece.placed = true;
            var idToPull = checkIfOnSideboard(piece.id);
            $(idToPull).detach().appendTo("#X" + newX + "Y" + newY);
            return 0;
        } else {
            return -1;
        }
    } else {
        if (piece.value == "2") {
            if (
                ((newX != piece.X && newY == piece.Y) ||
                    (newX == piece.X && newY != piece.Y)) &&
                newY < 10 && newY > -1 && newX < 10 && newX > -1) {

                if ((newX != piece.X && newY == piece.Y)) {
                    if (newX < piece.X) {
                        for (var x = piece.X - 1; x > newX; x = x - 1) {
                            if (!isEmpty(x, newY)) {
                                return -1;
                            }
                        }
                    } else {
                        for (var x = piece.X + 1; x < newX; x++) {
                            if (!isEmpty(x, newY)) {
                                return -1;
                            }
                        }
                    }
                } else {
                    if (newY < piece.Y) {
                        for (var y = piece.Y - 1; y > newY; y = y - 1) {
                            if (!isEmpty(newX, y)) {
                                return -1;
                            }
                        }
                    } else {
                        for (var y = piece.Y + 1; y < newY; y++) {
                            if (!isEmpty(newX, y)) {
                                return -1;
                            }
                        }
                    }
                }

                if (isEmpty(newX, newY)) {
                    game.map[newY][newX] = game.map[piece.Y][piece.X];
                    game.map[piece.Y][piece.X] = "0";
                    $("#X" + newX + "Y" + newY).removeClass("empty");
                    $("#X" + piece.X + "Y" + piece.Y).addClass("empty");
                    piece.X = newX;
                    piece.Y = newY;
                    return 0;
                } else if (attack(game, piece, newX, newY) != -1) {
                    var attackStatus = attack(game, piece, newX, newY);

                    console.log(attackStatus);
                    $("#X" + newX + "Y" + newY).removeClass("hide");
                    switch (attackStatus) {
                        case 0:
                            // 0 = Attacking Piece Removed
                            removePiece(piece, game);
                            break;
                        case 1:
                            // 1 = Attacked Piece Removed
                            var attackedPiece;

                            if (player == 1) {
                                attackedPiece = game.p2[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                            } else {
                                attackedPiece = game.p1[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                            }
                            removePiece(attackedPiece, game);
                            break;
                        case 2:
                            // 2 = Both Pieces Removed
                            var attackedPiece;

                            if (player == 1) {
                                attackedPiece = game.p2[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                            } else {
                                attackedPiece = game.p1[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                            }

                            removePiece(attackedPiece, game);
                            removePiece(piece, game);
                            break;
                    }
                    $("#X" + newX + "Y" + newY).removeClass("hide");
                    $("#X" + piece.X + "Y" + piece.Y).removeClass("hide");
                } else {
                    return -1;
                }

            } else {
                return -1;
            }
        } else if (
            ((newX == piece.X + 1 && newY == piece.Y + 0) ||
                (newX == piece.X - 1 && newY == piece.Y + 0) ||
                (newX == piece.X + 0 && newY == piece.Y + 1) ||
                (newX == piece.X + 0 && newY == piece.Y - 1)) &&
            newY < 10 && newY > -1 && newX < 10 && newX > -1 && piece.value != "B" && piece.value != "F") {


            if (isEmpty(newX, newY)) {
                game.map[newY][newX] = game.map[piece.Y][piece.X];
                game.map[piece.Y][piece.X] = "0";
                $("#X" + newX + "Y" + newY).removeClass("empty");
                $("#X" + piece.X + "Y" + piece.Y).addClass("empty");
                piece.X = newX;
                piece.Y = newY;
                return 0;
            } else if (attack(game, piece, newX, newY) != -1) {
                var attackStatus = attack(game, piece, newX, newY);

                console.log(attackStatus);
                $("#X" + newX + "Y" + newY).removeClass("hide");
                switch (attackStatus) {
                    case 0:
                        // 0 = Attacking Piece Removed
                        removePiece(piece, game);
                        break;
                    case 1:
                        // 1 = Attacked Piece Removed
                        var attackedPiece;

                        if (player == 1) {
                            attackedPiece = game.p2[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                        } else {
                            attackedPiece = game.p1[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                        }
                        removePiece(attackedPiece, game);
                        game.map[newY][newX] = game.map[piece.Y][piece.X];
                        game.map[piece.Y][piece.X] = "0";
                        $("#X" + newX + "Y" + newY).removeClass("empty");
                        $("#X" + piece.X + "Y" + piece.Y).addClass("empty");
                        piece.X = newX;
                        piece.Y = newY;
                        break;
                    case 2:
                        // 2 = Both Pieces Removed
                        var attackedPiece;

                        if (player == 1) {
                            attackedPiece = game.p2[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                        } else {
                            attackedPiece = game.p1[getPieceIndex(game, $("#X" + newX + "Y" + newY).children().first().attr("id"))];
                        }

                        removePiece(attackedPiece, game);
                        removePiece(piece, game);
                        break;

                }
                $("#X" + newX + "Y" + newY).removeClass("hide");
                $("#X" + piece.X + "Y" + piece.Y).removeClass("hide");
                return 0;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }
}

// Remove Piece
function removePiece(piece, game) {
    game.map[piece.Y][piece.X] = "0";
    piece.X = -1;
    piece.Y = -1;
    piece.lost = true;
    renderMap(game, false, true);

    var Player1Lose = true;

    for (var z = 0; z < game.p1.length; z++) {
        var piece = game.p1[z];

        if (piece.lost == true && piece.value == "F") {
            endScreen(false, game);
        }

        if (piece.lost == false && (piece.value != "F" || piece.value != "B")) {
            Player1Lose = false;
        }
    }

    var Player2Lose = true;

    for (var z = 0; z < game.p2.length; z++) {
        var piece = game.p1[z];

        if (piece.lost == true && piece.value == "F") {
            endScreen(true, game);
        }

        if (piece.lost == false && (piece.value != "F" || piece.value != "B")) {
            Player2Lose = false;
        }
    }

    if (Player1Lose == true) {
        endScreen(false, game);
    } else if (Player2Lose == true) {
        endScreen(true, game);
    }
}

// Check if spot is empty
function isEmpty(X, Y) {
    if ($("#X" + X + "Y" + Y).hasClass("noMove")) {
        return 0;
    }
    return $("#X" + X + "Y" + Y).hasClass("empty");
}

function getPieceIndex(game, dragId) {
    var id = dragId.substr(7);
    var player = dragId.substr(6, 1);

    if (player == 1) {
        for (var i = 0; i < game.p1.length; i++) {
            if (game.p1[i].id == id) {
                return i;
            }
        }
    } else {
        for (var i = 0; i < game.p2.length; i++) {
            if (game.p2[i].id == id) {
                return i;
            }
        }
    }
    return -1;
}

// Logic for Each Turn
function playerTurn(game) {
    var turnNumber = game.turn;
    var teamPlaying = ((turnNumber + 1) % 2) + 1;
    // 0 is setup
    if (turnNumber == 0) {
        $("#playing").html("Place Pieces");

        $(".piece").each(function() {
            $(this).draggable({
                snap: ".boardPlace",
                revert: true,
                helper: "clone"
            });
        });

        $(".boardPlace").each(function() {
            $(this).droppable({
                drop: function(event, ui) {
                    var dragId = ui.draggable.attr("id");
                    var id = $(this).attr("id");
                    var Y = id.substr(id.length - 1);
                    var X = id.substr(id.length - 3, 1);
                    if (placePiece(1, getPieceIndex(game, dragId), game, X, Y) == 0) {

                        ui.draggable.detach();
                        $(ui.helper).remove();
                        $(this).droppable("disable");
                        renderMap(game, false, false);

                        if (($("#P1SideBoard").children().length == 0 || testing == true) && game.turn == 0) {

                            for (var i = 0; i < boardValues.length; i++) {
                                var index = correlateValues(i, game);
                                placePiece(2, index, game, i % 10, Math.floor(i / 10));
                                //Append the svg to the board
                            }

                            clearDrags(teamPlaying);
                            nextTurn(game);
                        }
                    }
                }
            });
        });

    } else {

        if (teamPlaying == 1) {
            $("#playing").html("Blue Teams Move");

            $(".piece").each(function() {
                if (!$(this).data('ui-draggable')) {
                    $(this).draggable({
                        snap: ".boardPlace",
                        revert: true,
                        helper: "clone"
                    });
                } else {
                    $(this).draggable("enable");
                }
            });

        } else {

            $("#playing").html("Red Teams Move");

            //make move here
            AIMove(game);
            nextTurn(game);
        }

        $(".boardPlace").each(function() {
            $(this).droppable("enable");
        });

    }
}


function clearDrags(teamPlaying) {
    $(".piece").each(function() {
        if ($(this).data('ui-draggable')) {
            $(this).draggable("disable");
        }
    });

    $(".boardPlace").each(function() {
        $(this).droppable("disable");
    });
}

// Iterator for turns
function nextTurn(game) {

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/sendGameData",
        data: JSON.stringify(game),
        dataType: 'json'
    }).done(function(data) {
        console.log("Next Turn!");
        console.log(game);
        renderMap(game, false, true);
        game.turn++;

        setTimeout(function() { playerTurn(game); }, 2000);

    });

}

// Logic for taking a piece
// -1 = failed
// 0 = Attacking Piece Removed
// 1 = Attacked Piece Removed
// 2 = Both Pieces Removed
function attack(game, piece, X, Y) {
    var pieceBeingAttacked = game.map[Y][X];
    var teamAttacked = pieceBeingAttacked.substr(0, 1);
    var valAttacked = pieceBeingAttacked.substr(1, 1);
    var teamAttacking = ((game.turn + 1) % 2) + 1;
    var valAttacking = piece.value;

    if ($("#X" + X + "Y" + Y).hasClass("noMove") || $("#X" + X + "Y" + Y).hasClass("empty")) {
        return -1;
    }

    if (valAttacking == "F" || valAttacking == "B") {
        console.log("Flags and Bombs can't move!");
        return -1;
    }

    if (teamAttacked == teamAttacking) {
        console.log("No Friendly Fire!");
        return -1;
    }

    if (valAttacking == valAttacked) {
        return 2;
    }

    console.log("Attacked: " + valAttacked + " Attacking: " + valAttacking)
    switch (valAttacked) {
        case "1":
            // Spy
            return 1;
        case "2":
            // Scout
            if (valAttacking < 2) {
                return 0;
            } else {
                return 1;
            }
        case "3":
            // Miner
            if (valAttacking < 3) {
                return 0;
            } else {
                return 1;
            }
        case "4":
            // Sergeant
            if (valAttacking < 4) {
                return 0;
            } else {
                return 1;
            }
        case "5":
            // Lieutenant
            if (valAttacking < 5) {
                return 0;
            } else {
                return 1;
            }
        case "6":
            // Captain
            if (valAttacking < 6) {
                return 0;
            } else {
                return 1;
            }
        case "7":
            // Major
            if (valAttacking < 7) {
                return 0;
            } else {
                return 1;
            }
        case "8":
            // Colonel
            if (valAttacking < 8) {
                return 0;
            } else {
                return 1;
            }
        case "9":
            // General
            if (valAttacking < 9) {
                return 0;
            } else {
                return 1;
            }
        case "10":
            // Marshall
            if (valAttacking < 10 && valAttacking > 1) {
                return 0;
            } else {
                return 1;
            }
        case "B":
            // Bomb
            if (valAttacking == 3) {
                return 1;
            } else {
                return 0;
            }
        case "F":
            console.log("Gottem!");
            endScreen(true, game);
            return 1;
    }

}

// Disables UI and displays modal
function endScreen(win, game) {
    // disables canvas below
    // if win then show win screen
    // if lose then show lose screen
    var modal = document.createElement("div");
    var modalContent = document.createElement("div");
    var text = document.createElement("p");
    modal.setAttribute("id", "endScreen");
    modal.setAttribute("class", "modal");
    modal.style.display = "block";
    modalContent.setAttribute("class", "modal-content");
    if (win == true) {
        text.innerHTML = "You Win!";
    } else {
        text.innerHTML = "You Lose!";
    }
    modalContent.appendChild(text);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}