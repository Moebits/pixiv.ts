import {PixivMetaPage, PixivTag, PixivUser} from "./index"

export interface PixivIllustSearch {
  illusts: PixivIllust[]
  next_url: string | null
  search_span_limit?: number
}

export interface PixivIllustDetail {
    illust: PixivIllust
}

export interface PixivIllust {
    id: number
    title: string
    type: string
    image_urls: {
      square_medium: string
      medium: string
      large?: string
    }
    caption: string
    restrict: number
    user: PixivUser
    tags: PixivTag[]
    tools: string[]
    create_date: string
    page_count: number
    width: number
    height: number
    sanity_level: number
    meta_single_page: {
      original_image_url?: string
    }
    meta_pages: PixivMetaPage[]
    total_view: number
    total_bookmarks: number
    is_bookmarked: boolean
    visible: boolean
    x_restrict: number
    is_muted: boolean
    total_comments: number
    url?: string
  }
