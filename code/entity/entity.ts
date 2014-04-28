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
        if (this.mesh == null) {
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
        if (this.mesh != null) {
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

//Just for testing
class EntityBall extends Entity {
    constructor(level: Level) {
        super(level);
        this.bounds.setSize(0.2, 0.2, 0.2);
        
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshPhongMaterial({
            color: 0xFF0000,
            ambient: 0xFF0000,
            // diffuse: 0xFF0000,
            metal: true
        }));
        this.mesh.castShadow = true;
    }
    
    spawn() {
        super.spawn();
    }
    
    update() {
        if (this.getSecondsLived() >= 5) {
            this.die();
        }
    }
}
