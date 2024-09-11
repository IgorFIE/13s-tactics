import { CharacterStatus } from "./entities/character-status";
import { Point } from "./entities/point";
import { CharacterType } from "./enum/character-type";
import { DirectionType } from "./enum/direction-type";
import { MovType } from "./enum/mov-type";

const isMobile = navigator.maxTouchPoints > 1 && navigator.maxTouchPoints !== 256;

const tileXRatio = 13;
const tileYRatio = 10;
const tileDepth = 5;
const tileWallHeight = 7;

const gameBoardSize = 9;

const characterPos = {
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
};

const characterStatus = {
    [CharacterType.SHIELD]: new CharacterStatus(1, MovType.BOTH),
    [CharacterType.RANGE]: new CharacterStatus(4, MovType.DIRECTIONAL),
    [CharacterType.MELEE]: new CharacterStatus(2, MovType.DIAGONAL),
};

const moveOptionArrowPos = {
    [DirectionType.UP]: new Point(10, 6),
    [DirectionType.RIGHT]: new Point(10, 7),
    [DirectionType.DOWN]: new Point(9, 7),
    [DirectionType.LEFT]: new Point(9, 6),
};

const updatePixelSize = (width, height) => {
    GameVars.lastGameW = GameVars.gameW;
    GameVars.lastGameH = GameVars.gameH;

    GameVars.gameW = width;
    GameVars.gameH = height;

    GameVars.pixelSize = pixelCal(2, 4);
    GameVars.boardPixelSize = GameVars.pixelSize;

    GameVars.gameWdAsPixels = width / GameVars.pixelSize;
    GameVars.gameHgAsPixels = height / GameVars.pixelSize;
}

const pixelCal = (min, max) => {
    let hgPixelSize = Math.round((GameVars.gameH - 270) * ((max - min) / (1100 - 270)) + min);
    let wdPixelSize = Math.round((GameVars.gameW - 480) * ((max - min) / (1000 - 480)) + min);
    let pixelSize = hgPixelSize < wdPixelSize ? hgPixelSize : wdPixelSize;
    return pixelSize >= 1 ? pixelSize : 1;
};

let sound;

let lastGameW;
let lastGameH;

let gameW;
let gameH;

let pixelSize;
let boardPixelSize;

let gameWdAsPixels;
let gameHgAsPixels;

export const GameVars = {
    isMobile,

    sound,

    lastGameW,
    lastGameH,

    gameW,
    gameH,

    pixelSize,
    boardPixelSize,
    gameWdAsPixels,
    gameHgAsPixels,

    tileXRatio,
    tileYRatio,
    tileDepth,
    tileWallHeight,

    gameBoardSize,

    characterPos,
    characterStatus,

    moveOptionArrowPos,

    updatePixelSize,
}

export const toPixelSize = (value) => {
    return value * GameVars.pixelSize;
}

export const removePixelSize = (value) => {
    return value / GameVars.pixelSize;
}

export const toBoardPixelSize = (value) => {
    return value * GameVars.boardPixelSize;
}

export const removeBoardPixelSize = (value) => {
    return value / GameVars.boardPixelSize;
}