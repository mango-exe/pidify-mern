import './FileVersionsList.css'
import React from 'react'

import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const FileVersionsList = () => {
  const navigate = useNavigate()
  const { fileVersions  } = useSelector(state => state.file)

  const handleFileClick = (file) => {
    if (file.jobStatus === 'FULFILLED') {
      navigate(`/content/${file.alias}`)
    }
  }

  const fileVersionsTemplate = (file) => (
    <div
      key={file._id}
      className='file-item'
      title={file.jobStatus === 'FULFILLED' ? 'Click to open' : ''}
      onClick={(() => handleFileClick(file))}
    >
      <div className="file-name" title={file.name}>{file.name}</div>
    </div>
  )

  return(
    <div className='file-versions-container'>
      <div className='header'>Saved versions ({fileVersions.length})</div>
      <div className='file-versions-list'>
        {fileVersions.map(fileVersionsTemplate)}
      </div>
    </div>
  )

}

export default FileVersionsList
