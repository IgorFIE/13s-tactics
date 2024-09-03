const { GameVars, toPixelSize } = require("./game-variables");
const { createFpsElement, updateFps } = require("./utilities/fps-utilities");
const { setElemSize, createElem } = require("./utilities/elem-utilities");
const { Game } = require("./game");

let mainMenuDiv;
let mainMenuCanv;

let gameDiv;
let gameBoardDiv;

let fpsInterval = 1000 / GameVars.fps;
let then = Date.now();

let game;

const init = () => {
    let mainDiv = document.getElementById("main");
    mainMenuDiv = createElem(mainDiv, "div", "main-menu");
    mainMenuCanv = createElem(mainMenuDiv, "canvas");

    gameDiv = createElem(mainDiv, "div", "game");
    gameBoardDiv = createElem(gameDiv, "div", "board-div");

    createFpsElement(mainDiv);
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    setElemSize(mainMenuCanv, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));

    game = new Game(gameBoardDiv);
    game.init();
    initHandlers();

    window.requestAnimationFrame(() => gameLoop());
}

const initHandlers = () => {
    gameBoardDiv.onmousemove = (event) => { game.mov(event.pageX, event.pageY) };
    gameBoardDiv.onmousedown = (e) => { !game.isEnemyTurn && game.click(e.clientX, e.clientY) };

    gameBoardDiv.ontouchstart = (e) => { !game.isEnemyTurn && game.click(e.touches[0].clientX, e.touches[0].clientY) };
}

const gameLoop = () => {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        GameVars.deltaTime = elapsed / 1000;
        // updateFps(then);
        game.update();
        game.draw();
    }
    window.requestAnimationFrame(() => gameLoop());
}

init();