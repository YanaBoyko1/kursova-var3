class AvlNode {
  constructor(val) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1;
  }
}

export function insertNode(root, val) {
  root = insertBasic(root, val);
  return root;
}

function insertBasic(root, val) {
  if (root === null) {
    return new AvlNode(val);
  }
  if (val < root.val) {
    root.left = insertBasic(root.left, val);
    if (root.left !== null) {
      root.left.parent = root;
    }
  } else if (val > root.val) {
    root.right = insertBasic(root.right, val);
    if (root.right !== null) {
      root.right.parent = root;
    }
  } else {
    return root;
  }
  
  updateHeight(root);
  return rebalance(root);
}

export function deleteNode(root, val) {
  root = deleteBasic(root, val);
  return root;
}

function deleteBasic(root, val) {
  if (root === null) {
    return root;
  }

  if (val < root.val) {
    root.left = deleteBasic(root.left, val);
    if (root.left !== null) {
      root.left.parent = root;
    }
  } else if (val > root.val) {
    root.right = deleteBasic(root.right, val);
    if (root.right !== null) {
      root.right.parent = root;
    }
  } else {
    if (root.left === null || root.right === null) {
      const temp = root.left ? root.left : root.right;
      if (temp === null) {
        root = null;
      } else {
        root = temp;
      }
    } else {

      const temp = findMin(root.right);
      root.val = temp.val;
      root.right = deleteBasic(root.right, temp.val);
      if (root.right !== null) {
        root.right.parent = root;
      }
    }
  }

  if (root === null) {
    return root;
  }

  updateHeight(root);
  return rebalance(root);
}

function findMin(node) {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
}

export function searchNode(root, val) {
  let cur = root;
  while (cur !== null) {
    if (val === cur.val) {
      return cur;
    } else if (val < cur.val) {
      cur = cur.left;
    } else {
      cur = cur.right;
    }
  }
  return null;
}

export function searchNodeWithSteps(root, val) {
  let cur = root;
  const steps = [];
  
  while (cur !== null) {
    steps.push(cur);
    if (val === cur.val) {
      return { found: true, steps };
    } else if (val < cur.val) {
      cur = cur.left;
    } else {
      cur = cur.right;
    }
  }

  return { found: false, steps };
}

function updateHeight(node) {
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
}

function getHeight(node) {
  return node ? node.height : 0;
}

function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function rebalance(node) {
  const balance = getBalance(node);

  if (balance > 1) {
    if (getBalance(node.left) < 0) {
      node.left = rotateLeft(node.left);
      if (node.left !== null) node.left.parent = node;
    }
    const newRoot = rotateRight(node);
    return newRoot;
  }

  if (balance < -1) {
    if (getBalance(node.right) > 0) {
      node.right = rotateRight(node.right);
      if (node.right !== null) node.right.parent = node;
    }
    const newRoot = rotateLeft(node);
    return newRoot;
  }

  return node;
}

function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  if (x.right !== null) {
    x.right.parent = x;
  }
  y.left = x;

  y.parent = x.parent;
  x.parent = y;

  updateHeight(x);
  updateHeight(y);
  return y;
}

function rotateRight(y) {
  const x = y.left;
  y.left = x.right;
  if (y.left !== null) {
    y.left.parent = y;
  }
  x.right = y;

  x.parent = y.parent;
  y.parent = x;

  updateHeight(y);
  updateHeight(x);
  return x;
}
