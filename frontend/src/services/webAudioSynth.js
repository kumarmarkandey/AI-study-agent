/**
 * Web Audio API Procedural Soundscape Synthesizer
 * Generates relaxing ambient study audio (Rain, Binaural Alpha Beats, Deep Space Drone, Forest Stream, Soft White Noise)
 * without external audio assets.
 */

let audioCtx = null;
let currentNodes = [];
let isPlaying = false;
let activeSoundscapeId = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopSoundscape() {
  currentNodes.forEach(node => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch (e) {
      // Ignore cleanup errors
    }
  });
  currentNodes = [];
  isPlaying = false;
  activeSoundscapeId = null;
}

export function playSoundscape(type, volume = 0.5) {
  stopSoundscape();
  const ctx = getAudioContext();
  if (!ctx) return false;

  activeSoundscapeId = type;
  isPlaying = true;

  const masterGain = ctx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(ctx.destination);
  currentNodes.push(masterGain);

  if (type === 'rain') {
    // White noise filtered for soothing rain & pink noise effect
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();
    currentNodes.push(whiteNoise, filter);
  } 
  else if (type === 'alpha') {
    // Binaural Alpha Waves (200Hz left, 210Hz right for 10Hz Alpha State)
    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    oscLeft.frequency.value = 200;
    oscRight.frequency.value = 210; // 10Hz difference = Alpha focus frequency

    const merger = ctx.createChannelMerger(2);
    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.35;

    merger.connect(gainNode);
    gainNode.connect(masterGain);

    oscLeft.start();
    oscRight.start();
    currentNodes.push(oscLeft, oscRight, merger, gainNode);
  }
  else if (type === 'drone') {
    // Deep Space Cosmic Ambient Drone
    const freqs = [65.41, 98.00, 130.81]; // C2, G2, C3
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.value = 0.08 / (idx + 1);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 250 + idx * 50;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      currentNodes.push(osc, filter, gain);
    });
  }
  else if (type === 'whitenoise') {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect(masterGain);
    noise.start();
    currentNodes.push(noise);
  }

  return true;
}

export function playTimerCompletionChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chime cascade
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const startTime = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.85);
  });
}

export function getSoundscapeState() {
  return { isPlaying, activeSoundscapeId };
}
