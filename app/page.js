"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const ModelViewer = dynamic(() => import("./components/modelview"), {
  ssr: false,
});

export default function Home() {
  const [startAnimation, setStartAnimation] = useState(false);
  function triggerAnimate() {
    setStartAnimation(!startAnimation);
  }
  return (
    <div>
      <div className="h-[100px] flex justify-between max-w-6xl items-center mx-auto">
        <h1>3D Model Viewer</h1>
        <button
          type="button"
          onClick={() => triggerAnimate()}
          className="p-3 bg-blue-500 rounded-2xl hover:bg-blue-800"
        >
          {startAnimation ? (
            <span>Stop Animation</span>
          ) : (
            <span>Start Animation</span>
          )}
        </button>
      </div>
      <ModelViewer
        ctrlAnimation={startAnimation}
        modelUrl="/SimLab_2024-05-24-19-28-37.glb"
      />
    </div>
  );
}
