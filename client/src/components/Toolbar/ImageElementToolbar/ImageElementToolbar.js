import React, { useEffect, useState } from 'react'
import './ImageElementToolbar.css'
import { shallowEqual, useSelector } from 'react-redux'
import { contentEditorActionTypes } from '../../../state/slices/content-editor-slice'

const ImageElementToolbar = () => {
  const [imageElement, setImageElement] = useState(null)
  const [showImageElementToolbar, setShowImageElementToolbar] = useState(false)
  const [opacity, setOpacity] = useState(100) // default full opacity

  const { workingElementId, actionType } = useSelector(state => state.contentEditor, shallowEqual)

  useEffect(() => {
    if (workingElementId && actionType === contentEditorActionTypes.ADD_IMAGE_ELEMENT && imageElement) {
      setShowImageElementToolbar(true)
    } else {
      setShowImageElementToolbar(false)
    }
  }, [workingElementId, actionType])

  useEffect(() => {
    if (workingElementId) {
      const observer = new MutationObserver((mutationsList, observer) => {
        const element = document.getElementById(workingElementId)
        if (element) {
          setImageElement(element)
          const currentOpacity = parseFloat(window.getComputedStyle(element).opacity)
          setOpacity(Math.round(currentOpacity * 100))
          observer.disconnect()
        }
      })
      const pagesContainer = document.getElementById('page-container')

      observer.observe(pagesContainer, {
        childList: true,
        subtree: true
      })

      // return () => observer.disconnect()
    }
  }, [workingElementId, imageElement])

  // useEffect(() => {
  //   if (workingElementId) {
  //     const element = document.getElementById(workingElementId)
  //     if (element) {
  //       setImageElement(element)
  //       const currentOpacity = parseFloat(window.getComputedStyle(element).opacity)
  //       setOpacity(Math.round(currentOpacity * 100))
  //     } else {
  //       setImageElement(null)
  //     }
  //   } else {
  //     setImageElement(null)
  //   }
  // }, [workingElementId])

  const exec = (command, value = null) => {
    if (!imageElement) return

    switch (command) {
      case 'setOpacity':
        imageElement.style.opacity = value / 100
        break
      default:
        console.warn('Unknown command:', command)
    }
  }

  return (
    showImageElementToolbar ? (
      <div className='text-toolbar'>
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
      </div>
    ) : null
  )
}

export default ImageElementToolbar
