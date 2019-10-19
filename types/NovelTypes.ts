import {PixivTag} from "./IllustTypes"
import {PixivUser} from "./UserTypes"

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
    }
    is_bookmarked: boolean
    total_bookmarks: number
    total_view: number
    visible: boolean
    total_comments: number
    is_muted: boolean
    is_mypixiv_only: boolean
    is_x_restricted: boolean
  }
