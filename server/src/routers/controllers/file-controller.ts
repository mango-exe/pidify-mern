import { Response, NextFunction } from 'express'

import { IResponse } from '../../types/response/response'
import { IFileUploadRequest } from '../../types/request/IFileUploadRequest'

import { FileMeta } from '../../models/filemeta'
import { v4 as uuidv4 } from 'uuid'
import { JobStatus } from '../../types/models/filemeta'
import { saveFile } from '../../lib/file-lib'
import { UploadedFile } from 'express-fileupload'
import { ProcessingQueue } from '../../lib/queue-lib'
import { IPermission, Rights } from '../../types/models/permission'
import { models } from '../../models'

const getPDFFileMetas = async (req: Request, res: Response<IResponse>, next: NextFunction) => {
  try {
    const user = await models.User.findOne({ _id: res.locals.user._id }).populate<{ permissions: IPermission[] }>('permissions')

    if (!user) {
      res.status(400).json({ message: 'User not found', data: null, timestamp: new Date() })
      return
    }

    const fileMetaIds = user.permissions.map(permission => permission.forResource)
    const fileMetas = await models.FileMeta.find({ _id: { $in: fileMetaIds } })
    const count = await models.FileMeta.countDocuments({ _id: { $in: fileMetaIds } })

    return res.status(200).json({ message: 'OK', data: { files: fileMetas, count }, timestamp: new Date() })
  } catch(e) {
    next(e)
  }
}


const postOwnedPDF = async (req: IFileUploadRequest, res: Response<IResponse>, next: NextFunction): Promise<any> => {
  try {
    const files = req.files
    const { name, description } = req.body

    const user = await models.User.findOne({ _id: res.locals.user._id })!

    if (!user) {
      res.status(400).json({ message: 'User not found', data: null, timestamp: new Date() })
      return
    }

    if (!files || Object.keys(files).length === 0) {
      res.status(400).json({ message: 'No file uploaded', data: null, timestamp: new Date() })
      return
    }

    if (!files || Object.keys(files).length > 1) {
      res.status(400).json({ message: 'Too many files uploaded', data: null, timestamp: new Date() })
      return
    }

    const existingName = await models.FileMeta.findOne({ name })

    if (existingName) {
      res.status(400).json({ message: 'Filename already exists', data: null, timestamp: new Date() })
      return
    }

    const file: UploadedFile = Array.isArray(files) ? files[0] : files.file

    const alias = uuidv4()
    const fileMeta = new FileMeta()
    fileMeta.name = name
    fileMeta.description = description
    fileMeta.alias = alias
    fileMeta.timestamp = new Date()
    fileMeta.jobStatus = JobStatus.PENDING
    fileMeta.size = file.size

    const permission = new models.Permission()
    permission.forResource = fileMeta._id
    permission.rights = Rights.READ_WRITE
    await permission.save()

    user.permissions.push(permission._id)

    const filePath: string = await saveFile(alias, '.pdf', 'import', file.data)
    fileMeta.path = filePath


    await user.save()
    await fileMeta.save()

    try {
      const processingQueue: ProcessingQueue = ProcessingQueue.getInstance()
      processingQueue.addJob('pdf-to-html', fileMeta.alias, user)
    } catch(e) {
      console.warn(e)
    }

    return res.status(200).json({ message: 'OK', data: null, timestamp: new Date() })

  } catch (e) {
    next(e)
  }
}

export {
  postOwnedPDF,
  getPDFFileMetas
}
