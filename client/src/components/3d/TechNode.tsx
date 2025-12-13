import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface TechNodeProps {
  position: [number, number, number];
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools';
  proficiency: number; // 0-100
}

const categoryColors = {
  frontend: '#3b82f6',
  backend: '#10b981',
  database: '#f59e0b',
  devops: '#ef4444',
  tools: '#8b5cf6',
};

export function TechNode({ position, name, category, proficiency }: TechNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.005;
      
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.15;
      
      // Scale on hover
      const targetScale = hovered ? 1.3 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const size = 0.2 + (proficiency / 100) * 0.3; // Size based on proficiency

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={categoryColors[category]}
          emissive={categoryColors[category]}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </Sphere>
      
      {hovered && (
        <>
          <Text
            position={[0, size + 0.3, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
          <Text
            position={[0, size + 0.5, 0]}
            fontSize={0.1}
            color={categoryColors[category]}
            anchorX="center"
            anchorY="middle"
          >
            {proficiency}% proficiency
          </Text>
        </>
      )}
    </group>
  );
}

