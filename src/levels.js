import { Level } from "./entities/level";
import { Point } from "./entities/point";
import { CharacterType } from "./enum/character-type";
import { DirectionType } from "./enum/direction-type";

export const Levels = [
    new Level(
        [new Point(3, 4), new Point(4, 4), new Point(5, 4)],
        [
            [CharacterType.SHIELD, new Point(4, 6), DirectionType.UP],
        ],
        [
            [CharacterType.MELEE, new Point(4, 1), DirectionType.DOWN],
        ]
    ),
    new Level(
        [new Point(3, 4), new Point(4, 4), new Point(5, 4)],
        [
            [CharacterType.MELEE, new Point(4, 6), DirectionType.UP],
        ],
        [
            [CharacterType.SHIELD, new Point(4, 1), DirectionType.DOWN],
        ]
    ),
    new Level(
        [new Point(2, 4), new Point(3, 4), new Point(4, 4), new Point(5, 4)],
        [
            [CharacterType.RANGE, new Point(4, 6), DirectionType.UP],
        ],
        [
            [CharacterType.SHIELD, new Point(4, 2), DirectionType.DOWN],
        ]
    ),
    new Level(
        [new Point(4, 4), new Point(5, 4), new Point(6, 4), new Point(7, 4), new Point(8, 4)],
        [
            [CharacterType.RANGE, new Point(4, 6), DirectionType.UP],
            [CharacterType.SHIELD, new Point(6, 8), DirectionType.UP],
        ],
        [
            [CharacterType.SHIELD, new Point(4, 2), DirectionType.DOWN],
            [CharacterType.SHIELD, new Point(3, 2), DirectionType.DOWN],
        ]
    ),
    new Level(
        [
            new Point(4, 1), new Point(4, 2), new Point(5, 2),
            new Point(6, 3), new Point(6, 4), new Point(7, 4)
        ],
        [
            [CharacterType.RANGE, new Point(5, 7), DirectionType.UP],
        ],
        [
            [CharacterType.SHIELD, new Point(4, 0), DirectionType.LEFT],
            [CharacterType.MELEE, new Point(7, 1), DirectionType.DOWN],
            [CharacterType.SHIELD, new Point(8, 4), DirectionType.DOWN],
        ]
    ),
    new Level(
        [
            new Point(5, 1), new Point(6, 0), new Point(7, 0),
            new Point(8, 0), new Point(8, 1), new Point(8, 2),
            new Point(7, 3)
        ],
        [
            [CharacterType.RANGE, new Point(2, 4), DirectionType.UP],
            [CharacterType.RANGE, new Point(5, 4), DirectionType.UP],
        ],
        [
            [CharacterType.SHIELD, new Point(6, 1), DirectionType.DOWN],
            [CharacterType.MELEE, new Point(7, 1), DirectionType.DOWN],
            [CharacterType.SHIELD, new Point(7, 2), DirectionType.LEFT],
        ]
    ),
    new Level(
        [
            new Point(3, 1), new Point(3, 2), new Point(4, 2), new Point(5, 2),
            new Point(6, 2), new Point(6, 3), new Point(6, 4), new Point(7, 4),

            new Point(7, 8), new Point(7, 7), new Point(8, 6),
        ],
        [
            [CharacterType.RANGE, new Point(2, 5), DirectionType.DOWN],
            [CharacterType.RANGE, new Point(4, 5), DirectionType.DOWN],
        ],
        [
            [CharacterType.SHIELD, new Point(8, 3), DirectionType.DOWN],
            [CharacterType.MELEE, new Point(7, 0), DirectionType.LEFT],
            [CharacterType.RANGE, new Point(4, 1), DirectionType.UP],
            [CharacterType.MELEE, new Point(5, 2), DirectionType.DOWN],
        ]
    ),
    new Level(
        [new Point(7, 7), new Point(4, 2)],
        [
            [CharacterType.SHIELD, new Point(2, 2), DirectionType.RIGHT],
            [CharacterType.SHIELD, new Point(4, 4), DirectionType.UP],
            [CharacterType.SHIELD, new Point(6, 2), DirectionType.LEFT],
        ],
        [
            [CharacterType.MELEE, new Point(4, 2), DirectionType.DOWN],
        ]
    ),
    new Level(
        [
            new Point(5, 2), new Point(2, 5),
            new Point(5, 7), new Point(5, 8),
            new Point(7, 5), new Point(8, 5),
        ],
        [
            [CharacterType.SHIELD, new Point(2, 3), DirectionType.DOWN],
            [CharacterType.SHIELD, new Point(4, 4), DirectionType.RIGHT],
            [CharacterType.SHIELD, new Point(7, 2), DirectionType.LEFT],
            [CharacterType.SHIELD, new Point(2, 7), DirectionType.UP],
        ],
        [
            [CharacterType.MELEE, new Point(5, 2), DirectionType.RIGHT],
            [CharacterType.MELEE, new Point(2, 5), DirectionType.DOWN],
        ]
    ),
    new Level(
        [
            new Point(1, 1), new Point(1, 2), new Point(1, 3), new Point(2, 3), new Point(3, 3),
            new Point(5, 3), new Point(6, 3), new Point(7, 3), new Point(7, 2), new Point(7, 1),

            new Point(1, 7), new Point(1, 6), new Point(1, 5), new Point(2, 5), new Point(3, 5),
            new Point(5, 5), new Point(6, 5), new Point(7, 5), new Point(7, 6), new Point(7, 7),
        ],
        [
            [CharacterType.SHIELD, new Point(4, 5), DirectionType.UP],
            [CharacterType.SHIELD, new Point(3, 6), DirectionType.UP],
            [CharacterType.SHIELD, new Point(5, 6), DirectionType.UP],
            [CharacterType.SHIELD, new Point(4, 7), DirectionType.UP],
        ],
        [
            [CharacterType.MELEE, new Point(1, 1), DirectionType.DOWN],
            [CharacterType.SHIELD, new Point(4, 3), DirectionType.DOWN],
            [CharacterType.MELEE, new Point(7, 1), DirectionType.DOWN],
        ]
    ),
    // new Level(
    //     [
    //         new Point(2, 0), new Point(2, 1), new Point(2, 2), new Point(2, 3), new Point(2, 4),
    //         new Point(2, 5), new Point(2, 6), new Point(2, 7), new Point(2, 8),
    //         new Point(6, 0), new Point(6, 1), new Point(6, 2), new Point(6, 3), new Point(6, 4),
    //         new Point(6, 5), new Point(6, 6), new Point(6, 7), new Point(6, 8)
    //     ],
    //     [
    //         [CharacterType.SHIELD, new Point(3, 5), DirectionType.UP],
    //         [CharacterType.SHIELD, new Point(4, 5), DirectionType.UP],
    //         [CharacterType.SHIELD, new Point(5, 5), DirectionType.UP],

    //         [CharacterType.RANGE, new Point(3, 6), DirectionType.UP],
    //         [CharacterType.RANGE, new Point(5, 6), DirectionType.UP],

    //         [CharacterType.RANGE, new Point(3, 7), DirectionType.UP],
    //         [CharacterType.MELEE, new Point(4, 7), DirectionType.UP],
    //         [CharacterType.RANGE, new Point(5, 7), DirectionType.UP],

    //         [CharacterType.RANGE, new Point(3, 8), DirectionType.UP],
    //         [CharacterType.RANGE, new Point(5, 8), DirectionType.UP],
    //     ],
    //     [
    //         [CharacterType.SHIELD, new Point(3, 3), DirectionType.DOWN],
    //         [CharacterType.SHIELD, new Point(4, 3), DirectionType.DOWN],
    //         [CharacterType.SHIELD, new Point(5, 3), DirectionType.DOWN],

    //         [CharacterType.RANGE, new Point(3, 2), DirectionType.DOWN],
    //         [CharacterType.RANGE, new Point(5, 2), DirectionType.DOWN],

    //         [CharacterType.RANGE, new Point(3, 1), DirectionType.DOWN],
    //         [CharacterType.MELEE, new Point(4, 1), DirectionType.DOWN],
    //         [CharacterType.RANGE, new Point(5, 1), DirectionType.DOWN],

    //         [CharacterType.RANGE, new Point(3, 0), DirectionType.DOWN],
    //         [CharacterType.RANGE, new Point(5, 0), DirectionType.DOWN],
    //     ]
    // ),
];