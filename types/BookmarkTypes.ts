import {PixivTag} from "./index"

export interface PixivBookmarkSearch {
    bookmark_tags: PixivTag[]
    next_url: string | null
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
