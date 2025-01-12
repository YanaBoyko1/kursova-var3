import React from 'react';
import './List.css';

const List = ({ edges }) => {
  const adjacencyList = edges.reduce((acc, edge) => {
    if (!acc[edge.from]) {
      acc[edge.from] = [];
    }
    acc[edge.from].push(edge.to);
    return acc;
  }, {});

  const nodeIds = Object.keys(adjacencyList).map(Number).sort((a, b) => a - b);

  return (
    <div className="list">
      <h3>Список Суміжності</h3>
      <ul>
        {nodeIds.map(nodeId => (
          <li key={nodeId}>
            V{nodeId}: {adjacencyList[nodeId].map(to => `V${to}`).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
