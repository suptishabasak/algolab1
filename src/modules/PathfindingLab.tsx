import { useMemo, useState } from 'react';
import { pathEvents } from '../algorithms/pathfinding';
import type { Grid } from '../algorithms/pathfinding';
import Panel from '../components/Panel';

type Props = { idx: number };

export default function PathfindingLab({ idx }: Props) {
  const [algo, setAlgo] = useState('A*');
  const [size, setSize] = useState(16);
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const grid: Grid = { rows: size, cols: size, walls, start: { r: 1, c: 1 }, goal: { r: size - 2, c: size - 2 } };
  const events = useMemo(() => pathEvents(grid, algo), [size, walls, algo]);
  const visible = events.slice(0, idx);
  const visited = new Set(visible.filter(event => event.type === 'VISIT').map(event => {
    const cell = (event.payload as { cell: { r: number; c: number } }).cell;
    return `${cell.r},${cell.c}`;
  }));
  const path = new Set(visible.filter(event => event.type === 'PATH').map(event => {
    const cell = (event.payload as { cell: { r: number; c: number } }).cell;
    return `${cell.r},${cell.c}`;
  }));

  return (
    <div className="lab-grid">
      <div className="workspace">
        <div className="toolbar">
          <select value={algo} onChange={event => setAlgo(event.target.value)}>{['A*', 'Dijkstra', 'BFS', 'DFS', 'Greedy Best-First'].map(value => <option key={value}>{value}</option>)}</select>
          <label>Grid <input type="range" min="8" max="24" value={size} onChange={event => setSize(Number(event.target.value))} /></label>
          <button onClick={() => { const next = new Set<string>(); for (let r = 2; r < size - 2; r++) for (let c = 2; c < size - 2; c++) if (Math.random() < 0.18) next.add(`${r},${c}`); setWalls(next); }}>Random maze</button>
          <button onClick={() => setWalls(new Set())}>Clear walls</button>
        </div>
        <div className="grid-board" style={{ gridTemplateColumns: `repeat(${size},1fr)` }}>
          {Array.from({ length: size * size }, (_, index) => {
            const row = Math.floor(index / size);
            const col = index % size;
            const cellKey = `${row},${col}`;
            const isStart = row === 1 && col === 1;
            const isGoal = row === size - 2 && col === size - 2;
            return <button key={cellKey} className={`cell ${isStart ? 'start' : isGoal ? 'goal' : walls.has(cellKey) ? 'wall' : path.has(cellKey) ? 'path' : visited.has(cellKey) ? 'visited' : ''}`} onClick={() => { if (isStart || isGoal) return; setWalls(current => { const next = new Set(current); if (next.has(cellKey)) next.delete(cellKey); else next.add(cellKey); return next; }); }} title={`${row},${col}`} />;
          })}
        </div>
        <p className="hint">Click cells to toggle walls. Start and goal are fixed. Use the timeline to watch the search.</p>
      </div>
      <aside>
        <Panel title="Search stats">
          <div className="stat"><b>{visited.size}</b><span>Explored cells</span></div>
          <div className="stat"><b>{path.size}</b><span>Path cells</span></div>
          <p className="muted">A* uses Manhattan distance on this four-direction grid. All algorithms use the same grid.</p>
        </Panel>
      </aside>
    </div>
  );
}
