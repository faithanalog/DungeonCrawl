///<reference path="tile.ts"/>
///<reference path="../lib/three.d.ts"/>
///<reference path="../game.ts"/>
///<reference path="../entity/entity.ts"/>
class Level {
    xsize: number;
    zsize: number;
    tiles: Tile[];
    entities: Entity[];
    
    mesh: THREE.Mesh;
    entityMesh: THREE.Mesh;
    private tileMesh: THREE.Mesh;

    constructor(xsize: number, zsize: number) {
        this.xsize = xsize;
        this.zsize = zsize;
        this.tiles = Array(xsize * zsize);
        this.entities = Array();
        
        this.setTile(16, 16, Tiles.Brick);
        this.setTile(17, 16, Tiles.Brick);
        this.setTile(17, 17, Tiles.Brick);

        this.mesh = new THREE.Mesh();
        this.mesh.name = "level";
        
        this.tileMesh = new THREE.Mesh();
        this.tileMesh.name = "tiles";
        this.mesh.add(this.tileMesh);
        
        this.entityMesh = new THREE.Mesh();
        this.entityMesh.name = "entities";
        this.mesh.add(this.entityMesh);
        
        //Set up the repeating floor texture
        var floorGeom = new THREE.PlaneGeometry(xsize, zsize);
        floorGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        floorGeom.applyMatrix(new THREE.Matrix4().makeTranslation(xsize / 2, 0, zsize / 2));
        var floorTex = game.files.Grass.clone();
        floorTex.repeat.set(xsize, zsize);
        floorTex.needsUpdate = true;
        var floor = new THREE.Mesh(floorGeom, new THREE.MeshPhongMaterial({
            map: floorTex,
            specular: 0x111111,
            shininess: 0
        }));
        floor.receiveShadow = true;
        this.mesh.add(floor);
        
        
        var ball = new EntityBall(this, 14.5, 16.5);
        ball.bounds.setPosition(15.5, 0.35, 17.5);
        ball.velX = 1 / 60;
        this.spawnEntity(ball);
        
        
        this.genMesh();
    }
    
    spawnEntity(entity: Entity) {
        this.entities.push(entity);
        entity.spawn();
    }
    
    tick() {
        var entities = this.entities;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.tick();
            if (entity.isDead()) {
                //Remove it from the array if it's dead
                entities.splice(i, 1);
                i--;
            }
        }
    }

    setTile(x: number, z: number, tile: Tile) {
        this.tiles[x + z * this.xsize] = tile;
    }

    getTile(x: number, z: number) : Tile {
        return this.tiles[x + z * this.xsize];
    }

    genMesh() {
        var mesh = this.tileMesh;
        mesh.children.length = 0;

        for (var x = 0; x < this.xsize; x++) {
            for (var z = 0; z < this.zsize; z++) {
                var tile = this.getTile(x, z);
                if (tile) {
                    var tileMesh = new THREE.Mesh(tile.geom, tile.material);
                    // tileMesh.castShadow = true;
                    tileMesh.receiveShadow = true;
                    tileMesh.position.x = x + 0.5;
                    tileMesh.position.y = 0.5;
                    tileMesh.position.z = z + 0.5;
                    mesh.add(tileMesh);
                }
            }
        }
    }

}
