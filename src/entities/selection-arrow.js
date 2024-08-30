import { toBoardPixelSize } from "../game-variables";
import { SelectedArrow } from "../sprites/interaction-arrows";
import { drawSprite } from "../utilities/draw-utilities";

export class SelectionArrow {
    constructor() {
        this.x = 9;
        this.y = -12;
    }

    draw(tileX, tileY, ctx, isPlayer) {
        drawSprite(ctx, SelectedArrow, toBoardPixelSize(1), tileX + this.x, tileY + this.y, { "sa": (isPlayer ? "#ffff57" : "#ff0000") });
    }
}