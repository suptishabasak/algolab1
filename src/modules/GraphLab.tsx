import { useMemo, useState } from 'react';
import { graphEvents } from '../algorithms/graph';
import type { Graph } from '../algorithms/graph';
import Panel from '../components/Panel';

type Props = { idx: number };

export default function GraphLab({ idx }: Props) {
  const [algo, setAlgo] = useState('BFS');
  const [source, setSource] = useState('A');
  const [weight, setWeight] = useState(2);
  const [nodes, setNodes] = useState(['A', 'B', 'C', 'D', 'E']);
  const [edges, setEdges] = useState<Graph['edges']>([
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'D', to: 'E', weight: 3 },
  ]);

  const events = useMemo(() => graphEvents({ nodes, edges }, algo, source), [nodes, edges, algo, source]);
  const visibleEvents = events.slice(0, idx);
  const visited = visibleEvents.filter(event => event.type === 'VISIT').map(event => (event.payload as { node: string }).node);
  const selectedEdges = visibleEvents.filter(event => event.type === 'SELECT_EDGE').map(event => {
    const payload = event.payload as { from: string; to: string };
    return `${payload.from}-${payload.to}`;
  });

  return (
    <div className="lab-grid">
      <div className="workspace">
        <div className="toolbar">
          <select value={algo} onChange={event => setAlgo(event.target.value)}>
            {['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', "Prim's Algorithm", "Kruskal's Algorithm"].map(value => <option key={value}>{value}</option>)}
          </select>
          <select value={source} onChange={event => setSource(event.target.value)}>
            {nodes.map(node => <option key={node}>{node}</option>)}
          </select>
          <button onClick={() => setNodes(current => [...current, String.fromCharCode(65 + current.length)])}>+ Node</button>
          <button onClick={() => setEdges(current => [...current, { from: nodes[0], to: nodes[nodes.length - 1], weight }])}>+ Edge</button>
          <input type="number" value={weight} onChange={event => setWeight(Number(event.target.value))} aria-label="Edge weight" />
        </div>
        <svg viewBox="0 0 640 390" className="graph-canvas">
          {edges.map((edge, index) => {
            const a = nodes.indexOf(edge.from);
            const b = nodes.indexOf(edge.to);
            if (a < 0 || b < 0) return null;
            const x1 = 90 + (a % 3) * 220;
            const y1 = 75 + Math.floor(a / 3) * 220;
            const x2 = 90 + (b % 3) * 220;
            const y2 = 75 + Math.floor(b / 3) * 220;
            const selected = selectedEdges.includes(`${edge.from}-${edge.to}`) || selectedEdges.includes(`${edge.to}-${edge.from}`);
            return <g key={`${edge.from}-${edge.to}-${index}`}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={selected ? '#22c55e' : '#52627e'} strokeWidth={selected ? 4 : 2} /><text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} fill="#aab8d0">{edge.weight}</text></g>;
          })}
          {nodes.map((node, index) => {
            const x = 90 + (index % 3) * 220;
            const y = 75 + Math.floor(index / 3) * 220;
            const isVisited = visited.includes(node);
            return <g key={node}><circle cx={x} cy={y} r="25" fill={isVisited ? '#2563eb' : '#18243a'} stroke={isVisited ? '#60a5fa' : '#536783'} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill="white" fontWeight="700">{node}</text></g>;
          })}
        </svg>
        <div className="hint">Select an algorithm, then use the timeline at the bottom to step through its events.</div>
      </div>
      <aside>
        <Panel title="Execution">
          <div className="stat"><b>{visited.length}</b><span>Visited nodes</span></div>
          <div className="stat"><b>{events.length}</b><span>Generated events</span></div>
          <div className="event-list">{events.slice(Math.max(0, idx - 5), idx + 4).map((event, index) => <div key={`${event.type}-${index}`} className={index === Math.min(5, idx) ? 'active' : ''}>{event.label ?? event.type}</div>)}</div>
        </Panel>
        <Panel title="Algorithm notes">
          <p>{algo} explores graph vertices and edges using a deterministic event sequence.</p>
          <p className="muted">BFS/DFS: O(V + E) time · O(V) space<br />Dijkstra: O((V + E) log V) with a heap<br />Bellman–Ford: O(VE) time</p>
        </Panel>
      </aside>
    </div>
  );
}
