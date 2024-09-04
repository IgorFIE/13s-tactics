import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem } from "../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../utilities/text";
import { UiCharacter } from "./ui-character";

export class UI {
    constructor(game) {
        this.game = game;
        this.uiDiv = createElem(document.getElementById("game"), "div", "ui");
        this.uiCharacters = [];

        this.currentTime = 13;

        this.createTimer();
        this.createZoomBtns();
        this.createResetBtn();
        this.createCharacterIcons();
        this.createStartPlayerTurnBtn();
    }

    createResetBtn() {
        this.resetBoardBtn = createElem(this.uiDiv, "canvas", null, null, toPixelSize(52), toPixelSize(24), GameVars.isMobile, null, () => this.game.board.resetBoardPos());
        this.resetBoardBtn.style.translate = (GameVars.gameW - this.resetBoardBtn.width - toPixelSize(8)) + 'px ' + (GameVars.gameH - this.resetBoardBtn.height - toPixelSize(8)) + 'px';
        genSmallBox(this.resetBoardBtn, 0, 0, 51, 23, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("RESET BOARD", this.resetBoardBtn, toPixelSize(1), 26, 8, "#9bf2fa", 1);
        drawPixelTextInCanvas("POSITION", this.resetBoardBtn, toPixelSize(1), 26, 16, "#9bf2fa", 1);
    }

    createTimer() {
        this.timer = createElem(this.uiDiv, "canvas", null, null, toPixelSize(80), toPixelSize(34));
        this.timer.style.translate = ((GameVars.gameW - this.timer.width) / 2) + 'px ' + (toPixelSize(8)) + 'px';
        this.timerCtx = this.timer.getContext("2d");
        this.drawTimer();
    }

    drawTimer() {
        this.timerCtx.clearRect(0, 0, this.timer.width, this.timer.height);
        genSmallBox(this.timer, 0, 0, 78, 33, toPixelSize(1), "#3e3846", "#1b1116");
        if (this.game.isGamePause) {
            drawPixelTextInCanvas("BREAKTIME", this.timer, toPixelSize(1), 40, 8, "#00bcd4", 1);
            drawPixelTextInCanvas("think about actions", this.timer, toPixelSize(1), 40, 17, "#00bcd4", 1);
            drawPixelTextInCanvas("for next turn", this.timer, toPixelSize(1), 40, 26, "#00bcd4", 1);
        } else {
            drawPixelTextInCanvas(this.game.isEnemyTurn ? "enemy turn" : "player turn", this.timer, toPixelSize(1), 40, 8, this.game.isEnemyTurn ? "#ff0000" : "#00bcd4", 1);
            drawPixelTextInCanvas(this.currentTime, this.timer, toPixelSize(1), 40, 21, this.game.isEnemyTurn ? "#ff0000" : "#9bf2fa", 3);
        }
    }

    createZoomBtns() {
        this.zoomDiv = createElem(this.uiDiv, "div");
        this.zoom = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(26), toPixelSize(61));
        this.zoom.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(8)) + 'px ' + ((GameVars.gameH - this.zoom.height) / 2) + 'px';
        genSmallBox(this.zoom, 0, 0, 25, 60, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("ZOOM", this.zoom, toPixelSize(1), 13, 8, "#00bcd4", 1);

        this.zoomPlus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), GameVars.isMobile, null, () => {
            GameVars.boardPixelSize++;
            this.game.updateZoom();
        });
        this.zoomPlus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(15)) + 'px';
        genSmallBox(this.zoomPlus, 0, 0, 17, 17, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("+", this.zoomPlus, toPixelSize(1), 9, 9, "#9bf2fa", 4);

        this.zoomMinus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), GameVars.isMobile, null, () => {
            GameVars.boardPixelSize--;
            GameVars.boardPixelSize = GameVars.boardPixelSize < 1 ? 1 : GameVars.boardPixelSize;
            this.game.updateZoom();
        });
        this.zoomMinus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(37)) + 'px';
        genSmallBox(this.zoomMinus, 0, 0, 17, 17, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("-", this.zoomMinus, toPixelSize(1), 9, 9, "#9bf2fa", 4);
    }

    createCharacterIcons() {
        if (this.charactersDiv) this.charactersDiv.innerHTML = "";
        this.charactersDiv = createElem(this.uiDiv, "div");
        const countCharacters = this.game.playerCharacters.length;
        const yStartPos = (GameVars.gameH - toPixelSize(32 * countCharacters) - toPixelSize(4 * (countCharacters - 1))) / 2;
        this.game.playerCharacters.forEach((value, index) => this.uiCharacters.push(
            new UiCharacter(toPixelSize(8), yStartPos + (toPixelSize(32) * index) + toPixelSize(4 * index), value, this.charactersDiv, this.game)
        ));
    }

    createStartPlayerTurnBtn() {
        this.startPlayerTurnCanvas = createElem(this.uiDiv, "canvas", null, null, toPixelSize(64), toPixelSize(24), GameVars.isMobile, null, () => {
            this.game.isGamePause = false;
            this.startPlayerTurnCanvas.classList.add("hidden");
            this.currentTime = 13;
            this.timerInterval = setInterval(() => {
                this.currentTime--;
                if (this.currentTime === 0 && !this.game.isEnemyTurn) {
                    this.game.isEnemyTurn = true;
                    this.currentTime = 13;
                } else if (this.currentTime === 0 && this.game.isEnemyTurn) {
                    this.game.isEnemyTurn = false;
                    this.game.isGamePause = true;
                    this.startPlayerTurnCanvas.classList.remove("hidden");
                    clearInterval(this.timerInterval);
                }
            }, 1000)
        });
        this.startPlayerTurnCanvas.style.translate = ((GameVars.gameW - this.startPlayerTurnCanvas.width) / 2) + 'px ' +
            (GameVars.gameH - this.startPlayerTurnCanvas.height - toPixelSize(8)) + 'px';
        genSmallBox(this.startPlayerTurnCanvas, 0, 0, 62, 23, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("start player", this.startPlayerTurnCanvas, toPixelSize(1), 31, 8, "#9bf2fa", 1);
        drawPixelTextInCanvas("turn", this.startPlayerTurnCanvas, toPixelSize(1), 31, 16, "#9bf2fa", 1);
    }

    reset() {
        clearInterval(this.timerInterval);
        this.uiDiv.remove();
    }

    update(character) {
        this.uiCharacters.forEach(uiChar => uiChar.update(character));

    }

    draw() {
        this.uiCharacters.forEach(uiChar => uiChar.draw());
        this.drawTimer();
    }
}