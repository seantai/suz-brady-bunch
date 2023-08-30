import "./App.css";
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Wireframe,
  View,
  PerspectiveCamera,
  OrbitControls,
  Bvh,
} from "@react-three/drei";
// import { CameraControls } from "@react-three/drei";
import { MathUtils } from "three";

export default function App() {
  const views = useMemo(() => Array.from({ length: 30 }, React.createRef), []);
  //console.log(views);

  return (
    <div
      className="inset-0"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {views.map((view, i) => {
        return (
          <div
            key={i}
            ref={view}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            className={`ring-2 ring-[#cdcdcd]`}
          />
        );
      })}
      <Canvas
        camera={{ position: [0, 0, 2] }}
        eventSource={document.getElementById("root")}
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Views views={views} />
      </Canvas>
    </div>
  );
}

const Views = ({ views }) => {
  const RandomIntBetween = (min, max) => {
    return Math.floor(min + (max - min) * Math.random());
  };

  return (
    <>
      {views.map((view, i) => {
        const zoom = RandomIntBetween(1.5, 4);

        const colors = [
          "#553319",
          "#9e929c",
          "#b0a29b",
          "#7a604e",
          "#5f402c",
          "##DDDDDD",
          "##DDDDDD",
          "##DDDDDD",
          "##DDDDDD",
          "##DDDDDD",
        ];
        const bgColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <View index={i + 1} key={i + 1} track={view}>
            <Bvh>
              <Suzanne />
            </Bvh>
            <PerspectiveCamera zoom={zoom} makeDefault position={[0, 0, 5]} />
            <OrbitControls makeDefault />
            <color attach="background" args={[bgColor]} />
          </View>
        );
      })}
    </>
  );
};

const Suzanne = () => {
  const group = useRef();
  const { nodes } = useGLTF("/Suz.glb");
  const colors = ["#553319", "#9e929c", "#b0a29b", "#7a604e", "#5f402c"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  useFrame(({ pointer }) => {
    if (group.current) {
      group.current.rotation.y = MathUtils.lerp(
        group.current.rotation.y,
        -MathUtils.clamp(-pointer.x, -0.75, 0.75),
        0.1
      );
      group.current.rotation.x = MathUtils.lerp(
        group.current.rotation.x,
        MathUtils.clamp(-pointer.y, -0.35, 0.25),
        0.1
      );
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={nodes.Suzanne.geometry}>
        <Wireframe
          thickness={0.21}
          fillMix={1}
          fillOpacity={1}
          // fill={"#553319"}
          fill={randomColor}
          stroke={"#fff"}
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/Suz.glb");

// const Scene = () => {
//   const camRef = useRef();
//   return (
//     <>
//       <FooShader />
//       <ambientLight />
//       <CameraControls ref={camRef} makeDefault />
//     </>
//   );
// };

// const Box = () => {
//   const ref = useRef();
//   useFrame((_, delta) => {
//     if (ref.current) {
//       ref.current.rotation.y += 0.2 * delta;
//     }
//   });
//   return (
//     <mesh
//       ref={ref}
//       rotation={[
//         Math.random() * 2 * Math.PI,
//         Math.random() * 2 * Math.PI,
//         Math.random() * 2 * Math.PI,
//       ]}
//     >
//       <boxGeometry />
//       <meshNormalMaterial />
//     </mesh>
//   );
// };
