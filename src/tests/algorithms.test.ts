import { describe, it, expect } from 'vitest';
import { BST, AVL, BinaryHeap, HashTable, Trie } from '../algorithms/data-structures';
import { queensEvents, sudokuEvents } from '../algorithms/backtracking';
import { graphEvents } from '../algorithms/graph';
import { buildTimeline, frameAt } from '../engine/timeline';

describe('data structures', () => {
  it('BST insert/search/delete/traversal', () => {
    const tree = new BST();
    [4, 2, 6, 1, 3].forEach(value => tree.insert(value));
    expect(tree.traverse()).toEqual([1, 2, 3, 4, 6]);
    expect(tree.search(3)).toBe(true);
    tree.delete(4);
    expect(tree.traverse()).toEqual([1, 2, 3, 6]);
  });
  it('AVL remains ordered and balanced-height', () => {
    const tree = new AVL();
    [30, 20, 10, 25, 28, 27].forEach(value => tree.insert(value));
    expect(tree.inorder()).toEqual([10, 20, 25, 27, 28, 30]);
    expect(tree.root.h).toBeLessThanOrEqual(3);
  });
  it('heap extracts in order', () => {
    const heap = new BinaryHeap();
    [5, 1, 9, 2].forEach(value => heap.insert(value));
    expect([heap.extract(), heap.extract(), heap.extract(), heap.extract()]).toEqual([1, 2, 5, 9]);
  });
  it('hash and trie operations', () => {
    const table = new HashTable('linear');
    table.insert(12);
    expect(table.search(12)).toBe(true);
    table.delete(12);
    expect(table.search(12)).toBe(false);
    const trie = new Trie();
    trie.insert('tree');
    expect(trie.search('tree')).toBe(true);
    trie.delete('tree');
    expect(trie.search('tree')).toBe(false);
  });
});

describe('algorithms', () => {
  it('BFS covers reachable component only', () => {
    const events = graphEvents({ nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B', weight: 1 }] }, 'BFS', 'A');
    expect(events.filter(event => event.type === 'VISIT')).toHaveLength(2);
  });
  it('Bellman-Ford relaxes a negative edge', () => {
    const events = graphEvents({ nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B', weight: 2 }, { from: 'B', to: 'C', weight: -4 }] }, 'Bellman-Ford', 'A');
    expect(events.some(event => event.type === 'RELAX')).toBe(true);
  });
  it('N queens emits a full placement', () => {
    const events = queensEvents(4);
    expect(events.filter(event => event.type === 'PLACE').length).toBeGreaterThanOrEqual(4);
  });
  it('Sudoku placements minus backtracks equal the final number of assigned cells', () => {
    const events = sudokuEvents(Array.from({ length: 9 }, () => Array(9).fill(0)));
    const placements = events.filter(event => event.type === 'PLACE').length;
    const backtracks = events.filter(event => event.type === 'BACKTRACK').length;
    expect(placements - backtracks).toBe(81);
  });
});

describe('timeline', () => {
  it('replays deterministically in either direction', () => {
    const frames = buildTimeline({ n: 0 }, [{ type: 'PATCH', payload: { n: 1 } }, { type: 'PATCH', payload: { n: 2 } }], (state, event) => ({ ...state, ...event.payload as object }));
    expect(frameAt(frames, 2).state.n).toBe(2);
    expect(frameAt(frames, 1).state.n).toBe(1);
    expect(frameAt(frames, 2).state.n).toBe(2);
  });
});
