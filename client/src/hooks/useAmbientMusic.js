import { useCallback, useEffect, useRef, useState } from "react";

// Acorde cálido (Cmaj9) generado con osciladores — sin archivos de audio externos.
const CHORD_FREQS = [130.81, 164.81, 196.0, 246.94, 329.63];

export function useAmbientMusic(initialVolume = 0.15) {
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const masterGainRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(initialVolume);

  const teardown = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try {
        n.stop?.();
      } catch {
        // ya estaba detenido
      }
      try {
        n.disconnect?.();
      } catch {
        // ya estaba desconectado
      }
    });
    nodesRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close().catch(() => {});
      ctxRef.current = null;
    }
    masterGainRef.current = null;
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) {
      setPlaying(false);
      return;
    }
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 1.2);
    setTimeout(teardown, 1300);
    setPlaying(false);
  }, [teardown]);

  const play = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.connect(masterGain);

    const nodes = [filter];

    CHORD_FREQS.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const vibrato = ctx.createOscillator();
      vibrato.frequency.value = 0.08 + i * 0.02;
      const vibratoGain = ctx.createGain();
      vibratoGain.gain.value = 1.5;
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      vibrato.start();

      const voiceGain = ctx.createGain();
      voiceGain.gain.value = 0.12 / (i + 1);
      const breath = ctx.createOscillator();
      breath.frequency.value = 0.05 + i * 0.015;
      const breathGain = ctx.createGain();
      breathGain.gain.value = 0.04 / (i + 1);
      breath.connect(breathGain);
      breathGain.connect(voiceGain.gain);
      breath.start();

      osc.connect(voiceGain);
      voiceGain.connect(filter);
      osc.start();

      nodes.push(osc, vibrato, vibratoGain, voiceGain, breath, breathGain);
    });

    nodesRef.current = nodes;
    masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);
    setPlaying(true);
  }, [volume]);

  const toggle = useCallback(() => {
    if (playing) stop();
    else play();
  }, [playing, play, stop]);

  const setVolume = useCallback((value) => {
    setVolumeState(value);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(value, ctxRef.current.currentTime, 0.2);
    }
  }, []);

  useEffect(() => teardown, [teardown]);

  return { playing, toggle, volume, setVolume };
}
