import './PPTUpload.css'
import React, { useState, useRef } from 'react'
import { FileUpload } from 'primereact/fileupload'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { ProgressBar } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { useForm } from 'react-hook-form'

import { actions as filesActions } from '../../state/slices/files-slice'
import { useDispatch } from 'react-redux'

const PPTUpload = () => {
  const [description, setDescription] = useState('')
  const [totalSize, setTotalSize] = useState(0)

  const dispatch = useDispatch()

  const {
    register,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue
  } = useForm({ mode: 'onChange'})

  const name = watch('name', '')
  const file = watch('file', null)

  register('file', { required: 'File is required' })

  const isFormValid = isValid && !!file

  const fileUploadRef = useRef(null)
  const toastRef = useRef(null)

  const handleRemoveFile = () => {
    setValue('file', null)
    setTotalSize(0)
    trigger('file')
  }

  const handleFileUpload = () => {
    const  formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('description', description)
    dispatch(filesActions.uploadPDFFile(formData))
  }

  const onTemplateSelect = (e) => {
      let files = e.files

      if (files.length === 1)  {
        const [uploadedFile] = files
        setValue('file', uploadedFile, { shouldValidate: true })
        setValue('name',  uploadedFile.name)
        setTotalSize(uploadedFile.size || 0)
        trigger('file')
      } else {
        toastRef.current.show({  severity: 'error', summary: 'Error', detail: 'Only one file can be uploaded at a time', life: 3000 })
      }
  }

  const emptyTemplate = () => {
      return (
          <div className='file-upload-empty-template'>
              <i className='pi pi-file-pdf' style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
              <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className='my-5'>
                  Drag and Drop PDF Here
              </span>
          </div>
      )
  }


  const fileUploadHeaderTemplate = (options) => {
      const { className, chooseButton, cancelButton } = options

      const value = totalSize / 10000
      const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B'

      return (
          <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
              {chooseButton}
              {cancelButton}
              <div className='flex align-items-center gap-3 ml-auto'>
                  <span>{formatedValue} / 1 MB</span>
                  <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
              </div>
          </div>
      )
  }

  return (
    <div className='main-area file-upload-container'>
      <Toast ref={toastRef} />
      <Card className='file-upload-content'>
      <div className='file-upload'>
          <FileUpload
            accept='application/pdf'
            headerTemplate={fileUploadHeaderTemplate}
            emptyTemplate={emptyTemplate}
            onSelect={onTemplateSelect}
            onRemove={handleRemoveFile}
            ref={fileUploadRef}
          />
          {errors.file && <span className='error-message'>{errors.file.message}</span>}
        </div>
        <div>
          <Card title='Details' className='file-details-container'>
            <InputText className='input' id='name' placeholder='Name' {...register('name', { required: 'Name is required'})} />
            {errors.name && <span className='error-message'>{errors.name.message}</span>}
            <InputTextarea className='input' id='description' placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
          </Card>
        </div>
        <div className='upload-button-container'>
          <Button  label='Upload' disabled={!isFormValid} onClick={handleFileUpload} />
        </div>
      </Card>
    </div>
  )
}

export default PPTUpload
