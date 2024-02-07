import { useEffect, useState, useRef } from "react";
import "./index.css";

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(3);
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = duration - elapsedTime;
    const intervalId = setInterval(() => {
      handleElapsedTime(intervalId);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
    //clean up function , clean the first interval. 为什么是一个箭头函数?
  }, [duration]);

  function handleChangeDuration(event: React.ChangeEvent<HTMLInputElement>) {
    setDuration(Number(event.target.value));
  }

  function handleReset() {
    setElapsedTime(0);
    setDuration(0);
  }

  function handleElapsedTime(intervalId: number) {
    if (countRef.current <= 0) {
      clearInterval(intervalId);
      console.log("timer stopped", countRef.current);
      return;
    }
    setElapsedTime((prevSeconds) => prevSeconds + 1); //callback function , 所以它是从内向外的运算,运算使用的是内部return的值,所以不会受state的初始值影响
    console.log("timer works", countRef.current);
    countRef.current = countRef.current - 1;
  }

  return (
    <>
      <div className="container">
        <div className="elapsed-time-container">
          <p>Elapsed Time:</p>
          <div className="time-container">
            <div
              className="time-bar"
              style={{ width: calculatePercentage(elapsedTime, duration) }} // in this simple situation , is inline style OK?
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
            max={60}
            value={duration}
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
