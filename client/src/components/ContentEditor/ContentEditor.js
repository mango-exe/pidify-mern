import './ContentEditor.css'
import React, { useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import Toolbar from '../Toolbar'

import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { actions as filesActions } from '../../state/slices/files-slice'


const ContentEditor = () => {
  const params = useParams()
  const dispatch = useDispatch()

  const currentEditingElement = useRef(null)

  const { alias } = params

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
      let lastEdited = null

      const handleClick = (event) => {
        const clickedElement = event.target

        if (!clickedElement.hasAttribute('element-supports') || clickedElement.getAttribute('element-supports') !== 'editing') {
          return
        }


        if (currentEditingElement?.current && lastEdited?.id && currentEditingElement.current.id !== clickedElement?.id) {
          currentEditingElement.current.contentEditable = false
          currentEditingElement.current.blur()
          currentEditingElement.current.classList.remove('editing')
          currentEditingElement.current.classList.add('text-container')

          if (!currentEditingElement.current.textContent && pageInViewport.current.contains(currentEditingElement.current)) {
            console.warn(currentEditingElement.current)
            pageInViewport.current.removeChild(currentEditingElement.current)
          }
          currentEditingElement.current = null
        }
      }

      const handleDoubleClick = (event) => {
        const clickedElement = event.target

        if (!clickedElement.hasAttribute('element-supports')) return
        if (clickedElement.getAttribute('element-supports') !== 'editing') return

        currentEditingElement.current = clickedElement
        const clickedElementClassArray = Array.from(clickedElement.classList)
        if (clickedElementClassArray.includes('text-container') && clickedElement.textContent) {

          // Clean up previous editable element
          if (lastEdited && lastEdited !== clickedElement) {
            lastEdited.contentEditable = false
            lastEdited.classList.remove('editing')
            lastEdited.classList.add('text-container')
          }

          // Enable editing on clicked element
          clickedElement.contentEditable = true
          clickedElement.focus()
          clickedElement.classList.add('editing')
          clickedElement.classList.remove('text-container')

          // Remember this element for future cleanup
          lastEdited = clickedElement
        }
      }

      document.addEventListener('dblclick', handleDoubleClick)
      document.addEventListener('click', handleClick)

      return () => {
        document.removeEventListener('dblclick', handleDoubleClick)
        document.removeEventListener('click', handleClick)
      }
    }
  }, [fileContent])


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
