// lib/fileSystem.js

class FileNode {
  constructor(name, isDirectory, size = 0) {
    this.name = name;
    this.isDirectory = isDirectory;
    this.size = size;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
  }
}

export class FileSystem {
  constructor() {
    this.root = new FileNode("root", true);
  }


  // 1. Función para devolver la altura de un árbol
  getHeight(node = this.root) {
    if (!node) {
      return 0;
    }
    if (!node.isDirectory || node.children.length === 0) {
      return 1;
    }
    return 1 + Math.max(...node.children.map((child) => this.getHeight(child)));
  }

  // 2. Algoritmo para calcular el número de nodos
  countNodes(node = this.root) {
    if (!node) {
      return 0;
    }
    return (
      1 + node.children.reduce((sum, child) => sum + this.countNodes(child), 0)
    );
  }

  // 3. Algoritmo para devolver el peso de un árbol
  getWeight(node = this.root) {
    if (!node) {
      return 0;
    }
    if (!node.isDirectory) {
      return node.size;
    }
    return node.children.reduce((sum, child) => sum + this.getWeight(child), 0);
  }

  // 4. Función para comprobar si dos árboles son similares
  areSimilar(tree1 = this.root, tree2) {
    if (!tree1 && !tree2) {
      return true;
    }
    if (!tree1 || !tree2 || tree1.isDirectory !== tree2.isDirectory) {
      return false;
    }
    if (tree1.children.length !== tree2.children.length) {
      return false;
    }
    for (let i = 0; i < tree1.children.length; i++) {
      if (!this.areSimilar(tree1.children[i], tree2.children[i])) {
        return false;
      }
    }
    return true;
  }

  // Funciones adicionales para gestión de archivos
  createNode(path, isDirectory, size = 0) {
    const parts = path.split("/").filter(Boolean);
    let current = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let child = current.children.find((c) => c.name === part);

      if (!child) {
        child = new FileNode(part, i < parts.length - 1 || isDirectory, size);
        current.addChild(child);
      }

      current = child;
    }

    return current;
  }

   // Función deleteNode mejorada
   deleteNode(path) {
    const parts = path.split("/").filter(Boolean);
    let current = this.root;
    let parent = null;
  
    // Si la ruta comienza con 'root', la eliminamos
    if (parts[0] === 'root') {
      parts.shift();
    }
  
    for (let i = 0; i < parts.length; i++) {
      parent = current;
      current = current.children.find(c => c.name === parts[i]);
      if (!current) {
        console.log(`Nodo no encontrado: ${parts[i]} en la ruta ${path}`);
        return false;
      }
    }
  
    const index = parent.children.findIndex(c => c === current);
    if (index === -1) {
      console.log(`Nodo no encontrado en los hijos del padre: ${current.name}`);
      return false;
    }
  
    parent.children.splice(index, 1);
    console.log(`Nodo eliminado: ${current.name}`);
    return true;
  }

  moveNode(sourcePath, destPath) {
    const node = this.deleteNode(sourcePath);
    if (node) {
      this.createNode(destPath + "/" + node.name, node.isDirectory, node.size);
      return true;
    }
    return false;
  }


}

// Crea y exporta una instancia por defecto
export const defaultFileSystem = new FileSystem();
