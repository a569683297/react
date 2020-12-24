const createSquare = () => {
    let r = randomSquare();
    return {
        square: r[0],
        top: 0,
        left: 6,
        type: r[1],
        // color:getRandomColor() 随机颜色
        color: getRandomColor(r[1])
    }
};

function randomSquare() {
    let allTypeIndex = [
        [[1, 1, 1, 1]],
        [[1, 1], [1, 1]],
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1, 1], [1, 1, 0]],
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0, 0], [1, 1, 1]],
        [[0, 0, 1], [1, 1, 1]]
    ];
    let allType = ['I', 'O', 'Z', 'UZ', 'T', 'L', "UL"];
    let num = Math.floor(Math.random() * 7);
    return [allTypeIndex[num], allType[num]];
}
function getRandomColor(squareType) {
    /*随机色*/
    // let colorH:string = '#'+Math.floor(Math.random()*0xffffff).toString(16);
    // if (colorH == "#ffffff") getRandomColor('');
    // return colorH;
    /*固定*/
    switch (squareType) {
        case 'I': {
            return "#e57373";
        }
        case 'O': {
            return "#9575cd";
        }
        case 'Z': {
            return "#64b5f6";
        }
        case 'UZ': {
            return "#81c784";
        }
        case 'T': {
            return "#fff176";
        }
        case 'L': {
            return "#00e676";
        }
        case 'UL': {
            return "#ba68c8";
        }
    }
}
const transformL = () => {
    let tl = [
        [
            [1, 1], [1, 0], [1, 0]
        ],
        [
            [1, 1, 1], [0, 0, 1]
        ],
        [
            [0, 1], [0, 1], [1, 1]
        ],
        [
            [1, 0, 0], [1, 1, 1]
        ]
    ];
    return tl;
};
const transformUL = () => {
    let tul = [
        [
            [1, 0], [1, 0], [1, 1]
        ],
        [
            [1, 1, 1], [1, 0, 0]
        ],
        [
            [1, 1], [0, 1], [0, 1]
        ],
        [
            [0, 0, 1], [1, 1, 1]
        ]
    ];
    return tul;
};

const transformT = () => {
    let tul = [
        [
            [1, 0], [1, 1], [1, 0]
        ],
        [
            [1, 1, 1], [0, 1, 0]
        ],
        [
            [0, 1], [1, 1], [0, 1]
        ],
        [
            [0, 1, 0], [1, 1, 1]
        ]
    ];
    return tul;
};
const transformZ = () => {
    let tz = [
        [
            [0, 1], [1, 1], [1, 0]
        ],
        [
            [1, 1, 0], [0, 1, 1]
        ]
    ]
    return tz;
}
const transformUZ = () => {
    let tuz = [
        [
            [1, 0], [1, 1], [0, 1]
        ],
        [
            [0, 1, 1], [1, 1, 0]
        ]

    ]
    return tuz;
}
export {
    createSquare,
    transformL,
    transformUL,
    transformZ,
    transformUZ,
    transformT
}