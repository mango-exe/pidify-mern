import './FilesSidebar.css'
import React, { useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { useDispatch, useSelector } from 'react-redux'
import { actions as filesActions } from '../../state/slices/files-slice'
import { useNavigate, useLocation } from 'react-router'

const FilesSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { files } = useSelector(state => state.file)

  useEffect(() => {
    dispatch(filesActions.getPDFFiles())
  }, [dispatch])

  const handleFileClick = (file) => {
    if (file.jobStatus === 'FULFILLED') {
      navigate(`/content/${file.alias}`)
    }
  }

  const handleNavigateToUpload = () => {
    navigate('/')
  }


  const jobStatusMapping = (jobStatus) => {
    switch (jobStatus) {
      case 'PENDING':
        return 'Pending...'
      case 'IN_PROGRESS':
        return 'In Progress...'
      case 'FULFILLED':
        return 'Completed'
      case 'FAILED':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  const fileTemplate = (file) => (
    <div
      key={file._id}
      className={`file-item file-${file.jobStatus.toLowerCase()}`}
      title={file.jobStatus === 'FULFILLED' ? 'Click to open' : ''}
      style={{ pointerEvents: file.jobStatus === 'FULFILLED' ? 'auto' : 'none' }}
      onClick={(() => handleFileClick(file))}
    >
      <div className="file-name" title={file.name}>{file.name}</div>
      {file.jobStatus !== 'FULFILLED' && (
        <div className="file-status">
          {jobStatusMapping(file.jobStatus)}
          {['PENDING', 'IN_PROGRESS'].includes(file.jobStatus) && (
            <div className="file-spinner" />
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className='sidebar-area files-list-container'>
      <Card className='files-list-content'>
        <div className='header'>
          <div>Uploaded PDFs</div>
          {location.pathname !== '/' && <Button icon='pi pi-upload' rounded onClick={() => handleNavigateToUpload()} />}
        </div>
        <div className='files-list'>
          {files.map(fileTemplate)}
        </div>
      </Card>
    </div>
  )
}

export default FilesSidebar
