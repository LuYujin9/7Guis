import { useEffect, useState, useRef } from "react";
import "./index.css";

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [inputValue, setInputValue] = useState<number>(3);
  const [duration, setDuration] = useState<number>(3);

  useInterval(handleElapsedTime, elapsedTime, duration);

  function handleElapsedTime() {
    setElapsedTime((prevSeconds) => prevSeconds + 1); //callback function , 所以它是从内向外的运算,运算使用的是内部return的值,所以不会受state的初始值影响
  }

  function handleChangeDuration(event: React.ChangeEvent<HTMLInputElement>) {
    setDuration(Number(event.target.value) / 10);
    setInputValue(Number(event.target.value));
  }

  function handleReset() {
    setElapsedTime(0);
    setDuration(0);
  }

  return (
    <>
      <div className="container">
        <div className="elapsed-time-container">
          <p>Elapsed Time:{elapsedTime}s</p>
          <div className="time-container">
            <div
              className="time-bar"
              style={{ width: calculatePercentage(elapsedTime, duration) }}
            ></div>
          </div>
        </div>
        <p>{duration}s</p>
        <label htmlFor="">
          Duration:
          <input
            type="range"
            name="duration"
            className="range-input"
            min={0}
            max={600}
            value={inputValue}
            onChange={handleChangeDuration}
          />
        </label>
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
}

function calculatePercentage(Numerator: number, Denominator: number): string {
  if (Denominator !== 0) {
    return `${(Numerator / Denominator) * 100}%`;
  }
  return "0";
}

function useInterval(
  handleTime: () => void,
  elapsedTime: number,
  duration: number
) {
  const countRef = useRef<number>(0); //is 0 a good idee??? or undefined
  countRef.current = duration - elapsedTime;
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countRef.current <= 0) {
        clearInterval(intervalId);
        return;
      }
      handleTime();
      countRef.current = countRef.current - 1;
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
    //clean up function , clean the first interval. 为什么是一个箭头函数?
  }, [duration]);
}