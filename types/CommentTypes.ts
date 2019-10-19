import {PixivUser} from "./index"

export interface PixivCommentSearch {
    total_comments: number
    comments: PixivComment[]
    next_url: string | null
}

export interface PixivCommentSearchV2 {
    comments: PixivCommentV2[]
    next_url: string | null
}

export interface PixivComment {
    id: number
    comment: string
    date: string
    user: PixivUser
    parent_comment: PixivComment
}

export interface PixivCommentV2 {
  id: number
  comment: string
  date: string
  user: PixivUser
  has_replies: boolean
}
