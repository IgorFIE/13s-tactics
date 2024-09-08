export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.loopTime = 0.016;
        this.loopMaxTime = 4;
        this.notesPeerLoop = 32;
        this.currentTime = this.loopMaxTime / this.notesPeerLoop;

        this.musicBassNote = 0;
        this.musicBass2Note = 0;
        this.musicElectricNote = 0;
        this.musicRythmNote = 0;

        this.isSoundOn = true;
        this.isSoundInitialized = false;
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
        this.context.resume();
    }

    clickSound() {
        this.playSound("triangle", 174.6, 1, 0, 0.2);
    }

    moveSound() {
        this.playSound("triangle", 110, 1, 0, 0.1);
    }

    playerDeadSound() {
        this.playSound("square", 18.35, 0.1, 0, 0.1);
        this.playSound("square", 36.71, 0.1, 0.1, 0.2);
        this.playSound("square", 73.42, 0.1, 0.2, 0.2);
    }

    victorySound() {
        this.playSound("square", 932.3, 0.4, 0, 0.1);
        this.playSound("square", 1865, 0.4, 0.1, 0.2);
    }

    playOverSound() {
        this.playSound("square", 32.70, 0.3, 0, 0.1);
        this.playSound("square", 36.71, 0.2, 0.1, 0.2);
        this.playSound("square", 16.35, 0.3, 0.2, 0.1);
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {

                this.playSound("sine", mB[this.musicBassNote], 1, 0, 0.8);
                this.musicBassNote++;
                this.musicBassNote >= mB.length && (this.musicBassNote = 0);

                this.playSound("square", mM[this.musicElectricNote], 0.03, 0.1, 8);
                this.musicElectricNote++;
                this.musicElectricNote >= mM.length && (this.musicElectricNote = 0);

                this.playSound("sine", mB[this.musicBass2Note], 1, 0, 0.8);
                this.musicBass2Note++;
                this.musicBass2Note >= mB.length && (this.musicBass2Note = 0);

                this.playSound("square", mR[this.musicRythmNote], 0.01, 0, 0.8);
                this.musicRythmNote++;
                this.musicRythmNote >= mR.length && (this.musicRythmNote = 0);

                this.currentTime = 0;
            } else {
                this.currentTime = this.currentTime + this.loopTime;
            }
        }
    }

    playSound(type, value, volume, start, end) {
        if (this.isSoundOn && this.isSoundInitialized) {
            const o = this.context.createOscillator();
            const g = this.context.createGain();
            o.type = type;
            o.frequency.value = value;

            g.gain.setValueAtTime(volume, this.context.currentTime);
            g.gain.linearRampToValueAtTime(0.0001, this.context.currentTime + end);

            o.connect(g);
            g.connect(this.context.destination);
            o.start(start);
            o.stop(this.context.currentTime + end);
        }
    }
}

const mB = [
    61.74, null, 61.74, null, null, null, null, null,
    61.74, null, null, null, null, null, null, null,
    61.74, null, null, null, null, null, null, null,
    61.74, null, null, null, null, null, null, null
];

const mM = [
    null, null, null, null, 123.47, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
];

const mR = [
    61.74, null, 123.47, null, 61.74, null, 123.47, null,
    61.74, null, 123.47, null, 61.74, null, 123.47, null,
    61.74, null, 123.47, null, 61.74, null, 123.47, null,
    61.74, null, 123.47, null, 61.74, null, 123.47, null,
];