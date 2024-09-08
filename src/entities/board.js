import { CharacterType } from "../enum/character-type";
import { DirectionType } from "../enum/direction-type";
import { MovType } from "../enum/mov-type";
import { TileType } from "../enum/tile-type";
import { GameVars, removeBoardPixelSize, toBoardPixelSize, toPixelSize } from "../game-variables";
import { createPixelLine, fillPolygon } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { Character } from "./character";
import { Tile } from "./tile";

export class Board {
    constructor(gameDiv, levelWalls) {
        this.gameDiv = gameDiv;
        this.levelWalls = levelWalls;
        this.x = 0;
        this.y = 0;

        this.lastPixelSize = toBoardPixelSize(1);

        this.createBackground();

        this.boardShadowCanvas = createElem(this.gameDiv, "canvas", "board-shadow");
        this.boardShadowCtx = this.boardShadowCanvas.getContext("2d");
        this.drawGameBoardShadow();

        this.boardCanvas = createElem(this.gameDiv, "canvas", "board", [], null, null, GameVars.isMobile);
        this.boardCtx = this.boardCanvas.getContext("2d");
        this.setGameBoardCanvas();

        this.boardTiles = this.createGameBoardTiles();

        this.resetBoardPos();
        this.dragElement(this);

        this.selectedCharacter = null;
    }

    createBackground() {
        this.backgroundCanvas = createElem(this.gameDiv, "canvas", "board-background", null,
            toBoardPixelSize(GameVars.gameWdAsPixels), toBoardPixelSize(GameVars.gameHgAsPixels), GameVars.isMobile, "#100f0f");
        const lines = [];
        for (let i = 0; i < GameVars.gameHgAsPixels / 12; i++) {
            createPixelLine(0, 12 * i, GameVars.gameWdAsPixels, 12 * i, "#1b1116", toBoardPixelSize(1), lines);
            createPixelLine(0, 12 * i + 2, GameVars.gameWdAsPixels, 12 * i + 2, "#1b1116", toBoardPixelSize(1), lines);
        }
        const ctx = this.backgroundCanvas.getContext("2d");
        lines.forEach(line => line.draw(ctx));
    }

    drawGameBoardShadow() {
        this.boardShadowCtx.clearRect(0, 0, this.boardShadowCanvas.width, this.boardShadowCanvas.height);

        const width = toBoardPixelSize(GameVars.tileXRatio * GameVars.gameBoardSize * 2 + 1);
        const height = toBoardPixelSize(GameVars.tileYRatio * GameVars.gameBoardSize * 2 + 1 + GameVars.tileDepth);
        setElemSize(this.boardShadowCanvas, width, height);

        const lines = [];
        createPixelLine(removeBoardPixelSize(width / 2), 0, removeBoardPixelSize(width) - 1, removeBoardPixelSize(height / 2), "#00000070", toBoardPixelSize(1), lines);
        createPixelLine(removeBoardPixelSize(width) - 1, removeBoardPixelSize(height / 2), removeBoardPixelSize(width / 2), removeBoardPixelSize(height) - 1, "#00000070", toBoardPixelSize(1), lines);
        createPixelLine(removeBoardPixelSize(width / 2), removeBoardPixelSize(height) - 1, 0, removeBoardPixelSize(height / 2), "#00000070", toBoardPixelSize(1), lines);
        createPixelLine(0, removeBoardPixelSize(height / 2), removeBoardPixelSize(width / 2), 0, "#00000070", toBoardPixelSize(1), lines);

        lines.forEach(line => line.draw(this.boardShadowCtx));
        fillPolygon(lines, "#00000070", this.boardShadowCtx);
    }

    setGameBoardCanvas() {
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        setElemSize(this.boardCanvas,
            toBoardPixelSize(GameVars.tileXRatio * GameVars.gameBoardSize * 2 + 1),
            toBoardPixelSize(GameVars.tileYRatio * GameVars.gameBoardSize * 2 + 1 + GameVars.tileDepth)
        );
    }

