class RBNode {
    constructor(value: number, color: "red" | "black" = "red", children: [null | RBNode, null | RBNode] = [null, null], parent = null) {
        this.value = value;
        this.color = color;
        this.children = children;
        this.parent = parent;
        this.count = 1;
    }

    value: number;
    color: "red" | "black";
    children: [null | RBNode, null | RBNode];
    parent: RBNode | null;
    count: number;
}

class RedBlackTree {
    constructor() {
        this.root = null;
    }

    root: RBNode | null;

    insert(value: number) {
        if (this.root == null) {
            this.root = new RBNode(value, "black");
        }

        let currentNode: RBNode = this.root;

        while(currentNode) {
            if (value > currentNode.value) {
                if (currentNode.children[1]) {
                    currentNode = currentNode.children[1];
                    continue;
                }

                currentNode.children[1] = new RBNode(value);
                currentNode.children[1].parent = currentNode;
                break;
            } else if (value < currentNode.value) {
                if (currentNode.children[0]) {
                    currentNode = currentNode.children[0];
                    continue;
                }

                currentNode.children[0] = new RBNode(value);
                currentNode.children[0].parent = currentNode;
                break;
            } else {
                // duplicate
                currentNode.count++;
                break;
            }
        }

        // then fix RB properties
        this.fixAfterInsert(currentNode)
    }

    delete(value: number) {
        const currentNode = this.findNode(value);
    
        if (currentNode == null) {
            return;
        }
    
        let replacer;
    
        if (currentNode.count > 1) {
            currentNode.count--;
            return;
        }
    
        if (currentNode.children[0] || currentNode.children[1]) {
            // find in-order successor
            if (currentNode.children[1]) {
                // find leftmost node in right subtree
                replacer = this.findMin(currentNode.children[1]);
            } else if (currentNode.children[0]) {
                replacer = currentNode.children[0];
            }
    
            this.removeNode(replacer);
    
            currentNode.value = replacer.value;
            currentNode.color = replacer.color; // assign replacer's color to currentNode
        } else {
            if (this.root == currentNode) {
                this.root = null;
            } else if (currentNode.parent) {
                const parentChildIndex = currentNode.parent.children.findIndex(node => node === currentNode)
    
                currentNode.parent.children[parentChildIndex] = null;
            }
        }
    
        // fix RB properties
        this.fixAfterDelete(replacer); // only fix the tree once
    }

    // specific logic for removing the in-order successor;
    // other logic for removal will remain in the `delete` fn
    removeNode(node: RBNode): void {
        if (!node.parent) {
            throw new Error("#removeNode: This function should only be used to remove in-order successors, not roots")
        }
    
        let nodeParentChildIndex = node.parent.children.findIndex(child => child === node);
    
        if (node.children[0]) {
            throw new Error("#removeNode: This function should only be used to remove in-order successors")
        }
    
        if (node.children[1]) {
            node.children[1].parent = node.parent;
            node.parent.children[nodeParentChildIndex] = node.children[1];
        } else {
            node.parent.children[nodeParentChildIndex] = null;
        }
    
        if (node.color === 'black') {
            this.fixAfterDelete(node.parent.children[nodeParentChildIndex]);
        }
    }

    findNode(value: number): RBNode | null {
        let currentNode = this.root;

        while(currentNode) {
            if (currentNode.value === value) {
                // delete
                break;
            } else if (currentNode.value > value) {
                currentNode = currentNode.children[0];
            } else {
                currentNode = currentNode.children[1];
            }
        }

        return currentNode;
    }

    findMin(node: RBNode): RBNode {
        while(node.children[0]) {
            node = node.children[0];
        }

        return node;
    }

    
    rotateLeft(node?: RBNode | null): void {
        if (!node) {
            return;
        }

        const pivot = node.children[1]; // pivot is right child of node b/c greater

        if (!pivot) {
            return;
        }

        node.children[1] = pivot.children[0];

        if (pivot.children[0]) {
            pivot.children[0].parent = node;
        }

        // pivot takes the original node's place
        // because this is left rotate, node becomes pivots left child
        pivot.parent = node.parent;
        pivot.children[0] = node;

        if (!node.parent) {
            // if node doesnt have parent its the root
            this.root = pivot;
        } else if (node === node.parent.children[0]) {
            // update parent pointer according to which pointer it is
            node.parent.children[0] = pivot;
        } else {
            node.parent.children[1] = pivot;
        }

        // finally update original node's parent pointer
        node.parent = pivot;
    }

    rotateRight(node?: RBNode | null): void {
        if (!node) {
            return;
        }

        const pivot = node.children[0]; // pivot is left child of node

        if (!pivot) {
            return;
        }

        // update node's left child pointer at pivots right child
        node.children[0] = pivot.children[1];

        // if that child exists fix its pointer
        if (pivot.children[1]) {
            pivot.children[1].parent = node;
        }

        // pivot takes the original node's place
        // because this is right rotate, node becomes pivots right child
        pivot.parent = node.parent;
        pivot.children[1] = node;

        if (!node.parent) {
            // if node doesnt' have a parent it's the root
            this.root = pivot;
        } else if (node === node.parent.children[1]) {
            node.parent.children[1] = pivot;
        } else {
            node.parent.children[0] = pivot;
        }

        // finally update original node's parent pointer
        node.parent = pivot;
    }

    recolor(node: RBNode | null | undefined): void {
        if (!node || this.root === node) {
            return;
        }

        if (node.color === "black") {
            node.color = "red";
        } else {
            node.color = "black";
        }
    }

