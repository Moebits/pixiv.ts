import {PixivTag, PixivUser} from "./index"

export interface PixivNovelDetail {
  novel: PixivNovel
}

export interface PixivNovelText {
  novel_marker: {}
  novel_text: string
  series_prev: PixivNovel
  series_next: PixivNovel
}
export interface PixivNovelSearch {
  novels: PixivNovel[]
  next_url: string | null
  privacy_policy?: {}
  search_span_limit?: number
}

export interface PixivNovel {
    id: number
    title: string
    caption: string
    restrict: number
    x_restrict: number
    image_urls: {
      square_medium: string
      medium: string
      large?: string
    }
    create_date: string
    tags: PixivTag[]
    page_count: number
    text_length: number
    user: PixivUser
    series: {
      id: number
      title: string
    } | null
    is_bookmarked: boolean
    total_bookmarks: number
    total_view: number
    visible: boolean
    total_comments: number
    is_muted: boolean
    is_mypixiv_only: boolean
    is_x_restricted: boolean
    url: string
    type: string
  }
