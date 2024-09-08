import { CharacterType } from "../enum/character-type";
import { DirectionType } from "../enum/direction-type";
import { GameVars, toBoardPixelSize } from "../game-variables";
import { EnemySwatColors, MeleeSwatBottom, MeleeSwatTop, PlayerSwatColors, RangeSwatBottom, RangeSwatTop, ShieldSwatBottom, ShieldSwatTop } from "../sprites/swat-sprites";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";

export class Character {
    constructor(x, y, characterType, direction, isPlayer) {
        this.x = x;
        this.y = y;
        this.characterType = characterType;
        this.direction = direction;
        this.isPlayer = isPlayer;
    }

    updatePos(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction >= 0 ? direction : this.direction;
    }

    draw(tileX, tileY, ctx) {
        const spritePos = GameVars.characterPos[this.characterType][this.direction];
        genSmallBox(ctx.canvas, tileX + (GameVars.tileXRatio / 2), tileY + (GameVars.tileYRatio / 2), GameVars.tileXRatio, GameVars.tileYRatio, toBoardPixelSize(1), "#00000033", "#00000033");
        switch (this.direction) {
            case DirectionType.UP:
            case DirectionType.LEFT:
                drawSprite(ctx, this.getCharacterTypeSprite(), toBoardPixelSize(1), tileX + spritePos.x, tileY + spritePos.y, this.getCharacterColors(), this.direction == DirectionType.LEFT);
                break;
            case DirectionType.DOWN:
            case DirectionType.RIGHT:
                drawSprite(ctx, this.getCharacterTypeSprite(), toBoardPixelSize(1), tileX + spritePos.x, tileY + spritePos.y, this.getCharacterColors(), this.direction == DirectionType.DOWN);
                break;
        }
    }

    getCharacterTypeSprite() {
        switch (this.characterType) {
            case CharacterType.SHIELD: return this.isBottomSprite() ? ShieldSwatBottom : ShieldSwatTop;
            case CharacterType.MELEE: return this.isBottomSprite() ? MeleeSwatBottom : MeleeSwatTop;
            case CharacterType.RANGE: return this.isBottomSprite() ? RangeSwatBottom : RangeSwatTop;
        }
    }

    isBottomSprite() {
        return this.direction == DirectionType.DOWN || this.direction == DirectionType.RIGHT;
    }

    getCharacterColors() {
        return this.isPlayer ? PlayerSwatColors : EnemySwatColors;
    }
}