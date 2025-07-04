import './ContentEditor.css'
import React, { useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import Toolbar from '../Toolbar'

import { useParams } from 'react-router'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { actions as filesActions } from '../../state/slices/files-slice'
import { actions as contentEditorActions, contentEditorActionTypes } from '../../state/slices/content-editor-slice'

const ContentEditor = () => {
  const params = useParams()
  const dispatch = useDispatch()

  const { alias } = params

  const { actionType } = useSelector(state => state.contentEditor, shallowEqual)
  const { fileContent } = useSelector(state => state.file)

  const pageInViewport = useRef(null)

  useEffect(() => {
    if (alias) {
      dispatch(filesActions.getPDFFileById(alias))
      dispatch(filesActions.getPDFFileContent(alias))
    }
  }, [alias, dispatch])

  useEffect(() => {
    if (!fileContent) return

    const container = document.getElementById('page-container')
    if (!container) {
      return
    }

    const children = Array.from(container.children)
    if (!children.length) {
      return
    }

    const handleScroll = () => {
      const viewportCenterY = window.innerHeight / 2

      let found = null

      for (const child of children) {
        const rect = child.getBoundingClientRect()
        if (rect.top <= viewportCenterY && rect.bottom >= viewportCenterY) {
          found = child
          break
        }
      }

      if (found && pageInViewport.current !== found) {
        pageInViewport.current = found
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [fileContent])


  useEffect(() => {
    if (!fileContent) return

    const handleClick = (event) => {
      if (
        actionType === contentEditorActionTypes.EDIT_TEXT_ELEMENT &&
        pageInViewport.current?.contains(event.target)
      ) {
        dispatch(contentEditorActions.cancelEditingElement({
          actionType: contentEditorActionTypes.CANCEL_EDITING
        }))
      }
    }

    const handleDoubleClick = (event) => {
      const clickedElement = event.target

      if (!clickedElement.hasAttribute('element-supports')) return
      if (clickedElement.getAttribute('element-supports') !== 'editing') return
      dispatch(contentEditorActions.setWorkingElement({
        workingElementId: clickedElement.id,
        actionType: contentEditorActionTypes.EDIT_TEXT_ELEMENT
      }))
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('dblclick', handleDoubleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [fileContent, actionType, dispatch])

  return (
    <div className='main-area content-editor-container'>
      <Card className='content-editor-content'>
        {fileContent && (
          <div
            className='file-content-container'
            dangerouslySetInnerHTML={{ __html: fileContent }}
          />
        )}
        <Toolbar pageInViewport={pageInViewport} />
      </Card>
    </div>
  )
}

export default ContentEditor
