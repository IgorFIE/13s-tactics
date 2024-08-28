const { GameVars, toPixelSize } = require("./game-variables");
const { ShieldSwatTop, ShieldSwatBottom, RangeSwatTop, PlayerSwatColors, RangeSwatBottom, MeleeSwatTop, MeleeSwatBottom, EnemySwatColors } = require("./sprites/swat-sprites");
const { createFpsElement, updateFps } = require("./utilities/fps-utilities");
const { drawSprite, createPixelLine } = require("./utilities/draw-utilities");
const { Pixel } = require("./entities/pixel");
const { setElemSize, createElem } = require("./utilities/elem-utilities");
const { Tile } = require("./entities/tile");
const { TileType } = require("./enum/tile-type");
const { Board } = require("./entities/board");
const { SelectedArrow, MoveOptionArrow } = require("./sprites/interaction-arrows");
const { Game } = require("./game");

let mainMenuDiv;
let mainMenuCanv;

let gameDiv;

let fpsInterval = 1000 / GameVars.fps;
let then = Date.now();

let game;

const init = () => {
    let mainDiv = document.getElementById("main");
    mainMenuDiv = createElem(mainDiv, "div", "main-menu");
    mainMenuCanv = createElem(mainMenuDiv, "canvas");

    gameDiv = createElem(mainDiv, "div", "game");

    createFpsElement(mainDiv);
    GameVars.updatePixelSize(window.innerWidth, window.innerHeight);

    setElemSize(mainMenuCanv, toPixelSize(GameVars.gameWdAsPixels), toPixelSize(GameVars.gameHgAsPixels));

    // new Tile(0, 80, TileType.FLOOR, mainMenuCanv).draw();
    // new Tile(28, 80, TileType.FLOOR, mainMenuCanv).draw();
    // new Tile(70, 70, TileType.FLOOR, mainMenuCanv).draw();
    // new Tile(56, 80, TileType.FLOOR, mainMenuCanv).draw();

    // new Tile(84, 80, TileType.WALL, mainMenuCanv).draw();

    // new Tile(14, 90, TileType.FLOOR, mainMenuCanv).draw();

    // const tile = new Tile(42, 90, TileType.FLOOR, mainMenuCanv);
    // tile.draw();
    // tile.highlight();

    // new Tile(70, 90, TileType.FLOOR, mainMenuCanv).draw();

    // drawSprite(mainMenuCanv, RangeSwatTop, toPixelSize(2), toPixelSize(0), 0, EnemySwatColors, true);
    // drawSprite(mainMenuCanv, RangeSwatTop, toPixelSize(2), toPixelSize(5), 0, EnemySwatColors, false);
    // drawSprite(mainMenuCanv, RangeSwatBottom, toPixelSize(2), toPixelSize(0), toPixelSize(5), EnemySwatColors, true);
    // drawSprite(mainMenuCanv, RangeSwatBottom, toPixelSize(2), toPixelSize(5), toPixelSize(5), EnemySwatColors, false);

    // drawSprite(mainMenuCanv, ShieldSwatTop, toPixelSize(2), toPixelSize(10), 0, EnemySwatColors, true);
    // drawSprite(mainMenuCanv, ShieldSwatTop, toPixelSize(2), toPixelSize(15), 0, EnemySwatColors, false);
    // drawSprite(mainMenuCanv, ShieldSwatBottom, toPixelSize(2), toPixelSize(10), toPixelSize(5), EnemySwatColors, true);
    // drawSprite(mainMenuCanv, ShieldSwatBottom, toPixelSize(2), toPixelSize(15), toPixelSize(5), EnemySwatColors, false);

    // drawSprite(mainMenuCanv, MeleeSwatTop, toPixelSize(2), toPixelSize(20), 0, EnemySwatColors, true);
    // drawSprite(mainMenuCanv, MeleeSwatTop, toPixelSize(2), toPixelSize(25), 0, EnemySwatColors, false);
    // drawSprite(mainMenuCanv, MeleeSwatBottom, toPixelSize(2), toPixelSize(20), toPixelSize(5), EnemySwatColors, true);
    // drawSprite(mainMenuCanv, MeleeSwatBottom, toPixelSize(2), toPixelSize(25), toPixelSize(5), EnemySwatColors, false);

    // drawSprite(mainMenuCanv, RangeSwatTop, toPixelSize(2), toPixelSize(0), toPixelSize(10), PlayerSwatColors, true);
    // drawSprite(mainMenuCanv, RangeSwatTop, toPixelSize(2), toPixelSize(5), toPixelSize(10), PlayerSwatColors, false);
    // drawSprite(mainMenuCanv, RangeSwatBottom, toPixelSize(2), toPixelSize(0), toPixelSize(15), PlayerSwatColors, true);
    // drawSprite(mainMenuCanv, RangeSwatBottom, toPixelSize(2), toPixelSize(5), toPixelSize(15), PlayerSwatColors, false);

    // drawSprite(mainMenuCanv, ShieldSwatTop, toPixelSize(2), toPixelSize(10), toPixelSize(10), PlayerSwatColors, true);
    // drawSprite(mainMenuCanv, ShieldSwatTop, toPixelSize(2), toPixelSize(15), toPixelSize(10), PlayerSwatColors, false);
    // drawSprite(mainMenuCanv, ShieldSwatBottom, toPixelSize(2), toPixelSize(10), toPixelSize(15), PlayerSwatColors, true);
    // drawSprite(mainMenuCanv, ShieldSwatBottom, toPixelSize(2), toPixelSize(15), toPixelSize(15), PlayerSwatColors, false);

    // drawSprite(mainMenuCanv, MeleeSwatTop, toPixelSize(2), toPixelSize(20), toPixelSize(10), PlayerSwatColors, true);
    // drawSprite(mainMenuCanv, MeleeSwatTop, toPixelSize(2), toPixelSize(25), toPixelSize(10), PlayerSwatColors, false);
    // drawSprite(mainMenuCanv, MeleeSwatBottom, toPixelSize(2), toPixelSize(20), toPixelSize(15), PlayerSwatColors, true);
    // drawSprite(mainMenuCanv, MeleeSwatBottom, toPixelSize(2), toPixelSize(25), toPixelSize(15), PlayerSwatColors, false);

    // drawSprite(mainMenuCanv, ShieldSwatBottom, toPixelSize(2), 51, 87, PlayerSwatColors, false);

    // drawSprite(mainMenuCanv, SelectedArrow, toPixelSize(2), 0, 0, null, false);

    // drawSprite(mainMenuCanv, MoveOptionArrow, toPixelSize(2), 10, 0, null, false);
    // drawSprite(mainMenuCanv, MoveOptionArrow, toPixelSize(2), 20, 0, null, true);
    // drawSprite(mainMenuCanv, MoveOptionArrow, toPixelSize(2), 10, 10, null, false, true);
    // drawSprite(mainMenuCanv, MoveOptionArrow, toPixelSize(2), 20, 10, null, true, true);

    game = new Game(gameDiv);
    game.init();
    initHandlers();

    window.requestAnimationFrame(() => gameLoop());
}

const initHandlers = () => {
    document.onmousemove = (event) => {
        game.update(event.pageX, event.pageY);
    }
}

const gameLoop = () => {
    elapsed = Date.now() - then;
    if (elapsed > fpsInterval) {
        then = Date.now() - (elapsed % fpsInterval);
        GameVars.deltaTime = elapsed / 1000;
        updateFps(then);
        game.draw();
    }
    window.requestAnimationFrame(() => gameLoop());
}

init();