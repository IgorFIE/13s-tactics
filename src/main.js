const { GameVars, toPixelSize } = require("./game-variables");
const { createFpsElement, updateFps } = require("./utilities/fps-utilities");
const { setElemSize, createElem } = require("./utilities/elem-utilities");
const { Game } = require("./game");
const { genSmallBox } = require("./utilities/box-generator");
const { drawPixelTextInCanvas } = require("./utilities/text");
const { drawSprite, createPixelLine } = require("./utilities/draw-utilities");
const { ShieldSwatBottom, PlayerSwatColors, EnemySwatColors, RangeSwatBottom, MeleeSwatBottom } = require("./sprites/swat-sprites");

let mainDiv;

let mainMenuDiv;
let mainMenuCanv;
let mainMenuBtn;

let gameDiv;
let gameBoardDiv;

let game;

const init = () => {
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    mainDiv = document.getElementById("main");

    gameDiv = createElem(mainDiv, "div", "game");
    gameBoardDiv = createElem(gameDiv, "div", "board-div");

    createMainMenu();

    game = new Game(gameBoardDiv);

    initHandlers();
    window.requestAnimationFrame(() => gameLoop());
}

const createMainMenu = () => {
    mainMenuDiv = createElem(mainDiv, "div", "main-menu");
    mainMenuCanv = createElem(mainMenuDiv, "canvas", null, null, GameVars.gameW, GameVars.gameH, GameVars.isMobile, "#1b1116");
    const mainMenuCtx = mainMenuCanv.getContext("2d");

    const backLines = []
    for (let i = 0; i < GameVars.gameHgAsPixels / 12; i++) {
        createPixelLine(0, 12 * i, GameVars.gameWdAsPixels, 12 * i, "#1b1116", toPixelSize(2), backLines);
        createPixelLine(0, 12 * i + 2, GameVars.gameWdAsPixels, 12 * i + 2, "#1b1116", toPixelSize(2), backLines);
    }
    backLines.forEach(line => line.draw(mainMenuCtx));

    const lines = [];
    const linePixel = toPixelSize(3);
    const lineCenterW = Math.round((GameVars.gameW / 2) / linePixel);
    const lineCenterH = Math.round((GameVars.gameH / 2) / linePixel);
    genSmallBox(mainMenuCanv, 0, lineCenterH - 24, GameVars.gameWdAsPixels, GameVars.gameHgAsPixels, linePixel, "#686b7a", "#686b7a");
    createPixelLine(lineCenterW - 1, lineCenterH - 24, lineCenterW - 1, lineCenterH + 124, "#edeef7", linePixel, lines);
    for (let i = 1; i <= 8; i++) {
        createPixelLine(0, lineCenterH - 24 + ((i - 1) * (2 * i)), GameVars.gameWdAsPixels, lineCenterH - 24 + ((i - 1) * (2 * i)), "#edeef7", linePixel, lines);
        createPixelLine(lineCenterW + (i * 8), lineCenterH - 24, lineCenterW + (i * 112), lineCenterH + 48, "#edeef7", linePixel, lines);
        createPixelLine(lineCenterW - (i * 8), lineCenterH - 24, lineCenterW - (i * 112), lineCenterH + 48, "#edeef7", linePixel, lines);
    }
    lines.forEach(line => line.draw(mainMenuCtx));

    drawCharacter(mainMenuCtx, 3, -19, -19, RangeSwatBottom, PlayerSwatColors);
    drawCharacter(mainMenuCtx, 4, -24, -9, ShieldSwatBottom, PlayerSwatColors);
    drawCharacter(mainMenuCtx, 5, -28, 3, MeleeSwatBottom, PlayerSwatColors);

    drawCharacter(mainMenuCtx, 3, 4, -19, RangeSwatBottom, EnemySwatColors, true);
    drawCharacter(mainMenuCtx, 4, 8, -9, ShieldSwatBottom, EnemySwatColors, true);
    drawCharacter(mainMenuCtx, 5, 14, 3, MeleeSwatBottom, EnemySwatColors, true);

    genSmallBox(mainMenuCanv, -1, -1, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 24, toPixelSize(2), "#3e3846", "#1b1116");
    drawPixelTextInCanvas("13s tactics", mainMenuCanv, toPixelSize(3), Math.round(GameVars.gameW / 2 / toPixelSize(3)), 8, "#00bcd4", 1);

    genSmallBox(mainMenuCanv, -1, Math.floor(mainMenuCanv.height / toPixelSize(2)) - 15, Math.floor(mainMenuCanv.width / toPixelSize(2)) + 2, 16, toPixelSize(2), "#3e3846", "#1b1116");
    drawPixelTextInCanvas("a 13 second turns tactical game", mainMenuCanv, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 22, "#00bcd4", 1);
    drawPixelTextInCanvas("js13kgames 2024 - igor estevao", mainMenuCanv, toPixelSize(1), GameVars.gameWdAsPixels / 2, GameVars.gameHgAsPixels - 8, "#00bcd4", 1);

    createMainBtnStartBtn();
}

const drawCharacter = (ctx, pixelSize, x, y, sprite, colors, isInvert) => {
    const charPixel = toPixelSize(pixelSize);
    const charCenterW = Math.round((GameVars.gameW / 2) / charPixel);
    const charCenterH = Math.round((GameVars.gameH / 2) / charPixel);
    genSmallBox(mainMenuCanv, charCenterW + x - 1, charCenterH + y + 9, 16, 10, charPixel, "#00000033", "#00000033");
    drawSprite(ctx, sprite, charPixel, charCenterW + x, charCenterH + y, colors, isInvert);
}

const createMainBtnStartBtn = () => {
    mainMenuBtn = createElem(mainMenuDiv, "canvas", null, null, toPixelSize(112), toPixelSize(32), GameVars.isMobile, null, () => {
        mainMenuDiv.classList.add("hidden");
        game.init(0);
    });

    mainMenuBtn.style.translate = ((GameVars.gameW / 2) - (mainMenuBtn.width / 2)) + 'px ' + ((GameVars.gameH / 3) * 2) + 'px';
    genSmallBox(mainMenuBtn, 0, 0, 110, 30, toPixelSize(1), "#3e3846", "#1b1116");
    drawPixelTextInCanvas("start game", mainMenuBtn, toPixelSize(1), 56, 16, "#9bf2fa", 2);
}

const initHandlers = () => {
    gameBoardDiv.onmousemove = (event) => { game.mov(event.pageX, event.pageY) };
    gameBoardDiv.onmousedown = (e) => { !game.isEnemyTurn && game.click(e.clientX, e.clientY) };

    gameBoardDiv.ontouchstart = (e) => { !game.isEnemyTurn && game.click(e.touches[0].clientX, e.touches[0].clientY) };
}

const gameLoop = () => {
    game.update();
    game.draw();
    window.requestAnimationFrame(() => gameLoop());
}

init();