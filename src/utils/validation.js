// Helper to build adjacency list
const buildAdjacencyList = (nodes, edges) => {
  const adj = new Map();
  nodes.forEach(node => adj.set(node.id, []));
  edges.forEach(edge => {
    if (adj.has(edge.source) && adj.has(edge.target)) {
      adj.get(edge.source).push(edge.target);
    }
  });
  return adj;
};

// Check for cycles using DFS
const hasCycleDFS = (nodeId, adj, visited, recursionStack) => {
  visited.add(nodeId);
  recursionStack.add(nodeId);

  for (const neighbor of adj.get(nodeId) || []) {
    if (!visited.has(neighbor)) {
      if (hasCycleDFS(neighbor, adj, visited, recursionStack)) {
        return true;
      }
    } else if (recursionStack.has(neighbor)) {
      return true; // Cycle detected
    }
  }
  recursionStack.delete(nodeId); // Remove from recursion stack
  return false;
};

export const validateDAG = (nodes, edges) => {
  // Check 1: Minimum Nodes
  if (nodes.length < 2) {
    return { status: false, message: "Invalid: At least 2 nodes required." };
  }

  const adj = buildAdjacencyList(nodes, edges);

  // Check 2: No Cycles
  const visited = new Set();
  const recursionStack = new Set();
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycleDFS(node.id, adj, visited, recursionStack)) {
        return { status: false, message: "Invalid: Cycle detected." };
      }
    }
  }

  // Check 3: All nodes are connected to at least one edge (source or target)
  const connectedNodes = new Set();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  for (const node of nodes) {
    if (!connectedNodes.has(node.id)) {
      return { status: false, message: `Invalid: Node '${node.data.label}' is not connected.` };
    }
  }

  // Check 4 & 5: Edge directionality and self-loops are handled by React Flow's Handle types and onConnect logic

  return { status: true, message: "Valid DAG!" };
};