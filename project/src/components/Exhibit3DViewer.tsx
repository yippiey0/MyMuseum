import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const Exhibit3DViewer: React.FC<{ url: string }> = ({ url }) => (
  <div style={{ width: "100%", height: 500 }}>
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Suspense fallback={null}>
        <Stage>
          <Model url={url} />
        </Stage>
      </Suspense>
      <OrbitControls enablePan={false} />
    </Canvas>
  </div>
);

export default Exhibit3DViewer;