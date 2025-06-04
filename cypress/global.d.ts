import pageManager from './support/pageManager'

declare global {
  var pages: typeof pageManager
}

export {}