///<reference path="../phys/AABB.ts"/>
///<reference path="../level/level.ts"/>
class Entity {
    level: Level;
    bounds: AABB;

    constructor(level: Level) {
        this.level = level;
        this.bounds = new AABB(1, 1, 1);
    }

    spawn():void {

    }

    tick():void {

    }

    die():void {

    }
}
