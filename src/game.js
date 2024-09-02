import { Board } from "./entities/board";
import { UI } from "./entities/ui";
import { DirectionType } from "./enum/direction-type";
import { Levels } from "./levels";
import { aStar } from "./utilities/astar";

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

        this.board.selectedCharacter = this.playerCharacters[0];
        this.board.select();

        const aStarAlgorithm = new aStar();
        this.path = aStarAlgorithm.aStarPath(this.playerCharacters[0], this.enemyCharacters[0], this.board.boardTiles);
        this.pathIndex = 1; // ignore first position since it's the origin
        this.movementAi();
    }

    movementAi() {
        setTimeout(() => {
            if (this.pathIndex < this.path.length) {
                this.board.select();
                this.board.moveCharacter(this.board.boardTiles[this.path[this.pathIndex].y][this.path[this.pathIndex].x]);
                this.pathIndex++;
                this.movementAi();
            }
        }, 500);
    }

    createCharacters(characterPositions, isPlayer) {
        const charactersObj = [];
        characterPositions.forEach(pos => {
            const characterPos = pos[1];
            this.board.createCharacter(characterPos.x, characterPos.y, pos[0], pos[2], isPlayer);
            charactersObj.push(this.board.boardTiles[characterPos.y][characterPos.x].character);
        });
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

    updateZoom() {
        this.board.updateZoom();
    }

    draw() {
        this.board.draw();
        this.ui.draw();
    }
}