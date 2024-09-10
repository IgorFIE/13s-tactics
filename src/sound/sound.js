export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.isSoundOn = true;
        this.isSoundInitialized = false;

        this.noteCount = [0, 0];
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
        this.ctx.resume();
        this.musicInternval = setInterval(() => this.playMusic(), 60000 / 240);
    }

    clickSound() {
        this.playSound("triangle", 174.6, 0.5, 0, 0.2);
    }

    moveSound() {
        this.playSound("triangle", 110, 0.8, 0, 0.1);
    }

    playerDeadSound() {
        this.playSound("square", 18.35, 0.1, 0, 0.1);
        this.playSound("square", 36.71, 0.1, 0.1, 0.2);
        this.playSound("square", 73.42, 0.1, 0.2, 0.2);
    }

    victorySound() {
        this.playSound("square", 932.3, 0.2, 0, 0.1);
        this.playSound("square", 1865, 0.2, 0.1, 0.2);
    }

    playOverSound() {
        this.playSound("square", 32.70, 0.3, 0, 0.1);
        this.playSound("square", 36.71, 0.2, 0.1, 0.2);
        this.playSound("square", 16.35, 0.3, 0.2, 0.1);
    }

    playSound(type, value, volume, start, end) {
        if (this.isSoundOn && this.isSoundInitialized) {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();

            o.type = type;
            o.frequency.value = value;

            g.gain.setValueAtTime(volume, this.ctx.currentTime + start);
            g.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + start + end);

            o.connect(g);
            g.connect(this.ctx.destination);
            o.start(this.ctx.currentTime + start);
            o.stop(this.ctx.currentTime + start + end);
        }
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized && this.ctx.state == "running") {
            this.playSound("Sine", mB[this.noteCount[0]], 0.5, 0, 0.8);
            this.updateNoteCount(0, mB);

            this.playSound("square", mR[this.noteCount[1]], 0.02, 0, 0.8);
            this.updateNoteCount(1, mR);
        }
    }

    updateNoteCount(pos, melodyArray) {
        this.noteCount[pos]++;
        if (this.noteCount[pos] >= melodyArray.length) this.noteCount[pos] = 0;
    }
}

const mB = [
    61.74, null, 61.74, null, null, null, null, null,
    61.74, null, null, null, null, null, null, null,
    61.74, null, null, null, null, null, null, null,
    61.74, null, null, null, null, null, null, null
];

const mR = [61.74, null, 123.47, null];