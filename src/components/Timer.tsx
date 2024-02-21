import { useEffect, useState } from "react";

export function Timer() {
  const [inputValue, setInputValue] = useState<number>(0);
  const duration = inputValue / 10;
  const [elapsedTime, resetElapsedTime] = useInterval(duration);

  return (
    <div className="m-auto w-[25rem] p-5  bg-white  lg:bg-red-100">
      <div className="flex w-full m-auto">
        <p className="flex-aut m-auto">Elapsed Time:{elapsedTime}s</p>
        <div className="flex-auto overflow-hidden border border-gray-500 w-1/2 h-6 rounded m-3 bg-red-100">
          <div
            className=" z-1 w-1/2 h-6  bg-blue-500 "
            style={{ width: `${calculatePercentage(elapsedTime, duration)}` }}
          ></div>
        </div>
      </div>
      <p>{duration}s</p>
      <label>
        Duration:
        <input
          className="w-3/4 bg-red-100"
          type="range"
          name="duration"
          min={0}
          max={600}
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
        />
      </label>
      <button
        className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
        onClick={resetElapsedTime}
      >
        Reset
      </button>
    </div>
  );
}

function calculatePercentage(Numerator: number, Denominator: number): string {
  if (Denominator !== 0) {
    return `${(Numerator / Denominator) * 100}%`;
  }
  return "0";
}

function useInterval(duration: number) {
  const [elapsedTime, setElapsedTime] = useState(0);
  useEffect(() => {
    if (elapsedTime < duration) {
      const intervalId = setInterval(() => {
        setElapsedTime((t) => {
          const newTime = t + 1;
          if (newTime >= duration) {
            clearInterval(intervalId);
          }
          return newTime;
        });
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [duration, elapsedTime]);
  return [
    elapsedTime,
    () => {
      setElapsedTime(0);
    },
  ] as const;
}
