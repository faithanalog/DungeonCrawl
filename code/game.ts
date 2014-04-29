///<reference path="lib/preload.d.ts"/>
///<reference path="lib/three.d.ts"/>
///<reference path="lib/input.d.ts"/>
///<reference path="lib/requestAnimFrame.ts"/>
///<reference path="level/level.ts"/>
///<reference path="entity/entity.ts"/>
///<reference path="level/tile.ts"/>
///<reference path="audio.ts"/>
class Game {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    cam: THREE.PerspectiveCamera;
    files: any;
    clock: THREE.Clock;
    level: Level;
    input: Input;
    audio: GameAudio;
    lastUpdate: number;

    ambientLight: THREE.AmbientLight;
    playerLight: THREE.PointLight;
    shadowLight: THREE.SpotLight;

    init() {
        //var havePointerLock = 'pointerLockElement' in document ||
        //'mozPointerLockElement' in document ||
        //'webkitPointerLockElement' in document;

        //if (!havePointerLock) {
            //alert("Your browser doesn't support pointer lock!\nPlease use chrome, firefox, or another browser which supports it.");
            //return;
        //}

        var req = new XMLHttpRequest();
        req.open('GET', 'res/Manifest.json', true);
        req.responseType = "text";
        req.onload = function() {
            preloader.preload(JSON.parse(req.response), function(files) {
                game.files = files;
                game.launchGame();
            });
        }
        req.send();
    }
    launchGame() {
        this.scene = new THREE.Scene();
        this.cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        var elem = this.renderer.domElement;
        this.input = new Input(elem);
        document.body.appendChild(elem);

        window.onresize = function() {
            this.cam.aspect = window.innerWidth / window.innerHeight;
            this.cam.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        this.audio = new GameAudio();
        this.audio.setVolume(0.25);
        //this.audio.playSound(this.files.TestSound);
        //this.audio.streamAudio("res/songs/RQ_TouchTouch_VIP.mp3");

        //Init tiles
        Tiles.initTiles();

        this.level = new Level(32, 32);

        this.cam.rotation.order = 'YXZ';
        this.cam.position.x = 16;
        this.cam.position.z = 18;
        this.scene.add(this.level.mesh);

        this.ambientLight = new THREE.AmbientLight(0x808080);
        this.scene.add(this.ambientLight);


        // this.directLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
        // var light = this.directLight;
        // light.shadowMapWidth = light.shadowMapHeight = 4096;
        // light.position.set(150, 100, 150);
        // light.target.position.set(32, 0, 32);
        // light.castShadow = true;

        // var d = 23;
        // light.shadowCameraFar = 300;
        // light.shadowCameraLeft = -d;
        // light.shadowCameraRight = d;
        // light.shadowCameraTop = d + 5;
        // light.shadowCameraBottom = -d + 5;
        // light.shadowBias = 0.00003;
        // this.scene.add(light);

        var light = this.playerLight = new THREE.PointLight(0xFFFFFF, 1, 16);

        light.position = this.cam.position;
        this.scene.add(light);


        var shadowLight = this.shadowLight = new THREE.SpotLight(0xFFFFFF, 0, 100, Math.PI / 3);
        // shadowLight.position = this.cam.position;
        shadowLight.castShadow = true;
        shadowLight.onlyShadow = true;
        shadowLight.shadowCameraNear = this.cam.near;
        shadowLight.shadowCameraFar = this.cam.far;
        shadowLight.shadowCameraFov = 120;
        shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
        shadowLight.shadowBias = 0.00003;

        this.scene.add(this.cam);
        this.cam.add(shadowLight);
        this.cam.add(shadowLight.target);
        shadowLight.position.set(0, 0, 0.5);
        shadowLight.target.position.set(0, 0, -0.5);


        var renderer = this.renderer;
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        
        this.input.onkeyup = function(evt: KeyboardEvent) {
            //Space
            if (evt.keyCode === 32) {
                var level = game.level;
                
                var x = game.cam.position.x;
                var y = game.cam.position.y;
                var z = game.cam.position.z;
                
                var ball = new EntityBall(level, x - 1, x + 1);
                ball.bounds.setPosition(x, 0.35, z);
                ball.velX = 1 / 60;
                level.spawnEntity(ball);
            }
        };

        this.clock = new THREE.Clock(true);
        this.lastUpdate = -1;
        requestAnimationFrame(game.loop);
    }

    loop(time) {
        time = game.clock.getElapsedTime() * 1000; //Convert to milliseconds
        requestAnimationFrame(game.loop);
        if (game.lastUpdate === -1 || time - game.lastUpdate >= 1000) {
            game.lastUpdate = time;
        }
        while (time - game.lastUpdate >= 16.666667) {
            game.tick();
            game.lastUpdate += 16.666667;
        }
        game.render();
    }

    render() {
        this.renderer.render(this.scene, this.cam);
    }

    tick() {
        var input = game.input;

        var speed = 0.03;
        var rotSpeed = 0.03;

        var velx = 0, velz = 0;
        var velPitch = 0, velYaw = 0;
        if (input.isCharDown('A')) {
            velx -= speed;
        }
        if (input.isCharDown('D')) {
            velx += speed;
        }
        if (input.isCharDown('W')) {
            velz -= speed;
        }
        if (input.isCharDown('S')) {
            velz += speed;
        }

        //Left, Up, Right, Down
        if (input.isKeyDown(37)) {
            velYaw += rotSpeed;
        }
        if (input.isKeyDown(38)) {
            velPitch += rotSpeed;
        }
        if (input.isKeyDown(39)) {
            velYaw -= rotSpeed;
        }
        if (input.isKeyDown(40)) {
            velPitch -= rotSpeed;
        }

        var cam = game.cam;

        cam.rotation.x += velPitch;
        cam.rotation.y += velYaw;

        var cos = Math.cos(-cam.rotation.y);
        var sin = Math.sin(-cam.rotation.y);

        var pos = cam.position;
        pos.x += velx * cos - velz * sin;
        pos.y = 0.5;
        pos.z += velx * sin + velz * cos;
        
        this.level.tick();
    }
}
var game = new Game();
