import { Point } from "./point";

export class Pixel {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.center = new Point(x + (w / 2), y + (h / 2));
        this.color = color;
    }

    draw(ctx, overrideColor) {
        ctx.fillStyle = overrideColor || this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}