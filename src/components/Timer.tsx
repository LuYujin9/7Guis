import { useEffect, useState, useRef } from "react";

export function Timer() {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [inputValue, setInputValue] = useState<number>(3);
  const [duration, setDuration] = useState<number>(3);

  useInterval(duration);

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
    <div className="m-auto w-[25rem] p-5 bg-red-100  bg-white  md:bg-green-100 lg:bg-red-100">
      <div className="flex w-full m-auto">
        <p className="flex-aut m-auto">Elapsed Time:{elapsedTime}s</p>
        <div className="flex-auto overflow-hidden border border-gray-500 w-1/2 h-6 rounded m-3 bg-red-100">
          <div
            className=" z-1 w-1/2 h-6  bg-blue-500 "
            style={{ width: `${calculatePercentage(elapsedTime, duration)}` }}
            //className=" w-1/2 h-6 rounded bg-green-100"
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
          onChange={handleChangeDuration}
        />
      </label>
      <button
        className="flex-auto m-2 w-20 bg-blue-300 hover:bg-emphasis text-gray-700 hover:text-white font-bold"
        onClick={handleReset}
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

function useInterval(
  //handleTime: () => void,
  duration: number
) {
  const [timer, setTimer] = useState(0);
  const countRef = useRef<number>(0); //is 0 a good idee??? or undefined
  countRef.current = duration - timer;
  useEffect(() => {
    performance.mark("timer interval");
    const intervalId = setInterval(() => {
      if (countRef.current <= 0) {
        const end = performance.measure("timer interval");
        console.log(end);
        clearInterval(intervalId);
        return;
      }
      setTimer((i) => i + 1);
      countRef.current = countRef.current - 1;
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
    //clean up function , clean the first interval. 为什么是一个箭头函数?
  }, [duration]);
  return timer;
}
