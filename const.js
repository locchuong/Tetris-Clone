"use strict";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    [150,150,150], // None
    [0,255,255], //Cyan
    [0,0,255], //Blue
    [255,165,0], // Orange
    [255,255,0], // Yellow
    [0,255,0], // Green
    [255,0,255], // Purple
    [255,0,0] // Red
];
const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 2
};

const SHAPES = [
    [ // None
        [0]
    ],
    [ // Cyan
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        
    ],
    [ // Blue
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [ // Orange
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    [ // Yellow
        [4, 4],
        [4, 4],
    ],
    [ // Green
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    [ // Purple
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    [ // Red
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ],
];
// 0 is J L S T Z
// 1 is I
const WALLKICKSEQ = [
    [ // J L S T Z
        [ // 0 - > R
            [0, 0],
            [-1, 0],
            [-1, 1],
            [0, -2],
            [-1, -2]
        ],
        [ // R -> 2
            [0,0],
            [1,0],
            [1,-1],
            [0,2],
            [1,2]
        ],
        [ // 2 -> L
            [0,0],
            [1,0],
            [1,1],
            [0,-2],
            [1,-2]
        ],
        [ // L -> 0
            [0,0],
            [-1,0],
            [-1,-1],
            [0,2],
            [-1,2]
        ]
    ], // I
    [
        [ // 0 - > R
            [0,0],
            [-2,0],
            [1,0],
            [-2,1],
            [1,2]
        ],
        [  // R -> 2
            [0,0],
            [-1,0],
            [2,0],
            [-1,2],
            [2,-1]
        ],
        [  // 2 -> L
            [0,0],
            [2,0],
            [-1,0],
            [2,1],
            [-1,-2]
        ],
        [  // L -> 0
            [0,0],
            [1,0],
            [-2,0],
            [1,-2],
            [-2,1]
        ]

    ]
];

const LEVEL = [
    800, // 1
    720, // 2
    630, // 3
    550, // 4
    470, // 5
    380, // 6
    300, // 7
    220, // 8
    130, // 9
    100, // 10
    80, // 11
    80, // 12
    80, // 13
    70, // 14
    70, // 15
    70, // 16
    50, // 17
    50, // 18
    50, // 19
    30, // 20
    30, // 21
    20, // 22, 20ms for anything above 222
];