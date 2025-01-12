import React from 'react';

const Visualization = ({ nodes, edges }) => {
  return (
    <svg width="800" height="600">
      {edges.map((edge, i) => {
        const fromNode = nodes.find(n=>n.id===edge.from);
        const toNode = nodes.find(n=>n.id===edge.to);
        if(!fromNode||!toNode)return null;
        return (
          <line
            key={i}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke="black"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
      {nodes.map(n=>(
        <g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r="20"
            fill={n.state==='target'?'green':n.state==='processing'?'orange':n.state==='visited'?'black':'gray'}
          />
          <text
            x={n.x}
            y={n.y+5}
            textAnchor="middle"
            fill="white"
            fontSize="15"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default Visualization;
