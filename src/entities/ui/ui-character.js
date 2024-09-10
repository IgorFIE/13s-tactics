import { CharacterType } from "../../enum/character-type";
import { DirectionType } from "../../enum/direction-type";
import { GameVars, toPixelSize } from "../../game-variables";
import { MeleeSwatBottom, PlayerSwatColors, RangeSwatBottom, ShieldSwatBottom } from "../../sprites/swat-sprites";
import { genSmallBox } from "../../utilities/box-generator";
import { drawSprite } from "../../utilities/draw-utilities";
import { createElem } from "../../utilities/elem-utilities";

export class UiCharacter {
    constructor(x, y, character, div, game) {
        this.character = character;
        this.isCharacterSelected = false;
        this.canvas = createElem(div, "canvas", null, null, toPixelSize(30), toPixelSize(32), GameVars.isMobile, null, () => {
            if (!game.isEnemyTurn) {
                game.board.click(0, 0);
                game.board.selectedCharacter = character;
                game.board.select();
                GameVars.sound.clickSound();
            }
        });
        this.canvas.style.translate = x + 'px ' + y + 'px';

        this.ctx = this.canvas.getContext("2d");
    }

    update(character) {
        this.isCharacterSelected = !!character && this.character === character;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        genSmallBox(this.canvas, 2, 2, 25, 27, toPixelSize(1), "#3e3846", "#1b1116");
        if (this.isCharacterSelected) genSmallBox(this.canvas, 0, 0, 29, 31, toPixelSize(1), "#ffff57");

        drawSprite(this.ctx, this.character.spriteToDraw, toPixelSize(1), this.character.spritePos.x + 1, this.character.spritePos.y + 11, this.character.colors, this.character.invertX);
    }
}