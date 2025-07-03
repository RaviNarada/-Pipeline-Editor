import React from 'react';
import { Panel, Position } from 'reactflow';
import './Controls.css'; // For basic styling

const ControlsPanel = ({ addNode, onLayout, isValidDag }) => {
  return (
    <Panel position={Position.TopRight} className="controls-panel">
      <button onClick={addNode}>Add Node</button>
      <button onClick={() => onLayout('TB')}>Layout (Top-Bottom)</button>
      <button onClick={() => onLayout('LR')}>Layout (Left-Right)</button>
      <div className={`validation-status ${isValidDag.status ? 'valid' : 'invalid'}`}>
        {isValidDag.message}
      </div>
    </Panel>
  );
};

export default ControlsPanel;