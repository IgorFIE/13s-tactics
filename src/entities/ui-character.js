import { CharacterType } from "../enum/character-type";
import { DirectionType } from "../enum/direction-type";
import { GameVars, toPixelSize } from "../game-variables";
import { MeleeSwatBottom, PlayerSwatColors, RangeSwatBottom, ShieldSwatBottom } from "../sprites/swat-sprites";
import { genSmallBox } from "../utilities/box-generator";
import { drawSprite } from "../utilities/draw-utilities";
import { createElem } from "../utilities/elem-utilities";

export class UiCharacter {
    constructor(x, y, character, div, game) {
        this.character = character;
        this.isCharacterSelected = false;
        this.canvas = createElem(div, "canvas", null, null, toPixelSize(30), toPixelSize(32), GameVars.isMobile, null, () => {
            if (!game.isEnemyTurn) {
                game.board.click(0, 0);
                game.board.selectedCharacter = character;
                game.board.select();
            }
        });
        this.canvas.style.translate = x + 'px ' + y + 'px';

        this.ctx = this.canvas.getContext("2d");
    }

    // todo implement update
    update(character) {
        this.isCharacterSelected = !!character && this.character === character;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        genSmallBox(this.canvas, 2, 2, 25, 27, toPixelSize(1), "#3e3846", "#1b1116");
        if (this.isCharacterSelected) genSmallBox(this.canvas, 0, 0, 29, 31, toPixelSize(1), "#ffff57");

        const spritePos = GameVars.characterPos[this.character.characterType][DirectionType.RIGHT];
        drawSprite(this.ctx, this.getCharacterTypeSprite(), toPixelSize(1), spritePos.x, spritePos.y + 11, PlayerSwatColors);
    }

    getCharacterTypeSprite() {
        switch (this.character.characterType) {
            case CharacterType.SHIELD: return ShieldSwatBottom;
            case CharacterType.MELEE: return MeleeSwatBottom;
            case CharacterType.RANGE: return RangeSwatBottom;
        }
    }
}