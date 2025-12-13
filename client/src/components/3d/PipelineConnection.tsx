import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PipelineConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
}

export function PipelineConnection({ start, end, active }: PipelineConnectionProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame((state) => {
    if (materialRef.current && active) {
      // Pulsing effect for active connections
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.7;
      materialRef.current.opacity = pulse;
    }
  });

  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry)}>
      <lineBasicMaterial
        ref={materialRef}
        attach="material"
        color={active ? '#3b82f6' : '#4b5563'}
        linewidth={2}
        transparent
        opacity={active ? 0.8 : 0.3}
      />
    </primitive>
  );
}

