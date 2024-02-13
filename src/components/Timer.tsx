import { useEffect, useState, useRef } from "react";

export function Timer() {
  const [inputValue, setInputValue] = useState<number>(0);
  /*  当data直接有相关性的时候,只需一个useState*/
  const duration = inputValue / 10;
  const [time, resetTime] = useInterval(duration);

  function handleChangeDuration(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(Number(event.target.value));
  }

  function handleReset() {
    resetTime();
    setInputValue(0);
  }

  return (
    <div className="m-auto w-[25rem] p-5 bg-red-100  bg-white  md:bg-green-100 lg:bg-red-100">
      <div className="flex w-full m-auto">
        <p className="flex-aut m-auto">Elapsed Time:{time}s</p>
        <div className="flex-auto overflow-hidden border border-gray-500 w-1/2 h-6 rounded m-3 bg-red-100">
          <div
            className=" z-1 w-1/2 h-6  bg-blue-500 "
            style={{ width: `${calculatePercentage(time, duration)}` }}
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

function useInterval(duration: number) {
  const [time, setTimer] = useState(0);
  const idRef = useRef<number | undefined>();
  /* this is the way to use with different callback function, to fit different situation */

  //const callBackRef = useRef<() => void | undefined>();

  // function callback() {
  //   setTimer(time + 1);
  // }

  // useEffect(() => {
  //   callBackRef.current = callback;
  // });

  if (time >= duration && idRef.current) {
    console.log("cleared", idRef.current);
    clearInterval(idRef.current);
  }

  useEffect(() => {
    if (time < duration) {
      const intervalId = setInterval(() => {
        setTimer((t) => t + 1);
        // callBackRef.current?.();
      }, 1000);
      console.log("started", intervalId);
      idRef.current = intervalId;
      return () => {
        console.log("cleared", intervalId);
        clearInterval(intervalId);
      };
      /*   return 的function会在第二次运行的时候, 被运行.  setTimer((t) => t + 1);也是一样的情况. !!再看一次event loop  */
    }
  }, [duration]);

  return [
    time,
    () => {
      setTimer(0);
    },
  ] as const;
  /* 也可以type function的return */
}
