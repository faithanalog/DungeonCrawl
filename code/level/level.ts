///<reference path="tile.ts"/>
///<reference path="../three.d.ts"/>
///<reference path="../game.ts"/>
class Level {
    xsize: number;
    zsize: number;
    tiles: Tile[];
    mesh: THREE.Mesh;

    constructor(xsize: number, zsize: number) {
        this.xsize = xsize;
        this.zsize = zsize;
        this.tiles = Array(xsize * zsize);
        this.setTile(16, 16, Tiles.Brick);
        this.setTile(17, 16, Tiles.Brick);
        this.setTile(17, 17, Tiles.Brick);

        this.mesh = new THREE.Mesh();
        this.mesh.name = "level";
        this.genMesh();
    }

    setTile(x: number, z: number, tile: Tile) {
        this.tiles[x + z * this.xsize] = tile;
    }

    getTile(x: number, z: number) : Tile {
        return this.tiles[x + z * this.xsize];
    }

    genMesh() {
        var mesh = this.mesh;
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

        var floorGeom = new THREE.PlaneGeometry(this.xsize, this.zsize);
        floorGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        floorGeom.applyMatrix(new THREE.Matrix4().makeTranslation(this.xsize / 2, 0, this.zsize / 2));
        var floorMat = new THREE.MeshPhongMaterial({
            map: game.files.Grass,
            specular: 0x111111,
            shininess: 0
        });
        var floor = new THREE.Mesh(floorGeom, floorMat);
        floor.receiveShadow = true;
        // floor.rotation.x = Math.PI / 2D;
        mesh.add(floor);
        game.files.Grass.repeat.set(this.xsize, this.zsize);
    }

}
