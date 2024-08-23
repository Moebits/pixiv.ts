import {PixivUser} from "./index"

export interface PixivCommentSearch {
    comments: PixivComment[]
    next_url: string | null
    comment_access_control: number
}

export interface PixivComment {
  id: number
  comment: string
  date: string
  user: PixivUser
  has_replies: boolean
  stamp: {
    stamp_id: number
    stamp_url: string
  }
}
