'use client';

import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MarkerType,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

interface DependencyGraphProps {
  steps: any[];
  dependencies: any[];
  onNodeClick?: (stepId: string) => void;
}

export function DependencyGraph({ steps, dependencies, onNodeClick }: DependencyGraphProps) {
  const getNodeColor = (riskLevel: string) => {
    const colors = {
      high: '#fee2e2',
      medium: '#fef3c7',
      low: '#dcfce7'
    };
    return colors[riskLevel as keyof typeof colors] || '#f3f4f6';
  };

  const nodes: Node[] = steps.map((step, index) => ({
    id: step.stepId,
    type: 'default',
    data: { 
      label: (
        <div className="text-xs p-2">
          <div className="font-semibold">{step.description.substring(0, 30)}...</div>
          <div className="text-gray-600">{step.category}</div>
        </div>
      )
    },
    position: { 
      x: (index % 3) * 300, 
      y: Math.floor(index / 3) * 150 
    },
    style: {
      background: getNodeColor(step.riskLevel),
      border: '2px solid #9ca3af',
      borderRadius: '8px',
      width: 220,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  const edges: Edge[] = dependencies.map((dep) => ({
    id: `e-${dep.sourceStepId}-${dep.targetStepId}`,
    source: dep.targetStepId,
    target: dep.sourceStepId,
    type: 'smoothstep',
    animated: dep.criticality === 'required',
    style: { 
      stroke: dep.criticality === 'required' ? '#ef4444' : '#9ca3af',
      strokeWidth: 2
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    }
  }));

  return (
    <div className="w-full h-[600px] border rounded-lg bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}