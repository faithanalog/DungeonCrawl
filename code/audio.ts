interface Window {
    AudioContext: any;
    webkitAudioContext: any;
}
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audio = new window.AudioContext();

class GameAudio {
    gainNode: any;
    constructor() {
        this.gainNode = audio.createGain();
        this.gainNode.connect(audio.destination);
    }

    getVolume() : number {
        return this.gainNode.gain.value;
    }

    setVolume(pct: number) {
        this.gainNode.gain.value = pct;
    }

    createSource() {
        var source = audio.createBufferSource();
        source.connect(this.gainNode);
        return source;
    }

    playSound(buffer, delay?: number) {
        var source = this.createSource();
        source.buffer = buffer;
        delay = delay || 0;
        source.start(audio.currentTime + delay);
        return source;
    }

    /**
     * Creates an audio element and starts streaming it.
     * Returns the audio element, for control.
     */
    streamAudio(srcUrl: string) {
        var stream = new Audio();
        stream.src = srcUrl;
        stream.autoplay = true;
        var source = audio.createMediaElementSource(stream);
        source.connect(this.gainNode);
        return stream;
    }
}

//function GameAudio() {
    //this.gainNode = audio.createGain();
    //this.gainNode.connect(audio.destination);
//}

//GameAudio.prototype.getVolume = function() {
    //return this.gainNode.gain.value;
//}

//GameAudio.prototype.setVolume = function(pct) {
    //this.gainNode.gain.value = pct;
//}

//GameAudio.prototype.createSource = function() {
    //var source = audio.createBufferSource();
    //source.connect(this.gainNode);
    //return source;
//}

///**
 //* Plays a sound buffer with the given delay in seconds
 //* Returns the source, which can be used to control the sound.
 //*/
//GameAudio.prototype.playSound = function(buffer, delay) {
    //var source = this.createSource();
    //source.buffer = buffer;
    //delay = delay || 0;
    //source.start(audio.currentTime + delay);
    //return source;
//}

///**
 //* Creates an audio element and starts streaming it.
 //* Returns the audio element, for control.
 //*/
//GameAudio.prototype.streamAudio = function(srcUrl) {
    //var stream = new Audio();
    //stream.src = srcUrl;
    //stream.autoplay = true;
    //var source = audio.createMediaElementSource(stream);
    //source.connect(this.gainNode);
    //return stream;
//}
