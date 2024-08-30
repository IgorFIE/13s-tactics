import { TileType } from "../enum/tile-type";
import { GameVars, toPixelSize } from "../game-variables";
import { createPixelLine, fillPolygon } from "../utilities/draw-utilities";
import { DirectionArrow } from "./direction-arrow";
import { Point } from "./point";
import { Polygon } from "./polygon";
import { SelectionArrow } from "./selection-arrow";

export class Tile {
    constructor(boardX, boardY, x, y, tileType, ctx) {
        this.boardX = boardX;
        this.boardY = boardY;
        this.x = x;
        this.y = y;

        this.character = null;
        this.directionArrow = new DirectionArrow();
        this.selectionArrow = new SelectionArrow();

        this.isHighlight = false;
        this.isSelected = false;

        this.xRatio = GameVars.tileXRatio;
        this.yRatio = GameVars.tileYRatio;

        this.depth = GameVars.tileDepth;
        this.height = tileType == TileType.WALL ? GameVars.tileWallHeight : 0;
        this.tileType = tileType;

        this.ctx = ctx;

        this.createTopLines();
        this.createLeftLines();
        this.createRightLines();

        this.createCollisionBox();
    }

    createCollisionBox() {
        this.collisionObj = new Polygon([
            new Point(toPixelSize(this.x), toPixelSize(this.y + this.yRatio - this.height)),
            new Point(toPixelSize(this.x + this.xRatio), toPixelSize(this.y - this.height)),
            new Point(toPixelSize(this.x + (this.xRatio * 2)), toPixelSize(this.y + this.yRatio - this.height)),
            new Point(toPixelSize(this.x + this.xRatio), toPixelSize(this.y + (this.yRatio * 2) - this.height))
        ]);
    }

    createTopLines() {
        this.topLines = [];
        createPixelLine(this.x, this.y + this.yRatio - this.height, this.x + this.xRatio, this.y - this.height, this.tileType == TileType.WALL ? "#38252e" : "#edeef7", toPixelSize(1), this.topLines);
        createPixelLine(this.x + this.xRatio, this.y - this.height, this.x + (this.xRatio * 2), this.y + this.yRatio - this.height, this.tileType == TileType.WALL ? "#38252e" : "#edeef7", toPixelSize(1), this.topLines);
        createPixelLine(this.x, this.y + this.yRatio - this.height, this.x + this.xRatio, this.y + (this.yRatio * 2) - this.height, this.tileType == TileType.WALL ? "#38252e" : "#edeef7", toPixelSize(1), this.topLines);
        createPixelLine(this.x + this.xRatio, this.y + (this.yRatio * 2) - this.height, this.x + (this.xRatio * 2), this.y + this.yRatio - this.height, this.tileType == TileType.WALL ? "#38252e" : "#edeef7", toPixelSize(1), this.topLines);
    }

    createRightLines() {
        this.rightLines = [];
        createPixelLine(this.x + this.xRatio, this.y + (this.yRatio * 2) - this.height, this.x + (this.xRatio * 2), this.y + this.yRatio - this.height, this.tileType == TileType.WALL ? "#100f0f" : "#1b1116", toPixelSize(1), this.rightLines);
        createPixelLine(this.x + this.xRatio, this.y + (this.yRatio * 2) + this.depth, this.x + (this.xRatio * 2), this.y + this.yRatio + this.depth, this.tileType == TileType.WALL ? "#100f0f" : "#1b1116", toPixelSize(1), this.rightLines);
        createPixelLine(this.x + this.xRatio, this.y + (this.yRatio * 2) - this.height, this.x + this.xRatio, this.y + (this.yRatio * 2) + this.depth, this.tileType == TileType.WALL ? "#100f0f" : "#1b1116", toPixelSize(1), this.rightLines);
        createPixelLine(this.x + (this.xRatio * 2), this.y + this.yRatio - this.height, this.x + (this.xRatio * 2), this.y + this.yRatio + this.depth, this.tileType == TileType.WALL ? "#100f0f" : "#1b1116", toPixelSize(1), this.rightLines);
    }

    createLeftLines() {
        this.leftLines = [];
        createPixelLine(this.x, this.y + this.yRatio - this.height, this.x + this.xRatio, this.y + (this.yRatio * 2) - this.height, this.tileType == TileType.WALL ? "#38252e" : "#3e3846", toPixelSize(1), this.leftLines);
        createPixelLine(this.x + this.xRatio, this.y + (this.yRatio * 2) - this.height, this.x + this.xRatio, this.y + (this.yRatio * 2) + this.depth, this.tileType == TileType.WALL ? "#38252e" : "#3e3846", toPixelSize(1), this.leftLines);
        createPixelLine(this.x, this.y + this.yRatio - this.height, this.x, this.y + this.yRatio + this.depth, this.tileType == TileType.WALL ? "#38252e" : "#3e3846", toPixelSize(1), this.leftLines);
        createPixelLine(this.x, this.y + this.yRatio + this.depth, this.x + this.xRatio, this.y + (this.yRatio * 2) + this.depth, this.tileType == TileType.WALL ? "#38252e" : "#3e3846", toPixelSize(1), this.leftLines);
    }

    click(x, y) {
        this.isSelected = !!this.character && this.character.isPlayer && this.collisionObj.isPointInsidePolygon(x, y);
        return this.isSelected;
    }

    canMoveTo(x, y) {
        return this.isSelected && this.collisionObj.isPointInsidePolygon(x, y);
    }

    select(direction) {
        this.isSelected = true;
        this.directionArrow.direction = direction;
    }

    update(x, y) {
        this.isHighlight = this.collisionObj.isPointInsidePolygon(x, y);
    }

    drawBack() {
        fillPolygon(this.leftLines, this.tileType == TileType.WALL ? "#3e3846" : "#38252e", this.ctx);
        fillPolygon(this.rightLines, this.tileType == TileType.WALL ? "#1b1116" : "#2f1519", this.ctx);
        fillPolygon(this.topLines, this.tileType == TileType.WALL ? "#edeef7" : "#686b7a", this.ctx);

        this.leftLines.forEach(pixel => pixel.draw(this.ctx));
        this.rightLines.forEach(pixel => pixel.draw(this.ctx));
        this.topLines.forEach(pixel => pixel.draw(this.ctx));
    }

    drawMiddle() {
        if (this.isSelected) this.drawHighlight(!this.character || this.character.isPlayer ? "#52804d" : "#ff0000");
        if (this.isHighlight) this.drawHighlight(!this.character || this.character.isPlayer ? "#ffff57" : "#ff0000");
        if (this.isSelected) this.directionArrow.draw(this.x, this.y, this.ctx);
    }

    drawHighlight(color) {
        fillPolygon(this.topLines, color + "66", this.ctx);
        this.topLines.forEach(pixel => pixel.draw(this.ctx, color));
    }

    drawFront() {
        this.character?.draw(this.x, this.y, this.ctx);
        if (this.isSelected && this.character) this.selectionArrow.draw(this.x, this.y, this.ctx);
    }
}