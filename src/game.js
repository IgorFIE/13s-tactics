import { Board } from "./entities/board";
import { UI } from "./entities/ui";
import { DirectionType } from "./enum/direction-type";
import { Levels } from "./levels";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init() {
        this.gameDiv.innerHtml = "";
        this.level = Levels[0];
        this.board = new Board(this.gameDiv, this.level.boardWalls);
        this.playerCharacters = this.createCharacters(this.level.playerCharacters, true);
        this.enemyCharacters = this.createCharacters(this.level.enemiesCharacters, false);
        this.ui = new UI(this);
    }

    createCharacters(characterPositions, isPlayer) {
        const charactersObj = {}
        let isFirstChar = false;
        for (let key in characterPositions) {
            const characterPos = characterPositions[key];
            const characterType = Number(key);
            this.board.createCharacter(characterPos.x, characterPos.y, characterType, isPlayer ? DirectionType.UP : DirectionType.DOWN, isPlayer);
            charactersObj[key] = this.board.boardTiles[characterPos.y][characterPos.x].character;
            if (isPlayer && !isFirstChar) {
                this.board.selectedCharacter = this.board.boardTiles[characterPos.y][characterPos.x].character;
                this.board.select();
                isFirstChar = true;
            }
        };
        return charactersObj;
    }

    click(x, y) {
        this.board.click(x, y);
    }

    mov(x, y) {
        this.board.update(x, y);
    }

    update() {
        this.ui.update(this.board.selectedCharacter);
    }

    draw() {
        this.board.draw();
        this.ui.draw();
    }
}