import React from 'react';
import './Toolbar.css';

const Toolbar = () => {
  const tools = [
    {
      id: 'text',
      label: 'Text',
      onClick: () => alert('Text Tool Selected')
    },
    {
      id: 'image',
      label: 'Image',
      onClick: () => alert('Image Tool Selected')
    },
    {
      id: 'font',
      label: 'Font Style',
      onClick: () => alert('Font Style Tool Selected')
    }
  ];

  return (
    <div className="toolbar">
      {tools.map(tool => (
        <button
          key={tool.id}
          className="toolbar-button"
          title={tool.label}
          onClick={tool.onClick}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
