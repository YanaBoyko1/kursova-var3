import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <section>
      <h1>Алгоритм та Структура Даних</h1>
      <div className="sections">
        <div className="graph">
          <h2>Graph Algorithm BFS</h2>
          <Link to="/graph">
            <button className="start">Start</button>
          </Link>
        </div>
        <div className="avl">
          <h2>Data Structure AVL Tree</h2>
          <Link to="/avl">
            <button className="start">Start</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
