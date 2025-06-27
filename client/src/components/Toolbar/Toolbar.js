import React, { useRef, useEffect, useState } from 'react'
import { FaImage, FaTextHeight } from 'react-icons/fa'
import TextElement from './TextElement'
import './Toolbar.css'
import TextElementToolbar from './TextElementToolbar'

const Toolbar = ({ pageInViewport }) => {
  const [isAddingTextElement, setIsAddingTextElement] = useState()


  const handleAddNewTextElement = () => {
    if (!pageInViewport.current) return
    setIsAddingTextElement(true)
  }

  const handleRemoveNewTextElement = () => {
    setIsAddingTextElement(false)
  }



  const tools = [
    {
      id: 'text',
      label: 'Add text',
      icon: <FaTextHeight />,
      onClick: handleAddNewTextElement
    },
    {
      id: 'image',
      label: 'Add image',
      icon: <FaImage />,
      onClick: () => {} // placeholder
    }
  ]


  return (
    <>
      <div className='toolbar'>
        {tools.map((tool) => (
          <button
            key={tool.id}
            className='toolbar-button'
            title={tool.label}
            onClick={tool.onClick}
          >
            <span className='label'>{tool.label}</span>
            <span className='icon'>{tool.icon}</span>
          </button>
        ))}
      </div>
      {pageInViewport.current && isAddingTextElement && <TextElement pageInViewport={pageInViewport} onRemoveNewTextElement={handleRemoveNewTextElement} />}
      {pageInViewport.current && <TextElementToolbar />}
    </>
  )
}

export default Toolbar
