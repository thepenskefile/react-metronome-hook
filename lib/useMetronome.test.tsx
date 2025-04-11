import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useMetronome } from "./main";

describe("useMetronome", () => {
  const mockSounds: [string, string] = [
    "/mock-downbeat.mp3",
    "/mock-upbeat.mp3",
  ];

  beforeEach(() => {
    // Mock Audio constructor
    global.Audio = vi.fn().mockImplementation(() => ({
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      currentTime: 0,
      volume: 1,
    }));
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.tempo).toBe(60);
    expect(result.current.beatsPerMeasure).toBe(4);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentBeat).toBe(1);
    expect(result.current.volume).toBe(1);
  });

  it("should initialize with custom values", () => {
    const { result } = renderHook(() =>
      useMetronome({
        initialTempo: 120,
        initialBeatsPerMeasure: 3,
        initialTickSounds: mockSounds,
        initialVolume: 0.5,
      })
    );

    expect(result.current.tempo).toBe(120);
    expect(result.current.beatsPerMeasure).toBe(3);
    expect(result.current.volume).toBe(0.5);
  });

  it("should start and stop the metronome", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.startMetronome();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.stopMetronome();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it("should toggle the metronome", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.toggleMetronome();
    });

    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggleMetronome();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it("should update tempo", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.tempo).toBe(60);

    act(() => {
      result.current.setTempo(120);
    });

    expect(result.current.tempo).toBe(120);
  });

  it("should update time signature", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.beatsPerMeasure).toBe(4);

    act(() => {
      result.current.setTimeSignature(3);
    });

    expect(result.current.beatsPerMeasure).toBe(3);
  });

  it("should update volume", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.volume).toBe(1);

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
  });

  it("should validate tempo within range", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.tempo).toBe(60);

    act(() => {
      result.current.setTempo(10); // Below minimum
    });

    expect(result.current.tempo).toBe(20); // Should be clamped to minimum

    act(() => {
      result.current.setTempo(400); // Above maximum
    });

    expect(result.current.tempo).toBe(300); // Should be clamped to maximum
  });

  it("should validate beats per measure within range", () => {
    const { result } = renderHook(() =>
      useMetronome({ initialTickSounds: mockSounds })
    );

    expect(result.current.beatsPerMeasure).toBe(4);

    act(() => {
      result.current.setTimeSignature(0); // Below minimum
    });

    expect(result.current.beatsPerMeasure).toBe(1); // Should be clamped to minimum

    act(() => {
      result.current.setTimeSignature(20); // Above maximum
    });

    expect(result.current.beatsPerMeasure).toBe(16); // Should be clamped to maximum
  });
});
