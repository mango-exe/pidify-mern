import * as fs from 'fs/promises'
import * as path from 'path'
import mime from 'mime-types'
import sharp from 'sharp'

const resizeImageToPDFPageSize = async (filePath: string, width: number, height: number): Promise<void> => {
  try {
    const tempPath = filePath + '.tmp';

    await sharp(filePath)
      .resize(width, height)
      .toFile(tempPath)

    await fs.rename(tempPath, filePath)

    console.log(`Image resized and saved at ${filePath}`)
  } catch (error) {
    console.error('Failed to resize and overwrite image:', error)
    throw error
  }
}
const saveImageProcessorSourceImage = async (
  dataUrl: string,
): Promise<string | null> => {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
  if (!match) {
    console.warn('Invalid data URL format')
    return null
  }

  const mimeType = match[1]
  const base64Data = match[2]
  const extension = mimeType.split('/')[1]

  const buffer = Buffer.from(base64Data, 'base64')

  const fileName = `source_image.${extension}`
  const filePath = path.join(process.cwd(), 'src', 'image-extractor', 'source',  fileName)

  await fs.writeFile(filePath, buffer)

  return filePath
}

const getImageProcessorOutput = async (): Promise<{ metadata: any, src: string }[]> => {
  const imageProcessorBaseDir = path.join(process.cwd(), 'src', 'image-extractor')
  const outputDir = path.join(imageProcessorBaseDir, 'output')

  const outputDirFiles = await fs.readdir(outputDir)
  const outputDirImageFiles = outputDirFiles.filter(file => path.extname(file) !== '.json')

  const images: { metadata: any, src: string }[] = []
  for(const outputDirImageFile of outputDirImageFiles) {
    if (outputDirImageFile.includes('debug_boxes') || outputDirImageFile.includes('inv_mask')) continue
    const imageFilePath = path.join(outputDir, outputDirImageFile)
    const imageExtension = path.extname(imageFilePath).slice(1)
    const fileName = path.basename(outputDirImageFile, imageExtension)
    const imageMetadataPath = path.join(outputDir, `${fileName}json`)
    const imageContent = await fs.readFile(imageFilePath)

    const imageObject: { metadata: any, src: string } = { metadata: null, src: '' }

    const mimeType = mime.lookup(outputDirImageFile)
    const src = `data:${mimeType};base64,${imageContent.toString('base64')}`
    imageObject.src = src

    const imageMetadataContent = await fs.readFile(imageMetadataPath, 'utf-8')

    const imageMetadata = JSON.parse(imageMetadataContent)
    imageObject.metadata = imageMetadata
    images.push(imageObject)
  }

  return images
}

const cleanImageProcessorWorkingDirectories = async (): Promise<void> => {
  const imageProcessorBaseDir = path.join(process.cwd(), 'src', 'image-extractor')
  const sourceDir = path.join(imageProcessorBaseDir, 'source')
  const outputDir = path.join(imageProcessorBaseDir, 'output')

  const [sourceDirFile] = await fs.readdir(sourceDir)
  const sourceDirFilePath = path.join(sourceDir, sourceDirFile)
  await fs.unlink(sourceDirFilePath)

  const outputDirFiles = await fs.readdir(outputDir)

  for (const outputDirFile of outputDirFiles) {
    const outputDirFilePath = path.join(outputDir, outputDirFile)
    await fs.unlink(outputDirFilePath)
  }
}




export {
  saveImageProcessorSourceImage,
  cleanImageProcessorWorkingDirectories,
  getImageProcessorOutput,
  resizeImageToPDFPageSize
}