    createGameBoardTiles() {
        const startX = (GameVars.tileXRatio * GameVars.gameBoardSize) - GameVars.tileXRatio;
        const boardTiles = [];
        for (let y = 0; y < GameVars.gameBoardSize; y++) {
            boardTiles.push([]);
            for (let x = 0; x < GameVars.gameBoardSize; x++) {
                const tileType = this.levelWalls.filter(wallPos => wallPos.y === y && wallPos.x === x).length === 1 ? TileType.WALL : TileType.FLOOR;
                boardTiles[y].push(new Tile(
                    x, y,
                    startX - (y * GameVars.tileXRatio) + (x * GameVars.tileXRatio),
                    (x * GameVars.tileYRatio) + (y * GameVars.tileYRatio), tileType, this.boardCtx)
                );
            }
        }
        return boardTiles;
    }

    resetBoardPos() {
        this.updateBoardPos((GameVars.gameW - this.boardCanvas.width) / 2, (GameVars.gameH - this.boardCanvas.height) / 2);
    }

    updateBoardPos(x, y) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.collisionObj.updatePos(this.x ? x - this.x : x, this.y ? y - this.y : y)));
        this.x = x;
        this.y = y;
        this.boardCanvas.style.translate = x + 'px ' + y + 'px';
        this.boardShadowCanvas.style.translate = x + 'px ' + (y + toBoardPixelSize(GameVars.tileYRatio + GameVars.tileDepth)) + 'px';
    }

    createCharacter(x, y, characterType, directionType, isPlayer) {
        this.boardTiles[y][x].character = new Character(x, y, characterType, directionType, isPlayer);
    }

    click(x, y, isPaused) {
        let targetTile = this.retrieveTargetTile(x, y);
        if (this.selectedCharacter && !!targetTile) {
            if (!isPaused) this.moveCharacter(targetTile);
        } else {
            this.selectedCharacter = null;
            this.boardTiles.forEach(row => row.forEach(tile => {
                if (tile.click(x, y)) {
                    this.selectedCharacter = tile.character;
                    GameVars.sound.clickSound();
                }
            }));
            this.select();
        }
    }

    retrieveTargetTile(x, y) {
        let targetTile = null;
        this.boardTiles.forEach(row => {
            row.forEach(tile => {
                if (tile.canMoveTo(x, y)) {
                    targetTile = tile;
                    return;
                }
            });
            if (targetTile) return;
        });
        return targetTile;
    }

    moveCharacter(targetTile, isEnemyMov) {
        //clean selection
        this.boardTiles.forEach(row => row.forEach(tile => tile.click(0, 0)));

        // clean character in it's current pos
        this.boardTiles[this.selectedCharacter.y][this.selectedCharacter.x].character = null;

        // move char
        this.selectedCharacter.updatePos(targetTile.boardX, targetTile.boardY, targetTile.directionArrow.direction)

        // set char on new pos
        this.boardTiles[this.selectedCharacter.y][this.selectedCharacter.x].character = this.selectedCharacter;

        // new select
        this.select(isEnemyMov);

        GameVars.sound.moveSound();
    }

    select(isEnemyMov) {
        if (this.selectedCharacter) {
            const x = this.selectedCharacter.x;
            const y = this.selectedCharacter.y;
            const characterType = this.selectedCharacter.characterType;
            this.boardTiles[y][x].select();

            const dist = GameVars.characterStatus[this.selectedCharacter.characterType].dist;
            const movType = GameVars.characterStatus[this.selectedCharacter.characterType].movType;
            if (movType === MovType.DIRECTIONAL || movType === MovType.BOTH) {
                this.loopDirection(dist, (i) => y - i >= 0 && this.validateCollision(x, y, 0, - i, DirectionType.UP, characterType, isEnemyMov));
                this.loopDirection(dist, (i) => y + i < GameVars.gameBoardSize && this.validateCollision(x, y, 0, i, DirectionType.DOWN, characterType, isEnemyMov));
                this.loopDirection(dist, (i) => x - i >= 0 && this.validateCollision(x, y, - i, 0, DirectionType.LEFT, characterType, isEnemyMov));
                this.loopDirection(dist, (i) => x + i < GameVars.gameBoardSize && this.validateCollision(x, y, i, 0, DirectionType.RIGHT, characterType, isEnemyMov));
            }
            if (movType === MovType.DIAGONAL || movType === MovType.BOTH) {
                this.loopDirection(dist, (i) => y - i >= 0 && x - i >= 0 && this.validateCollision(x, y, - i, - i, DirectionType.UP, characterType, isEnemyMov));
                this.loopDirection(dist, (i) => y + i < GameVars.gameBoardSize && x + i < GameVars.gameBoardSize && this.validateCollision(x, y, i, i, DirectionType.DOWN, characterType, isEnemyMov));
                this.loopDirection(dist, (i) => x - i >= 0 && y + i < GameVars.gameBoardSize && this.validateCollision(x, y, - i, i, DirectionType.LEFT, characterType, isEnemyMov));
                this.loopDirection(dist, (i) => y - i >= 0 && x + i < GameVars.gameBoardSize && this.validateCollision(x, y, i, - i, DirectionType.RIGHT, characterType, isEnemyMov));
            }
        }
    }

    loopDirection(dist, fn) {
        for (let i = 1; i <= dist; i++) {
            if (fn(i)) break;
        }
    }

    validateCollision(x, y, xValue, yValue, directionType, characterType, isEnemyMov) {
        const tile = this.boardTiles[y + yValue][x + xValue];
        if (tile.tileType === TileType.WALL && characterType !== CharacterType.MELEE) return true;

        if (isEnemyMov) {
            if (tile.character && !tile.character.isPlayer) return true;
        } else {
            if (tile.character?.isPlayer) return true;
        }

        if (tile.character?.characterType === CharacterType.SHIELD && this.validateShieldCollision(x, y, tile.character)) return true;
        tile.select(directionType);

        if (isEnemyMov) {
            if (tile.character && tile.isPlayer) return true;
        } else {
            if (tile.character && !tile.isPlayer) return true;
        }
    }

    validateShieldCollision(x, y, character) {
        switch (character.direction) {
            case DirectionType.UP: return y < character.y;
            case DirectionType.DOWN: return y > character.y;
            case DirectionType.LEFT: return x < character.x;
            case DirectionType.RIGHT: return x > character.x;
        }
    }

    update(x, y) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.update(x, y)))
    }

    updateZoom() {
        const xDiff = this.x - (GameVars.gameW - this.boardCanvas.width) / 2;
        const yDiff = this.y - (GameVars.gameH - this.boardCanvas.height) / 2;
        this.updateBoardPos(0, 0);
        this.drawGameBoardShadow();
        this.setGameBoardCanvas();
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.updateZoom()));
        this.resetBoardPos();
        this.updateBoardPos(this.x + this.retrieveNewDiff(xDiff), this.y + this.retrieveNewDiff(yDiff));
        this.lastPixelSize = toBoardPixelSize(1);
    }

    retrieveNewDiff(value) {
        return value * toBoardPixelSize(1) / this.lastPixelSize;
    }

    draw(isEnemyTurn) {
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.drawBack()));
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.drawMiddle(isEnemyTurn)));
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.drawFront()));
    }

    dragElement(board) {
        let clientX = 0, clientY = 0;
        let newX = 0, newY = 0, startX = 0, startY = 0;

        board.boardCanvas.onmousedown = dragMouseDown;
        board.boardCanvas.ontouchstart = dragMouseDown;
        board.boardCanvas.onmouseout = closeDragElem;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }

            board.boardCanvas.onmouseup = closeDragElem;
            board.boardCanvas.onmousemove = elemDrag;

            board.boardCanvas.ontouchend = closeDragElem;
            board.boardCanvas.ontouchmove = elemDrag;
        }

        function elemDrag(e) {
            e = e || window.event;
            e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            newX = startX - clientX;
            newY = startY - clientY;
            startX = clientX;
            startY = clientY;
            board.updateBoardPos(board.x - newX, board.y - newY);
        }

        function closeDragElem(e) {
            board.boardCanvas.onmouseup = null;
            board.boardCanvas.onmousemove = null;

            board.boardCanvas.ontouchend = null;
            board.boardCanvas.ontouchmove = null;
        }
    }
}