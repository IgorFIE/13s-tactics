import { GameVars, toPixelSize } from "../../game-variables";
import { Levels } from "../../levels";
import { genSmallBox } from "../../utilities/box-generator";
import { createElem } from "../../utilities/elem-utilities";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { UiCharacter } from "./ui-character";

export class UI {
    constructor(game) {
        this.game = game;
        this.uiDiv = createElem(document.getElementById("game"), "div", "ui");
        this.uiCharacters = [];

        this.currentTime = 13;

        this.currentLevelUi();
        this.createTimer();
        this.createZoomBtns();
        this.createResetBtn();
        this.createCharacterIcons();
        this.createStartPlayerTurnBtn();
        this.createEndModal();
    }

    currentLevelUi() {
        const levelUi = createElem(this.uiDiv, "canvas", null, null, toPixelSize(52), toPixelSize(24), GameVars.isMobile, null, () => this.game.board.resetBoardPos());
        levelUi.style.translate = (GameVars.gameW - levelUi.width - toPixelSize(8)) + 'px ' + (toPixelSize(8)) + 'px';
        genSmallBox(levelUi, 0, 0, 51, 23, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("level", levelUi, toPixelSize(1), 26, 6, "#00bcd4", 1);
        drawPixelTextInCanvas(this.game.levelIndex + 1, levelUi, toPixelSize(1), 26, 16, "#00bcd4", 2);
    }

    createResetBtn() {
        this.resetBoardBtn = createElem(this.uiDiv, "canvas", null, null, toPixelSize(52), toPixelSize(24), GameVars.isMobile, null, () => {
            this.resetClick = true;
            this.game.board.resetBoardPos();
            GameVars.sound.clickSound();
        }, () => setTimeout(() => this.resetClick = false, 50));
        this.resetBoardBtn.style.translate = (GameVars.gameW - this.resetBoardBtn.width - toPixelSize(8)) + 'px ' + (GameVars.gameH - this.resetBoardBtn.height - toPixelSize(8)) + 'px';
    }

    drawResetBtn() {
        genSmallBox(this.resetBoardBtn, 0, 0, 51, 23, toPixelSize(1), "#9bf2fa", this.resetClick ? "#ffffff66" : "#1b1116");
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
            drawPixelTextInCanvas(this.game.isEnemyTurn ? "enemy turn time" : "player turn time", this.timer, toPixelSize(1), 40, 8, this.game.isEnemyTurn ? "#ff0000" : "#00bcd4", 1);
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
            this.plusClick = true;
            GameVars.boardPixelSize++;
            this.game.updateZoom();
            GameVars.sound.clickSound();
        }, () => setTimeout(() => this.plusClick = false, 50));
        this.zoomPlus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(15)) + 'px';

        this.zoomMinus = createElem(this.zoomDiv, "canvas", null, null, toPixelSize(18), toPixelSize(18), GameVars.isMobile, null, () => {
            this.minusClick = true;
            GameVars.boardPixelSize--;
            GameVars.boardPixelSize = GameVars.boardPixelSize < 1 ? 1 : GameVars.boardPixelSize;
            this.game.updateZoom();
            GameVars.sound.clickSound();
        }, () => setTimeout(() => this.minusClick = false, 50));
        this.zoomMinus.style.translate = (GameVars.gameW - this.zoom.width - toPixelSize(4)) + 'px ' + (((GameVars.gameH - this.zoom.height) / 2) + toPixelSize(37)) + 'px';
    }

    drawZoomBtns() {
        genSmallBox(this.zoomPlus, 0, 0, 17, 17, toPixelSize(1), "#9bf2fa", this.plusClick ? "#ffffff66" : "#1b1116");
        drawPixelTextInCanvas("+", this.zoomPlus, toPixelSize(1), 9, 9, "#9bf2fa", 4);

        genSmallBox(this.zoomMinus, 0, 0, 17, 17, toPixelSize(1), "#9bf2fa", this.minusClick ? "#ffffff66" : "#1b1116");
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
            GameVars.sound.clickSound();
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
        genSmallBox(this.startPlayerTurnCanvas, 0, 0, 62, 23, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas("start player", this.startPlayerTurnCanvas, toPixelSize(1), 31, 8, "#9bf2fa", 1);
        drawPixelTextInCanvas("turn", this.startPlayerTurnCanvas, toPixelSize(1), 31, 16, "#9bf2fa", 1);
    }

    createEndModal() {
        this.isDisplayingModal = false;
        this.endModalDiv = createElem(this.uiDiv, "div", null, null, GameVars.gameW, GameVars.gameH, GameVars.isMobile, "#00000066");
        this.endModalCanvas = createElem(this.endModalDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, GameVars.isMobile, "#000000cc");

        this.endModalBtn = createElem(this.endModalDiv, "canvas", null, null, toPixelSize(48), toPixelSize(20), GameVars.isMobile, "#00000066", () => {
            GameVars.sound.clickSound();
            if (this.game.enemyCharacters.length == 0) {
                if (this.game.levelIndex + 1 >= Levels.length) {
                    this.game.isGameCompleted = true;
                } else {
                    this.game.isChangeLevel = true;
                }
            }
            else if (this.game.playerCharacters.length == 0) {
                this.game.isRetryLevel = true;
            }
        });
        this.endModalBtn.style.translate = ((GameVars.gameW / 2) - (this.endModalBtn.width / 2)) + 'px ' + ((GameVars.gameH / 2) + 12) + 'px';
        this.endModalDiv.classList.add("hidden");
    }

    drawEndModal() {
        const wasVictory = this.game.enemyCharacters.length == 0;
        const isLastLevel = this.game.levelIndex + 1 >= Levels.length;
        genSmallBox(this.endModalCanvas, (GameVars.gameWdAsPixels / 2) - 64, (GameVars.gameHgAsPixels / 2) - 32, 128, 64, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas(wasVictory ? isLastLevel ? "game completed" : "victory" : "game over", this.endModalCanvas, toPixelSize(1), (GameVars.gameWdAsPixels / 2), (GameVars.gameHgAsPixels / 2) - 12, wasVictory ? "#00bcd4" : "#ff0000", 2);

        genSmallBox(this.endModalBtn, 0, 0, 47, 19, toPixelSize(1), "#9bf2fa", "#1b1116");
        drawPixelTextInCanvas(wasVictory ? isLastLevel ? "start over" : "next level" : "retry", this.endModalBtn, toPixelSize(1), 24, 10, "#9bf2fa", 1);
    }

    reset() {
        clearInterval(this.timerInterval);
        this.uiDiv.remove();
    }

    update(character) {
        this.uiCharacters.forEach(uiChar => uiChar.update(character));
        if (!this.isDisplayingModal && (this.game.enemyCharacters.length == 0 || this.game.playerCharacters.length == 0)) {
            this.isDisplayingModal = true;
            clearInterval(this.timerInterval);
            this.endModalDiv.classList.remove("hidden");
        }
    }

    draw() {
        this.uiCharacters.forEach(uiChar => uiChar.draw());
        this.drawTimer();
        this.drawResetBtn();
        this.drawZoomBtns();
        this.drawEndModal();
    }
}