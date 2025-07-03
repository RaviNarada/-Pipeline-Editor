import React from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.css'; // For basic styling

const CustomNode = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} id="a" /> {/* Incoming handle */}
      <div>
        <strong>{data.label}</strong>
      </div>
      <Handle type="source" position={Position.Right} id="b" /> {/* Outgoing handle */}
    </div>
  );
};

export default CustomNode;