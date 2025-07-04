import * as cheerio from 'cheerio'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import { saveImageProcessorSourceImage, getImageProcessorOutput, cleanImageProcessorWorkingDirectories, resizeImageToPDFPageSize } from '../lib/service-image-extractor-lib'
import { runDockerImageExtractorService } from '../lib/docker-lib'

const preprocessHTMLFile = async (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const html = await fsPromise.readFile(filePath)

    const $ = cheerio.load(html)

    $('#sidebar').remove()
    const pagesContainerElement = $('#page-container')
    pagesContainerElement.removeAttr('style')
    pagesContainerElement.attr('style', 'position: relative; background-color: unset !important; background-image: unset !important; transition: unset !important; -webkit-transition: unset !important;')

    const pages = pagesContainerElement.children().toArray()

    for(const pageElement of pages) {
      const [imgElement] = $(pageElement).find('img').toArray()
      const imgContent = $(imgElement).attr('src')
      if (!imgContent) continue

      let pageImages: { src: string, metadata: any }[] = []
      const savedImagePath = await saveImageProcessorSourceImage(imgContent)

      if (savedImagePath) {
        await resizeImageToPDFPageSize(savedImagePath, 796, 1030)
        const imageExtractorResult = await runDockerImageExtractorService()
        if (imageExtractorResult) {
          pageImages = await getImageProcessorOutput()
        }
      }

      for (const pageImage of pageImages) {
        const newImageElement = $('<img>')
        newImageElement.attr('src', pageImage.src)

        newImageElement.attr('style', `position: absolute; top: ${pageImage.metadata.position.top}px; left: ${pageImage.metadata.position.left}px; width: ${pageImage.metadata.position.width}px; height: ${pageImage.metadata.position.height}px;`)

        $(pageElement).append(newImageElement)
      }

      if (pageImages.length > 0) {
        await cleanImageProcessorWorkingDirectories()
      }
    }

    const textElements: cheerio.Element[] = $('.t').toArray()

    for (const textElement of textElements) {
      if ($(textElement).children() && $(textElement).children().length > 0) {
        $(textElement).children().each((childIndex, childElement) => {
          const childId = uuidv4()
          const childCurrentClass: string = $(childElement).attr('class') || ''
          $(childElement).attr('id', childId)
          $(childElement).attr('class', `${childCurrentClass} text-container`)
          $(childElement).attr('element-supports', 'editing');

        })
      }

      const elementId = uuidv4()
      $(textElement).attr('id', elementId);
      const elementCurrentClass: string = $(textElement).attr('class') || ''
      $(textElement).attr('class', `${elementCurrentClass} text-container`)
      $(textElement).attr('element-supports', 'editing');
    }

    const preprocessedHTML = $.html()
    await fsPromise.writeFile(filePath, preprocessedHTML)

    console.warn('Done preprocessing HTML file:', filePath)
  } catch(error: any) {
    console.warn(error)
    throw new Error(`Error processing HTML file${filePath}: ${error.toString()}`);
  }
}


export {
  preprocessHTMLFile
}
