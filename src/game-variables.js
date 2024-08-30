import { CharacterStatus } from "./entities/character-status";
import { Point } from "./entities/point";
import { CharacterType } from "./enum/character-type";
import { DirectionType } from "./enum/direction-type";

const storeId = 'igorfie-pixel-swat';

let highScore = parseInt(localStorage.getItem(storeId)) || 0;

const isMobile = navigator.maxTouchPoints > 1 && navigator.maxTouchPoints !== 256;

let lastGameW;
let lastGameH;

let gameW;
let gameH;

let deltaTime;

let pixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

const updatePixelSize = (width, height) => {
    GameVars.lastGameW = GameVars.gameW;
    GameVars.lastGameH = GameVars.gameH;

    GameVars.gameW = width;
    GameVars.gameH = height;

    GameVars.pixelSize = pixelCal(2, 4);

    GameVars.gameWdAsPixels = width / GameVars.pixelSize;
    GameVars.gameHgAsPixels = height / GameVars.pixelSize;
}

const pixelCal = (min, max) => {
    let hgPixelSize = Math.round((GameVars.gameH - 270) * ((max - min) / (1100 - 270)) + min);
    let wdPixelSize = Math.round((GameVars.gameW - 480) * ((max - min) / (1000 - 480)) + min);
    let pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    return pixelSize >= 1 ? pixelSize : 1;
};

export const GameVars = {
    storeId,
    highScore,

    isMobile,

    lastGameW,
    lastGameH,

    gameW,
    gameH,

    fps: 60,
    deltaTime,

    pixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    tileXRatio: 13,
    tileYRatio: 10,
    tileDepth: 5,
    tileWallHeight: 7,

    gameBoardSize: 9,

    keys: {},

    characterPos: {
        [CharacterType.SHIELD]: {
            [DirectionType.LEFT]: new Point(4, -7),
            [DirectionType.UP]: new Point(9, -7),
            [DirectionType.RIGHT]: new Point(8, -3),
            [DirectionType.DOWN]: new Point(4, -3),
        },
        [CharacterType.RANGE]: {
            [DirectionType.LEFT]: new Point(5, -2),
            [DirectionType.UP]: new Point(9, -2),
            [DirectionType.RIGHT]: new Point(8, -2),
            [DirectionType.DOWN]: new Point(5, -2),
        },
        [CharacterType.MELEE]: {
            [DirectionType.LEFT]: new Point(6, -4),
            [DirectionType.UP]: new Point(6, -4),
            [DirectionType.RIGHT]: new Point(9, -2),
            [DirectionType.DOWN]: new Point(4, -2),
        }
    },
    characterStatus: {
        [CharacterType.SHIELD]: new CharacterStatus(0, 3, 1),
        [CharacterType.RANGE]: new CharacterStatus(2, 1, 2),
        [CharacterType.MELEE]: new CharacterStatus(4, 2, 3),
    },

    moveOptionArrowPos: {
        [DirectionType.UP]: new Point(10, 6),
        [DirectionType.RIGHT]: new Point(10, 7),
        [DirectionType.DOWN]: new Point(9, 7),
        [DirectionType.LEFT]: new Point(9, 6),
    },

    updatePixelSize,
}

export const toPixelSize = (value) => {
    return value * GameVars.pixelSize;
}

export const removePixelSize = (value) => {
    return value / GameVars.pixelSize;
}