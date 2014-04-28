///<reference path="globals.d.ts"/>
///<reference path="preload.d.ts"/>
///<reference path="three.d.ts"/>
///<reference path="input.d.ts"/>
///<reference path="requestAnimFrame.ts"/>
///<reference path="level/level.ts"/>
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
            game.cam.aspect = window.innerWidth / window.innerHeight;
            game.cam.updateProjectionMatrix();
            game.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        game.audio = new GameAudio();
        game.audio.setVolume(0.25);
        //game.audio.playSound(game.files.TestSound);
        //game.audio.streamAudio("res/songs/RQ_TouchTouch_VIP.mp3");

        //Init tiles
        Tiles.initTiles();

        game.level = new Level(32, 32);

        game.cam.rotation.order = 'YXZ';
        game.cam.position.x = 16;
        game.cam.position.z = 18;
        game.scene.add(game.level.mesh);

        game.ambientLight = new THREE.AmbientLight(0x808080);
        game.scene.add(game.ambientLight);


        // game.directLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
        // var light = game.directLight;
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
        // game.scene.add(light);

        var light = game.playerLight = new THREE.PointLight(0xFFFFFF, 1, 16);

        light.position = game.cam.position;
        game.scene.add(light);


        var shadowLight = game.shadowLight = new THREE.SpotLight(0xFFFFFF, 0, 100, Math.PI / 3);
        // shadowLight.position = game.cam.position;
        shadowLight.castShadow = true;
        shadowLight.onlyShadow = true;
        shadowLight.shadowCameraNear = game.cam.near;
        shadowLight.shadowCameraFar = game.cam.far;
        shadowLight.shadowCameraFov = 120;
        shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
        shadowLight.shadowBias = 0.00003;

        game.scene.add(game.cam);
        game.cam.add(shadowLight);
        game.cam.add(shadowLight.target);
        shadowLight.position.set(0, 0, 0.5);
        shadowLight.target.position.set(0, 0, -0.5);
        // shadowLight.target = game.cam;
        // shadowLight.target.position.set(0, 0, -1);
        // game.scene.add(shadowLight);


        var renderer = game.renderer;
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;

        // var sun = new THREE.Mesh(new THREE.SphereGeometry(10, 20, 20), new THREE.MeshBasicMaterial({color: 0xFFDF00}));
        // sun.name = "sun";
        // sun.position.set(150, 100, 150);
        // game.scene.add(sun);
        // renderer.shadowMapDebug = true;

        var testObj = new THREE.Mesh(new THREE.SphereGeometry(0.20, 32, 32), new THREE.MeshPhongMaterial({
            color: 0xFF0000,
            ambient: 0xFF0000,
            // diffuse: 0xFF0000,
            metal: true
        }));
        testObj.castShadow = true;
        // testObj.receiveShadow = true;
        testObj.position.set(15.5, 0.35, 17.5);
        game.scene.add(testObj);

        game.clock = new THREE.Clock(true);
        game.lastUpdate = -1;
        requestAnimationFrame(game.loop);
    }

    loop(time) {
        requestAnimationFrame(game.loop);
        if (game.lastUpdate === -1 || time - game.lastUpdate >= 1000) {
            game.lastUpdate = time;
        }
        while (time - game.lastUpdate >= 16.6667) {
            game.tick();
            game.lastUpdate += 16.6667;
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
    }
}
var game = new Game();
