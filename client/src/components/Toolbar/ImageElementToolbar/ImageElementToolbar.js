import React, { useEffect, useState } from 'react'
import './ImageElementToolbar.css'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { contentEditorActionTypes, actions as contentEditorActions } from '../../../state/slices/content-editor-slice'

const ImageElementToolbar = () => {
  const [imageElement, setImageElement] = useState(null)
  const [showImageElementToolbar, setShowImageElementToolbar] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [zIndex, setZIndex] = useState(100)
  const { workingElementId, actionType } = useSelector(state => state.contentEditor, shallowEqual)

  const dispatch = useDispatch()

  useEffect(() => {
    if (
      workingElementId &&
      (actionType === contentEditorActionTypes.ADD_IMAGE_ELEMENT ||
        actionType === contentEditorActionTypes.EDIT_IMAGE_ELEMENT) &&
      imageElement
    ) {
      setShowImageElementToolbar(true)
    } else {
      setShowImageElementToolbar(false)
    }
  }, [workingElementId, actionType, imageElement])

  useEffect(() => {
    if (workingElementId) {
      const observer = new MutationObserver((mutationsList, observer) => {
        const element = document.getElementById(workingElementId)
        if (element) {
          setImageElement(element)
          const computedStyle = window.getComputedStyle(element)
          setOpacity(Math.round(parseFloat(computedStyle.opacity) * 100))
          setZIndex(parseInt(computedStyle.zIndex) || 100)
          observer.disconnect()
        }
      })

      const pagesContainer = document.getElementById('page-container')

      observer.observe(pagesContainer, {
        childList: true,
        subtree: true
      })
    }
  }, [workingElementId])

  useEffect(() => {
    if (workingElementId) {
      const element = document.getElementById(workingElementId)
      if (element) {
        setImageElement(element)
        const computedStyle = window.getComputedStyle(element)
        setOpacity(Math.round(parseFloat(computedStyle.opacity) * 100))
        setZIndex(parseInt(computedStyle.zIndex) || 100)
      }
    }
  }, [workingElementId])

  const exec = (command, value = null) => {
    if (!imageElement) return

    switch (command) {
      case 'setOpacity':
        imageElement.style.opacity = value / 100
        break
      case 'setZIndex':
        imageElement.style.zIndex = value
        setZIndex(value)
        break
      default:
        console.warn('Unknown command:', command)
    }
  }

  const handleDelete = () => {
    if (imageElement && imageElement.parentNode) {
      imageElement.parentNode.removeChild(imageElement)
      setImageElement(null)
      setShowImageElementToolbar(false)
      dispatch(contentEditorActions.unsetWorkingElement())
    }
  }

  return (
    showImageElementToolbar ? (
      <div className='image-toolbar'>
        <label>
          Opacity: {opacity}%
          <input
            type='range'
            min='0'
            max='100'
            value={opacity}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setOpacity(val)
              exec('setOpacity', val)
            }}
          />
        </label>

        <div className='z-index-controls-container'>
          <label>
            Z-Index:
            <input
              type='number'
              min='0'
              value={zIndex}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                if (!isNaN(val)) {
                  exec('setZIndex', val)
                }
              }}
            />
          </label>
        </div>

        <button className='delete-button' onClick={handleDelete}>
          Delete Image
        </button>
      </div>
    ) : null
  )
}

export default ImageElementToolbar
