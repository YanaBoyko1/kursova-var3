import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AvlTree.css';
import { insertNode, deleteNode, searchNodeWithSteps } from './avlOperations';

function AvlTree() {
  const [treeRoot, setTreeRoot] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [highlightedNode, setHighlightedNode] = useState(null);
  const searchStepsRef = useRef([]);
  const searchIntervalRef = useRef(null);

  const handleInsert = () => {
    const parsed = parseInt(inputVal);
    if (isNaN(parsed)) {
      alert('Введіть числове значення.');
      return;
    }
    const newRoot = insertNode(treeRoot, parsed);
    setTreeRoot(newRoot);
    setInputVal('');
  };

  const handleDelete = () => {
    const parsed = parseInt(inputVal);
    if (isNaN(parsed)) {
      alert('Введіть числове значення.');
      return;
    }
    const newRoot = deleteNode(treeRoot, parsed);
    setTreeRoot(newRoot);
    setInputVal('');
  };

  const handleSearch = () => {
    const parsed = parseInt(inputVal);
    if (isNaN(parsed)) {
      alert('Введіть числове значення.');
      return;
    }

    const { found, steps } = searchNodeWithSteps(treeRoot, parsed);
    if (steps.length === 0) {
      alert('Дерево порожнє або вузол не знайдено.');
      return;
    }

    if (searchIntervalRef.current) {
      clearInterval(searchIntervalRef.current);
      searchIntervalRef.current = null;
    }

    searchStepsRef.current = steps;
    setInputVal('');

    let index = 0;
    searchIntervalRef.current = setInterval(() => {
      if (index < searchStepsRef.current.length) {
        setHighlightedNode(searchStepsRef.current[index]);
        index++;
      } else {
        clearInterval(searchIntervalRef.current);
        searchIntervalRef.current = null;
        if (!found) {
          alert('Вузол не знайдено.');
        } else {
          alert('Вузол знайдено!');
        }
      }
    }, 700);
  };

  const renderTree = () => {
    const renderNode = (node, x, y, angle, depth) => {
      if (node === null) {
        return null;
      }

      const leftX = x - 200 / depth;
      const rightX = x + 200 / depth;
      const childY = y + 70;

      return (
        <g key={node.id}>
          {node.left !== null && (
            <line x1={x} y1={y} x2={leftX} y2={childY} stroke="black" />
          )}
          {node.right !== null && (
            <line x1={x} y1={y} x2={rightX} y2={childY} stroke="black" />
          )}
          <circle
            cx={x}
            cy={y}
            r="20"
            fill="#4CAF50"
            stroke={highlightedNode === node ? 'yellow' : 'black'}
            strokeWidth={highlightedNode === node ? 3 : 1}
          />
          <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="15">
            {node.val}
          </text>
          {renderNode(node.left, leftX, childY, angle - 20, depth + 1)}
          {renderNode(node.right, rightX, childY, angle + 20, depth + 1)}
        </g>
      );
    };

    return (
      <svg width="1300" height="600">
        {renderNode(treeRoot, 400, 50, 0, 1)}
      </svg>
    );
  };

  return (
    <div className="avl-container">
      <h1>AVL Tree</h1>
      <div className="controls">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Введіть значення"
        />
        <button onClick={handleInsert}>Додати</button>
        <button onClick={handleDelete}>Видалити</button>
        <button onClick={handleSearch}>Пошук</button>
        <Link to="/">
          <button>Home</button>
        </Link>
      </div>
      <div className="tree-area">{renderTree()}</div>
    </div>
  );
}

export default AvlTree;
