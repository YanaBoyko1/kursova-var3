import React from 'react';

const Controls = ({
  onAddNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
  onStartBFS,
  onPauseBFS,
  onUndoBFS,
  onResetGraph,
  isRunning,
  isPaused
}) => (
  <div className="controls">
    <button onClick={onAddNode}>Додати Вершину</button>
    <button onClick={onDeleteNode}>Видалити Вершину</button>
    <button onClick={onAddEdge}>Додати Ребро</button>
    <button onClick={onDeleteEdge}>Видалити Ребро</button>
    <button onClick={onStartBFS} disabled={isRunning}>
      Старт
    </button>
    <button onClick={onPauseBFS} disabled={!isRunning}>
      {isPaused ? 'Продовжити' : 'Пауза'}
    </button>
    <button onClick={onUndoBFS} disabled={!isRunning}>
      Назад
    </button>
    <button onClick={onResetGraph}>Скинути</button>
  </div>
);

export default Controls;
