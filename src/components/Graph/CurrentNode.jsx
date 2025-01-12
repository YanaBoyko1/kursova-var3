import React from 'react';

const CurrentNode = ({ node }) => (
  <div className="current-node">
    {node?<p>Поточна вершина: V{node}</p>:<p>Алгоритм не запущений</p>}
  </div>
);

export default CurrentNode;
