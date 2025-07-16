import './Toolbar.css'
import React from 'react'

import { FaImage, FaTextHeight, FaSave } from 'react-icons/fa'

import { useParams } from 'react-router'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { actions as contentEditorActions, contentEditorActionTypes } from '../../state/slices/content-editor-slice'
import { actions as filesActions } from '../../state/slices/files-slice'
import { v4 as uuidv4 } from 'uuid'
import ImageElementToolbar from './ImageElementToolbar/ImageElementToolbar'
import TextElementToolbar from './TextElementToolbar'
import TextElement from './TextElement'
import ImageElement from './ImageElement'
import FileVersionsList from './FileVersionsList'


const Toolbar = ({ pageInViewport }) => {
  const dispatch = useDispatch()

  const params = useParams()

  const { alias } = params
  const { workingElementId, actionType } = useSelector(state => state.contentEditor, shallowEqual)
  const { fileContent: originalPDFContent, fileVersions, file: fileMeta } = useSelector(state => state.file)

  const handleAddNewTextElement = () => {
    if (!pageInViewport.current) return
    dispatch(contentEditorActions.setWorkingElement({ workingElementId: uuidv4(), actionType: contentEditorActionTypes.ADD_TEXT_ELEMENT }))
  }

  const handleAddNewImageElement = () => {
    if (!pageInViewport.current) return
    dispatch(contentEditorActions.setWorkingElement({ workingElementId: uuidv4(), actionType: contentEditorActionTypes.ADD_IMAGE_ELEMENT }))
  }

  const handleSaveDocument = () => {
    dispatch(filesActions.startSavingPDFVersion())
    const domParser = new DOMParser()

    const updatedPDFContentContainer = document.querySelector('#page-container')

    const originalPDFDOM = domParser.parseFromString(originalPDFContent, 'text/html')

    const targetNode = originalPDFDOM.querySelector('#page-container')

    const updatedSubtreeHTML = updatedPDFContentContainer.outerHTML

    const tempDoc = domParser.parseFromString(updatedSubtreeHTML, 'text/html')
    targetNode.replaceWith(tempDoc.querySelector('#page-container'))

    const updatedPDFContent = originalPDFDOM.documentElement.outerHTML

    const blob = new Blob([updatedPDFContent], { type: 'text/html' })
    const file = new File([blob], 'updated-document.html', { type: 'text/html' })

    const formData = new FormData()
    formData.append('files', file)
    if (fileMeta.parentFile?.alias) {
      dispatch(filesActions.savePDFFileVersion({ fileFormData: formData, parentFileAlias: fileMeta.parentFile.alias }))
    } else {
      dispatch(filesActions.savePDFFileVersion({ fileFormData: formData, parentFileAlias: alias }))
    }
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
      onClick: handleAddNewImageElement // placeholder
    },
    {
      id: 'save-document',
      label: 'Save document',
      icon: <FaSave />,
      onClick: handleSaveDocument
    },
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
      {workingElementId && (actionType === contentEditorActionTypes.ADD_IMAGE_ELEMENT) && <ImageElement pageInViewport={pageInViewport} />}
      {pageInViewport.current && <TextElementToolbar />}
      {pageInViewport.current && <ImageElementToolbar />}
      {fileMeta && !fileMeta.parentFile && fileVersions && fileVersions.length >0 && <FileVersionsList />}
    </>
  )
}

export default Toolbar
