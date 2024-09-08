import { CharacterType } from "../enum/character-type";
import { DirectionType } from "../enum/direction-type";
import { TileType } from "../enum/tile-type";
import { GameVars } from "../game-variables";

class AStarNode {
    constructor(x, y, g = 0, h = 0, parent = null) {
        this.id = this.createNumericIdentifier(x, y);
        this.x = x;
        this.y = y;
        this.f = g + h;
        this.g = g;
        this.h = h;
        this.parent = parent;
    }

    createNumericIdentifier(x, y) {
        return y + (x / Math.pow(10, x.toString().length));
    }
}

export class aStar {
    aStarPath(character, targetPoint, board) {
        this.openList = [];
        this.closedList = [];

        this.openMap = {};
        this.closedMap = {};

        const parent = new AStarNode(character.x, character.y);
        const target = new AStarNode(targetPoint.x, targetPoint.y);

        this.openList.push(parent);
        this.openMap[parent.id] = true;

        let forceBreakCount = 0;
        let s = null;

        while (this.openList.length > 0) {
            s = this.retrieveLowestScore();

            if ((s.x == target.x && s.y == target.y) || forceBreakCount > 500) break;

            switch (character.characterType) {
                case CharacterType.SHIELD:
                    for (let y = -1; y <= 1; y++) {
                        for (let x = -1; x <= 1; x++) {
                            this.addAdjacentNodesToOpenList(s.x + x, s.y + y, s.g + 1, s, target, board, (tile) => this.normalCharacterValidation(s, tile));
                        }
                    }
                    break;

                case CharacterType.MELEE:
                    this.addAdjacentNodesToOpenList(s.x + 1, s.y, s.g + 1, s, target, board, (tile) => this.meleeCharacterValidation(s, tile));
                    this.addAdjacentNodesToOpenList(s.x - 1, s.y, s.g + 1, s, target, board, (tile) => this.meleeCharacterValidation(s, tile));
                    this.addAdjacentNodesToOpenList(s.x, s.y + 1, s.g + 1, s, target, board, (tile) => this.meleeCharacterValidation(s, tile));
                    this.addAdjacentNodesToOpenList(s.x, s.y - 1, s.g + 1, s, target, board, (tile) => this.meleeCharacterValidation(s, tile));
                    break;

                case CharacterType.RANGE:
                    this.addAdjacentNodesToOpenList(s.x + 1, s.y + 1, s.g + 1, s, target, board, (tile) => this.normalCharacterValidation(s, tile));
                    this.addAdjacentNodesToOpenList(s.x - 1, s.y - 1, s.g + 1, s, target, board, (tile) => this.normalCharacterValidation(s, tile));
                    this.addAdjacentNodesToOpenList(s.x + 1, s.y - 1, s.g + 1, s, target, board, (tile) => this.normalCharacterValidation(s, tile));
                    this.addAdjacentNodesToOpenList(s.x - 1, s.y + 1, s.g + 1, s, target, board, (tile) => this.normalCharacterValidation(s, tile));
                    break;
            }

            forceBreakCount++;
        }
        if (this.closedMap[target.id] && forceBreakCount <= 500) {
            return this.calculateFinalList(character.characterType);
        }
        return [];
    };

    normalCharacterValidation(s, tile) {
        return (tile.tileType == TileType.FLOOR && !tile.character) ||
            (tile.tileType == TileType.FLOOR && tile.character && tile.character.isPlayer && !this.validateShieldCollision(s.x, s.y, tile.character));
    }

    // melee ignores walls
    meleeCharacterValidation(s, tile) {
        return !(tile.character && tile.character.isPlayer && this.validateShieldCollision(s.x, s.y, tile.character));
    }

    validateShieldCollision(x, y, enemy) {
        switch (enemy.direction) {
            case DirectionType.UP: return y < enemy.y;
            case DirectionType.DOWN: return y > enemy.y;
            case DirectionType.LEFT: return x < enemy.x;
            case DirectionType.RIGHT: return x > enemy.x;
        }
    }

    retrieveLowestScore() {
        let s = null;
        this.openList.forEach((node, i) => {
            if (s == null || node.h <= s.h) s = node;
        });
        if (!!s) {
            this.openList = this.openList.filter(node => node.id != s.id);
            delete this.openMap[s.id];

            this.closedList.push(s);
            this.closedMap[s.id] = true;
        }
        return s;
    }

    addAdjacentNodesToOpenList(x, y, g, parent, target, board, validationFn) {
        if (y >= 0 && y < board.length && x >= 0 && x < board.length) {
            if (validationFn(board[y][x])) {
                const h = Math.abs(x - target.x) + Math.abs(y - target.y);
                const newPoint = new AStarNode(x, y, g, h, parent);
                if (!this.closedMap[newPoint.id] && !this.openMap[newPoint.id]) {
                    this.openList.push(newPoint);
                    this.openMap[newPoint.id] = true;
                }
            }
        }
    }

    calculateFinalList(characterType) {
        const finalPathList = [];
        let node = this.closedList[this.closedList.length - 1];
        while (node != null) {
            finalPathList.push(node);
            node = node.parent;
        }

        if (characterType !== CharacterType.SHIELD) {
            return this.cleanPathByCharacterType(finalPathList.reverse(), GameVars.characterStatus[characterType].dist);
        }
        return finalPathList.reverse();
    }

    cleanPathByCharacterType(path, maxDiff) {
        let currentIndex = 0;
        let nextIndex;
        while (currentIndex < path.length - 1) {
            nextIndex = currentIndex + 1;
            if (nextIndex < path.length - 1) {
                path = this.clearPath(path, currentIndex, nextIndex, path[nextIndex].x - path[currentIndex].x, path[nextIndex].y - path[currentIndex].y, maxDiff);
            }
            currentIndex++;
        }
        return path;
    }

    clearPath(path, startIndex, nextIndex, xDiff, yDiff, maxDiff) {
        if (nextIndex >= path.length - 1) return path;
        let newXDiff = path[nextIndex].x - path[startIndex].x;
        let newYDiff = path[nextIndex].y - path[startIndex].y;
        let isSameXdir = xDiff == newXDiff || (xDiff > 0 && newXDiff > 0) || (xDiff < 0 && newXDiff < 0);
        let isSameYdir = yDiff == newYDiff || (yDiff > 0 && newYDiff > 0) || (yDiff < 0 && newYDiff < 0);
        if (isSameXdir && isSameYdir && Math.abs(newXDiff) <= maxDiff && Math.abs(newYDiff) <= maxDiff) {
            if (Math.abs(newXDiff) > 1 || Math.abs(newYDiff) > 1) {
                path.splice(startIndex + 1, 1);
                return this.clearPath(path, startIndex, nextIndex, xDiff, yDiff, maxDiff);
            }
            return this.clearPath(path, startIndex, nextIndex + 1, xDiff, yDiff, maxDiff);
        }
        return path;
    }
}