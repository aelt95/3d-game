import { Physics } from "@react-three/rapier";
import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import Player from "./Player.jsx";
import useGame from "./stores/useGame.jsx";

export default function Experience() {
  const blocksCounts = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);

  return (
    <>
      <color args={["#241a1a"]} attach="background" />
      <Lights />
      <Physics>
        <Level count={blocksCounts} seed={blockSeed} />
        <Player />
      </Physics>
    </>
  );
}
