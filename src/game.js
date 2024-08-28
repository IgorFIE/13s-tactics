import { Board } from "./entities/board";
import { UI } from "./entities/ui";
import { GameVars, toPixelSize } from "./game-variables";
import { createElem, setElemSize } from "./utilities/elem-utilities";

export class Game {
    constructor(gameDiv) {
        this.gameDiv = gameDiv;
    }

    init() {
        this.gameDiv.innerHtml = "";
        this.board = new Board(this.gameDiv);
        this.ui = new UI(this);
    }

    interact(x, y) {
        this.board.interact(x, y);
    }

    update() {
    }

    draw() {
        this.board.draw();
    }
}