import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiSearch, FiPlus } from 'react-icons/fi';
import { useRegistryStore } from '../state/registryStore';
import { useWorkflowStore } from '../state/workflowStore';
import { nanoid } from 'nanoid';
import './LeftSidebar.css';

function LeftSidebar({ width, onWidthChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const initialWidth = useRef(0);

  const categories = useRegistryStore((state) => state.categories);
  const getNodesByCategory = useRegistryStore((state) => state.getNodesByCategory);
  const searchNodes = useRegistryStore((state) => state.searchNodes);
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    initialWidth.current = width;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.max(200, Math.min(500, initialWidth.current + delta));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, width, onWidthChange]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (e, nodeDefinition) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'node-add', nodeDefinition })
    );
  };

  const handleNodeClick = (nodeDefinition) => {
    const newNode = {
      id: nanoid(),
      type: nodeDefinition.type,
      data: { ...nodeDefinition.defaultData },
      position: { x: 100, y: 100 },
      width: 200,
      height: 100,
    };
    addNode(newNode);
  };

  return (
    <div className="ares-sidebar-left" style={{ width: `${width}px` }}>
      <div className="sidebar-header">
        <h3>Node Library</h3>
      </div>

      <div className="sidebar-search">
        <FiSearch size={16} />
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-content">
        {searchQuery ? (
          <div className="search-results">
            {searchNodes(searchQuery).length === 0 ? (
              <p className="no-results">No nodes found</p>
            ) : (
              searchNodes(searchQuery).map((nodeDefinition) => (
                <div
                  key={nodeDefinition.type}
                  className="node-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeDefinition)}
                  onClick={() => handleNodeClick(nodeDefinition)}
                >
                  <div className="node-icon">{nodeDefinition.icon || '◼'}</div>
                  <div className="node-info">
                    <div className="node-name">{nodeDefinition.name}</div>
                    <div className="node-category">{nodeDefinition.category}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          categories.map((category) => {
            const nodes = getNodesByCategory(category);
            const isExpanded = expandedCategories[category] !== false;

            return (
              <div key={category} className="category-group">
                <div
                  className="category-header"
                  onClick={() => toggleCategory(category)}
                >
                  <FiChevronDown
                    size={16}
                    className={isExpanded ? 'expanded' : ''}
                  />
                  <span>{category}</span>
                  <span className="node-count">{nodes.length}</span>
                </div>

                {isExpanded && (
                  <div className="category-content">
                    {nodes.length === 0 ? (
                      <p className="empty-category">No nodes in this category</p>
                    ) : (
                      nodes.map((nodeDefinition) => (
                        <div
                          key={nodeDefinition.type}
                          className="node-item"
                          draggable
                          onDragStart={(e) => handleDragStart(e, nodeDefinition)}
                          onClick={() => handleNodeClick(nodeDefinition)}
                          title={nodeDefinition.description}
                        >
                          <div className="node-icon">{nodeDefinition.icon || '◼'}</div>
                          <div className="node-info">
                            <div className="node-name">{nodeDefinition.name}</div>
                            <div className="node-type">{nodeDefinition.type}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="sidebar-footer">
        <button className="btn-secondary" title="Create custom node">
          <FiPlus size={16} /> Custom Node
        </button>
      </div>

      <div
        className="ares-sidebar-left-handle"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default LeftSidebar;
