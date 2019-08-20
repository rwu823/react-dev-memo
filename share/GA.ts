/* eslint-disable camelcase, no-eval */

const globalThis = (1, eval)('this')

type PageView = Partial<{
  page_title: string
  page_path: string
  send_page_view: boolean
}>

type GAOptions = Partial<{
  debug: boolean
}>

export default class GA {
  private readonly id: string

  private readonly options: GAOptions

  private reTryTimes: number = 0

  private isScriptLoaded: boolean = false

  constructor(id: string, options?: GAOptions) {
    this.id = id
    this.options = options || {}

    const gaScript = document.createElement('script')
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    gaScript.async = true

    document.head.appendChild(gaScript)

    globalThis.dataLayer = globalThis.dataLayer || []
    globalThis.gtag = (...args: any[]) => {
      globalThis.dataLayer.push(args)
    }

    gaScript.onload = () => {
      this.isScriptLoaded = true

      globalThis.gtag('js', new Date())
      globalThis.gtag('config', id)
    }
  }

  pageView(options: PageView = {}) {
    const opts = {
      page_title: document.title,
      page_path: window.location.pathname,
      ...options,
    }

    if (this.isScriptLoaded) {
      globalThis.gtag('config', this.id, options)

      if (this.options.debug) {
        console.log('[ga]', opts)
      }
    } else {
      if (this.reTryTimes > 3) return
      setTimeout(() => {
        this.pageView(options)
        this.reTryTimes += 1
      }, 500)
    }
  }
}
