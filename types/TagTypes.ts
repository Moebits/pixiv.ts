import {PixivIllust} from "./index"

export interface PixivTag {
    name: string
    translated_name: string | null
    added_by_uploaded_user?: boolean
    illust?: PixivIllust
    is_registered?: boolean
  }

export interface PixivMetaPage {
    image_urls: {
      square_medium: string
      medium: string
      large: string
      original: string
    }
}
export interface PixivTrendTags {
    trend_tags: PixivTag[]
}

export interface PixivAutoComplete {
    search_auto_complete_keywords: string[]
}
