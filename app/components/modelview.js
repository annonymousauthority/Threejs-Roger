"use client";
import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function Model({ url, targetPosition }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      // Move towards the target position
      ref.current.position.lerp(new THREE.Vector3(...targetPosition), 0.02);
    }
  });

  return <primitive object={scene} ref={ref} />;
}

const AutoRotatingOrbitControls = ({ rotationAngles }) => {
  const ref = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (ref.current) {
      ref.current.update();
    }
  });

  useEffect(() => {
    if (rotationAngles) {
      const { theta, phi } = rotationAngles;
      const radius = 10; // Distance from the target
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0); // Assuming the target is at the origin
    }
  }, [rotationAngles, camera]);
  return <OrbitControls ref={ref} enableZoom={true} autoRotate={false} />;
};


const ModelViewer = ({ modelUrl, ctrlAnimation }) => {
  const [targetPosition, setTargetPosition] = useState([8, -3, 0]);
  const [rotationAngles, setRotationAngles] = useState(null);

  const handleClick = (event) => {
    const { clientX, clientY } = event;
    // Calculate normalized device coordinates (NDC) for the mouse click
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;

    const theta = x * Math.PI; // Horizontal angle
    const phi = (y + 1) * (Math.PI / 2); // Vertical angle

    setRotationAngles({ theta, phi });

    // Update target position based on NDC
    setTargetPosition((prevPosition) => [
      prevPosition[0],
      y * 5,
      prevPosition[2],
    ]); // Adjust the factor for movement scaling
  };
  useEffect(() => {
    // window.addEventListener("click", handleClick);
    // return () => {
    //   window.removeEventListener("click", handleClick);
    // };
  }, []);

  useEffect(() => {
    if (ctrlAnimation) {
      const interval = setInterval(() => {
        setTargetPosition((prevPosition) => [
          prevPosition[0],
          prevPosition[1],
          prevPosition[2] + 1,
        ]);
      }, 200); // Adjust the interval time as needed

      return () => clearInterval(interval); // Clean up on unmount
    } else {
      setTargetPosition([8, -3, 0]);
    }
  }, [ctrlAnimation]);

  return (
    <Canvas
      style={{ width: "100vw", height: "100vh", backgroundColor: "#dbdad7" }}
    >
      <ambientLight />
      <directionalLight position={(5, -10, 7.5)} intensity={1.5} />
      <pointLight position={[40, -25, -100]} />
      <Model url={modelUrl} targetPosition={targetPosition} />
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer;
