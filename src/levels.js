import { Level } from "./entities/level";
import { Point } from "./entities/point";
import { CharacterType } from "./enum/character-type";

export const Levels = [
    new Level(
        [new Point(4, 4)],
        [
            [CharacterType.RANGE, new Point(4, 6)],
            [CharacterType.MELEE, new Point(3, 7)],
            [CharacterType.SHIELD, new Point(5, 7)],
        ],
        [
            [CharacterType.MELEE, new Point(4, 2)],
        ]
    )
];