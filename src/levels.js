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
            [CharacterType.SHIELD, new Point(4, 1), DirectionType.DOWN],
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
        [new Point(3, 4), new Point(4, 4), new Point(5, 4)],
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
    )
];