# React Metronome Hook

A custom React hook for creating a metronome with configurable tempo, time signature, and sound effects.

## Features

- Configurable tempo (BPM)
- Customizable time signature
- Support for different sound effects for downbeat and upbeat
- Volume control
- Play/pause functionality
- Current beat tracking

## Installation

```bash
npm install react-metronome-hook
# or
yarn add react-metronome-hook
```

## Usage

```tsx
import { useMetronome } from "react-metronome-hook";

function MetronomeComponent() {
  const {
    tempo,
    isPlaying,
    currentBeat,
    beatsPerMeasure,
    setTempo,
    setTimeSignature,
    startMetronome,
    stopMetronome,
    toggleMetronome,
  } = useMetronome({
    initialTempo: 120,
    initialBeatsPerMeasure: 4,
    initialTickSounds: ["/path/to/downbeat.mp3", "/path/to/upbeat.mp3"],
    initialVolume: 0.8,
  });

  return (
    <div>
      <div>Current Beat: {currentBeat}</div>
      <div>Tempo: {tempo} BPM</div>
      <div>Time Signature: {beatsPerMeasure}/4</div>
      <button onClick={toggleMetronome}>{isPlaying ? "Stop" : "Start"}</button>
    </div>
  );
}
```

## API

### `useMetronome` Hook

#### Props

```typescript
interface UseMetronomeProps {
  initialTempo?: number; // Default: 60
  initialBeatsPerMeasure?: number; // Default: 4
  initialTickSounds: [string, string]; // [downbeatSound, upbeatSound]
  initialVolume?: number; // Default: 1
}
```

#### Return Value

```typescript
interface MetronomeControls {
  tempo: number;
  isPlaying: boolean;
  currentBeat: number;
  beatsPerMeasure: number;
  volume: number;
  setTempo: (value: number) => void;
  setTimeSignature: (value: number) => void;
  setTickSounds: (sounds: [string, string]) => void;
  setVolume: (volume: number) => void;
  startMetronome: () => void;
  stopMetronome: () => void;
  toggleMetronome: () => void;
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT
