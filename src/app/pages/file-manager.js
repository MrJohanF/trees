'use client'

import { useState, useEffect } from 'react';
import { defaultFileSystem } from '../lib/fileSystem';

function FileSystemNode({ node, onDelete, onNavigate, currentPath }) {
    const fullPath = [...currentPath, node.name].join('/');
    const isSelected = false; // Puedes implementar la selección si lo deseas

    return (
        <div 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '5px',
                backgroundColor: isSelected ? '#e6f3ff' : 'transparent',
                cursor: 'pointer'
            }}
            onClick={() => onNavigate(node, fullPath)}
        >
            <span style={{ marginRight: '10px' }}>
                {node.isDirectory ? '📁' : '📄'}
            </span>
            <span style={{ flexGrow: 1 }}>{node.name}</span>
            <span style={{ marginRight: '20px' }}>
                {new Date().toLocaleDateString()} {/* Usamos la fecha actual como ejemplo */}
            </span>
            <span>{node.isDirectory ? '' : `${node.size} KB`}</span>
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(fullPath);
                }}
                style={{ marginLeft: '10px' }}
            >
                Eliminar
            </button>
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
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0' }}>
                <button onClick={handleBack} disabled={currentPath.length === 0}>⬅️ Back</button>
                <span style={{ marginLeft: '20px' }}>/{currentPath.join('/')}</span>
            </div>
            
            <div style={{ display: 'flex' }}>
                <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc' }}>
                    {/* Aquí puedes agregar una vista de árbol si lo deseas */}
                    <div>Files</div>
                    <div>Documents</div>
                    <div>Downloads</div>
                    <div>Music</div>
                    <div>Pictures</div>
                    <div>Videos</div>
                </div>
                
                <div style={{ flexGrow: 1, padding: '10px' }}>
                    <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #ccc', padding: '5px' }}>
                        <span style={{ flexGrow: 1 }}>Name</span>
                        <span style={{ width: '150px' }}>Modified</span>
                        <span style={{ width: '100px' }}>Size</span>
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

            <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
                <input 
                    type="text" 
                    value={newItemName} 
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="New item name"
                />
                <label style={{ marginLeft: '10px' }}>
                    <input 
                        type="checkbox" 
                        checked={isDirectory} 
                        onChange={(e) => setIsDirectory(e.target.checked)}
                    />
                    Directory
                </label>
                <button onClick={handleCreate} style={{ marginLeft: '10px' }}>Create</button>
            </div>
        </div>
    );
}