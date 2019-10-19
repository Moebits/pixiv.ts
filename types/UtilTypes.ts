import {PixivComment, PixivIllust, PixivNovel, PixivTag, PixivUser} from "./index"

export interface PixivMultiCall {
    next_url: string
    illusts?: PixivIllust[]
    comments?: PixivComment[]
    user_previews?: Array<{
        user: PixivUser
        illusts: PixivIllust[]
        novels: PixivNovel[]
        is_muted: boolean
    }>
    bookmark_tags?: PixivTag[]
    novels?: PixivNovel[]
}

export interface PixivFolderMap {
    folder: string
    tag: string
}
