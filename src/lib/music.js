import config from '../config.js';

/**
 * Background music.
 *  - If config.music.src is set, plays that audio file on loop.
 *  - Otherwise generates a soft, royalty-free music-box lullaby with the
 *    Web Audio API (no files to download, works offline).
 * Browsers only allow audio after a user gesture, so `start()` must be called
 * from a tap/click handler.
 */

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI -> Hz

// I – V – vi – IV in C major, gentle and warm.  [bass, chord tones...]
const PROGRESSION = [
  [48, 60, 64, 67, 72], // C
  [43, 59, 62, 67, 71], // G
  [45, 60, 64, 69, 72], // Am
  [41, 60, 65, 69, 72], // F
];
// Arpeggio pattern (indexes into chord tones 1..4, +12 = up an octave)
const ARP = [1, 2, 3, 4, 3, 2, 3, 4];
// Little melody per bar (MIDI notes on beats; null = rest). 8 eighth-notes per bar.
const MELODY = [
  [76, null, null, 79, null, null, 76, null],
  [74, null, null, null, 71, null, 74, null],
  [72, null, null, 76, null, null, 79, null],
  [77, null, 76, null, 74, null, null, null],
  [76, null, null, 79, null, 84, 83, null],
  [79, null, null, null, 74, null, 76, null],
  [72, null, null, 76, null, null, 81, 79],
  [77, null, 76, null, 72, null, null, null],
];

const BPM = 76;
const EIGHTH = 60 / BPM / 2;

class SynthEngine {
  ctx = null;
  master = null;
  timer = null;
  step = 0;
  nextTime = 0;

  init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;

    // Soft echo for a dreamy, roomy feel
    const delay = this.ctx.createDelay(1);
    delay.delayTime.value = EIGHTH * 3;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.28;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.35;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2600;

    this.bus = this.ctx.createGain();
    this.bus.connect(lp);
    lp.connect(this.master);
    lp.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(this.master);
    this.master.connect(this.ctx.destination);
    return true;
  }

  bell(midi, t, vel = 0.12, dur = 2.2) {
    const { ctx } = this;
    const f = NOTE(midi);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(this.bus);
    // Music-box timbre: fundamental + a quiet inharmonic partial
    [
      [1, 1],
      [2.0, 0.25],
      [3.01, 0.08],
    ].forEach(([mult, amp]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.value = amp;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + dur + 0.05);
    });
  }

  pad(midi, t, dur) {
    const { ctx } = this;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = NOTE(midi);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.6);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.bus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  schedule = () => {
    const { ctx } = this;
    while (this.nextTime < ctx.currentTime + 0.15) {
      const bar = Math.floor(this.step / 8);
      const pos = this.step % 8;
      const chord = PROGRESSION[bar % PROGRESSION.length];
      const t = this.nextTime;
      if (pos === 0) this.pad(chord[0], t, EIGHTH * 8 + 0.4);
      this.bell(chord[ARP[pos]] , t, 0.05, 1.6);
      const m = MELODY[bar % MELODY.length][pos];
      if (m) this.bell(m, t, 0.11, 2.6);
      this.step++;
      this.nextTime += EIGHTH;
    }
  };

  async play(volume) {
    if (!this.ctx && !this.init()) return;
    if (this.ctx.state !== 'running') await this.ctx.resume();
    if (!this.timer) {
      this.nextTime = this.ctx.currentTime + 0.1;
      this.timer = setInterval(this.schedule, 30);
    }
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(volume, now + 1.2);
  }

  isRunning() {
    return !!(this.ctx && this.ctx.state === 'running' && this.timer);
  }

  pause() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.3);
    clearInterval(this.timer);
    this.timer = null;
    setTimeout(() => this.ctx?.state === 'running' && !this.timer && this.ctx.suspend(), 400);
  }
}

class FileEngine {
  audio = null;
  async play(volume) {
    if (!this.audio) {
      this.audio = new Audio(config.music.src);
      this.audio.loop = true;
      this.audio.preload = 'auto';
    }
    this.audio.volume = volume;
    await this.audio.play();
  }
  isRunning() {
    return !!(this.audio && !this.audio.paused);
  }
  pause() {
    this.audio?.pause();
  }
}

const engine = config.music.src ? new FileEngine() : new SynthEngine();
const MUTE_KEY = 'six-layers-of-love:muted';

export const music = {
  started: false,
  muted: (() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  })(),

  /** Call from a user gesture. Starts music unless muted. */
  async start() {
    this.started = true;
    if (this.muted) return;
    try {
      await engine.play(config.music.volume ?? 0.5);
    } catch {
      /* autoplay blocked – will retry on next gesture */
      this.started = false;
    }
  },

  isRunning() {
    return engine.isRunning();
  },

  /** Pause while the tab is hidden (phone locked / app switched). */
  suspend() {
    engine.pause();
  },

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (muted) engine.pause();
    else this.start();
  },
};
