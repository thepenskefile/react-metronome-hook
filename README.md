# react-metronome-hook
A react hook to keep in time

## Install
`
npm i react-metronome-hook
`

## Usage
```jsx
import { useMetronome } from 'react-metronome-hook';
import click1 from './click1.wav';
import click2 from './click2.wav';
import click3 from './click3.wav';
import click4 from './click4.wav';

function App() {

  const {
    startMetronome,
    isTicking,
    stopMetronome,
    bpm,
    setBpm,
    setBeatsPerMeasure,
    setSounds
  } = useMetronome(120, 4, [click1, click2]);
  
  return (
    <div>
      <button onClick={isTicking ? stopMetronome : startMetronome}>
        {isTicking ? "Stop" : "Start"}
      </button>
      <div>{bpm}</div>
      <input placeholder="Change BPM" onChange={e => setBpm(e.target.value)} />
      <input placeholder="Change beats per measure" onChange={e => setBeatsPerMeasure(e.target.value)} />
      <button onClick={() => setSounds([click3, click4])}>Change sounds</button>
    </div>
  );
  
}

```

### ```useMetronome(beatsPerMinute, beatsPerMeasure, [strongTick, weakTick])```
> returns an [object](#object)

#### beatsPerMinute
> ```int``` | default: ```60```

#### beatsPerMeasure
> ```int``` | default: ```4```

#### strongTick
> ```audio file```

#### weakTick
> ```audio file```

### ```object```

#### beatsPerMeasure
> ```int```

The beats per measure the metronome is ticking on

#### bpm
> ```int```

The beats per minute the metronome is ticking on

#### isTicking
> ```boolean```

Returns true if the metronome is currently ticking

#### setBeatsPerMeasure
> ```function```

Sets the beats per measure the metronome will tick on

#### setBpm
> ```function```

Sets the beats per minute the metronome will tick on

#### setSounds
> ```function```

Sets the sounds metronome will use for its ticks

#### startMetronome
> ```function```

Starts the metronome

#### stopMetronome
> ```function```

Stops the metronome
