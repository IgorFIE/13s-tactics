import { Pixel } from "../entities/pixel";
import { Triangle } from "../entities/triangle";

export const drawSprite = (canvas, sprite, pixelSize = 1, startX = 0, startY = 0, colorIds = null, invertX = false, invertY = false) => {
    const ctx = canvas.getContext("2d");
    sprite.forEach((row, y) => {
        y = invertY ? row.length - 1 - y : y;
        row.forEach((val, x) => {
            x = invertX ? row.length - 1 - x : x;
            if (val !== null) {
                ctx.fillStyle = colorIds ? colorIds[val] || val : val;
                ctx.fillRect(
                    (startX * pixelSize) + (x * pixelSize),
                    (startY * pixelSize) + (y * pixelSize),
                    pixelSize,
                    pixelSize);
            }
        })
    });
};

export const fillPolygon = (pixels, color, ctx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pixels[0].center.x, pixels[0].center.y);
    pixels.forEach(pixel => ctx.lineTo(pixel.center.x, pixel.center.y));
    ctx.closePath();
    ctx.fill();
}

export const createPixelLine = (sx, sy, tx, ty, color, scale, pixels) => {
    const angle = getAngle(tx - sx, ty - sy);
    const tri = getTriangle(sx, sy, tx, ty, angle);
    for (let i = 0; i < tri.long; i++) {
        pixels.push(new Pixel(Math.round(sx + tri.x * i) * scale, Math.round(sy + tri.y * i) * scale, scale, scale, color));
    }
    pixels.push(new Pixel(Math.round(tx) * scale, Math.round(ty) * scale, scale, scale, color));
    return pixels;
}

const getAngle = (x, y) => {
    return Math.atan(y / (x == 0 ? 0.01 : x)) + (x < 0 ? Math.PI : 0);
}

const getTriangle = (x1, y1, x2, y2, ang) => {
    if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
        return new Triangle(
            Math.sign(Math.cos(ang)),
            Math.tan(ang) * Math.sign(Math.cos(ang)),
            Math.abs(x1 - x2)
        );
    } else {
        return new Triangle(
            Math.tan((Math.PI / 2) - ang) * Math.sign(Math.cos((Math.PI / 2) - ang)),
            Math.sign(Math.cos((Math.PI / 2) - ang)),
            Math.abs(y1 - y2)
        );
    }
}