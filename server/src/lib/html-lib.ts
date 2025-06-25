import * as cheerio from 'cheerio'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

const preprocessHTMLFile = async (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const html = await fsPromise.readFile(filePath)

    const $ = cheerio.load(html)

    $('#sidebar').remove()
    $('#page-container').removeAttr('style')
    $('#page-container').attr('style', 'position: relative; background-color: unset !important; background-image: unset !important; transition: unset !important; -webkit-transition: unset !important;')

    const textElements: cheerio.Element[] = $('.t').toArray()

    for (const textElement of textElements) {
      // Assign id and class to the textElement itself

      let hasChildElements = false
      if ($(textElement).children() && $(textElement).children().length > 0) {
        hasChildElements = true
        $(textElement).children().each((childIndex, childElement) => {
          const childId = uuidv4()
          const childCurrentClass: string = $(childElement).attr('class') || ''
          $(childElement).attr('id', childId)
          $(childElement).attr('class', `${childCurrentClass} text-container`)
        })
      }

      const elementId = uuidv4()
      $(textElement).attr('id', elementId);
      const elementCurrentClass: string = $(textElement).attr('class') || ''
      $(textElement).attr('class', `${elementCurrentClass} text-container`)
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
