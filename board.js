class Board {
    grid; // Game board
    piece; // Current piece
    projection; // Current piece's projection down onto board
    next; // Next piece 
    lines; // Number of lines cleared
    score; // Score board
    level; // Level counter
    hold; // Game piece that is held for later
    holdToggle; // Checks whether swapping curr piece with hold is allowed

    // Reset Board and piece
    reset() {
        this.grid = this.getEmptyBoard();
        this.piece = new Piece();
        this.projection = new Piece();
        this.projectPiece();
        this.next = new Piece();
        this.lines = 0;
        this.score = 0;
        this.level = floor(this.lines/10) + 1;
        this.holdToggle = true;
        this.hold = undefined;
    }

    // Return empty 2D Array by ROWS and COLS
    getEmptyBoard() {
        return Array.from({
            length: ROWS
        }, () => Array(COLS).fill(0));
    }

    // Draw board from grid values
    draw() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] > 0) {
                    noStroke();
                    fill(COLORS[this.grid[i][j]]);
                    square(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    // Handles clearing lines on board, counting number of lines cleared, and level assignment
    clearLines() {
        let numCleared = 0;
        for(let i = 0; i < this.grid.length; i++) {
            if(this.grid[i].every(value => value > 0)) {
                numCleared++;
                this.grid.splice(i, 1);
                this.grid.unshift(Array(COLS).fill(0));
            }
        }
        this.lines += numCleared;
        if(this.level < 21) this.level = floor(this.lines/10) + 1;
        switch(numCleared) {
            case 1:
                this.score += POINTS.SINGLE;
                return true;
            case 2:
                this.score += POINTS.DOUBLE;
                return true;
            case 3:
                this.score += POINTS.TRIPLE;
                return true;
            case 4:
                this.score += POINTS.TETRIS;
                return true;
            default:
                return false;
        }
    }


    // Handles freezing current piece onto board and populating grid
    freeze() {
        this.holdToggle = true;
        for (let i = 0; i < this.piece.shape.length; i++) {
            for (let j = 0; j < this.piece.shape[i].length; j++) {
                if(this.piece.shape[i][j] > 0) {
                    this.grid[this.piece.y + i][this.piece.x + j] = this.piece.shape[i][j];
                }
            }
        }
    }
    
    // Wrapper function for dropping piece
    drop() {
        if(this.valid(0, 1, this.piece)) {
            this.piece.y++;
            return true;
        }
        return false;
    }

    // Handles hold functionality 
    holdPiece() {
        // Only allow hold once per freeze call
        if(!this.holdToggle) return;
        this.holdToggle = false;
        // Save obj to swap
        let temp = this.hold;
        let temp2 = this.piece;
        this.hold = temp2;
        // Restore original orientation of shape
        this.hold.shape = SHAPES[this.hold.type].map(function(arr) {
            return arr.slice();
        });
        this.hold.wallKickState = 0;
        // If hold object exists, swap current piece and hold obj
        if(temp) {
            // Swap piece and hold, restoring orientation and position
            this.piece = temp;
            this.piece.x = 3;
            this.piece.y = 0;
            this.piece.shape = SHAPES[this.piece.type].map(function(arr) {
                return arr.slice();
            });
            this.piece.wallKickState = 0;
            board.projectPiece();
        }
        // First call to holdPiece(), hold current piece and generate new piece
         else {
            this.generatePiece();
         }
    }


    // Check if translation by (x,y) relative to piece's (x,y) is valid
    valid(x, y, pieceX) {
        for (let i = 0; i < pieceX.shape.length; i++) {
            for (let j = 0; j < pieceX.shape[i].length; j++) {
                let x2 = pieceX.x + j + x;
                let y2 = pieceX.y + i + y;
                if (pieceX.shape[i][j] === 0 || (this.validWalls(x2) && this.validFloor(y2) && this.validBlock(x2, y2))) {
                    continue;
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    // Check if rotation (Always clock-wise) is valid
    rotatePiece() {
        // Save original orientation to copy, rotate original piece
        const original = this.piece.rotate();
        let state = this.piece.wallKickState;
        // Check up to 5 Wall kicks, then fail if none are valid
        for (let i = 0; i < this.piece.wallKickSeq[state].length; i++) {
            let x = this.piece.wallKickSeq[state][i][0];
            let y = this.piece.wallKickSeq[state][i][1] * -1;
            if (this.valid(x, y, this.piece)) {
                this.piece.x = this.piece.x + x;
                this.piece.y = this.piece.y + y;
                this.piece.wallKickState = (this.piece.wallKickState + 1) % 4;
                this.projectPiece();
                return;
            }
        }
        // Rotation failed, restore piece to original orientation
        this.piece.shape = original;
    }

    // Helper method to valid(): Checks for collision with other blocks
    validBlock(x, y) {
        return (this.grid[y]) && (this.grid[y][x] == 0);
    }

    // Helper method to valid(): Checks for collision with side border
    validWalls(x) {
        return x >= 0 && x < COLS;
    }

    // Helper method to valid(): Checks for collision with floor
    validFloor(y) {
        return y <= ROWS;
    }

    // Method to project current piece down onto board
    projectPiece() {
        this.projection.x = this.piece.x;
        this.projection.y = this.piece.y;
        this.projection.color = this.piece.color;
        this.projection.shape = this.piece.shape.map(function(arr) {
            return arr.slice();
        });
        this.projection.wallKickSeq = this.piece.wallKickSeq;
        this.projection.wallKickState = this.piece.wallKickState;
        while(this.valid(0,1, this.projection)) {
            this.projection.y++;
        }
    }

    // Handles generating new piece and checking validity of game
    generatePiece() {
        this.piece = this.next;
        this.projectPiece();
        if(this.valid(0,0, this.piece)) {
            this.next = new Piece();
            return true;
        }
        else {
            return false;
        }

    }
}