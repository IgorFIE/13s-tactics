import { Board } from "./entities/board";
import { UI } from "./entities/ui/ui";
import { GameVars } from "./game-variables";
import { Levels } from "./levels";
import { aStar } from "./utilities/astar";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init(levelIndex) {
        GameVars.boardPixelSize = GameVars.pixelSize;
        this.levelIndex = levelIndex;
        this.gameDiv.innerHTML = "";
        this.level = Levels[levelIndex];
        this.board = new Board(this.gameDiv, this.level.boardWalls);
        this.playerCharacters = this.createCharacters(this.level.playerCharacters, true);
        this.enemyCharacters = this.createCharacters(this.level.enemiesCharacters, false);
        this.ui = new UI(this);

        this.board.selectedCharacter = this.playerCharacters[0];
        this.board.select();

        this.aStarAlgorithm = new aStar();

        this.isChangeLevel = false;
        this.isRetryLevel = false;
        this.isGameCompleted = false;

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
        this.ui?.update(this.board.selectedCharacter);
        if (this.isGamePause) return;
        if (this.isEnemyTurn) this.enemyTurn();
    }

    changeLevel() {
        if (this.isChangeLevel || this.isRetryLevel || this.isGameCompleted) {
            if (this.isChangeLevel) this.levelIndex++;
            if (this.isGameCompleted) this.levelIndex = 0;
            this.isChangeLevel = false;
            this.isRetryLevel = false;
            this.isGameCompleted = false;
            this.reset();
            if (this.levelIndex < Levels.length) {
                this.init(this.levelIndex);
            }
        }
    }

    enemyTurn() {
        if (this.resetEnemyMovement && !this.ui.isDisplayingModal) this.fetchNewEnemyMovement();
    }

    fetchNewEnemyMovement() {
        let bestCharIndex = -1;
        let bestPathIndex = -1;
        let bestPath = 999;
        const possiblePaths = this.enemyCharacters.map((enemyChar, charIndex) => {
            return this.playerCharacters.map((playerChar, index) => {
                const result = this.aStarAlgorithm.aStarPath(enemyChar, playerChar, this.board.boardTiles);
                if (result.length > 1 && result.length < bestPath) {
                    bestCharIndex = charIndex;
                    bestPathIndex = index;
                    bestPath = result.length;
                }
                return result;
            });
        });
        if (bestCharIndex != -1) {
            this.click(0, 0);
            this.board.selectedCharacter = this.enemyCharacters[bestCharIndex];
            this.board.select(true);

            this.path = possiblePaths[bestCharIndex][bestPathIndex];
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
        const countBeforeFilterPlayer = this.playerCharacters.length;
        this.playerCharacters = this.playerCharacters.filter(char => this.board.boardTiles[char.y][char.x].character === char);
        if (countBeforeFilterPlayer != this.playerCharacters.length) {
            GameVars.sound.playerDeadSound();
            this.ui.createCharacterIcons();
        }
        const countBeforeFilterEnemy = this.enemyCharacters.length;
        this.enemyCharacters = this.enemyCharacters.filter(char => this.board.boardTiles[char.y][char.x].character === char);
        if (countBeforeFilterEnemy != this.enemyCharacters.length) GameVars.sound.victorySound();
    }

    updateZoom() {
        this.board.updateZoom();
    }

    draw() {
        this.board?.draw(this.isEnemyTurn);
        this.ui?.draw();
    }

    reset() {
        this.ui.reset();
    }
}