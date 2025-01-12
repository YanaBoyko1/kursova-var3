import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import Controls from './Controls';
import Visualization from './Visualization';
import CurrentNode from './CurrentNode';
import List from './list/List';
import {
  initializeBFS,
  startBFSProcess,
  performBFSStep,
  pauseBFSProcess,
  undoBFSProcess,
  resetBFSProcess,
} from './algorithms/bfs';
import './Graph.css';

const Graph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [targetNode, setTargetNode] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);
  const [queue, setQueue] = useState([]);

  const isPausedRef = useRef(isPaused);
  const nodesRef = useRef(nodes);
  const timeoutRef = useRef(null);

  const delay = 700;

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const calculateNodePosition = (id) => {
    const level = Math.floor(Math.log2(id));
    const maxNodesOnLevel = Math.pow(2, level);
    const indexOnLevel = id - maxNodesOnLevel;

    const spacingX = 800 / (maxNodesOnLevel + 1);
    const x = (indexOnLevel + 1) * spacingX;
    const y = 100 + level * 100;

    return { x, y };
  };

  useEffect(() => {
    const initialCount = 15;
    const initialNodes = Array.from({ length: initialCount }, (_, i) => {
      const id = i + 1;
      const { x, y } = calculateNodePosition(id);
      return { id, label: `V${id}`, x, y, state: 'unvisited' };
    });

    const initialEdges = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 3, to: 7 },
      { from: 4, to: 8 },
      { from: 4, to: 9 },
      { from: 5, to: 10 },
      { from: 5, to: 11 },
      { from: 6, to: 12 },
      { from: 6, to: 13 },
      { from: 7, to: 14 },
      { from: 7, to: 15 },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  const addNode = () => {
    const currentIds = nodes.map(n => n.id).sort((a,b)=>a-b);
    if (currentIds.length >= 15) {
      alert('Досягнуто максимальної кількості вершин (15).');
      return;
    }

    let continuousMax = 0;
    for (let i = 1; i <= 15; i++) {
      if (currentIds.includes(i)) {
        continuousMax = i;
      } else {
        break;
      }
    }

    let newNodeId = null;
    if (continuousMax < 15 && continuousMax === currentIds.length) {
      newNodeId = continuousMax + 1;
    } else {

      const input = prompt(`Введіть ID вершини, яку ви хочете додати (1-15), відсутні IDs: ${[...Array(15).keys()].map(x=>x+1).filter(x=>!currentIds.includes(x)).join(', ')}`);
      if (input === null) return;
      const chosenId = parseInt(input,10);
      if (isNaN(chosenId) || chosenId < 1 || chosenId > 15) {
        alert('Некоректний ID вершини.');
        return;
      }
      if (currentIds.includes(chosenId)) {
        alert('Вершина з таким ID вже існує.');
        return;
      }
      newNodeId = chosenId;
    }

    const parentId = Math.floor(newNodeId / 2);
    if (parentId < 1) {
      alert('Неможливо додати вершину без кореня.');
      return;
    }
    if (!nodes.some((node) => node.id === parentId)) {
      alert('Батьківської вершини не існує. Спочатку додайте потрібну вершину-батька.');
      return;
    }

    const { x, y } = calculateNodePosition(newNodeId);
    const newNode = {
      id: newNodeId,
      label: `V${newNodeId}`,
      x,
      y,
      state: 'unvisited',
    };
    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, { from: parentId, to: newNodeId }]);
  };

  const deleteNode = () => {
    const nodeId = parseInt(prompt('Введіть ID вершини для видалення:'), 10);
    if (isNaN(nodeId) || !nodes.some((node) => node.id === nodeId)) {
      alert('Некоректний ID вершини');
      return;
    }

    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) => prev.filter((edge) => edge.from !== nodeId && edge.to !== nodeId));
  };

  const addEdge = () => {
    const fromId = parseInt(prompt('Введіть ID початкової вершини:'), 10);
    const toId = parseInt(prompt('Введіть ID кінцевої вершини:'), 10);

    if (
      isNaN(fromId) ||
      isNaN(toId) ||
      !nodes.some((node) => node.id === fromId) ||
      !nodes.some((node) => node.id === toId) ||
      edges.some((edge) => edge.from === fromId && edge.to === toId)
    ) {
      alert('Некоректні ID вершин або ребро вже існує.');
      return;
    }

    setEdges((prev) => [...prev, { from: fromId, to: toId }]);
  };

  const deleteEdge = () => {
    const fromId = parseInt(prompt('Введіть ID початкової вершини для видалення ребра:'), 10);
    const toId = parseInt(prompt('Введіть ID кінцевої вершини для видалення ребра:'), 10);

    if (
      isNaN(fromId) ||
      isNaN(toId) ||
      !edges.some((edge) => edge.from === fromId && edge.to === toId)
    ) {
      alert('Ребро не знайдено.');
      return;
    }

    setEdges((prev) => prev.filter((edge) => !(edge.from === fromId && edge.to === toId)));
  };

  const updateNodeState = useCallback((id, state) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, state } : node)));
    setCurrentNode(id);
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timeoutRef.current = setTimeout(async () => {
        await performBFSStep({
          nodesRef,
          edges,
          queue,
          setQueue,
          updateNodeState,
          setStepHistory,
          delay,
          targetNode,
          isPausedRef,
          setIsRunning,
        });
      }, delay);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isRunning, isPaused, queue, edges, delay, targetNode, updateNodeState]);

  const startBFS = () => {
    const startNodeId = parseInt(prompt('Введіть ID початкової вершини:'), 10);
    const endNodeId = parseInt(prompt('Введіть ID кінцевої вершини:'), 10);

    if (
      isNaN(startNodeId) ||
      isNaN(endNodeId) ||
      !nodes.some((node) => node.id === startNodeId) ||
      !nodes.some((node) => node.id === endNodeId)
    ) {
      alert('Некоректний ID вершини.');
      return;
    }

    const { nodes: initNodes, stepHistory: initStepHistory, currentNode: initCurrentNode, targetNode: initTargetNode } =
      initializeBFS(nodes, endNodeId);
    setNodes(initNodes);
    setStepHistory(initStepHistory);
    setCurrentNode(initCurrentNode);
    setTargetNode(initTargetNode);
    startBFSProcess(startNodeId, endNodeId, setIsRunning, setIsPaused, setTargetNode, setQueue, setNodes);
  };

  const pauseBFS = () => {
    pauseBFSProcess(isRunning, setIsPaused, isPaused);
  };

  const undoBFS = () => {
    undoBFSProcess(stepHistory, setStepHistory, setNodes, setQueue, setCurrentNode);
  };

  const resetGraph = () => {
    resetBFSProcess(setNodes, setStepHistory, setCurrentNode, setTargetNode, setIsRunning, setIsPaused, setQueue);
  };

  return (
    <div className="graph-container">
      <h1>Алгоритм Пошуку в Ширину (BFS)</h1>
      <Visualization nodes={nodes} edges={edges} target={targetNode} />
      <Controls
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onAddEdge={addEdge}
        onDeleteEdge={deleteEdge}
        onStartBFS={startBFS}
        onPauseBFS={pauseBFS}
        onUndoBFS={undoBFS}
        onResetGraph={resetGraph}
        isRunning={isRunning}
        isPaused={isPaused}
      />
      <CurrentNode node={currentNode} />
      <List edges={edges} />
      {isRunning && (
        <div className="current-stack">
          <p>Поточна Черга: {queue.join(', ')}</p>
        </div>
      )}
      <Link to="/">
        <button>Home</button>
      </Link>
    </div>
  );
};

export default Graph;
