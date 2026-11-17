import { useMemo, useState } from 'react';
import { queensEvents, sudokuEvents, mazeEvents, coloringEvents } from '../algorithms/backtracking';
import type { Event } from '../types';
import Panel from '../components/Panel';

type Props = { idx: number };
type Payload = { r?: number; c?: number; v?: number; color?: number; cIndex?: number };

export default function BacktrackingLab({ idx }: Props) {
  const [problem, setProblem] = useState('N-Queens');
  const [n, setN] = useState(8);
  const events = useMemo(() => {
    if (problem === 'N-Queens') return queensEvents(n);
    if (problem === 'Sudoku') return sudokuEvents(Array.from({ length: 9 }, () => Array(9).fill(0)));
    if (problem === 'Rat in a Maze') return mazeEvents(Array.from({ length: n }, () => Array(n).fill(0)));
    return coloringEvents(n, Array.from({ length: n }, (_, index) => [index, (index + 1) % n] as [number, number]));
  }, [problem, n]);

  const visibleEvents = events.slice(0, idx);
  const queenCells = new Set<string>();
  const mazeCells = new Set<string>();
  const sudokuValues = new Map<string, number>();
  const vertexColors = new Map<number, number>();
  const attempted = new Set<string>();

  visibleEvents.forEach((event: Event) => {
    const payload = (event.payload ?? {}) as Payload & { v?: number; c?: number };
    if (problem === 'N-Queens' && typeof payload.r === 'number' && typeof payload.c === 'number') {
      const key = `${payload.r},${payload.c}`;
      if (event.type === 'PLACE') queenCells.add(key);
      if (event.type === 'BACKTRACK') queenCells.delete(key);
      if (event.type === 'TRY') attempted.add(key);
    }
    if (problem === 'Rat in a Maze' && typeof payload.r === 'number' && typeof payload.c === 'number') {
      const key = `${payload.r},${payload.c}`;
      if (event.type === 'VISIT') mazeCells.add(key);
      if (event.type === 'BACKTRACK') mazeCells.delete(key);
    }
    if (problem === 'Sudoku' && typeof payload.r === 'number' && typeof payload.c === 'number') {
      const key = `${payload.r},${payload.c}`;
      if (event.type === 'PLACE' && typeof payload.v === 'number') sudokuValues.set(key, payload.v);
      if (event.type === 'BACKTRACK') sudokuValues.delete(key);
    }
    if (problem === 'Graph Coloring' && typeof payload.v === 'number') {
      if (event.type === 'PLACE' && typeof payload.c === 'number') vertexColors.set(payload.v, payload.c);
      if (event.type === 'BACKTRACK') vertexColors.delete(payload.v);
    }
  });

  const boardSize = problem === 'Sudoku' ? 9 : n;
  const cellCount = boardSize * boardSize;

  return (
    <div className="lab-grid">
      <div className="workspace">
        <div className="toolbar">
          <select value={problem} onChange={event => setProblem(event.target.value)}>
            {['N-Queens', 'Sudoku', 'Rat in a Maze', 'Graph Coloring'].map(value => <option key={value}>{value}</option>)}
          </select>
          {problem !== 'Sudoku' && <label>Size <input type="number" min="4" max="12" value={n} onChange={event => setN(Math.max(4, Math.min(12, Number(event.target.value) || 4)))} /></label>}
        </div>

        {problem === 'Graph Coloring' ? (
          <div className="value-cloud">
            {Array.from({ length: n }, (_, vertex) => {
              const color = vertexColors.get(vertex);
              return <div className="value-node" key={vertex} style={{ border: color ? `3px solid hsl(${color * 110}, 75%, 60%)` : undefined }}>V{vertex}{color ? ` · C${color}` : ''}</div>;
            })}
          </div>
        ) : (
          <div className="board" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(25px, 1fr))` }}>
            {Array.from({ length: cellCount }, (_, index) => {
              const row = Math.floor(index / boardSize);
              const col = index % boardSize;
              const key = `${row},${col}`;
              const queen = queenCells.has(key);
              const mazeVisited = mazeCells.has(key);
              const sudokuValue = sudokuValues.get(key);
              const isActiveAttempt = attempted.has(key) && !queen;
              const content = problem === 'N-Queens'
                ? queen ? '♛' : ''
                : problem === 'Sudoku'
                  ? sudokuValue ?? '·'
                  : mazeVisited ? '●' : '';
              return <div key={key} className={`board-cell ${(row + col) % 2 ? 'alt' : ''} ${queen || mazeVisited || sudokuValue ? 'placed' : ''} ${isActiveAttempt ? 'active' : ''}`}>{content}</div>;
            })}
          </div>
        )}
        <div className="hint">The timeline replays attempted choices, placements and backtracks in order.</div>
      </div>
      <aside>
        <Panel title="Recursion trace">
          <div className="stat"><b>{visibleEvents.length}</b><span>Events replayed</span></div>
          <div className="event-list">{events.slice(Math.max(0, idx - 8), idx + 2).map((event, index) => <div key={`${event.type}-${index}`}>{event.label ?? `${event.type} · line ${event.line ?? '—'}`}</div>)}</div>
        </Panel>
      </aside>
    </div>
  );
}
