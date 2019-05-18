import { useEffect, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';

const FIRST_BEAT = 1;
const DEFAULT_BPM = 60;
const DEFAULT_BEATS_PER_MEASURE = 4;
const START_TIME = 0;

export const useMetronome = (
  initialBpm = DEFAULT_BPM,
  initialBeatsPerMeasure = DEFAULT_BEATS_PER_MEASURE,
  initialTickSounds
) => {
  const [isTicking, setIsTicking] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(initialBeatsPerMeasure);
  const [sounds, setSounds] = useState(initialTickSounds);

  const strongTick = useMemo(() => sounds && sounds[0] && new Audio(sounds[0]), [sounds]);
  const weakTick = useMemo(() => sounds && sounds[1] && new Audio(sounds[1]), [sounds]);

  const handleChangeBeatsPerMeasure = debounce(newBeatsPerMeasure => {
    if (newBeatsPerMeasure && !isNaN(newBeatsPerMeasure)) {
      setBeatsPerMeasure(parseInt(newBeatsPerMeasure, 10));
    } else {
      setBeatsPerMeasure(4);
    }
  }, 500);

  const handleChangeBpm = debounce(newBpm => {
    if (newBpm && !isNaN(newBpm)) {
      setBpm(parseInt(newBpm, 10));
    } else {
      setBpm(60);
    }
  }, 500);

  const handleChangeSounds = newSounds => {
    if (newSounds.length === 2) {
      setSounds(newSounds);
    }
  };

  useEffect(() => {
    let interval;
    let beat = FIRST_BEAT;

    const resetSounds = () => {
      strongTick.pause();
      strongTick.currentTime = START_TIME;
      weakTick.pause();
      weakTick.currentTime = START_TIME;
    };

    const tick = () => {
      resetSounds();
      if (beat === FIRST_BEAT) {
        strongTick.play();
      } else {
        weakTick.play();
      }
      if (beat === beatsPerMeasure) {
        beat = FIRST_BEAT;
      } else {
        beat++;
      }
    };

    if (isTicking && sounds.length === 2) {
      tick();
      interval = setInterval(tick, (60 / bpm) * 1000);
    }

    return () => clearInterval(interval);
  }, [isTicking, bpm, beatsPerMeasure, sounds]);

  return {
    beatsPerMeasure,
    bpm,
    isTicking,
    setBeatsPerMeasure: handleChangeBeatsPerMeasure,
    setBpm: handleChangeBpm,
    setSounds: handleChangeSounds,
    startMetronome: () => setIsTicking(true),
    stopMetronome: () => setIsTicking(false)
  };
};