    fixAfterInsert(node: RBNode | null | undefined): void {
        if (!node) {
            return;
        }
    
        if (node.parent?.color === "red") {
            if (this.getUncle(node)?.color === "red") {
                // recolor both the parent
                this.recolor(node.parent);
                this.recolor(this.getUncle(node));
                this.fixAfterInsert(this.getGrandparent(node) as RBNode);
            } else { // Uncle is black or null
                if (this.getParentIndex(node) === 0) { // parent is left child
                    if (node === node.parent.children[1]) {
                        this.rotateLeft(node.parent);
    
                        node.parent = node;
                    }
    
                    this.rotateRight(this.getGrandparent(node));
    
                    this.recolor(node.parent);
                    this.recolor(this.getGrandparent(node));
                } else if (this.getParentIndex(node) === 1) { // parent is right child
                    if (node === node.parent.children[0]) {
                        this.rotateRight(node.parent);
    
                        node.parent = node;
                    }
    
                    this.rotateLeft(this.getGrandparent(node));
    
                    this.recolor(node.parent);
                    this.recolor(this.getGrandparent(node));
                }
            }
        }
    
        if (this.root) {
            this.root.color = "black";
        }
    }
    

    getParentIndex(node: RBNode): 0 | 1 | undefined {
        const parent = node.parent;

        return node.parent?.parent?.children.findIndex(child => child == parent) as 0 | 1 | undefined;
    }

    fixAfterDelete(node: RBNode | null): void {
        if (!node) {
            return;
        }
    
        // Case 1: the removed node is red
        if (node.color === "red") {
            return;
        }
    
        // Case 2: the removed node is black and has a red sibling
        const sibling = this.getSibling(node);
        if (sibling && sibling.color === "red") {
            if (node.parent) {
                node.parent.color = "red";
                sibling.color = "black";
                if (node === node.parent.children[0]) {
                    this.rotateLeft(node.parent);
                } else {
                    this.rotateRight(node.parent);
                }
            }
        }

    
        // Case 3: the removed node is black and has a black sibling with at least one red child
        const newSibling = this.getSibling(node);
        if (newSibling) {
            const redChildIndex = newSibling.children.findIndex((child) => child && child.color === "red");
            if (node.parent) {
            if (redChildIndex !== -1) {
                if (node === node.parent.children[0]) {
                    if (redChildIndex === 0) {
                        if (newSibling.children[0]) {
                            newSibling.children[0].color = "black";
                            this.rotateRight(newSibling);
                        }
                    } else {
                        if (newSibling.children[1]) {
                            newSibling.color = "red";
                            newSibling.children[1].color = "black";
                        }
                    }
                    this.rotateLeft(node.parent);
                } else {
                    if (redChildIndex === 1) {
                        if (newSibling.children[1]) {
                            newSibling.children[1].color = "black";
                            this.rotateLeft(newSibling);
                        }
                    } else {
                        if (newSibling.children[0]) {
                            newSibling.color = "red";
                            newSibling.children[0].color = "black";
                        }
                    }
                    this.rotateRight(node.parent);
                }
                node.parent.color = "black";
            } else {
                // Case 4: the removed node is black and has a black sibling with black children
                newSibling.color = "red";
                if (node.parent.color === "black") {
                    this.fixAfterDelete(node.parent);
                } else {
                    node.parent.color = "black";
                }
            }
        }
        }
    }

    getSibling(node: RBNode): RBNode | null {
        const siblingIndex = this.getParentIndex(node) === 0 ? 1 : 0;

        return node.parent?.children[siblingIndex] ?? null;
    }

    getGrandparent(node: RBNode): RBNode | null | undefined {
        return node?.parent?.parent;
    }

    getUncle(node: RBNode): RBNode | null {
        const parent = node?.parent;
        const parentIndex = parent?.parent?.children.findIndex(child => child == parent);
        
        return parent?.parent?.[parentIndex === 0 ? 1 : 0];
    }
}

// function testRedBlackTree() {
//     const tree = new RedBlackTree();

//     const valuesToInsert = [10, 5, 15, 2, 7, 12, 18, 1, 3, 6, 8, 11, 13, 16, 19];

//     console.log("Inserting values:");
//     valuesToInsert.forEach(value => {
//         console.log(`Inserting ${value}`);
//         tree.insert(value);
//         printTree(tree.root);
//         console.log("");
//     });

//     const valuesToDelete = [3, 7, 15];

//     console.log("Deleting values:");
//     valuesToDelete.forEach(value => {
//         console.log(`Deleting ${value}`);
//         tree.delete(value);
//         printTree(tree.root);
//         console.log("");
//     });
// }

// function printTree(node, prefix = "", isTail = true) {
//     if (!node) {
//         return;
//     }

//     console.log(prefix + (isTail ? "└── " : "├── ") + `(${node.color}) ${node.value} (count: ${node.count})`);
//     const newPrefix = prefix + (isTail ? "    " : "│   ");
//     printTree(node.children[0], newPrefix, false);
//     printTree(node.children[1], newPrefix, true);
// }

// // Run the test function
// testRedBlackTree();

function printTree(node: RBNode | null, prefix = ""): void {
    if (!node) {
        return;
    }

    console.log(prefix + node.value + " (" + node.color + ")");
    printTree(node.children[0], prefix + "  ");
    printTree(node.children[1], prefix + "  ");
}

const tree = new RedBlackTree();

tree.insert(10);
tree.insert(5);
tree.insert(15);
tree.insert(2);
tree.insert(8);
tree.insert(12);
tree.insert(18);

console.log("Initial Tree:");
printTree(tree.root);

tree.delete(5);

console.log("\nTree after deletion:");
printTree(tree.root);

tree.insert(5);

console.log("\nTree after re-insertion:");
printTree(tree.root);
