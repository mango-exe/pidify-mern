import express from 'express'
import { auth } from '../middleware/auth-middleware'
import * as controllers from './controllers/index'

const router = express.Router()

router.use(auth)
router.get('/file-metas', controllers.fileController.getPDFFileMetas as any)
router.post('/upload', controllers.fileController.postOwnedPDF as any)

export default router
