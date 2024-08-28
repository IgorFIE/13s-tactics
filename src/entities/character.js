import { CharacterType } from "../enum/character-type";
import { DirectionType } from "../enum/direction-type";
import { GameVars, removePixelSize, toPixelSize } from "../game-variables";
import { EnemySwatColors, MeleeSwatBottom, MeleeSwatTop, PlayerSwatColors, RangeSwatBottom, RangeSwatTop, ShieldSwatBottom, ShieldSwatTop } from "../sprites/swat-sprites";
import { drawSprite } from "../utilities/draw-utilities";

export class Character {
    constructor(x, y, characterType, direction, isPlayer) {
        this.x = x;
        this.y = y;
        this.characterType = characterType;
        this.direction = direction;
        this.isPlayer = isPlayer;
    }

    updatePos(x, y) {
        this.setCharacterDirection(this.x - x, this.y - y);
        this.x = x;
        this.y = y;
    }

    setCharacterDirection(xDiff, yDiff) {
        if (xDiff != 0) {
            this.direction = xDiff < 0 ? DirectionType.RIGHT : DirectionType.LEFT;
        }
        if (yDiff != 0) {
            this.direction = yDiff < 0 ? DirectionType.DOWN : DirectionType.UP;
        }
    }

    draw(tileX, tileY, ctx) {
        const spritePos = GameVars.characterPos[this.characterType][this.direction];
        switch (this.direction) {
            case DirectionType.UP:
            case DirectionType.LEFT:
                drawSprite(ctx, this.getCharacterTypeSprite(), toPixelSize(1), tileX + spritePos.x, tileY + spritePos.y, this.getCharacterColors(), this.direction == DirectionType.LEFT);
                break;
            case DirectionType.DOWN:
            case DirectionType.RIGHT:
                drawSprite(ctx, this.getCharacterTypeSprite(), toPixelSize(1), tileX + spritePos.x, tileY + spritePos.y, this.getCharacterColors(), this.direction == DirectionType.DOWN);
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