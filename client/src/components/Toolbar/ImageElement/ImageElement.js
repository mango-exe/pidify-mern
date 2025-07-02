import './ImageElement.css'
import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Rnd } from 'react-rnd'
import { actions as contentEditorActions } from '../../../state/slices/content-editor-slice'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

const ImageElement = ({ pageInViewport }) => {
  const IMAGE_ELEMENT_WIDTH = 150
  const IMAGE_ELEMENT_HEIGHT = 150

  const [selectedImage, setSelectedImage] = useState(null)
  const [imageDimensions, setImageDimensions] = useState({ width: `${IMAGE_ELEMENT_WIDTH}px`, height: `${IMAGE_ELEMENT_HEIGHT}px`, x: 0, y: 0 })
  const dispatch = useDispatch()

  const clickTriggeredRef = useRef(null)
  const rndRef = useRef(null)
  const inputRef = useRef(null)
  const imageRef = useRef(null)

  const { workingElementId } = useSelector(state => state.contentEditor, shallowEqual)


  const pageInViewportBounds = pageInViewport.current.getBoundingClientRect()

  useEffect(() => {
    if (inputRef.current && !clickTriggeredRef.current) {
      inputRef.current.click()
      document.body.onfocus = handleCheckEmptyUpload
      clickTriggeredRef.current = true
    }
  }, [pageInViewport])

  const handleCheckEmptyUpload = () => {
    if (!inputRef.current.files.length) {
      dispatch(contentEditorActions.unsetWorkingElement())
    }
    document.body.onfocus = null
  }

  const getBase64URI = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = function(event) {
          resolve(event.target.result)
      }

      reader.onerror = function(error) {
          reject(error)
      }

      reader.readAsDataURL(file)
    })
  }

  const handleBrowserSelectImage = async (evt) => {
     console.warn(evt)
     try {
      const file = evt.target.files[0]
      if (!file) return

      const imageSrc = await getBase64URI(file)
      inputRef.current.style.display = 'none'

      setSelectedImage({ src: imageSrc, name: file.name })
    } catch (e) {
      console.warn(e)
    }
  }

  const handleSaveImageElement = () => {
    // Create a container for image + button
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = `${imageDimensions.x}px`
    container.style.top = `${imageDimensions.y}px`
    container.style.width = imageDimensions.width
    container.style.height = imageDimensions.height
    container.classList.add('image-container')
    container.setAttribute('element-supports', 'editing')
    container.style.userSelect = 'none'
    container.style.cursor = 'default'
    container.style.boxSizing = 'border-box'
    container.style.border = '1px solid transparent'
    container.style.display = 'inline-block'

    // Create the image
    const imgElement = document.createElement('img')
    imgElement.id = workingElementId
    imgElement.src = selectedImage.src
    imgElement.style.width = '100%'
    imgElement.style.height = '100%'
    imgElement.style.display = 'block'
    imgElement.style.pointerEvents = 'none'
    imgElement.style.opacity = imageRef.current.style.opacity

    const removeImageButton = document.createElement('button')
    removeImageButton.textContent = '×'
    removeImageButton.classList.add('remove-button')

    removeImageButton.addEventListener('click', () => {
      container.remove()
    })

    container.appendChild(imgElement)
    container.appendChild(removeImageButton)

    pageInViewport.current.appendChild(container)

    handleRemoveNewElement()
  }

  const handleRemoveNewElement = () => {
    dispatch(contentEditorActions.unsetWorkingElement())
  }

  return (
    <>
      {ReactDOM.createPortal(
        <Rnd
          ref={rndRef}
          style={{ zIndex: 9999 }}
          enableResizing={{ left: true, right: true, top: true, bottom: true }}
          default={{
            x: pageInViewportBounds.width / 2 - 75,
            y: pageInViewportBounds.height / 2 - 25,
            width: `${IMAGE_ELEMENT_WIDTH}px`,
            height: `${IMAGE_ELEMENT_HEIGHT}px`
          }}
          bounds='parent'
          className='text-element-container'
          onDragStop={(e, d) => { setImageDimensions((prev) => ({ ...prev, x: d.x, y: d.y })) }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setImageDimensions((prev) => ({
              ...prev,
              width: ref.style.width,
              height: ref.style.height,
            }))
          }}
        >
          <div className='text-element-content'>
            <div className='buttons-container'>
              <button onClick={handleRemoveNewElement} style={{ zIndex: 100 }}>-</button>
              <button onClick={handleSaveImageElement} style={{ zIndex: 100 }}>＋</button>
            </div>
            <input
              ref={inputRef}
              onChange={handleBrowserSelectImage}
              className='text-element-input'
              type='file'
              accept='image/*'
              style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0, cursor: 'pointer' }}
            />
            {selectedImage && <img ref={imageRef} id={workingElementId} src={selectedImage.src} alt={selectedImage.name} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />}

          </div>
        </Rnd>,
        pageInViewport.current
      )}
    </>
  )
}

export default ImageElement
