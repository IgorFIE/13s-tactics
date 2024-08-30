import { DirectionType } from "../enum/direction-type";
import { GameVars, toBoardPixelSize } from "../game-variables";
import { MoveOptionArrow } from "../sprites/interaction-arrows";
import { drawSprite } from "../utilities/draw-utilities";

export class DirectionArrow {
    constructor() {
        this.direction = null;
    }

    update(direction) {
        this.direction = direction;
    }

    draw(tileX, tileY, ctx) {
        if (this.direction != null) {
            let spritePos = GameVars.moveOptionArrowPos[this.direction];
            drawSprite(ctx, MoveOptionArrow, toBoardPixelSize(1), tileX + spritePos.x, tileY + spritePos.y, null,
                this.direction == DirectionType.UP || this.direction == DirectionType.RIGHT,
                this.direction == DirectionType.DOWN || this.direction == DirectionType.RIGHT);
        }
    }
}