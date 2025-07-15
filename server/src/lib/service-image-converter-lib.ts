import path from 'path'
import fsPromises from 'fs/promises'
import fs from 'fs'

const copyPDFFileToImageConverterWorkingDirectory = async (fileAlias: string): Promise<void> => {
  const imageConverterDestinationFile = path.join(process.cwd(), 'src', 'image-converter', `${fileAlias}.pdf`)
  const filePath = path.join(process.cwd(), 'src', 'files', 'import', fileAlias, `${fileAlias}.pdf`)

  await fsPromises.copyFile(filePath, imageConverterDestinationFile)
}


const cleanImageConverterWorkingDirectories = async (): Promise<void> => {
  const imageProcessorBaseDir = path.join(process.cwd(), 'src', 'image-converter')
  const croppedImagesDir = path.join(imageProcessorBaseDir, 'cropped_images')
  const extractedImagesDir = path.join(imageProcessorBaseDir, 'extracted_images')


  const croppedImagesDirFiles = await fsPromises.readdir(croppedImagesDir)
  for (const imageFilename of croppedImagesDirFiles) {
    const imageFilePath = path.join(croppedImagesDir, imageFilename)
    await fsPromises.unlink(imageFilePath)
  }

  const extractedImagesDirFiles = await fsPromises.readdir(extractedImagesDir)
  for (const imageFilename of extractedImagesDirFiles) {
    const imageFilePath = path.join(extractedImagesDir, imageFilename)
    await fsPromises.unlink(imageFilePath)
  }

  const imageConverterDirFiles = await fsPromises.readdir(imageProcessorBaseDir)
  for (const file of imageConverterDirFiles) {
    if (file.includes('.pdf')) {
      const pdfFilePath = path.join(imageProcessorBaseDir, file)
      await fsPromises.unlink(pdfFilePath)
    }
  }
}

const replaceOrginalPDFWithImagesUpdatedPDF = async (fileAlias: string): Promise<void> => {
  const imageConverterBaseDir = path.join(process.cwd(), 'src', 'image-converter')
  const updatedPDFFilePath = path.join(imageConverterBaseDir, `${fileAlias}.pdf`)
  const originalPDFFilePath = path.join(process.cwd(), 'src', 'files', 'import', fileAlias, `${fileAlias}.pdf`)

  await fsPromises.copyFile(updatedPDFFilePath, originalPDFFilePath)
}

export {
  copyPDFFileToImageConverterWorkingDirectory,
  cleanImageConverterWorkingDirectories,
  replaceOrginalPDFWithImagesUpdatedPDF
}
