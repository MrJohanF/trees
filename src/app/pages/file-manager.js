"use client";

import { useState, useEffect } from "react";
import { defaultFileSystem } from "../lib/fileSystem";

function FileSystemNode({ node, onDelete, onNavigate, currentPath }) {
  const fullPath = Array.isArray(currentPath)
    ? [...currentPath, node.name]
    : [node.name];
  const isSelected = false;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        backgroundColor: isSelected ? "#6832a8" : "transparent",
        cursor: "pointer",
      }}
      onClick={() => onNavigate(fullPath)}
    >
      <span style={{ marginRight: "10px" }}>
        {node.isDirectory ? "📁" : "📄"}
      </span>
      <span style={{ flexGrow: 1 }}>{node.name}</span>
      <span style={{ marginRight: "20px" }}>
        {new Date().toLocaleDateString()}
      </span>
      <span>{node.isDirectory ? "" : `${node.size} KB`}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(fullPath);
        }}
        style={{ marginLeft: "10px" }}
      >
        Eliminar
      </button>
    </div>
  );
}

function FileTreeView({
  node,
  onNavigate,
  currentPath,
  isRoot = false,
  nodePath = [],
}) {
  const [isExpanded, setIsExpanded] = useState(isRoot);

  const fullPath = isRoot ? [] : [...nodePath, node.name];

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleClick = () => {
    onNavigate(fullPath);
  };

  // Revisar si el nodo actual es el directorio actual
  const isCurrentDirectory =
    JSON.stringify(fullPath) === JSON.stringify(currentPath);

  if (!node.isDirectory && !isRoot) {
    return null;
  }

  return (
    <div style={{ marginLeft: isRoot ? "0" : "20px" }}>
      <span
        onClick={handleClick}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 5px",
          backgroundColor: isCurrentDirectory ? "#007bff" : "transparent",
          color: isCurrentDirectory ? "white" : "inherit",
          borderRadius: "3px",
        }}
      >
        <span
          onClick={handleToggle}
          style={{ marginRight: "5px", cursor: "pointer" }}
        >
          {isExpanded ? "▼" : "▶"}
        </span>
        📁 {node.name}
      </span>

      {isExpanded && (
        <div>
          {node.children
            .filter((child) => child.isDirectory)
            .map((child, index) => (
              <FileTreeView
                key={index}
                node={child}
                onNavigate={onNavigate}
                currentPath={currentPath}
                nodePath={fullPath}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [isDirectory, setIsDirectory] = useState(false);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    defaultFileSystem.createNode("documents/work/report.txt", false, 1024);
    defaultFileSystem.createNode("documents/personal/photos", true);
    defaultFileSystem.createNode(
      "documents/personal/photos/vacation.jpg",
      false,
      2048
    );
    forceUpdate({}); // Forzar re-render después de crear los nodos iniciales
  }, []);

  const getCurrentNode = () => {
    let current = defaultFileSystem.root;
    for (let name of currentPath) {
      current = current.children.find((child) => child.name === name);
      if (!current) break;
    }
    return current || defaultFileSystem.root;
  };

  const handleCreate = () => {
    if (newItemName) {
      const fullPath = [...currentPath, newItemName].join("/");
      defaultFileSystem.createNode(fullPath, isDirectory);
      setNewItemName("");
      setIsDirectory(false);
      forceUpdate({}); // Forzar re-render
    }
  };

  const handleDelete = (fullPath) => {
    if (defaultFileSystem.deleteNode(fullPath.join("/"))) {
      forceUpdate({}); // Forzar re-render solo si se elimina el nodo
    }
  };

  const handleNavigate = (newPath) => {
    setCurrentPath(newPath);
  };

  const handleBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1));
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#e4e1e8",
        }}
      >
        <button onClick={handleBack} disabled={currentPath.length === 0}>
          ⬅️ Back
        </button>
        <span style={{marginLeft: "20px", color: "black" }}>/{currentPath.join("/")}</span>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "200px",
            height: "20rem",
            padding: "10px",
            borderRight: "1px solid #ccc",
          }}
        >
          <FileTreeView
            node={defaultFileSystem.root}
            onNavigate={handleNavigate}
            currentPath={currentPath}
            isRoot={true}
          />
        </div>

        <div style={{ flexGrow: 1, padding: "10px" }}>
          <div
            style={{
              display: "flex",
              fontWeight: "bold",
              borderBottom: "1px solid #ccc",
              padding: "5px",
            }}
          >
            <span style={{ flexGrow: 1 }}>Name</span>
            <span style={{ width: "150px" }}>Modified</span>
            <span style={{ width: "100px" }}>Size</span>
          </div>
          {getCurrentNode().children.map((child, index) => (
            <FileSystemNode
              key={index}
              node={child}
              onDelete={handleDelete}
              onNavigate={handleNavigate}
              currentPath={currentPath}
            />
          ))}
        </div>
      </div>

      <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
        />
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={isDirectory}
            onChange={(e) => setIsDirectory(e.target.checked)}
          />
          Directory
        </label>
        <button onClick={handleCreate} style={{ marginLeft: "10px" }}>
          Create
        </button>
      </div>
    </div>
  );
}
