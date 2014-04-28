var preloader = {};
preloader.parseTextureWrap = function(str) {
    if (!str) {
        return THREE.ClampToEdgeWrapping;
    }
    switch (str) {
        case "clamp":
            return THREE.ClampToEdgeWrapping;
        case "repeat":
            return THREE.RepeatWrapping;
    }
}

preloader.parseTextureFilter = function(str) {
    switch (str) {
        case "nearest":
            return THREE.NearestFilter;
        case "linear":
            return THREE.LinearFilter;
        case "nearestMipMapNearest":
            return THREE.NearestMipMapNearestFilter;
        case "nearestMipMapLinear":
            return THREE.NearestMipMapLinearFilter;
        case "linearMipMapNearest":
            return THREE.LinearMipMapNearestFilter;
        case "linearMipMapLinear":
            return THREE.LinearMipMapLinearFilter;
    }
}

preloader.preload = function(manifest, callback) {
    var fileCount = Object.keys(manifest.files).length;
    var filesLoaded = 0;
    var files = {};

    var geomLoader = new THREE.JSONLoader();
    var objLoader = new THREE.ObjectLoader();

    var fileDone = function(name, obj) {
        files[name] = obj;
        filesLoaded++;
        if (filesLoaded == fileCount) {
            callback(files);
        }
    };
    for (var fname in manifest.files) {
        (function(name, info) {
            var path = manifest.root + info.path;
            switch (info.type) {
                case "texture":
                    var img = new Image();
                    img.onload = function() {
                        var tex = new THREE.Texture(img);
                        tex.wrapS = preloader.parseTextureWrap(info.wrapS);
                        tex.wrapT = preloader.parseTextureWrap(info.wrapT);
                        if (info.minFilter) {
                            tex.minFilter = preloader.parseTextureFilter(info.minFilter);
                        }
                        if (info.magFilter) {
                            tex.magFilter = preloader.parseTextureFilter(info.magFilter);
                        }
                        if (info.anisotropy) {
                            tex.anisotropy = info.anisotropy;
                        }
                        tex.needsUpdate = true;
                        fileDone(name, tex);
                    }
                    img.src = path;
                    break;
                case "geometry":
                    geomLoader.load(path, function(geom, mats) {
                        fileDone(name, {geometry: geom, materials: mats});
                    });
                    break;
                case "object":
                    objLoader.load(path, function(obj) {
                        console.log(obj);
                        fileDone(name, obj);
                    });
                    break;
                case "json":
                    var req = new XMLHttpRequest();
                    req.open('GET', path, true);
                    req.responseType = "text";
                    req.onload = function() {
                        fileDone(name, JSON.parse(req.response));
                    }
                    req.send();
                    break;
                case "sound":
                    var req = new XMLHttpRequest();
                    req.open('GET', path, true);
                    req.responseType = "arraybuffer";
                    req.onload = function() {
                        audio.decodeAudioData(req.response, function(audioBuffer) {
                            fileDone(name, audioBuffer);
                        });
                    }
                    req.send();
                    break;
            }
        })(fname, manifest.files[fname]);
    }
}
