import './ContentEditor.css'
import React, { useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import Toolbar from '../Toolbar'

import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { actions as filesActions } from '../../state/slices/files-slice'
import { current } from '@reduxjs/toolkit'


const ContentEditor = () => {
  const params = useParams()
  const dispatch = useDispatch()

  const currentEditingElement = useRef(null)

  const { alias } = params

  const { file, fileContent, fetching } = useSelector(state => state.file)

  useEffect(() => {
    if (alias) {
      dispatch(filesActions.getPDFFileById(alias))
      dispatch(filesActions.getPDFFileContent(alias))
    }
  }, [alias])

  useEffect(() => {
    if (fileContent) {
      let lastEdited = null;

      const handleClick = (event) => {
        const clickedElement = event.target
        console.warn(clickedElement, currentEditingElement.current)

        if (currentEditingElement?.current && currentEditingElement.current.id !== clickedElement?.id) {
          currentEditingElement.current.contentEditable = false;
          currentEditingElement.current.blur();
          currentEditingElement.current.classList.remove('editing')
          currentEditingElement.current.classList.add('text-container')
        }
      }

      const handleDoubleClick = (event) => {
        const clickedElement = event.target;
        currentEditingElement.current = clickedElement
        const clickedElementClassArray = Array.from(clickedElement.classList)
        if (clickedElementClassArray.includes('text-container')) {
          console.log('Double-clicked:', clickedElement);

          // Clean up previous editable element
          if (lastEdited && lastEdited !== clickedElement) {
            lastEdited.contentEditable = false;
            lastEdited.classList.remove('editing');
            lastEdited.classList.add('text-container');
          }

          // Enable editing on clicked element
          clickedElement.contentEditable = true;
          clickedElement.focus();
          clickedElement.classList.add('editing');
          clickedElement.classList.remove('text-container');

          // Remember this element for future cleanup
          lastEdited = clickedElement;
        }
      };

      document.addEventListener('dblclick', handleDoubleClick);
      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('dblclick', handleDoubleClick);
        document.removeEventListener('click', handleClick);
      };
    }
  }, [fileContent]);


  return (
    <div className='main-area content-editor-container'>
      <Card className='content-editor-content'>
        {fileContent && <div className='file-content-container' dangerouslySetInnerHTML={{ __html: fileContent }} />}
        <Toolbar />
      </Card>
    </div>
  )
}

export default ContentEditor
