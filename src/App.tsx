import { useState, useEffect, useRef } from "react";

export default function CountdownTimer() {
  const [inputMinutes, setInputMinutes] = useState<number>(0);
  const [inputSeconds, setInputSeconds] = useState<number>(30);

  const [initialTime, setInitialTime] = useState<number>((0 * 60 + 30) * 1000);
  const [timeLeft, setTimeLeft] = useState<number>((0 * 60 + 30) * 1000);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<string[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    handleStop();
    setTimeLeft(initialTime);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    setLaps((prev) => [...prev, formatTime(timeLeft)]);
  };

  const applyNewTime = () => {
    const totalMs = (inputMinutes * 60 + inputSeconds) * 1000;

    setInitialTime(totalMs);
    setTimeLeft(totalMs);
    setIsRunning(false);
    setLaps([]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Set Timer</h2>

      <input
        type="number"
        min="0"
        value={inputMinutes}
        onChange={(e) => setInputMinutes(Number(e.target.value))}
        style={{ width: 80, padding: 6, marginRight: 10 }}
      />
      Minutes

      <input
        type="number"
        min="0"
        max="59"
        value={inputSeconds}
        onChange={(e) => setInputSeconds(Number(e.target.value))}
        style={{ width: 80, padding: 6, marginLeft: 20, marginRight: 10 }}
      />
      Seconds

      <br />
      <button onClick={applyNewTime} style={{ marginTop: 10 }}>
        Apply
      </button>

      <h1 style={{ marginTop: 20 }}>{formatTime(timeLeft)}</h1>

      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleLap} disabled={!isRunning}>
        Lap
      </button>

      <h2>Laps</h2>
      <ul>
        {laps.map((lap, index) => (
          <li key={index}>
            Lap {index + 1}: {lap}
          </li>
        ))}
      </ul>
    </div>
  );
}
