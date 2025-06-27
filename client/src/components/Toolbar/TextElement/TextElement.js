import './TextElement.css'
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Rnd } from 'react-rnd'
import { v4 as uuidv4 } from 'uuid'
import { actions as contentEditorActions } from '../../../state/slices/content-editor-slice'
import { useDispatch } from 'react-redux'

const TextElement = ({ pageInViewport, onRemoveNewTextElement }) => {
  const dispatch = useDispatch()

  const rndRef = useRef(null)
  const inputRef = useRef(null)



  const [showAddTextElement, setShowAddTextElement] = useState(false)

  const MIN_ELEMENT_WIDTH = 150
  const PADDING_RIGHT_TEXT = 10

  const pageInViewportBounds = pageInViewport.current.getBoundingClientRect()

  useEffect(() => {
    if (showAddTextElement) {
      dispatch(contentEditorActions.setWorkingElement({ workingElementId: inputRef.current.id, type: 'ADD_TEXT_ELEMENT' }))
    }
  }, [showAddTextElement])

  useEffect(() => {
    if (pageInViewport) {
      setShowAddTextElement(true)
    }
  }, [pageInViewport])

  const handleSaveTextElement = () => {
    const newTextElement = inputRef.current.cloneNode(true)
    newTextElement.classList.remove('text-element-container')
    newTextElement.classList.remove('text-element-input')
    newTextElement.classList.add('text-container')
    newTextElement.style.position = 'absolute'
    newTextElement.style.left = inputRef.current.style.left
    newTextElement.style.top = inputRef.current.top
    const { width, height } = inputRef.current.getBoundingClientRect()
    newTextElement.style.width = `${width}px`
    newTextElement.style.height = `${height}px`
    newTextElement.style.display = 'block'
    newTextElement.setAttribute('element-supports', 'editing')
    newTextElement.contentEditable = false

    if (pageInViewport.current) {
      pageInViewport.current.appendChild(newTextElement)
    }

    if (pageInViewport.current) {
      pageInViewport.current.appendChild(newTextElement)
    }

    inputRef.current = null
    handleRemoveNewElement()
  }

  const handleInputResize = (e) => {
    const editableDiv = e.target

    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    span.style.whiteSpace = 'pre'
    span.style.paddingLeft = '0.3em'
    span.style.paddingRight = '0.3em'
    span.style.font = getComputedStyle(editableDiv).font
    span.innerText = editableDiv.textContent || ''
    document.body.appendChild(span)

    let updatedWidth

    const inputCurrentWidth = inputRef.current.getBoundingClientRect().width
    if (inputCurrentWidth > span.offsetWidth + PADDING_RIGHT_TEXT) {
      updatedWidth = inputCurrentWidth
    } else if (inputRef.current.style.width < MIN_ELEMENT_WIDTH) {
      updatedWidth =  MIN_ELEMENT_WIDTH
    } else {
      updatedWidth = span.offsetWidth + PADDING_RIGHT_TEXT
    }

    editableDiv.style.width = updatedWidth + 'px'
    document.body.removeChild(span)

    rndRef.current?.updateSize(
      updatedWidth + PADDING_RIGHT_TEXT,
      editableDiv.offsetHeight
    )
  }

  const handleRemoveNewElement = () => {
    setShowAddTextElement(false)
    onRemoveNewTextElement()
    inputRef.current = null
    dispatch(contentEditorActions.unsetWorkingElement())
  }

  return (
    <>
      {showAddTextElement && pageInViewport?.current &&
        ReactDOM.createPortal(
          <Rnd
            ref={rndRef}
            enableResizing={{ left: true, right: true }}
            onResizeStop={(e, direction, ref, delta, position) => {
              inputRef.current.style.width = `${ref.offsetWidth - PADDING_RIGHT_TEXT}px`
              inputRef.current.style.height = `${ref.offsetHeight}px`
            }}
            onDragStop={(e, d) => {
              inputRef.current.style.left = `${d.x}px`
              inputRef.current.style.top = `${d.y}px`
            }}
            default={{
              x: pageInViewportBounds.width / 2 - 75,
              y: pageInViewportBounds.height / 2 - 25,
              width: MIN_ELEMENT_WIDTH
            }}
            bounds='parent'
            className='text-element-container'
          >
            <div className='text-element-content'>
              <div className='buttons-container'>
                <button onClick={handleRemoveNewElement}>-</button>
                <button onClick={handleSaveTextElement} disabled={!inputRef?.current?.textContent}>＋</button>
              </div>
              <div
                ref={inputRef}
                id={uuidv4()}
                contentEditable
                className='text-element-input'
                onInput={(e) => {
                  handleInputResize?.(e)
                }}
              />
            </div>
          </Rnd>,
          pageInViewport.current
        )
      }
    </>
  )
}

export default TextElement
