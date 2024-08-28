import { Board } from "./entities/board";
import { Character } from "./entities/character";
import { UI } from "./entities/ui";
import { CharacterType } from "./enum/character-type";
import { DirectionType } from "./enum/direction-type";
import { GameVars, toPixelSize } from "./game-variables";
import { createElem, setElemSize } from "./utilities/elem-utilities";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init() {
        this.gameDiv.innerHtml = "";
        this.board = new Board(this.gameDiv);

        this.board.createCharacter(6, 1, CharacterType.SHIELD, DirectionType.UP, true);
        this.board.createCharacter(5, 2, CharacterType.SHIELD, DirectionType.RIGHT, true);
        this.board.createCharacter(6, 3, CharacterType.SHIELD, DirectionType.DOWN, true);
        this.board.createCharacter(7, 2, CharacterType.SHIELD, DirectionType.LEFT, true);

        this.board.createCharacter(2, 4, CharacterType.RANGE, DirectionType.UP, true);
        this.board.createCharacter(1, 5, CharacterType.RANGE, DirectionType.RIGHT, true);
        this.board.createCharacter(2, 6, CharacterType.RANGE, DirectionType.DOWN, true);
        this.board.createCharacter(3, 5, CharacterType.RANGE, DirectionType.LEFT, true);

        this.board.createCharacter(6, 5, CharacterType.MELEE, DirectionType.UP, true);
        this.board.createCharacter(5, 6, CharacterType.MELEE, DirectionType.RIGHT, true);
        this.board.createCharacter(6, 7, CharacterType.MELEE, DirectionType.DOWN, true);
        this.board.createCharacter(7, 6, CharacterType.MELEE, DirectionType.LEFT, true);

        this.ui = new UI(this);
    }

    update(x, y) {
        this.board.update(x, y);
    }

    draw() {
        this.board.draw();
    }
}