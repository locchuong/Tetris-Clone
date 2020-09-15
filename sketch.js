
var cnv;          // Canvas
var board;        // Board object: handles game grid, curr piece, next piece
var keyEvents;  // Boolean: handles when to accept key events

var difficulty;   // Time interval to drop object
var time;         // Piece drop time interval object

// Gui variables
var titleP;
var scoreP;
var LinesP;
var LevelP;
var playBtn;
var gameOverTxt;

function setup() {
  // Create canvas
  cnv = createCanvas( 2 * COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
  cnv.parent('canvas-holder');
  cnv.style('border', '3px solid grey');
  cnv.style('display', 'inline-block');
  // Create and reset board
  board = new Board();
  board.reset();
  // Initiate starting drop interval, difficulty, and score
  time = setInterval(drop, LEVEL[board.level-1]);
  // Set to accept key events
  keyEvents = true;
  // Create GUI (title, scoreboard, levels, and lines)
  createGUI();
  // Slow framerate to handle key holds
  frameRate(20);
}


// Game Loop
function draw() {
  background(255);
  // Handles user DOWN_ARROW key event
  if (keyIsDown(DOWN_ARROW)) {
    if(board.drop()) {
      board.score += POINTS.SOFT_DROP;
    }
    else {
      board.freeze();
      if(board.clearLines()) {
        clearInterval(time);
        time = setInterval(drop, LEVEL[board.level-1]);
      }
      if(!board.generatePiece()) {
        gameOver();
      }
    }
  }
  board.draw();
  board.projection.drawProjection();
  if(board.hold) board.hold.drawNext(COLS * 1.55,ROWS * 1/2); 
  if(board.valid(0,0, board.piece)) board.piece.draw();
  board.next.drawNext(COLS * 1.05,ROWS * 1/2);
  // Update score-bord
  scoreP.html('Score:' + board.score);
  linesP.html('Lines:' + board.lines);
  levelP.html('Level:' + board.level);
  // Draw dividing line between game and gui
  stroke(color('grey'));
  strokeWeight(3);
  line(COLS * BLOCK_SIZE, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
  
}

// Handles creating title, score, lines, level, and play button
function createGUI() {
  // Create Title 
  titleP = createP('TETRIS');
  titleP.parent('canvas-holder');
  titleP.id('gameTitle');
  titleP.position((cnv.width/2) + textWidth(titleP)/3, 0);
  // Create Score board
  scoreP = createP('Score:' + board.score);
  scoreP.parent('canvas-holder');
  scoreP.position((cnv.width/2) + 20, 4/20 * cnv.height);

  // Create Lines board
  linesP = createP('Lines:' + board.lines);
  linesP.parent('canvas-holder');
  linesP.position((cnv.width/2) + 20, 5/20 * cnv.height);

  // Create Level board
  levelP = createP('Level:' + board.level);
  levelP.parent('canvas-holder');
  levelP.position((cnv.width/2) + 20, 6/20 * cnv.height);

  // Create Next text
  nextP = createP('NEXT');
  nextP.parent('canvas-holder');
  nextP.position((cnv.width/2) + 15, 8/20 * cnv.height);

  // Create Hold text
  holdP = createP('HOLD');
  holdP.parent('canvas-holder');
  holdP.position((cnv.width/2) + 165, 8/20 * cnv.height);

  // Create Play Button
  playBtn = createButton('Play');
  playBtn.position(cnv.width/2 * 1.05, cnv.height - playBtn.height * 4);
  playBtn.addClass('play-button');
  playBtn.parent('canvas-holder');
  playBtn.mousePressed(playButton);
}

// Wrapper function to board.drop()
function drop() {
  if(!board.drop()) {
    board.freeze();
    if(board.clearLines()) {
      clearInterval(time);
      time = setInterval(drop, LEVEL[board.level-1]);
    }
    if(!board.generatePiece()) {
      gameOver();
    }
  }
}

// Function to handle play button press
function playButton() {
  clearInterval(time);
  if(gameOverTxt)   gameOverTxt.remove();
  board.reset();
  loop();
  time = setInterval(drop, LEVEL[board.level-1]);
  keyEvents = true;
}

// Game over sequence, called when game over conditions met
function gameOver() {
  noLoop();
  gameOverTxt = createP(
    'GAMEOVER'
  ).addClass('Press+Start+2P h2');
  gameOverTxt.parent('canvas-holder');
  gameOverTxt.position((cnv.width/32), height/4);
  clearInterval(time);
  keyEvents=false;
}

// Key Event handler
function keyPressed() {
  // Check if key events are allowed, if not then abort
  if(!keyEvents) return false; 
  // Handles left piece movement
  if(keyCode === LEFT_ARROW) {
    if(board.valid(-1, 0, board.piece)) board.piece.x--;
    board.projectPiece();
  }
  // Handles right piece movement
  else if (keyCode === RIGHT_ARROW) {
    if(board.valid(1, 0, board.piece)) board.piece.x++;
    board.projectPiece();
  }
  // Handles piece hard drop
  else if (keyCode === 32) {
    while(board.drop()) {
      board.score += POINTS.HARD_DROP;
    }
    board.freeze();
    if(board.clearLines()) {
      clearInterval(time);
      time = setInterval(drop, LEVEL[board.level-1]);
    }
    if(!board.generatePiece()) {
      gameOver();
    }
  }
  // Handles piece rotation
  else if (keyCode === UP_ARROW) {
    board.rotatePiece();
  }
  // Handles early game over
  else if (keyCode === ESCAPE) {
    gameOver();
  }
  else if (keyCode === 16) {
    board.holdPiece();
  }
 return false;
}