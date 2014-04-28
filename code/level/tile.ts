///<reference path="../three.d.ts"/>
///<reference path="../game.ts"/>
class Tile {
    texture: THREE.Texture;
    geom: THREE.Geometry;
    material: THREE.MeshPhongMaterial;

    constructor(texture: THREE.Texture) {
        this.texture = texture;
        this.geom = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshPhongMaterial({
            map: this.texture,
            specular: 0x111111,
            shininess: 0
        });
    }
}
var Tiles:any = {
    initTiles: function() {
        this.Brick = new Tile(game.files.Brick);
    }
}
