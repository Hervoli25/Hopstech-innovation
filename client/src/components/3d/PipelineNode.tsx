import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface PipelineNodeProps {
  position: [number, number, number];
  label: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  onClick?: () => void;
}

const statusColors = {
  pending: '#6b7280',
  running: '#3b82f6',
  success: '#10b981',
  failed: '#ef4444',
};

export function PipelineNode({ position, label, status, onClick }: PipelineNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Rotate when running
      if (status === 'running') {
        meshRef.current.rotation.y += 0.01;
      }
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 1, 0.3]}
        radius={0.1}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={statusColors[status]}
          emissive={statusColors[status]}
          emissiveIntensity={status === 'running' ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>
      
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.3}
      >
        {label}
      </Text>
      
      {/* Status indicator */}
      {status === 'running' && (
        <mesh position={[0.8, 0.5, 0.2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  );
}

