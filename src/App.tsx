
import { useState, useEffect } from 'react';
import {
  Network,
  GitBranch,
  Boxes,
  Route,
  Activity,
  ChevronRight,
  Command,
} from 'lucide-react';
import { motion } from 'framer-motion';

import GraphLab from './modules/GraphLab';
import BacktrackingLab from './modules/BacktrackingLab';
import DataStructuresLab from './modules/DataStructuresLab';
import PathfindingLab from './modules/PathfindingLab';
import PlaybackControls from './components/PlaybackControls';

const modules = [
  {
    id: 'graph',
    name: 'Graph algorithms',
    sub: 'Traversal & shortest paths',
    icon: Network,
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    sub: 'Recursive search',
    icon: GitBranch,
  },
  {
    id: 'structures',
    name: 'Data structures',
    sub: 'Trees, heaps & hashing',
    icon: Boxes,
  },
  {
    id: 'path',
    name: 'Pathfinding',
    sub: 'Grid search algorithms',
    icon: Route,
  },
];

export default function App() {
  const [active, setActive] = useState('graph');
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setIdx(current => {
        if (current >= 79) {
          setPlaying(false);
          return 79;
        }
        return current + 1;
      });
    }, 700 / speed);

    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const current = modules.find(module => module.id === active)!;

  const Component =
    active === 'graph'
      ? GraphLab
      : active === 'backtracking'
        ? BacktrackingLab
        : active === 'structures'
          ? DataStructuresLab
          : PathfindingLab;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Activity size={20} />
          </div>
          <div>
            <b>AlgoLab</b>
            <small>ALGORITHM PLAYGROUND</small>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        {modules.map(module => (
          <button
            key={module.id}
            className={`nav-item ${active === module.id ? 'selected' : ''}`}
            onClick={() => {
              setActive(module.id);
              setIdx(0);
              setPlaying(false);
            }}
          >
            <module.icon size={18} />
            <span>
              <b>{module.name}</b>
              <small>{module.sub}</small>
            </span>
            {active === module.id && <ChevronRight size={15} />}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="avatar">AL</div>
          <div>
            <b>Local workspace</b>
            <small>All processing in browser</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">
            Workspace <span>/</span> {current.name}
          </div>
          <div className="top-right">
            <span className="status-dot" /> READY <kbd>⌘ K</kbd>
          </div>
        </header>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="content"
        >
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                INTERACTIVE LEARNING ENVIRONMENT
              </div>
              <h1>{current.name}</h1>
              <p>
                {current.sub} · Explore the mechanics, one operation at a time.
              </p>
            </div>

            <div className="module-chip">
              <Command size={14} /> MODULE 0
              {modules.findIndex(module => module.id === active) + 1}
            </div>
          </div>

          <Component idx={idx} />

          <div className="bottom-dock">
            <div className="dock-label">
              <span className="live-dot" /> VISUALIZATION TIMELINE
            </div>

            <PlaybackControls
              index={idx}
              length={80}
              onSeek={next => setIdx(Math.max(0, Math.min(79, next)))}
              speed={speed}
              onSpeed={setSpeed}
              playing={playing}
              onPlay={() => {
                if (idx >= 79) setIdx(0);
                setPlaying(true);
              }}
              onPause={() => setPlaying(false)}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
