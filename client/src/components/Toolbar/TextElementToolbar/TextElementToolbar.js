import React, { useEffect, useState } from 'react'
import './TextElementToolbar.css'
import { shallowEqual, useSelector } from 'react-redux'
import { contentEditorActionTypes  } from '../../../state/slices/content-editor-slice'


const TextElementToolbar = () => {
  const [textElement, setTextElement] = useState(null)
  const [showTextElementToolbar, setShowTextElementToolbar] = useState(false)
  const [embeddedFonts, setEmbeddedFonts] = useState([])

  const { workingElementId, actionType } = useSelector(state => state.contentEditor, shallowEqual)

  useEffect(() => {
    const container = document.getElementById('page-container')
    const foundFonts = getEmbeddedFonts(container)

    if (foundFonts.length > 0) {
      const foundEmbeddedFonts = foundFonts.filter(e => e.includes('ff')).map((e, index) => ({name: `Embedded Font ${index + 1}`, value: e }))

      setEmbeddedFonts(foundEmbeddedFonts)
    }
  }, [])

  useEffect(() => {
    if (workingElementId && (actionType === contentEditorActionTypes.ADD_TEXT_ELEMENT || actionType === contentEditorActionTypes.EDIT_TEXT_ELEMENT)) {
      setShowTextElementToolbar(true)
    } else {
      setShowTextElementToolbar(false)
    }
  }, [workingElementId, actionType])

  useEffect(() => {
    if (workingElementId) {
      const element = document.getElementById(workingElementId)

      if (element && element.isContentEditable) {

        setTextElement(element)
      } else {
        console.warn('Target element must be contentEditable')
        setTextElement(null)
      }
    } else {
      setTextElement(null)
    }
  }, [workingElementId])

  function getEmbeddedFonts(rootElement) {
    const fonts = new Set()

    function traverse(node) {
      if (node.nodeType !== Node.ELEMENT_NODE) return

      const style = window.getComputedStyle(node)
      if (style.fontFamily) {
        fonts.add(style.fontFamily)
      }

      for (const child of node.children) {
        traverse(child)
      }
    }

    traverse(rootElement)
    return Array.from(fonts)
  }


  const exec = (command, value = null) => {
    if (!textElement) return

    switch (command) {
      case 'fontSize':
        textElement.style.fontSize = `${value}px`
        break
      case 'fontFamily':
        textElement.style.fontFamily = value
        break
      case 'color':
        textElement.style.color = value
        break
      case 'bold':
        textElement.style.fontWeight = textElement.style.fontWeight === 'bold' ? 'normal' : 'bold'
        break
      case 'italic':
        textElement.style.fontStyle = textElement.style.fontStyle === 'italic' ? 'normal' : 'italic'
        break
      case 'underline':
        toggleTextDecoration('underline')
        break
      case 'strikeThrough':
        toggleTextDecoration('line-through')
        break
      default:
        console.warn('Unknown command:', command)
    }
  }

  const toggleTextDecoration = (style) => {
    const current = textElement.style.textDecoration || ''
    if (current.includes(style)) {
      textElement.style.textDecoration = current.replace(style, '').trim()
    } else {
      textElement.style.textDecoration = [current, style].filter(Boolean).join(' ').trim()
    }
  }

  return (
    showTextElementToolbar ? (
      <div className='text-toolbar'>
        <select onChange={(e) => exec('fontFamily', e.target.value)} defaultValue=''>
          <option value=''>Font</option>

          <optgroup label="Standard Fonts">
            <option value='Arial'>Arial</option>
            <option value='Courier New'>Courier</option>
            <option value='Georgia'>Georgia</option>
            <option value='Times New Roman'>Times</option>
            <option value='Verdana'>Verdana</option>
          </optgroup>

          {embeddedFonts.length > 0 && (
            <optgroup label="Embedded Fonts">
              {embeddedFonts.map((font, index) => (
                <option key={index} value={font.value}>
                  {font.name} ({font.value})
                </option>
              ))}
            </optgroup>
          )}
        </select>

        <input
          type="number"
          min="1"
          onChange={(e) => exec('fontSize', e.target.value)}
          placeholder="Size"
          style={{ width: '60px' }}
        />


        <input type='color' onChange={(e) => exec('color', e.target.value)} />

        <button onClick={() => exec('bold')}><b>B</b></button>
        <button onClick={() => exec('italic')}><i>I</i></button>
        <button onClick={() => exec('underline')}><u>U</u></button>
        <button onClick={() => exec('strikeThrough')}><s>S</s></button>
      </div>
    ) : null
  )
}

export default TextElementToolbar
