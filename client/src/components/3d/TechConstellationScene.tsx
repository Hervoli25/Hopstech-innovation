import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { TechNode } from './TechNode';
import * as THREE from 'three';

interface Tech {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  proficiency: number;
  position: [number, number, number];
}

const technologies: Tech[] = [
  // Frontend
  { name: 'React', category: 'frontend', proficiency: 95, position: [-2, 2, 0] },
  { name: 'TypeScript', category: 'frontend', proficiency: 90, position: [-1, 2.5, -1] },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 85, position: [-3, 1.5, 1] },
  { name: 'Next.js', category: 'frontend', proficiency: 80, position: [-1.5, 3, 0.5] },
  
  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 95, position: [2, 2, 0] },
  { name: 'Express', category: 'backend', proficiency: 90, position: [1, 2.5, -1] },
  { name: 'tRPC', category: 'backend', proficiency: 85, position: [3, 1.5, 1] },
  { name: 'Python', category: 'backend', proficiency: 75, position: [1.5, 3, 0.5] },
  
  // Database
  { name: 'PostgreSQL', category: 'database', proficiency: 90, position: [0, -2, 0] },
  { name: 'Redis', category: 'database', proficiency: 80, position: [-1, -2.5, -1] },
  { name: 'MongoDB', category: 'database', proficiency: 75, position: [1, -2.5, 1] },
  
  // DevOps
  { name: 'Docker', category: 'devops', proficiency: 90, position: [-2, -1, -2] },
  { name: 'Kubernetes', category: 'devops', proficiency: 75, position: [-3, -0.5, -1.5] },
  { name: 'GitHub Actions', category: 'devops', proficiency: 85, position: [-1.5, -1.5, -2.5] },
  { name: 'AWS', category: 'devops', proficiency: 70, position: [-2.5, 0, -2] },
  
  // Tools
  { name: 'Git', category: 'tools', proficiency: 95, position: [2, -1, -2] },
  { name: 'VS Code', category: 'tools', proficiency: 90, position: [3, -0.5, -1.5] },
  { name: 'Vite', category: 'tools', proficiency: 85, position: [1.5, -1.5, -2.5] },
];

function TechConnections() {
  const connections = [
    // Frontend to Backend
    [[-2, 2, 0], [2, 2, 0]],
    [[-1, 2.5, -1], [1, 2.5, -1]],
    
    // Backend to Database
    [[2, 2, 0], [0, -2, 0]],
    [[1, 2.5, -1], [-1, -2.5, -1]],
    
    // Frontend to Database
    [[-2, 2, 0], [0, -2, 0]],
  ];

  return (
    <>
      {connections.map((conn, index) => {
        const points = [
          new THREE.Vector3(...(conn[0] as [number, number, number])),
          new THREE.Vector3(...(conn[1] as [number, number, number])),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive key={index} object={new THREE.Line(geometry)}>
            <lineBasicMaterial attach="material" color="#4b5563" transparent opacity={0.2} />
          </primitive>
        );
      })}
    </>
  );
}

export function TechConstellationScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.3}
      />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <TechConnections />
      
      {technologies.map((tech, index) => (
        <TechNode
          key={index}
          position={tech.position}
          name={tech.name}
          category={tech.category}
          proficiency={tech.proficiency}
        />
      ))}
    </Canvas>
  );
}

