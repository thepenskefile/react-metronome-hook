import { useEffect, useState, useMemo, useCallback } from "react";

const FIRST_BEAT = 1;
const DEFAULT_TEMPO = 60;
const DEFAULT_BEATS_PER_MEASURE = 4;
const START_TIME = 0;
const MIN_TEMPO = 20;
const MAX_TEMPO = 300;
const MIN_BEATS_PER_MEASURE = 1;
const MAX_BEATS_PER_MEASURE = 16;

export interface UseMetronomeProps {
  initialTempo?: number;
  initialBeatsPerMeasure?: number;
  initialTickSounds: [string, string];
  initialVolume?: number;
}

export interface MetronomeControls {
  beatsPerMeasure: number;
  tempo: number;
  isPlaying: boolean;
  currentBeat: number;
  volume: number;
  setTimeSignature: (value: number) => void;
  setTempo: (value: number) => void;
  setTickSounds: (sounds: string[]) => void;
  setVolume: (volume: number) => void;
  startMetronome: () => void;
  stopMetronome: () => void;
  toggleMetronome: () => void;
}

export const useMetronome = ({
  initialTempo = DEFAULT_TEMPO,
  initialBeatsPerMeasure = DEFAULT_BEATS_PER_MEASURE,
  initialTickSounds,
  initialVolume = 1,
}: UseMetronomeProps): MetronomeControls => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempoState] = useState<number>(initialTempo);
  const [beatsPerMeasure, setBeatsPerMeasureState] = useState<number>(
    initialBeatsPerMeasure
  );
  const [tickSounds, setTickSoundsState] =
    useState<string[]>(initialTickSounds);
  const [volume, setVolumeState] = useState<number>(initialVolume);
  const [currentBeat, setCurrentBeat] = useState<number>(FIRST_BEAT);

  const validateTempo = (value: number): number => {
    return Math.min(Math.max(value, MIN_TEMPO), MAX_TEMPO);
  };

  const validateBeatsPerMeasure = (value: number): number => {
    return Math.min(
      Math.max(value, MIN_BEATS_PER_MEASURE),
      MAX_BEATS_PER_MEASURE
    );
  };

  const validateVolume = (value: number): number => {
    return Math.min(Math.max(value, 0), 1);
  };

  const downbeatSound = useMemo(() => {
    if (!tickSounds?.[0]) return null;
    const audio = new Audio(tickSounds[0]);
    audio.volume = volume;
    return audio;
  }, [tickSounds, volume]);

  const upbeatSound = useMemo(() => {
    if (!tickSounds?.[1]) return null;
    const audio = new Audio(tickSounds[1]);
    audio.volume = volume;
    return audio;
  }, [tickSounds, volume]);

  const setTimeSignature = (newBeatsPerMeasure: number) => {
    if (!isNaN(newBeatsPerMeasure)) {
      setBeatsPerMeasureState(validateBeatsPerMeasure(newBeatsPerMeasure));
    } else {
      setBeatsPerMeasureState(DEFAULT_BEATS_PER_MEASURE);
    }
  };

  const setTempo = (newTempo: number) => {
    if (newTempo && !isNaN(newTempo)) {
      setTempoState(validateTempo(newTempo));
    } else {
      setTempoState(DEFAULT_TEMPO);
    }
  };

  const setTickSounds = (newSounds: string[]) => {
    if (newSounds.length === 2) {
      setTickSoundsState(newSounds);
    }
  };

  const setVolume = (newVolume: number) => {
    const validatedVolume = validateVolume(newVolume);
    setVolumeState(validatedVolume);
    if (downbeatSound) downbeatSound.volume = validatedVolume;
    if (upbeatSound) upbeatSound.volume = validatedVolume;
  };

  const resetAudio = useCallback(() => {
    if (downbeatSound) {
      downbeatSound.pause();
      downbeatSound.currentTime = START_TIME;
    }
    if (upbeatSound) {
      upbeatSound.pause();
      upbeatSound.currentTime = START_TIME;
    }
  }, [downbeatSound, upbeatSound]);

  const playBeat = useCallback(() => {
    resetAudio();
    setCurrentBeat((beat) => {
      if (beat === FIRST_BEAT) {
        if (downbeatSound) {
          downbeatSound.play().catch(console.error);
        }
      } else {
        if (upbeatSound) {
          upbeatSound.play().catch(console.error);
        }
      }
      return beat === beatsPerMeasure ? FIRST_BEAT : beat + 1;
    });
  }, [beatsPerMeasure, downbeatSound, upbeatSound, resetAudio]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && tickSounds.length === 2) {
      playBeat();
      interval = setInterval(playBeat, (60 / tempo) * 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, tempo, playBeat, tickSounds.length]);

  return {
    beatsPerMeasure,
    tempo,
    isPlaying,
    currentBeat,
    volume,
    setTimeSignature,
    setTempo,
    setTickSounds,
    setVolume,
    startMetronome: () => setIsPlaying(true),
    stopMetronome: () => setIsPlaying(false),
    toggleMetronome: () => setIsPlaying((prev) => !prev),
  };
};
