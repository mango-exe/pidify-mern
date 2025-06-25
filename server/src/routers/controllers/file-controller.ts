import { Response, NextFunction } from 'express'
import { IResponse } from '../../types/response/response'
import { IFileUploadRequest } from '../../types/request/IFileUploadRequest'
import { IGetFileRequest } from '../../types/request/IGetFileRequest'
import { JobStatus } from '../../types/models/filemeta'
import { FileMeta } from '../../models/filemeta'
import { IPermission, Rights } from '../../types/models/permission'
import { UploadedFile } from 'express-fileupload'
import { Types } from 'mongoose'

import { ProcessingQueue } from '../../lib/queue-lib'

import fsPromise from 'fs/promises'
import path from 'path'

import { models } from '../../models'
import { v4 as uuidv4 } from 'uuid'
import { saveFile } from '../../lib/file-lib'
import { prev } from 'cheerio/dist/commonjs/api/traversing'

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

const getPDFFileMetaById = async (req: IGetFileRequest, res: Response<IResponse>, next: NextFunction) => {
  try {
    const alias = req.params.alias

    if (!alias) {
      res.status(400).json({ message: 'Missing  file alias', data: null, timestamp: new Date() })
      return
    }

    const fileMeta = await models.FileMeta.findOne({ alias })

    if (!fileMeta) {
      res.status(404).json({ message: 'File not found', data: null, timestamp: new Date() })
      return
    }

    const permissionsIds: Types.ObjectId[]  = res.locals.user.permissions.map((e: IPermission)  => e.forResource)

    if (!permissionsIds.find(e => e.equals(fileMeta._id))) {
      res.status(401).json({ message: 'Unauthorized', data: null, timestamp: new Date() })
      return
    }

    return res.status(200).json({ message: 'OK', data: fileMeta, timestamp: new Date() })
  } catch(e) {
    next(e)
  }
}

const getFileMetaContent = async (req: IGetFileRequest, res: Response, next: NextFunction) => {
  try {
    const alias = req.params.alias

    if (!alias) {
      res.status(400).json({ message: 'Missing  file alias', data: null, timestamp: new Date() })
      return
    }

    const fileMeta = await models.FileMeta.findOne({ alias })

    if (!fileMeta) {
      res.status(404).json({ message: 'File not found', data: null, timestamp: new Date() })
      return
    }

    const permissionsIds: Types.ObjectId[]  = res.locals.user.permissions.map((e: IPermission)  => e.forResource)

    if (!permissionsIds.find(e => e.equals(fileMeta._id))) {
      res.status(401).json({ message: 'Unauthorized', data: null, timestamp: new Date() })
      return
    }

    const fileMetaContentPath = path.join(fileMeta.path, `${fileMeta.alias}.html`)

    const fileMetaContent = await fsPromise.readFile(fileMetaContentPath)

    res.send(fileMetaContent)
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

    const fileBaseDir: string = await saveFile(alias, '.pdf', 'import', file.data)
    fileMeta.path = fileBaseDir


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
  getPDFFileMetas,
  getFileMetaContent,
  getPDFFileMetaById
}
