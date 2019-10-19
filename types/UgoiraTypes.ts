export interface UgoiraMetaData {
    ugoira_metadata: {
      zip_urls: {
        medium: string
      }
      frames: Array<{
        file: string
        delay: number
      }>
    }
}
