export class Polygon {
    constructor(points) {
        this.points = points;
    }

    isPointInsidePolygon(x, y) {
        let isInside = false;
        let j = 0;
        for (let i = 0; i < this.points.length; i++) {
            j = i + 1 < this.points.length ? i + 1 : 0;
            if (this.points[i].y > y != this.points[j].y > y &&
                x < ((this.points[j].x - this.points[i].x) * (y - this.points[i].y)) / (this.points[j].y - this.points[i].y) + this.points[i].x) {
                isInside = !isInside;
            }
        }
        return isInside;
    }

    updatePos(x, y) {
        this.points.forEach(point => {
            point.x += x;
            point.y += y;
        });
    }
}