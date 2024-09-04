import { Board } from "./entities/board";
import { UI } from "./entities/ui";
import { DirectionType } from "./enum/direction-type";
import { GameVars } from "./game-variables";
import { Levels } from "./levels";
import { aStar } from "./utilities/astar";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init(levelIndex) {
        this.levelIndex = levelIndex;
        this.gameDiv.innerHtml = "";
        this.level = Levels[levelIndex];
        this.board = new Board(this.gameDiv, this.level.boardWalls);
        this.playerCharacters = this.createCharacters(this.level.playerCharacters, true);
        this.enemyCharacters = this.createCharacters(this.level.enemiesCharacters, false);
        this.ui = new UI(this);

        this.board.selectedCharacter = this.playerCharacters[0];
        this.board.select();

        this.aStarAlgorithm = new aStar();

        this.isGamePause = true;
        this.isEnemyTurn = false;
        this.resetEnemyMovement = true;
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
        this.board.click(x, y, this.isGamePause);
        this.cleanCharacters();
    }

    mov(x, y) {
        this.board.update(x, y);
    }

    update() {
        this.changeLevel();
        this.ui.update(this.board.selectedCharacter);
        if (this.isGamePause) return;
        if (this.isEnemyTurn) this.enemyTurn();
    }

    changeLevel() {
        if (this.enemyCharacters.length === 0) {
            this.reset();
            this.levelIndex++;
            if (this.levelIndex < Levels.length) {
                this.init(this.levelIndex);
            }
        }
    }

    enemyTurn() {
        if (this.resetEnemyMovement) this.fetchNewEnemyMovement();
    }

    fetchNewEnemyMovement() {
        let bestCharIndex = -1;
        let bestPath = 999;
        const possiblePaths = this.enemyCharacters.map((enemyChar, charIndex) => {
            return this.playerCharacters.map((playerChar, index) => {
                const result = this.aStarAlgorithm.aStarPath(enemyChar, playerChar, this.board.boardTiles);
                if (result.length > 1 && result.length < bestPath) {
                    bestCharIndex = charIndex;
                    bestPath = index;
                }
                return result;
            });
        });
        if (bestCharIndex != -1) {
            this.click(0, 0);
            this.board.selectedCharacter = this.enemyCharacters[bestCharIndex];
            this.board.select(true);

            this.path = possiblePaths[bestCharIndex][bestPath];
            this.pathIndex = 1; // ignore first position since it's the origin
            this.resetEnemyMovement = false;
            this.movementAi();
        }
    }

    movementAi() {
        setTimeout(() => {
            if (this.pathIndex < this.path.length) {
                this.board.moveCharacter(this.board.boardTiles[this.path[this.pathIndex].y][this.path[this.pathIndex].x], true);
                this.cleanCharacters();
                this.pathIndex++;
                this.movementAi();
            } else {
                this.resetEnemyMovement = true;
            }
        }, 750);
    }

    cleanCharacters() {
        const countBeforeFilter = this.playerCharacters.length;
        this.playerCharacters = this.playerCharacters.filter(char => this.board.boardTiles[char.y][char.x].character === char);
        if (countBeforeFilter != this.playerCharacters.length) this.ui.createCharacterIcons();
        this.enemyCharacters = this.enemyCharacters.filter(char => this.board.boardTiles[char.y][char.x].character === char);
    }

    updateZoom() {
        this.board.updateZoom();
    }

    draw() {
        this.board.draw(this.isEnemyTurn);
        this.ui.draw();
    }

    reset() {
        this.ui.reset();
    }
}