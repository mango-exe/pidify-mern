import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
type Directon = 'import' | 'export'
type FileType = '.pdf' | '.ppt' | '.html' | '.docx'


const saveFile = async (fileAlias: string, fileType: FileType, type: Directon = 'import', file: Buffer): Promise<string> => {
  const baseDir = type == 'import' ? 'files/import' : 'files/export'
  const fileDir = path.join(process.cwd(), 'src', baseDir, fileAlias)
  const filePath = path.join(fileDir, `${fileAlias}${fileType}`)

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true })
  }

  await fsPromises.writeFile(filePath, file)

  return filePath
}

const removeFile = async (fileAlias: string, fileType: FileType, type: Directon = 'import'): Promise<boolean> => {
  const baseDir = type == 'import' ? 'files/import' : 'files/export'
  const fileDir = path.join(process.cwd(), 'src', baseDir, fileAlias)
  const filePath = path.join(fileDir, `${fileAlias}${fileType}`)

  if (!fs.existsSync(filePath)) {
    return false
  }

  await fsPromises.unlink(filePath)

  return true
}

export {
  saveFile,
  removeFile
}
