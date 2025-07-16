import { dir } from 'console'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
type Directon = 'import' | 'export' | 'version'
type FileType = '.pdf' | '.ppt' | '.html' | '.docx'


const saveFile = async (fileAlias: string, fileType: FileType, type: Directon = 'import', file: Buffer, parentFileAlias?: string): Promise<string> => {
  let baseDir

  switch(type) {
    case 'import':
      baseDir = 'files/import'
    break
    case 'export':
      baseDir = 'files/export'
    break
    case 'version':
      baseDir = 'files/version'
    break
  }

  let fileDir
  if (type === 'version') {
    fileDir = path.join(process.cwd(), 'src', baseDir, parentFileAlias as string)
    const filePath = path.join(fileDir, `${fileAlias}${fileType}`)

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true })
    }

    await fsPromises.writeFile(filePath, file)
  } else {
    fileDir = path.join(process.cwd(), 'src', baseDir, fileAlias)
    const filePath = path.join(fileDir, `${fileAlias}${fileType}`)

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true })
    }

    await fsPromises.writeFile(filePath, file)
  }


  return fileDir
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
