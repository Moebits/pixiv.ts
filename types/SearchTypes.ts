import {PixivComment, PixivIllust, PixivTag} from "./IllustTypes"
import {PixivManga} from "./MangaTypes"
import {PixivNovel} from "./NovelTypes"
import {PixivUser} from "./UserTypes"

export interface PixivIllustSearch {
    illusts: PixivIllust[]
    next_url: string | null
    search_span_limit?: number
  }

export interface PixivUserSearch {
    user_previews: Array<{
      user: PixivUser
      illusts: PixivIllust[]
      novels: PixivNovel[]
      is_muted: boolean
    }>
    next_url: string | null
  }

export interface PixivCommentSearch {
    total_comments: number
    comments: PixivComment[]
    next_url: string | null
  }

export interface PixivNovelSearch {
    novels: PixivNovel[]
    next_url: string | null
    privacy_policy?: {}
    search_span_limit?: number
  }

export interface PixivBookmarkSearch {
    bookmark_tags: PixivTag[]
    next_url: string | null
  }

export interface PixivMangaSearch {
    illusts: PixivManga[]
    ranking_illusts: PixivManga[] | []
    privacy_policy: {}
    next_url: string | null
  }
