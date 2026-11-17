
# AlgoLab — Interactive Algorithm & Data Structure Playground

A locally runnable React + TypeScript + Vite application with four learning labs. The project is designed to run entirely in your browser after dependencies are installed.

## Requirements

- Node.js 18.18+ (Node 20 LTS recommended)
- npm 9+

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — type-check and create a production build in `dist/`
- `npm run test` — run Vitest unit tests
- `npm run preview` — preview the production build

## Modules

- **Graph algorithms:** BFS, DFS, Dijkstra, Bellman–Ford and edge-selection demonstrations for Prim/Kruskal; editable node/edge examples and traversal timeline.
- **Backtracking:** N-Queens, Sudoku, Rat in a Maze and Graph Coloring event generators.
- **Data structures:** Binary Search Tree, AVL insertion balancing, heaps, hash collision strategies and tries.
- **Pathfinding:** A*, Dijkstra, BFS, DFS and Greedy Best-First search over an editable grid with walls and random maze generation.

## Architecture

- `src/algorithms/` — algorithm implementations and event generators
- `src/engine/` — deterministic event timeline construction and playback state transitions
- `src/components/` — shared playback controls and panels
- `src/modules/` — module-level React interfaces
- `src/tests/` — Vitest tests
- `src/types/` — shared event and frame types

## Notes and known scope

The event timeline is deterministic: algorithms generate ordered events, `buildTimeline` snapshots reduced states, and `frameAt` restores a frame by index. The dock is a shared playback controller; individual labs currently use local timeline indices and their own event streams.

This is a substantial runnable foundation, not a claim that every requested advanced interaction is at production depth. In particular, graph edge editing is example-driven rather than a full drag-to-connect canvas; Prim/Kruskal currently demonstrate sorted edge selection rather than full component-specific MST annotations; the Sudoku board starts empty; AVL deletion and full rotation telemetry are not yet exposed in the UI; heapify and side-by-side pathfinding comparison are not yet surfaced; and the UI's shared playback dock is not yet wired to each lab's event stream. The algorithms and event generators are kept separate so these can be extended without restructuring the application.

No dependency installation or project execution was performed in the generation environment. Install dependencies locally, then run `npm run test` and `npm run build` to verify in your environment. The app uses standard npm dependencies; it does not download packages at runtime. Google Fonts are referenced for optional typography; system fallback fonts work offline.
