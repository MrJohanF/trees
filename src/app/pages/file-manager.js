'use client'

import { useState, useEffect } from 'react';
import { defaultFileSystem } from '../lib/fileSystem';

function FileSystemNode({ node, onDelete, onNavigate, currentPath }) {
    const fullPath = [...currentPath, node.name].join('/');
    return (
        <div style={{ marginLeft: '20px' }}>
            <span onClick={() => onNavigate(node, fullPath)}>
                {node.isDirectory ? '📁' : '📄'} {node.name}
            </span>
            <button onClick={() => onDelete(fullPath)}>Eliminar</button>
            {node.isDirectory && node.children.map((child, index) => (
                <FileSystemNode 
                    key={index} 
                    node={child} 
                    onDelete={onDelete} 
                    onNavigate={onNavigate}
                    currentPath={[...currentPath, node.name]}
                />
            ))}
        </div>
    );
}

export default function FileManager() {
    const [currentPath, setCurrentPath] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [isDirectory, setIsDirectory] = useState(false);
    const [, forceUpdate] = useState({});

    useEffect(() => {
        defaultFileSystem.createNode('documents/work/report.txt', false, 1024);
        defaultFileSystem.createNode('documents/personal/photos', true);
        defaultFileSystem.createNode('documents/personal/photos/vacation.jpg', false, 2048);
        forceUpdate({}); // Forzar re-render después de crear los nodos iniciales
    }, []);

    const getCurrentNode = () => {
        let current = defaultFileSystem.root;
        for (let name of currentPath) {
            current = current.children.find(child => child.name === name);
            if (!current) break; // Evitar errores si la ruta no existe
        }
        return current || defaultFileSystem.root;
    };

    const handleCreate = () => {
        if (newItemName) {
            const fullPath = [...currentPath, newItemName].join('/');
            defaultFileSystem.createNode(fullPath, isDirectory);
            setNewItemName('');
            setIsDirectory(false);
            forceUpdate({}); // Forzar re-render
        }
    };

    const handleDelete = (fullPath) => {
        if (defaultFileSystem.deleteNode(fullPath)) {
            forceUpdate({}); // Forzar re-render solo si la eliminación fue exitosa
        }
    };

    const handleNavigate = (node, fullPath) => {
        if (node.isDirectory) {
            setCurrentPath(fullPath.split('/').filter(Boolean));
        }
    };

    const handleBack = () => {
        setCurrentPath(prev => prev.slice(0, -1));
    };

    return (
        <div>
            <h1>Gestor de Archivos</h1>
            <p>Ruta actual: /{currentPath.join('/')}</p>
            <button onClick={handleBack} disabled={currentPath.length === 0}>Atrás</button>
            
            <h2>Contenido:</h2>
            
            <FileSystemNode 
                node={getCurrentNode()} 
                onDelete={handleDelete}
                onNavigate={handleNavigate}
                currentPath={currentPath}
            />

            <h2>Crear nuevo elemento:</h2>
            <input 
                type="text" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Nombre del nuevo elemento"
            />
            <label>
                <input 
                    type="checkbox" 
                    checked={isDirectory} 
                    onChange={(e) => setIsDirectory(e.target.checked)}
                />
                Es un directorio
            </label>
            <button onClick={handleCreate}>Crear</button>

            <h2>Estadísticas:</h2>
            <p>Altura del árbol: {defaultFileSystem.getHeight()}</p>
            <p>Número de nodos: {defaultFileSystem.countNodes()}</p>
            <p>Peso total: {defaultFileSystem.getWeight()} bytes</p>
        </div>
    );
}