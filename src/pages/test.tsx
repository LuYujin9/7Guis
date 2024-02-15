import { useState, useRef, useEffect } from "react";

export function Test() {
  const [count, setCount] = useState(0);
  const savedCallback = useRef<() => void | undefined>();

  //console.log(count, "updated with state");

  function callback() {
    setCount(count + 1);
    console.log(count);
    //因为callback在外面, 所以它运行环境里,state已经更新
  }

  useEffect(() => {
    savedCallback.current = callback;
    //每次调用的callbcak都带走已跟新的count的state
    //state更新的时候useEffect 跟着更新
    console.log(count, "updated with ref");
  });

  useEffect(() => {
    // function tick() {
    //   savedCallback.current?.();
    // }

    let id = setInterval(() => {
      savedCallback.current?.();
    }, 1000);
    //当它为一个函数时,每次调用的是在这个useEffect外的状态, 如果没有callback function, 就只会重复调用同一个函数.state不会更新
    return () => clearInterval(id);
  }, []);

  return <h1>{count}</h1>;
}
