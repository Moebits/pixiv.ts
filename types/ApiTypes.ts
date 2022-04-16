export interface PixivAuthData {
    client_id: string
    client_secret: string
    username?: string
    password?: string
    grant_type?: "refresh_token" | "password"
    get_secure_url?: boolean
    refresh_token?: string
}

export interface PixivAuthHeaders {
    "app-os"?: string
    "app-os-version"?: string
    "app-version"?: string
    "user-agent"?: string
    "host"?: string
    "accept-language"?: string
    "x-client-time": string
    "x-client-hash": string
    "content-type"?: string
    "accept-encoding"?: string
    "authorization"?: string

}

export interface PixivAPIResponse {
  response: {
    access_token: string
    expires_in: number
    token_type: string
    scope: string
    refresh_token: string
    user: PixivClientUser
    device_token: string
  }
}

export interface PixivClientUser {
    profile_image_urls: {
        px_16x16: string
        px_50x50: string
        px_170x170: string
      }
    id: string
    name: string
    account: string
    mail_address: string
    is_premium: boolean
    x_restrict: number
    is_mail_authorized: boolean
}

export interface PixivParams {
    access_token?: string
    en?: boolean
    r18?: boolean
    bookmarks?: "0" | "50" | "100" | "300" | "500" | "1000" | "3000" | "5000" | "10000"
    user_id?: number
    series_id?: number
    novel_id?: number
    type?: "illust" | "novel" | "manga" | "ugoira"
    filter?: string
    restrict?: "public" | "private" | "all"
    illust_id?: number
    comment_id?: number
    parent_comment_id?: number
    content_type?: string
    include_total_comments?: boolean
    include_ranking_label?: boolean
    include_ranking_illusts?: boolean
    include_ranking_novels?: boolean
    mode?:
      | "day"
      | "week"
      | "month"
      | "day_male"
      | "day_female"
      | "week_original"
      | "week_rookie"
      | "day_r18"
      | "day_male_r18"
      | "day_female_r18"
      | "week_r18"
      | "week_r18g"
      | "day_manga"
      | "week_manga"
      | "month_manga"
      | "week_rookie_manga"
      | "day_r18_manga"
      | "week_r18_manga"
      | "week_r18g_manga"
    word?: string
    search_target?:
      | "partial_match_for_tags"
      | "exact_match_for_tags"
      | "title_and_caption"
    sort?: "date_desc" | "date_asc" | "popular_desc" | "popular_asc"
    start_date?: string
    duration?: "within_last_day" | "within_last_week" | "within_last_month"
    end_date?: string
    offset?: string
    category?: string
}

export interface PixivWebParams {
  lang?: "en"
  keyword: string
}
