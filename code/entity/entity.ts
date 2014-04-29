///<reference path="../phys/AABB.ts"/>
///<reference path="../level/level.ts"/>
class Entity {
    level: Level;
    bounds: AABB;
    mesh: THREE.Mesh;
    private dead: boolean;
    
    ticksLived: number;

    constructor(level: Level) {
        this.level = level;
        this.bounds = new AABB(1, 1, 1);
        this.ticksLived = 0;
        this.mesh = null;
        this.dead = false;
    }

    spawn(): void {
        if (this.mesh === null) {
            this.mesh = new THREE.Mesh(new THREE.BoxGeometry(this.bounds.width, this.bounds.height, this.bounds.depth),
            new THREE.MeshBasicMaterial({
                color: 0xFFFF00
            }));
        }
        this.mesh.position.set(this.bounds.x, this.bounds.y, this.bounds.z);
        this.level.entityMesh.add(this.mesh);
    }

    /**
     * Called to update the entity. Generally should not be overriden
     */
    tick(): void {
        this.update();
        this.ticksLived++;
        this.mesh.position.set(this.bounds.x, this.bounds.y, this.bounds.z);
    }
    
    /**
     * Override this to provide entity logic
     */
    update(): void {
        
    }

    die(): void {
        this.dead = true;
        if (this.mesh !== null) {
            this.level.entityMesh.remove(this.mesh);
        }
    }
    
    getSecondsLived(): number {
        return this.ticksLived / 60;
    }
    
    isDead(): boolean {
        return this.dead;
    }
}

class EntityLiving extends Entity {
    velX: number;
    velY: number;
    velZ: number;
    
    constructor(level: Level) {
        super(level);
        this.velX = 0;
        this.velY = 0;
        this.velZ = 0;
    }
    
    update() {
        this.bounds.translate(this.velX, this.velY, this.velZ);
        // this.bounds.x += this.velX;
        // this.bounds.y += this.velY;
        // this.bounds.z += this.velZ;
    }
}

//Just for testing
class EntityBall extends EntityLiving {
    
    private static ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshPhongMaterial({
        color: 0xFF0000,
        ambient: 0xFF0000,
        metal: true
    }));
    
    private minX: number;
    private maxX: number;
    
    constructor(level: Level, minX: number, maxX: number) {
        super(level);
        this.bounds.setSize(0.2, 0.2, 0.2);
        this.minX = minX;
        this.maxX = maxX;
        
        this.mesh = EntityBall.ballMesh.clone();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
    
    update() {
        super.update();
        if (this.bounds.minX <= this.minX) {
            this.velX *= -1;
            this.bounds.x += this.minX - this.bounds.minX;
        } else if (this.bounds.maxX >= this.maxX) {
            this.velX *= -1;
            this.bounds.x += this.maxX - this.bounds.maxX;
        }
    }
}
