import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  Background,
  useReactFlow, // For fitView in auto-layout
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs
import CustomNode from './components/CustomNode.jsx'; // Add .jsx
import ControlsPanel from './components/Controls.jsx'; // Add .jsx
import { validateDAG } from './utils/validation';
import { getLayoutedElements } from './utils/dagLayout';

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  customNode: CustomNode,
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isValidDag, setIsValidDag] = useState({ status: false, message: "Add at least 2 nodes and connect them." });

  const { fitView } = useReactFlow(); // Hook for auto-layout

  // Handles changes to nodes (dragging, selection, etc.)
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handles changes to edges (deletion, new connections)
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handles new connections
  const onConnect = useCallback(
    (params) => {
      // Prevent self-connections
      if (params.source === params.target) {
        alert('Self-connections are not allowed!');
        return;
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Handles node deletion via delete key
  const onNodesDelete = useCallback(
    (deletedNodes) => {
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !deletedNodes.some((node) => node.id === edge.source || node.id === edge.target)
        )
      );
    },
    [setEdges]
  );

  // Handles edge deletion via delete key (React Flow handles this automatically if onEdgesChange is provided)

  // Add Node Functionality
  const addNode = useCallback(() => {
    const nodeName = prompt('Enter node name:');
    if (nodeName) {
      const newNode = {
        id: uuidv4(), // Unique ID
        type: 'customNode', // Use our custom node type
        position: { x: Math.random() * 250, y: Math.random() * 250 }, // Random initial position
        data: { label: nodeName },
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [setNodes]);

  // DAG Validation - runs whenever nodes or edges change
  useEffect(() => {
    const validationResult = validateDAG(nodes, edges);
    setIsValidDag(validationResult);
  }, [nodes, edges]);

  // Auto Layout
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, fitView]
  );


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
        <ControlsPanel addNode={addNode} onLayout={onLayout} isValidDag={isValidDag} />
      </ReactFlow>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;