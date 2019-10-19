import {PixivUser} from "./UserTypes"

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
  }

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

export interface PixivComment {
    id: number
    comment: string
    date: string
    user: PixivUser
    parent_comment: PixivComment
}

export interface PixivTrendTags {
    trend_tags: PixivTag[]
}

export interface PixivAutoComplete {
    search_auto_complete_keywords: string[]
}

export interface PixivBookmarkDetail {
  bookmark_detail: {
    is_bookmarked: boolean
    tags: PixivTag[]
    restrict: string
  }
}

export interface PixivBookmarkRanges {
  bookmark_ranges: Array<{ 
    bookmark_num_min: string
    bookmark_num_max: string
  }>
}
