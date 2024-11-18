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

export interface PixivAJAXNovel {
  id: string
  title: string
  genre: string
  xRestrict: number
  restrict: number
  url: string
  tags: string[]
  userId: string
  userName: string
  profileImageUrl: string
  textCount: number
  wordCount: number
  readingTime: number
  useWordCount: boolean
  description: string
  isBookmarkable: boolean
  bookmarkData: any
  bookmarkCount: number
  isOriginal: boolean
  marker: any
  titleCaptionTranslation: {workTitle: any, workCaption: any}
  createDate: string
  updateDate: string
  isMasked: boolean
  aiType: number
  seriesId: string
  seriesTitle: string
  isUnlisted: boolean
}

export interface PixivAJAXNovelText {
  bookmarkCount: number
  commentCount: number
  markerCount: number
  createDate: string
  uploadDate: string
  description: string
  id: string
  title: string
  likeCount: number
  pageCount: number
  userId: string
  userName: string
  viewCount: number
  isOriginal: boolean
  isBungei: boolean
  xRestrict: number
  restrict: number
  content: string
  coverUrl: string
  suggestedSettings: {
    viewMode: number
    themeBackground: number
    themeSize: number | null
    themeSpacing: number | null
  },
  isBookmarkable: boolean
  bookmarkData: any
  likeData: boolean
  pollData: any
  marker: any
  tags: {
    authorId: string
    isLocked: boolean
    tags: {tag: string, locked: boolean, deletable: boolean, userId: string, userName: string}[]
    writable: boolean
  }
  seriesNavData: {
    seriesType: string
    seriesId: number
    title: string
    isConcluded: boolean
    isReplaceable: boolean
    isWatched: boolean
    isNotifying: boolean
    order: number
    next: any
    prev: any
  }
  descriptionBoothId: any
  descriptionYoutubeId: any
  comicPromotion: any
  fanboxPromotion: any
  contestBanners: {
    id: string
    title: string
    comment: string
    user_id: string
    scene: string
    restrict: string
    x_restrict: string
    tag_full_lock: string
    response_auto: string
    is_original: string
    language: string
    tag: string
    tool: string
    cover_type: string
    cover_id: string
    hash: string
    serialized_value: string
    character_count: string
    word_count: string
    cdate: string
    mdate: string
    novel_cover_img_name: string
    novel_cover_img_ext: string
    comment_off_setting: string
    ai_type: string
    novel_image_sanity_level: string
    text: string
    novel_image_id: string
    type: string
    text_length: number
    user_account: string
    user_name: string
    user_status: string
    tag_a: string[]
    url: {m: string}
    series_id: number
    series_title: string | null
    series_content_display_order: any
    genre: string
    marker_count: number
    bookmark_count: number
    comment_count: number
    rating_count: number
    rating_score: number
    rating_view: number
    rating_view_from_home: number
    view_mode: number
    theme_background: number
    theme_size: number
    theme_spacing: number
  } | null
  contestData: any
  request: any
  imageResponseOutData: any[]
  imageResponseData: any[]
  imageResponseCount: number
  userNovels: {[key: string]: PixivAJAXNovel | null}
  hasGlossary: boolean
  zoneConfig: {
    responsive: {url: string}
    rectangle: {url: string}
    "500x500": {url: string}
    header: {url: string}
    footer: {url: string}
    expandedFooter: {url: string}
    logo: {url: string}
    ad_logo: {url: string}
    relatedworks: {url: string}
  }
  extraData: {
    meta: {
      title: string
      description: string
      canonical: string
      descriptionHeader: string
      ogp: {description: string, image: string, title: string, type: string} 
      twitter: {description: string, image: string, title: string, card: string}
    }
  },
  titleCaptionTranslation: {workTitle: any, workCaption: any},
  isUnlisted: boolean
  language: string
  textEmbeddedImages: any
  commentOff: number
  characterCount: number
  wordCount: number
  useWordCount: boolean
  readingTime: number
  genre: string
  aiType: number
  noLoginData: {
    breadcrumbs: {successor: {tag: string, translation: {en: string}}[], current: {en: string}}
    zengoWorkData: {
      nextWork: {id: string, title: string}
      prevWork: {id: string, title: string}
    }
}
}