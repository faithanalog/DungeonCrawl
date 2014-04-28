function Input(elem) {
    this.elem = elem;
    this.keys = Array(256);
    var scope = this;

    elem.tabIndex = 1;
    elem.requestPointerLock = elem.requestPointerLock ||
			     elem.mozRequestPointerLock ||
			     elem.webkitRequestPointerLock;
    elem.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;

    this.isKeyDown = function(key) {
        return this.keys[key];
    }

    this.isCharDown = function(char) {
        return this.keys[char.charCodeAt(0)];
    };

    var pointerlockchange = function(evt) {
        if (document.pointerLockElement === elem ||
            document.mozPointerLockElement === elem ||
            document.webkitPointerLockElement === elem) {
            // Pointer was just locked
            // Enable the mousemove listener
            document.addEventListener("mousemove", mousemove, false);
        } else {
            // Pointer was just unlocked
            // Disable the mousemove listener
            document.removeEventListener("mousemove", mousemove, false);
        }
    };

    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);


    var mousemove = function(e) {
        var movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0,
          movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;
        if (Math.abs(movementX) >= 200) {
            movementX = 0;
        }
        if (Math.abs(movementY) >= 200) {
            movementY = 0;
        }
        var sens = 0.0020;
        game.cam.rotation.y -= movementX * sens;
        game.cam.rotation.x -= movementY * sens;
        while (game.cam.rotation.y < 0)
            game.cam.rotation.y += Math.PI * 2;
        while (game.cam.rotation.y >= Math.PI * 2)
            game.cam.rotation.y -= Math.PI * 2;
        if (game.cam.rotation.x < -Math.PI * 0.5)
            game.cam.rotation.x = -Math.PI * 0.5;
        if (game.cam.rotation.x > Math.PI * 0.5)
            game.cam.rotation.x = Math.PI * 0.5;
    };

    elem.onkeydown = function(evt) {
        scope.keys[evt.keyCode] = true;

    };
    elem.onkeyup = function(evt) {
        scope.keys[evt.keyCode] = false;
    };
    elem.onmousedown = function(evt) {
        // evt.preventDefault();
        elem.requestPointerLock();
    };
    elem.onmouseup = function(evt) {
        // evt.preventDefault();
    };
    elem.oncontextmenu = function() {
        return false;
    };
}
