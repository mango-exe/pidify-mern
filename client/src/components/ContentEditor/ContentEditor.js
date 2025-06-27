import './ContentEditor.css'
import React, { useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import Toolbar from '../Toolbar'

import { useParams } from 'react-router'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { actions as filesActions } from '../../state/slices/files-slice'
import { actions as contentEditorActions } from '../../state/slices/content-editor-slice'


const ContentEditor = () => {
  const params = useParams()
  const dispatch = useDispatch()

  const { alias } = params

  const { workingElementId, actionType } = useSelector(state => state.contentEditor, shallowEqual)
  const { fileContent } = useSelector(state => state.file)

  const pageInViewport = useRef(null)

  useEffect(() => {
    if (alias) {
      dispatch(filesActions.getPDFFileById(alias))
      dispatch(filesActions.getPDFFileContent(alias))
    }
  }, [alias])


  const container = document.getElementById('page-container')

  useEffect(() => {
    if (!container) return

    const children = Array.from(container.children)
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0
        let maxIndex = null

        entries.forEach((entry) => {
          const index = children.indexOf(entry.target)
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            maxIndex = index
          }
        })

        pageInViewport.current = children[maxIndex]
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    )

    children.forEach((child) => observer.observe(child))

  }, [container])

  useEffect(() => {
    if (fileContent && pageInViewport) {

      const handleClick = (event) => {
        const clickedElement = event.target
        const currentEditingElement = document.getElementById(workingElementId)

        if (actionType === 'EDIT_TEXT_ELEMENT' && currentEditingElement && pageInViewport.current.contains(clickedElement)) {

          if (clickedElement.id !== currentEditingElement.id) {
            currentEditingElement.contentEditable = false
            currentEditingElement.blur()
            currentEditingElement.classList.remove('editing')
            currentEditingElement.classList.add('text-container')
          }

          if (!currentEditingElement.textContent && pageInViewport.current.contains(currentEditingElement)) {
            pageInViewport.current.removeChild(currentEditingElement)
          }

          dispatch(contentEditorActions.unsetWorkingElement())
        }
      }

      const handleDoubleClick = (event) => {
        const clickedElement = event.target

        if (!clickedElement.hasAttribute('element-supports')) return
        if (clickedElement.getAttribute('element-supports') !== 'editing') return

        if (clickedElement.textContent) {

          const lastEditingElement = document.getElementById(workingElementId)

          // Clean up previous editable element
          if (lastEditingElement && lastEditingElement.id !== clickedElement.id) {
            lastEditingElement.contentEditable = false
            lastEditingElement.classList.remove('editing')
            lastEditingElement.classList.add('text-container')

            const existingButton = lastEditingElement.querySelector('.close-edit-button')
            if (existingButton) existingButton.remove()

            dispatch(contentEditorActions.unsetWorkingElement())
          }

          clickedElement.contentEditable = true
          clickedElement.focus()
          clickedElement.classList.add('editing')
          clickedElement.classList.remove('text-container')
          dispatch(contentEditorActions.setWorkingElement({ workingElementId: clickedElement.id, actionType: 'EDIT_TEXT_ELEMENT' }))
          // Remove existing button if any
        }
      }

      document.addEventListener('dblclick', handleDoubleClick)
      document.addEventListener('click', handleClick)
      return () => {
        document.removeEventListener('dblclick', handleDoubleClick)
        document.removeEventListener('click', handleClick)
      }
    }
  }, [fileContent, workingElementId])


  return (
    <div className='main-area content-editor-container'>
      <Card className='content-editor-content'>
        {fileContent && <div className='file-content-container' dangerouslySetInnerHTML={{ __html: fileContent }} />}
        <Toolbar pageInViewport={pageInViewport} />
      </Card>
    </div>
  )
}

export default ContentEditor
