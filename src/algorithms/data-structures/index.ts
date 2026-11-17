export class BSTNode {
  left: BSTNode | null = null;
  right: BSTNode | null = null;
  constructor(public value: number) {}
}

export class BST {
  root: BSTNode | null = null;

  insert(value: number) {
    const put = (node: BSTNode | null): BSTNode => {
      if (!node) return new BSTNode(value);
      if (value < node.value) node.left = put(node.left);
      else if (value > node.value) node.right = put(node.right);
      return node;
    };
    this.root = put(this.root);
  }

  search(value: number) {
    let node = this.root;
    while (node && node.value !== value) node = value < node.value ? node.left : node.right;
    return !!node;
  }

  delete(value: number) {
    const remove = (node: BSTNode | null, target: number): BSTNode | null => {
      if (!node) return null;
      if (target < node.value) node.left = remove(node.left, target);
      else if (target > node.value) node.right = remove(node.right, target);
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let successor = node.right;
        while (successor.left) successor = successor.left;
        node.value = successor.value;
        node.right = remove(node.right, successor.value);
      }
      return node;
    };
    this.root = remove(this.root, value);
  }

  traverse(order = 'inorder') {
    const result: number[] = [];
    const walk = (node: BSTNode | null) => {
      if (!node) return;
      if (order === 'preorder') result.push(node.value);
      walk(node.left);
      if (order === 'inorder') result.push(node.value);
      walk(node.right);
      if (order === 'postorder') result.push(node.value);
    };
    walk(this.root);
    return result;
  }
}

export class AVL {
  root: any = null;
  h(node: any): number { return node ? node.h : 0; }
  fix(node: any) { node.h = 1 + Math.max(this.h(node.l), this.h(node.r)); return node; }
  rotR(y: any) { const x = y.l; const temp = x.r; x.r = y; y.l = temp; this.fix(y); return this.fix(x); }
  rotL(x: any) { const y = x.r; const temp = y.l; y.l = x; x.r = temp; this.fix(x); return this.fix(y); }
  insert(value: number) {
    const go = (node: any): any => {
      if (!node) return { v: value, l: null, r: null, h: 1 };
      if (value < node.v) node.l = go(node.l);
      else if (value > node.v) node.r = go(node.r);
      this.fix(node);
      const balance = this.h(node.l) - this.h(node.r);
      if (balance > 1 && value < node.l.v) return this.rotR(node);
      if (balance < -1 && value > node.r.v) return this.rotL(node);
      if (balance > 1 && value > node.l.v) { node.l = this.rotL(node.l); return this.rotR(node); }
      if (balance < -1 && value < node.r.v) { node.r = this.rotR(node.r); return this.rotL(node); }
      return node;
    };
    this.root = go(this.root);
  }
  inorder() {
    const result: number[] = [];
    const walk = (node: any) => { if (node) { walk(node.l); result.push(node.v); walk(node.r); } };
    walk(this.root);
    return result;
  }
}

export class BinaryHeap {
  a: number[] = [];
  constructor(public min = true) {}
  cmp(a: number, b: number) { return this.min ? a < b : a > b; }
  insert(value: number) {
    this.a.push(value);
    let index = this.a.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (!this.cmp(this.a[index], this.a[parent])) break;
      [this.a[index], this.a[parent]] = [this.a[parent], this.a[index]];
      index = parent;
    }
  }
  extract() {
    if (!this.a.length) return undefined;
    const result = this.a[0];
    const last = this.a.pop()!;
    if (this.a.length) {
      this.a[0] = last;
      let index = 0;
      while (true) {
        let best = index;
        const left = 2 * index + 1;
        const right = left + 1;
        if (left < this.a.length && this.cmp(this.a[left], this.a[best])) best = left;
        if (right < this.a.length && this.cmp(this.a[right], this.a[best])) best = right;
        if (best === index) break;
        [this.a[index], this.a[best]] = [this.a[best], this.a[index]];
        index = best;
      }
    }
    return result;
  }
}

export class HashTable {
  buckets: number[][] = Array.from({ length: 11 }, () => []);
  constructor(public mode: 'linear' | 'quadratic' | 'chain' = 'linear') {}
  hash(value: number) { return Math.abs(value) % this.buckets.length; }
  insert(value: number) {
    const start = this.hash(value);
    if (this.mode === 'chain') { if (!this.buckets[start].includes(value)) this.buckets[start].push(value); return; }
    for (let step = 0; step < this.buckets.length; step++) {
      const index = (start + (this.mode === 'linear' ? step : step * step)) % this.buckets.length;
      if (this.buckets[index][0] === undefined || this.buckets[index][0] === value) { this.buckets[index] = [value]; return; }
    }
  }
  search(value: number) { return this.buckets.some(bucket => bucket.includes(value)); }
  delete(value: number) { for (const bucket of this.buckets) { const index = bucket.indexOf(value); if (index >= 0) bucket.splice(index, 1); } }
}

export class Trie {
  root: any = { children: {}, end: false };
  insert(word: string) {
    let node = this.root;
    for (const char of word) node = node.children[char] ?? (node.children[char] = { children: {}, end: false });
    node.end = true;
  }
  search(word: string) {
    let node = this.root;
    for (const char of word) { node = node.children[char]; if (!node) return false; }
    return node.end;
  }
  delete(word: string) {
    const remove = (node: any, index: number): boolean => {
      if (index === word.length) { node.end = false; return Object.keys(node.children).length === 0; }
      const char = word[index];
      const child = node.children[char];
      if (!child) return false;
      if (remove(child, index + 1)) delete node.children[char];
      return !node.end && Object.keys(node.children).length === 0;
    };
    remove(this.root, 0);
  }
}
