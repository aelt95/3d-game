import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { addEffect } from "@react-three/fiber";
import useGame from "./stores/useGame";

const Interface = () => {
  const timeRef = useRef();
  const { forward } = useKeyboardControls((state) => state);
  const { backward } = useKeyboardControls((state) => state);
  const { leftward } = useKeyboardControls((state) => state);
  const { rightward } = useKeyboardControls((state) => state);
  const { jump } = useKeyboardControls((state) => state);

  const { restart, phase } = useGame();

  useEffect(() => {
    const unsuscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      }
      if (state.phase === "ended")
        elapsedTime = state.endTime - state.startTime;

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);
      if (timeRef.current) timeRef.current.textContent = elapsedTime;
    });
    return () => {
      unsuscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      <div className="time" ref={timeRef}>
        0.00
      </div>
      {phase === "ended" ? (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      ) : (
        ""
      )}

      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
