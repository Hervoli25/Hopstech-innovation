import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { PipelineNode } from './PipelineNode';
import { PipelineConnection } from './PipelineConnection';

interface PipelineStage {
  id: string;
  label: string;
  position: [number, number, number];
  status: 'pending' | 'running' | 'success' | 'failed';
}

const initialStages: PipelineStage[] = [
  { id: 'code', label: 'Code Commit', position: [-4, 0, 0], status: 'success' },
  { id: 'build', label: 'Build', position: [-2, 1, 0], status: 'success' },
  { id: 'test', label: 'Test', position: [0, 0, 0], status: 'running' },
  { id: 'security', label: 'Security Scan', position: [0, -1.5, 0], status: 'pending' },
  { id: 'deploy-staging', label: 'Deploy Staging', position: [2, 1, 0], status: 'pending' },
  { id: 'integration', label: 'Integration Tests', position: [2, -1, 0], status: 'pending' },
  { id: 'deploy-prod', label: 'Deploy Production', position: [4, 0, 0], status: 'pending' },
];

const connections = [
  { from: 'code', to: 'build' },
  { from: 'build', to: 'test' },
  { from: 'test', to: 'security' },
  { from: 'test', to: 'deploy-staging' },
  { from: 'security', to: 'integration' },
  { from: 'deploy-staging', to: 'deploy-prod' },
  { from: 'integration', to: 'deploy-prod' },
];

export function DevOpsPipelineScene() {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [currentStageIndex, setCurrentStageIndex] = useState(2);

  // Simulate pipeline progression
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev >= stages.length - 1) return 0;
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [stages.length]);

  useEffect(() => {
    setStages((prevStages) =>
      prevStages.map((stage, index) => {
        if (index < currentStageIndex) {
          return { ...stage, status: 'success' };
        } else if (index === currentStageIndex) {
          return { ...stage, status: 'running' };
        } else {
          return { ...stage, status: 'pending' };
        }
      })
    );
  }, [currentStageIndex]);

  const getStagePosition = (id: string): [number, number, number] => {
    const stage = stages.find((s) => s.id === id);
    return stage ? stage.position : [0, 0, 0];
  };

  const isConnectionActive = (from: string, to: string): boolean => {
    const fromStage = stages.find((s) => s.id === from);
    const toStage = stages.find((s) => s.id === to);
    return fromStage?.status === 'success' || toStage?.status === 'running' || toStage?.status === 'success';
  };

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      
      <Environment preset="city" />
      
      {/* Render connections first (behind nodes) */}
      {connections.map((conn, index) => (
        <PipelineConnection
          key={index}
          start={getStagePosition(conn.from)}
          end={getStagePosition(conn.to)}
          active={isConnectionActive(conn.from, conn.to)}
        />
      ))}
      
      {/* Render nodes */}
      {stages.map((stage) => (
        <PipelineNode
          key={stage.id}
          position={stage.position}
          label={stage.label}
          status={stage.status}
          onClick={() => console.log(`Clicked: ${stage.label}`)}
        />
      ))}
    </Canvas>
  );
}

