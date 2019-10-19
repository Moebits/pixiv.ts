import {PixivIllust, PixivNovel} from "./index"

export interface PixivUserSearch {
  user_previews: Array<{
    user: PixivUser
    illusts: PixivIllust[]
    novels: PixivNovel[]
    is_muted: boolean
  }>
  next_url: string | null
}

export interface PixivUser {
    id: number
    name: string
    account: string
    profile_image_urls: {
      medium: string
    }
    comment: string
    is_followed: boolean
}

export interface PixivUserDetail {
    user: PixivUser
    profile: {
      webpage: string
      gender: string
      birth: string
      birth_day: string
      birth_year: number
      region: string
      address_id: number
      country_code: string
      job: string
      job_id: number
      total_follow_users: number
      total_mypixiv_users: number
      total_illusts: number
      total_manga: number
      total_novels: number
      total_illust_bookmarks_public: number
      total_illust_series: number
      background_image_url: string
      twitter_account: string
      twitter_url: string
      pawoo_url: string
      is_premium: boolean
      is_using_custom_profile_image: boolean
    }
    profile_publicity: {
      gender: string
      region: string
      birth_day: string
      birth_year: string
      job: string
      pawoo: boolean
    }
    workspace: {
      pc: string
      monitor: string
      tool: string
      scanner: string
      tablet: string
      mouse: string
      printer: string
      desktop: string
      music: string
      desk: string
      chair: string
      comment: string
      workspace_image_url: string | null
    }
}

export interface PixivFollowDetail {
  follow_detail: {
    is_followed: boolean
    restrict: string
  }
}
