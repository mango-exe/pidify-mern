import React, { useState, useEffect } from 'react'
import { FaImage, FaTextHeight } from 'react-icons/fa'
import TextElement from './TextElement'
import './Toolbar.css'
import TextElementToolbar from './TextElementToolbar'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { actions as contentEditorActions, contentEditorActionTypes } from '../../state/slices/content-editor-slice'

import { v4 as uuidv4 } from 'uuid'

const Toolbar = ({ pageInViewport }) => {
  const dispatch = useDispatch()

  const { workingElementId, actionType } = useSelector(state => state.contentEditor, shallowEqual)

  const handleAddNewTextElement = () => {
    if (!pageInViewport.current) return
    dispatch(contentEditorActions.setWorkingElement({ workingElementId: uuidv4(), actionType: 'ADD_TEXT_ELEMENT' }))
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
      {workingElementId && (actionType === contentEditorActionTypes.ADD_TEXT_ELEMENT) && <TextElement pageInViewport={pageInViewport} />}
      {pageInViewport.current && <TextElementToolbar />}
    </>
  )
}

export default Toolbar
