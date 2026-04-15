import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';

function Building({ position, color, height, scaleX, scaleZ }) {
  return (
    <Box args={[scaleX, height, scaleZ]} position={position} castShadow receiveShadow>
      <meshStandardMaterial 
        color={color} 
        roughness={0.6} 
        metalness={0.3} 
        emissive={color}
        emissiveIntensity={0.15}
      />
    </Box>
  );
}

export default function CityModel3D() {
  const cityRadius = 18;
  const gridSize = 1.6;

  // Procedurally generate a massive city block
  const buildings = useMemo(() => {
    const b = [];
    // Cyberpunk/Night city color palette
    const colors = ['#1e3a8a', '#0ea5e9', '#334155', '#475569', '#0d9488'];
    const alertColor = '#e11d48'; // Red for high pollution/traffic critical
    const warningColor = '#f59e0b'; // Amber for warnings

    for (let x = -cityRadius; x <= cityRadius; x += gridSize) {
      for (let z = -cityRadius; z <= cityRadius; z += gridSize) {
        
        // Randomly skip to create empty lots or parks
        if (Math.random() > 0.88) continue; 

        // Taller buildings naturally cluster in the center of the city
        const distFromCenter = Math.sqrt(x*x + z*z);
        const maxH = Math.max(1, 12 - (distFromCenter * 0.6));
        const h = (Math.random() * maxH) + 0.8;

        // Assign colors dynamically
        let c = colors[Math.floor(Math.random() * colors.length)];
        
        // Randomly simulate "anomalies" or alerts like traffic jams
        const isAnomaly = Math.random() < 0.04; 
        if (isAnomaly) {
            c = alertColor; // Critical
        } else if (Math.random() < 0.08) {
            c = warningColor; // Moderate issue
        }

        // Scale leaves room for grid lines (roads)
        const scaleX = gridSize * 0.65;
        const scaleZ = gridSize * 0.65;

        b.push({
          pos: [x, h / 2, z],
          color: c,
          h: h,
          scaleX,
          scaleZ,
          key: `${x}-${z}`
        });
      }
    }
    return b;
  }, []);

  return (
    <div className="w-full h-full bg-slate-950 cursor-move rounded-xl overflow-hidden">
      <Canvas shadows camera={{ position: [25, 20, 25], fov: 45 }}>
        
        {/* Beautiful dark fog fading into the distance */}
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 15, 60]} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[20, 40, 20]} 
          castShadow 
          intensity={1.2} 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0001}
        />
        <pointLight position={[-15, 10, -15]} color="#0ea5e9" intensity={1.5} distance={40} />
        <pointLight position={[15, 5, 15]} color="#14b8a6" intensity={1} distance={30} />
        
        {/* Ground representation */}
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0,0,0]}>
          <meshStandardMaterial color="#0f172a" roughness={1} metalness={0} />
        </Plane>

        {/* Glowing road network grid */}
        <gridHelper args={[100, 60, '#334155', '#1e293b']} position={[0, 0.01, 0]} />

        {/* Render generated buildings */}
        {buildings.map((b) => (
           <Building 
             key={b.key} 
             position={b.pos} 
             color={b.color} 
             height={b.h} 
             scaleX={b.scaleX} 
             scaleZ={b.scaleZ} 
           />
        ))}

        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under the map
          minDistance={5}
          maxDistance={50}
          autoRotate={true} // Add slow dramatic rotation
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
