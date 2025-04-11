import { useEffect, useState, useMemo, useCallback } from "react";

const FIRST_BEAT = 1;
const DEFAULT_TEMPO = 60;
const DEFAULT_BEATS_PER_MEASURE = 4;
const START_TIME = 0;
const MIN_TEMPO = 20;
const MAX_TEMPO = 300;
const MIN_BEATS_PER_MEASURE = 1;
const MAX_BEATS_PER_MEASURE = 16;

/**
 * Props for configuring the metronome hook
 */
export interface UseMetronomeProps {
  /** Initial tempo in beats per minute (BPM). Defaults to 60. */
  initialTempo?: number;
  /** Initial number of beats per measure. Defaults to 4. */
  initialBeatsPerMeasure?: number;
  /** Array of two sound file paths: [downbeat, upbeat]. Required. */
  initialTickSounds: [string, string];
  /** Initial volume level (0 to 1). Defaults to 1. */
  initialVolume?: number;
}

/**
 * Controls and state provided by the metronome hook
 */
export interface MetronomeControls {
  /** Current number of beats per measure */
  beatsPerMeasure: number;
  /** Current tempo in beats per minute (BPM) */
  tempo: number;
  /** Whether the metronome is currently playing */
  isPlaying: boolean;
  /** Current beat number in the measure (1-based) */
  currentBeat: number;
  /** Current volume level (0 to 1) */
  volume: number;
  /** Set the number of beats per measure (1-16) */
  setTimeSignature: (value: number) => void;
  /** Set the tempo in beats per minute (20-300) */
  setTempo: (value: number) => void;
  /** Set the sound files for downbeat and upbeat */
  setTickSounds: (sounds: string[]) => void;
  /** Set the volume level (0 to 1) */
  setVolume: (volume: number) => void;
  /** Start the metronome */
  startMetronome: () => void;
  /** Stop the metronome */
  stopMetronome: () => void;
  /** Toggle the metronome on/off */
  toggleMetronome: () => void;
}

/**
 * A React hook that provides metronome functionality
 * @param props - Configuration options for the metronome
 * @returns Metronome controls and state
 * @example
 * ```tsx
 * const { isPlaying, tempo, startMetronome, stopMetronome } = useMetronome({
 *   initialTempo: 120,
 *   initialBeatsPerMeasure: 4,
 *   initialTickSounds: ['/tick.mp3', '/tock.mp3'],
 *   initialVolume: 0.5
 * });
 * ```
 */
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

  /**
   * Validates and clamps tempo value within allowed range
   * @param value - Tempo value to validate
   * @returns Clamped tempo value between MIN_TEMPO and MAX_TEMPO
   */
  const validateTempo = (value: number): number => {
    return Math.min(Math.max(value, MIN_TEMPO), MAX_TEMPO);
  };

  /**
   * Validates and clamps beats per measure value within allowed range
   * @param value - Beats per measure value to validate
   * @returns Clamped value between MIN_BEATS_PER_MEASURE and MAX_BEATS_PER_MEASURE
   */
  const validateBeatsPerMeasure = (value: number): number => {
    return Math.min(
      Math.max(value, MIN_BEATS_PER_MEASURE),
      MAX_BEATS_PER_MEASURE
    );
  };

  /**
   * Validates and clamps volume value within allowed range
   * @param value - Volume value to validate
   * @returns Clamped volume value between 0 and 1
   */
  const validateVolume = (value: number): number => {
    return Math.min(Math.max(value, 0), 1);
  };

  /**
   * Creates and memoizes the downbeat sound
   */
  const downbeatSound = useMemo(() => {
    if (!tickSounds?.[0]) return null;
    const audio = new Audio(tickSounds[0]);
    audio.volume = volume;
    return audio;
  }, [tickSounds, volume]);

  /**
   * Creates and memoizes the upbeat sound
   */
  const upbeatSound = useMemo(() => {
    if (!tickSounds?.[1]) return null;
    const audio = new Audio(tickSounds[1]);
    audio.volume = volume;
    return audio;
  }, [tickSounds, volume]);

  /**
   * Sets the number of beats per measure, with validation
   * @param newBeatsPerMeasure - New number of beats per measure
   */
  const setTimeSignature = (newBeatsPerMeasure: number) => {
    if (!isNaN(newBeatsPerMeasure)) {
      const newValue = validateBeatsPerMeasure(newBeatsPerMeasure);
      setBeatsPerMeasureState(newValue);
      // Reset current beat to first beat when time signature changes
      setCurrentBeat(FIRST_BEAT);
    } else {
      setBeatsPerMeasureState(DEFAULT_BEATS_PER_MEASURE);
      setCurrentBeat(FIRST_BEAT);
    }
  };

  /**
   * Sets the tempo, with validation
   * @param newTempo - New tempo value in BPM
   */
  const setTempo = (newTempo: number) => {
    if (newTempo && !isNaN(newTempo)) {
      setTempoState(validateTempo(newTempo));
    } else {
      setTempoState(DEFAULT_TEMPO);
    }
  };

  /**
   * Sets the tick sounds for downbeat and upbeat
   * @param newSounds - Array of two sound file paths
   */
  const setTickSounds = (newSounds: string[]) => {
    if (newSounds.length === 2) {
      setTickSoundsState(newSounds);
    }
  };

  /**
   * Sets the volume level, with validation
   * @param newVolume - New volume level (0 to 1)
   */
  const setVolume = (newVolume: number) => {
    const validatedVolume = validateVolume(newVolume);
    setVolumeState(validatedVolume);
    if (downbeatSound) downbeatSound.volume = validatedVolume;
    if (upbeatSound) upbeatSound.volume = validatedVolume;
  };

  /**
   * Resets the audio elements to their initial state
   */
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

  /**
   * Plays the appropriate beat sound and updates the current beat
   */
  const playBeat = useCallback(() => {
    resetAudio();
    setCurrentBeat((beat) => {
      const nextBeat = beat + 1;
      // Play the appropriate sound
      if (nextBeat > beatsPerMeasure) {
        if (downbeatSound) {
          downbeatSound.play().catch(console.error);
        }
        return FIRST_BEAT;
      } else if (nextBeat === FIRST_BEAT) {
        if (downbeatSound) {
          downbeatSound.play().catch(console.error);
        }
      } else {
        if (upbeatSound) {
          upbeatSound.play().catch(console.error);
        }
      }
      return nextBeat;
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
