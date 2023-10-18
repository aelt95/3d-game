import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import useGame from "./stores/useGame";

const Player = () => {
  const rigidRef = useRef();
  const { rapier, world } = useRapier();

  const [suscribeKeys, getKeys] = useKeyboardControls();

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3());
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  /* useGame hook */
  const { blocksCount } = useGame();
  const startGame = useGame((state) => state.start);
  const endGame = useGame((state) => state.end);
  const restartGame = useGame((state) => state.restart);

  /* Mechanic logic */
  const ballJump = () => {
    const origin = rigidRef.current.translation();
    origin.y -= 0.31;

    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.toi < 0.1) {
      rigidRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  const resetBall = () => {
    rigidRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    rigidRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    rigidRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    useGame.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "ready") resetBall();
      }
    );

    const unsuscribeJump = suscribeKeys(
      (state) => state.jump,
      (jump) => {
        if (jump) {
          ballJump();
        }
      }
    );

    const unsubscribeKey = suscribeKeys(() => {
      startGame();
    });

    //Fixing double jumps after reload
    return () => {
      unsuscribeJump();
      unsubscribeKey();
    };
  }, []);

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    rigidRef.current.applyImpulse(impulse);
    rigidRef.current.applyTorqueImpulse(torque);

    /* Camera Animation */
    const bodyPosition = rigidRef.current.translation();

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 3.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 10 * delta);
    smoothedCameraTarget.lerp(cameraPosition, 10 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    /* Ending game */

    if (bodyPosition.z < -blocksCount * 4 - 2) endGame();
    if (bodyPosition.y < -2) restartGame();
  });

  return (
    <RigidBody
      ref={rigidRef}
      colliders="ball"
      restitution={0.2}
      friction={1}
      canSleep={false}
      linearDamping={0.5}
      angularDamping={0.5}
      position-y={1}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color={"mediumpurple"} />
      </mesh>
    </RigidBody>
  );
};

export default Player;
