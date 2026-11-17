import { useState } from 'react';
import { BST, AVL, BinaryHeap, HashTable, Trie } from '../algorithms/data-structures';
import Panel from '../components/Panel';

export default function DataStructuresLab({ idx: _idx }: { idx: number }) {
  const [kind, setKind] = useState('BST');
  const [value, setValue] = useState(42);
  const [items, setItems] = useState<number[]>([30, 18, 45, 12, 24, 38, 51]);
  const [word, setWord] = useState('graph');
  const [mode, setMode] = useState<'linear' | 'quadratic' | 'chain'>('linear');
  const [tick, setTick] = useState(0);
  const [trieWords, setTrieWords] = useState<string[]>(['graph', 'grid', 'greedy', 'tree', 'trie']);
  const trie = new Trie();
  trieWords.forEach(item => trie.insert(item));
  const refresh = () => setTick(current => current + 1);

  const bst = new BST();
  items.forEach(item => bst.insert(item));
  const avl = new AVL();
  items.forEach(item => avl.insert(item));
  const heap = new BinaryHeap(true);
  items.forEach(item => heap.insert(item));
  const hash = new HashTable(mode);
  items.forEach(item => hash.insert(item));
  void tick;

  const mutate = (operation: 'insert' | 'delete' | 'extract') => {
    if (kind === 'BST' || kind === 'AVL' || kind === 'Hash Table') {
      if (operation === 'insert') setItems(current => current.includes(value) ? current : [...current, value]);
      if (operation === 'delete') setItems(current => { const index = current.indexOf(value); return index < 0 ? current : current.filter((_, i) => i !== index); });
    } else if (kind === 'Heap') {
      if (operation === 'insert') setItems(current => [...current, value]);
      if (operation === 'delete') setItems(current => { const index = current.indexOf(value); return index < 0 ? current : current.filter((_, i) => i !== index); });
      if (operation === 'extract' && items.length) {
        const min = Math.min(...items);
        setItems(current => { const index = current.indexOf(min); return current.filter((_, i) => i !== index); });
      }
    }
    refresh();
  };

  const insertWord = () => {
    if (!word.trim()) return;
    const normalized = word.trim().toLowerCase();
    setTrieWords(current => current.includes(normalized) ? current : [...current, normalized]);
    refresh();
  };

  return (
    <div className="lab-grid">
      <div className="workspace">
        <div className="toolbar">
          <select value={kind} onChange={event => setKind(event.target.value)}>{['BST', 'AVL', 'Hash Table', 'Heap', 'Trie'].map(item => <option key={item}>{item}</option>)}</select>
          <input type="number" value={value} onChange={event => setValue(Number(event.target.value))} aria-label="Numeric value" />
          {kind !== 'Trie' && <><button onClick={() => mutate('insert')}>Insert</button><button onClick={() => mutate('delete')}>Delete</button></>}
          {kind === 'Heap' && <button onClick={() => mutate('extract')}>Extract min</button>}
          {kind === 'Hash Table' && <select value={mode} onChange={event => setMode(event.target.value as 'linear' | 'quadratic' | 'chain')}><option value="linear">Linear probing</option><option value="quadratic">Quadratic probing</option><option value="chain">Separate chaining</option></select>}
        </div>

        {kind === 'Hash Table' ? (
          <div className="hash-grid">{hash.buckets.map((bucket, index) => <div key={index}><small>{index}</small><b>{bucket.join(', ') || '—'}</b></div>)}</div>
        ) : kind === 'Trie' ? (
          <div className="trie-view">
            <input value={word} onChange={event => setWord(event.target.value)} aria-label="Trie word" />
            <button onClick={insertWord}>Insert word</button>
            <button onClick={() => window.alert(trie.search(word.trim().toLowerCase()) ? 'Word found' : 'Word not found')}>Search</button>
            <p>Example vocabulary: graph · grid · greedy · tree · trie</p>
          </div>
        ) : (
          <div className="value-cloud">{(kind === 'BST' ? bst.traverse() : kind === 'AVL' ? avl.inorder() : kind === 'Heap' ? heap.a : items).map((item, index) => <div className="value-node" key={`${item}-${index}`}>{item}</div>)}</div>
        )}
        <p className="hint">Operations update the underlying structure and the rendered values. Switch structures to explore their behavior.</p>
      </div>
      <aside>
        <Panel title="Structure inspector">
          <div className="stat"><b>{kind === 'Trie' ? '—' : items.length}</b><span>Stored values</span></div>
          <p className="muted">{kind === 'BST' ? 'BST: average O(log n), worst O(n). Inorder traversal returns sorted keys.' : kind === 'AVL' ? 'AVL: self-balancing BST. Rotations maintain height balance.' : kind === 'Heap' ? 'Binary heap: insert and extract are O(log n).' : kind === 'Hash Table' ? 'Hash table: expected O(1) lookup with a suitable load factor.' : 'Trie: lookup is O(L), where L is the word length.'}</p>
          <p className="muted">BST traversal: {bst.traverse('inorder').join(' → ')}</p>
        </Panel>
      </aside>
    </div>
  );
}
