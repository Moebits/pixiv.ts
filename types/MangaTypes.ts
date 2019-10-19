import {PixivMetaPage, PixivTag} from "./IllustTypes"
import {PixivUser} from "./UserTypes"

export interface PixivManga {
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
    page_count: string
    width: number
    height: number
    sanity_level: number
    x_restrict: number
    series: {
      id: number
      title: string
    } | null
    meta_single_page: {}
    meta_pages: PixivMetaPage[]
    total_view: number
    total_bookmarks: number
    is_bookmarked: boolean
    visible: boolean
    is_muted: boolean
  }
