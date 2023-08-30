import "./App.css";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Wireframe, View, Bvh } from "@react-three/drei";
import { CameraControls } from "@react-three/drei";
import { MathUtils } from "three";
import Navbar from "./components/Navbar";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Perf } from "r3f-perf";
// import

export default function App() {
  const views = useMemo(() => Array.from({ length: 5 }, React.createRef), []);
  //console.log(views);

  return (
    <>
      <div
        className="relative inset-0 grid h-full w-full items-center gap-4 p-4"
        style={{
          // position: "relative",
          // width: "100%",
          // height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          // gap: "1rem",
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        {views.map((view, i) => {
          return (
            <div
              key={i}
              ref={view}
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
              className={`] ring-2 ring-[#cdcdcd]`}
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
          {/* <Perf /> */}
        </Canvas>
        {/* <Cursor /> */}
      </div>
    </>
  );
}

const Views = ({ views }) => {
  const RandomIntBetween = (min, max) => {
    return Math.floor(min + (max - min) * Math.random());
  };

  const camRef = useRef();

  // () => colors[Math.floor(Math.random() * colors.length)], [];

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
          "#DDDDDD",
          "#DDDDDD",
          "#DDDDDD",
        ];
        const randomBackground = useMemo(
          () => colors[Math.floor(Math.random() * colors.length)],
          []
        );
        const randomColor = useMemo(
          () => colors[Math.floor(Math.random() * colors.length)],
          []
        );

        const colorPairs = [["#553319", "#9e929c"]];

        return (
          <View index={i + 1} key={i + 1} track={view}>
            <Bvh>
              <Suzanne
                randomBackground={randomBackground}
                randomColor={randomColor}
                strokeColor={colorPairs[0]}
              />
            </Bvh>
            <CameraControls
              ref={camRef}
              zoom={zoom}
              makeDefault
              position={[0, 0, 5]}
              fov={40}
            />
            <color attach="background" args={[colorPairs[0][1]]} />
          </View>
        );
      })}
    </>
  );
};

const Suzanne = ({ randomColor, randomBackground, strokeColor }) => {
  const group = useRef();
  const { nodes } = useGLTF("/Suz.glb");
  // const colors = ["#553319", "#9e929c", "#b0a29b", "#7a604e", "#5f402c"];

  // const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  // const randomColor2 = colors[Math.floor(Math.random() * colors.length)];

  const { controls } = useThree();

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

  useEffect(() => {
    if (controls) {
      const margin = 0;
      // const margin = -0.4;
      // controls.fitToBox(group.current, true, {
      //   paddingTop: margin,
      //   paddingLeft: margin,
      //   paddingBottom: margin,
      //   paddingRight: margin,
      // });
      // controls.rotateTo((Math.PI * Math.random()) / -40, Math.PI / 2.5, true);
    }
  }, []);

  return (
    <group ref={group}>
      <mesh geometry={nodes.Suzanne.geometry}>
        <Wireframe
          thickness={0.21}
          // fillMix={0}
          // fillOpacity={1}
          // fill={"#553319"}
          // fill={randomColor}
          stroke={"black"}
          // stroke={randomColor == "#DDDDDD" ? "#7a604e" : randomColor}
          // wireframe
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/Suz.glb");

const Cursor = () => {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: 1,
        transform: `scale(${1}) translateX(-50%) translateY(-50%)`,
      }}
      transition={{ duration: 0.15 }}
      // ref={scope}
      className="pointer-events-none absolute z-0 grid h-[50px] w-[50px] origin-[0px_0px] place-content-center rounded-full bg-gradient-to-br from-slate-200 from-40% to-indigo-400 text-2xl"
    >
      <FiArrowUpRight className="text-slate-950" />
    </motion.span>
  );
};

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
