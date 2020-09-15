class Piece {
    x; // X-coord of piece relative to board's grid
    y; // Y-coord of piece relative to board's grid
    color; // Color of piece
    shape; // Shape of piece (2D array)
    wallKickSeq; // Handles wall kick sequence
    wallKickState; // Handles where in the wall kick sequence the piece is
    type; // Type of piece

    constructor() {
        this.spawn();
    }
    
    // Spawns in new random piece
    spawn() {
        let ran = floor(random(7)) + 1;
        this.type = ran;
        this.x = 3;
        this.y = 0;
        this.color = color(COLORS[ran]);
        this.shape = SHAPES[ran].map(function(arr) {
            return arr.slice();
        });
        if(ran == 1) {
            this.wallKickSeq = WALLKICKSEQ[1];
        }
        else {
            this.wallKickSeq = WALLKICKSEQ[0];
        }
        this.wallKickState = 0;
    }

    // Draws current piece with respect to the piece's x and y coords on the grid
    draw() {
        for(let i = 0; i < this.shape.length; i++) {
            for(let j = 0; j < this.shape[i].length; j++) {
                if(this.shape[i][j] > 0) {
                    fill(this.color);
                    noStroke();
                    square((this.x  + j)* BLOCK_SIZE, (this.y + i) * BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    // Draws current piece's projection
    drawProjection() {
        for(let i = 0; i < this.shape.length; i++) {
            for(let j = 0; j < this.shape[i].length; j++) {
                if(this.shape[i][j] > 0) {
                    fill(color('grey'));
                    noStroke();
                    square((this.x  + j)* BLOCK_SIZE, (this.y + i) * BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    // Draw current piece with respect to params x and y
    drawNext(x, y) {
        for(let i = 0; i < this.shape.length; i++) {
            for(let j = 0; j < this.shape[i].length; j++) {
                if(this.shape[i][j] > 0) {
                    fill(this.color);
                    noStroke();
                    square((x  + j)* BLOCK_SIZE, (y + i) * BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    // Rotate current piece's shape
    rotate() {
        // Deep copy
        const copy = Array.from(
            {length: this.shape.length}, () => Array(this.shape[0]).fill(0)
        );
        for(let i = 0; i < this.shape.length; i++) {
            for(let j = 0; j < this.shape[i].length; j++) {
                copy[i][j] = this.shape[i][j];
            }
        }
        // Rotation
        for(let y = 0; y < this.shape.length; y++) {
            for(let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = [this.shape[y][x], this.shape[x][y]];
            }
        }
        this.shape.forEach(row => row.reverse());
        return copy;
    }
}