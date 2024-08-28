import { TileType } from "../enum/tile-type";
import { GameVars, removePixelSize, toPixelSize } from "../game-variables";
import { createPixelLine, fillPolygon } from "../utilities/draw-utilities";
import { createElem, setElemSize } from "../utilities/elem-utilities";
import { Character } from "./character";
import { Tile } from "./tile";

export class Board {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
        this.createBackground();
        this.createGameBoardShadow();
        this.createGameBoard();
        this.resetBoardPos();
        this.dragElement(this);
    }

    createBackground() {
        this.backgroundCanvas = createElem(this.gameDiv, "canvas", "board-background", null,
            toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels), GameVars.isMobile, "#100f0f");
        const lines = [];
        for (let i = 0; i < GameVars.gameHgAsPixels / 12; i++) {
            createPixelLine(0, 12 * i, GameVars.gameWdAsPixels, 12 * i, "#1b1116", toPixelSize(1), lines);
            createPixelLine(0, 12 * i + 2, GameVars.gameWdAsPixels, 12 * i + 2, "#1b1116", toPixelSize(1), lines);
        }
        const ctx = this.backgroundCanvas.getContext("2d");
        lines.forEach(line => line.draw(ctx));
    }

    createGameBoardShadow() {
        const width = toPixelSize(GameVars.tileXRatio * GameVars.gameBoardSize * 2 + 1);
        const height = toPixelSize(GameVars.tileYRatio * GameVars.gameBoardSize * 2 + 1 + GameVars.tileDepth);

        this.boardShadowCanvas = createElem(this.gameDiv, "canvas", "board-shadow");
        setElemSize(this.boardShadowCanvas, width, height);

        const lines = [];
        createPixelLine(removePixelSize(width / 2), 0, removePixelSize(width) - 1, removePixelSize(height / 2), "#00000070", toPixelSize(1), lines);
        createPixelLine(removePixelSize(width) - 1, removePixelSize(height / 2), removePixelSize(width / 2), removePixelSize(height) - 1, "#00000070", toPixelSize(1), lines);
        createPixelLine(removePixelSize(width / 2), removePixelSize(height) - 1, 0, removePixelSize(height / 2), "#00000070", toPixelSize(1), lines);
        createPixelLine(0, removePixelSize(height / 2), removePixelSize(width / 2), 0, "#00000070", toPixelSize(1), lines);

        const ctx = this.boardShadowCanvas.getContext("2d");
        lines.forEach(line => line.draw(ctx));
        fillPolygon(lines, "#00000070", ctx);
    }

    createGameBoard() {
        this.boardCanvas = createElem(this.gameDiv, "canvas", "board", [], null, null, GameVars.isMobile);
        this.boardCtx = this.boardCanvas.getContext("2d");
        setElemSize(this.boardCanvas,
            toPixelSize(GameVars.tileXRatio * GameVars.gameBoardSize * 2 + 1),
            toPixelSize(GameVars.tileYRatio * GameVars.gameBoardSize * 2 + 1 + GameVars.tileDepth)
        );
        this.boardTiles = this.generateGameBoard();
    }

    generateGameBoard() {
        const startY = (GameVars.tileYRatio * GameVars.gameBoardSize) - GameVars.tileYRatio;
        const boardTiles = [];
        for (let y = 0; y < GameVars.gameBoardSize; y++) {
            boardTiles.push([]);
            for (let x = GameVars.gameBoardSize - 1; x >= 0; x--) {
                boardTiles[y].push(new Tile(
                    x * GameVars.tileXRatio + (y * GameVars.tileXRatio),
                    startY - (x * GameVars.tileYRatio) + (y * GameVars.tileYRatio),
                    x == 4 && y == 4 ? TileType.WALL : TileType.FLOOR, this.boardCtx)
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
        this.boardShadowCanvas.style.translate = x + 'px ' + (y + toPixelSize(GameVars.tileYRatio + GameVars.tileDepth)) + 'px';
    }

    createCharacter(x, y, characterType, directionType, isPlayer) {
        this.boardTiles[y][x].character = new Character(x, y, characterType, directionType, isPlayer);
    }

    update(x, y) {
        this.boardTiles.forEach(row => row.forEach(tile => tile.update(x, y)))
    }

    draw() {
        this.boardCtx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.drawBack()));
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.drawMiddle()));
        this.boardTiles.forEach(tileRow => tileRow.forEach(tile => tile.drawFront()));
    }

    dragElement(board) {
        let clientX = 0, clientY = 0;
        let newX = 0, newY = 0, startX = 0, startY = 0;

        board.boardCanvas.onmousedown = dragMouseDown;
        board.boardCanvas.ontouchstart = dragMouseDown;

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