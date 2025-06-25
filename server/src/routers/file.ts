import express from 'express'
import { auth } from '../middleware/auth-middleware'
import * as controllers from './controllers/index'

const router = express.Router()

router.use(auth)
router.get('/file-metas', controllers.fileController.getPDFFileMetas as any)
router.get('/file-metas/:alias', controllers.fileController.getPDFFileMetaById as any)
router.get('/file-metas/:alias/content', controllers.fileController.getFileMetaContent as any)
router.post('/upload', controllers.fileController.postOwnedPDF as any)

export default router
