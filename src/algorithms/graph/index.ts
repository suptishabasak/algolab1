import type { Event } from '../../types';

export type Graph = {
  nodes: string[];
  edges: { from: string; to: string; weight: number }[];
};

export function graphEvents(graph: Graph, algorithm: string, start: string): Event[] {
  const adjacency = (node: string) => graph.edges
    .filter(edge => edge.from === node || edge.to === node)
    .map(edge => ({ to: edge.from === node ? edge.to : edge.from, weight: edge.weight }));
  const events: Event[] = [];
  const visited = new Set<string>();
  const distance: Record<string, number> = {};
  const previous: Record<string, string> = {};
  graph.nodes.forEach(node => { distance[node] = Infinity; });
  if (start in distance) distance[start] = 0;
  const visit = (node: string) => {
    visited.add(node);
    events.push({ type: 'VISIT', payload: { node }, label: `Visit ${node}` });
  };

  if (algorithm === 'BFS' || algorithm === 'DFS') {
    const work = [start];
    while (work.length) {
      const node = algorithm === 'BFS' ? work.shift()! : work.pop()!;
      if (visited.has(node)) continue;
      visit(node);
      for (const edge of adjacency(node)) {
        events.push({ type: 'EDGE', payload: { from: node, to: edge.to } });
        if (!visited.has(edge.to)) work.push(edge.to);
      }
    }
  } else if (algorithm === 'Dijkstra' || algorithm === 'Bellman-Ford') {
    if (algorithm === 'Bellman-Ford') {
      for (let pass = 0; pass < graph.nodes.length - 1; pass++) {
        for (const edge of graph.edges) {
          for (const [from, to] of [[edge.from, edge.to], [edge.to, edge.from]]) {
            if (distance[from] !== Infinity && distance[from] + edge.weight < distance[to]) {
              distance[to] = distance[from] + edge.weight;
              previous[to] = from;
              events.push({ type: 'RELAX', payload: { from, to, dist: distance[to] }, label: `Relax ${from} → ${to}` });
            }
          }
        }
      }
    } else {
      const done = new Set<string>();
      while (done.size < graph.nodes.length) {
        const node = graph.nodes.filter(item => !done.has(item)).sort((a, b) => distance[a] - distance[b])[0];
        if (!node || distance[node] === Infinity) break;
        done.add(node);
        visit(node);
        for (const edge of adjacency(node)) {
          if (!done.has(edge.to) && edge.weight >= 0 && distance[node] + edge.weight < distance[edge.to]) {
            distance[edge.to] = distance[node] + edge.weight;
            previous[edge.to] = node;
            events.push({ type: 'RELAX', payload: { from: node, to: edge.to, dist: distance[edge.to] }, label: `Relax ${node} → ${edge.to}` });
          }
        }
      }
    }
    events.push({ type: 'RESULT', payload: { dist: distance, prev: previous }, label: 'Shortest-path distances' });
  } else if (algorithm === "Prim's Algorithm") {
    const inTree = new Set<string>();
    if (start in distance) inTree.add(start);
    if (start in distance) visit(start);
    while (inTree.size < graph.nodes.length) {
      let best: Graph['edges'][number] | undefined;
      for (const edge of graph.edges) {
        const crosses = inTree.has(edge.from) !== inTree.has(edge.to);
        if (crosses && (!best || edge.weight < best.weight)) best = edge;
      }
      if (!best) break;
      events.push({ type: 'EDGE', payload: { from: best.from, to: best.to } });
      events.push({ type: 'SELECT_EDGE', payload: { from: best.from, to: best.to, weight: best.weight }, label: `Select ${best.from} — ${best.to}` });
      const next = inTree.has(best.from) ? best.to : best.from;
      inTree.add(next);
      visit(next);
    }
  } else {
    const parent: Record<string, string> = {};
    graph.nodes.forEach(node => { parent[node] = node; });
    const find = (node: string): string => parent[node] === node ? node : (parent[node] = find(parent[node]));
    for (const edge of [...graph.edges].sort((a, b) => a.weight - b.weight)) {
      const left = find(edge.from);
      const right = find(edge.to);
      events.push({ type: 'EDGE', payload: { from: edge.from, to: edge.to } });
      if (left !== right) {
        parent[left] = right;
        events.push({ type: 'SELECT_EDGE', payload: { from: edge.from, to: edge.to, weight: edge.weight }, label: `Select ${edge.from} — ${edge.to}` });
      }
    }
  }
  return events;
}
