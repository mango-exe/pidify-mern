import * as css from 'css'
import { CheerioAPI } from 'cheerio'
import { Stylesheet, Rule, Declaration } from 'css'

type PageSize = Record<string, number>

const extractPageSizeFromStyles = ($: CheerioAPI): PageSize => {
  const pageWidthAndHeightCSS: Rule[] = []

  $('style').each((_: any, el: cheerio.Element) => {
    const cssString = $(el).html()
    if (!cssString) return

    const cssObj = css.parse(cssString) as { stylesheet: Stylesheet }
    if (!cssObj.stylesheet || !cssObj.stylesheet.rules) return

    for (const rule of cssObj.stylesheet.rules) {
      if (
        rule.type === 'rule' &&
        'selectors' in rule &&
        rule.selectors &&
        (rule.selectors.includes('.w1') || rule.selectors.includes('.h1'))
      ) {
        pageWidthAndHeightCSS.push(rule)
      }
    }
  })

  const cssStylesObjects = pageWidthAndHeightCSS
    .flatMap((rule) => rule.declarations || [])
    .filter(
      (decl): decl is Declaration =>
        decl.type === 'declaration' && !!decl.property && !!decl.value
    )
    .map((decl) => ({ [decl.property!]: decl.value! }))

  const combined: Record<string, string> = Object.assign({}, ...cssStylesObjects)

  const pageSize: PageSize = Object.fromEntries(
    Object.entries(combined).map(([key, value]) => [
      key,
      parseInt(parseFloat(value).toString())
    ])
  )

  return pageSize
}


export  {
  extractPageSizeFromStyles
}
