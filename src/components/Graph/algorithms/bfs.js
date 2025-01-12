export const initializeBFS = (nodes, endNodeId) => {
  const updatedNodes = nodes.map(n => ({...n, state:'unvisited'}));
  return {
    nodes: updatedNodes,
    stepHistory: [],
    currentNode: null,
    targetNode: endNodeId,
    queue: []
  };
};

export const startBFSProcess = (startId, endId, setIsRunning, setIsPaused, setTargetNode, setQueue, setNodes) => {
  setIsRunning(true);
  setIsPaused(false);
  setTargetNode(endId);
  setNodes(p=>p.map(n=>({...n,state:'unvisited'})));
  setQueue([startId]);
};

function findCandidate(queue, nodesRef, setQueue, isPausedRef, setIsRunning) {
  if (queue.length === 0) {
    alert('Цільова вершина не знайдена');
    setIsRunning(false);
    return null;
  }
  if (isPausedRef.current) return null;
  
  const candidate = queue[0];
  const cNode = nodesRef.current.find(n=>n.id===candidate);
  if (!cNode || (cNode.state !== 'unvisited' && cNode.state !== 'processing')) {
    setQueue(prev=>prev.slice(1));
    return findCandidate(queue.slice(1), nodesRef, setQueue, isPausedRef, setIsRunning);
  }
  return candidate;
}

export const performBFSStep = async ({nodesRef, edges, queue, setQueue, updateNodeState, setStepHistory, delay, targetNode, isPausedRef, setIsRunning}) => {
  const candidate = findCandidate(queue, nodesRef, setQueue, isPausedRef, setIsRunning);
  if (candidate === null) return;

  updateNodeState(candidate, 'processing');
  setStepHistory(h=>[...h,candidate]);
  await new Promise(r=>setTimeout(r,delay));

  if (candidate === targetNode) {
    updateNodeState(candidate, 'target');
    alert('Знайдено кінцеву вершину V' + targetNode);
    setIsRunning(false);
    return;
  }

  const allNeighbors = edges.filter(e=>e.from===candidate).map(e=>e.to);

  const newNodes = [...nodesRef.current];
  const unvisitedNeighbors = [];
  for (let nb of allNeighbors) {
    const neighborNode = newNodes.find(n=>n.id===nb);
    if (neighborNode && neighborNode.state==='unvisited') {
      neighborNode.state = 'processing';
      unvisitedNeighbors.push(nb);
    }
  }

  unvisitedNeighbors.forEach(nb => updateNodeState(nb, 'processing'));

  setQueue(q => [...q.slice(1), ...unvisitedNeighbors]);

  updateNodeState(candidate,'visited');
  await new Promise(r=>setTimeout(r,delay));
}

export const pauseBFSProcess = (isRunning, setIsPaused, isPaused) => {
  if (!isRunning) return;
  setIsPaused(!isPaused);
}

export const undoBFSProcess = (stepHistory, setStepHistory, setNodes, setQueue, setCurrentNode) => {
  if (stepHistory.length===0) {
    alert('Немає попередніх кроків для відкату.');
    return;
  }
  const newHistory = [...stepHistory];
  const lastVisitedNode = newHistory.pop();
  setNodes(prev=>prev.map(n=>n.id===lastVisitedNode?{...n,state:'unvisited'}:n));
  setStepHistory(newHistory);
  setQueue(prev=>[lastVisitedNode, ...prev]);
  const previousNode = newHistory[newHistory.length-1]||null;
  setCurrentNode(previousNode);
}

export const resetBFSProcess = (setNodes, setStepHistory, setCurrentNode, setTargetNode, setIsRunning, setIsPaused, setQueue) => {
  setNodes(prev=>prev.map(n=>({...n,state:'unvisited'})));
  setStepHistory([]);
  setCurrentNode(null);
  setTargetNode(null);
  setIsRunning(false);
  setIsPaused(false);
  setQueue([]);
}
