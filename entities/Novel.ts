import api from "../API"
import {PixivBookmarkSearch, PixivCommentSearch, PixivNovelSearch, PixivParams, PixivTrendTags} from "../types"

export class Novel {
    constructor(private readonly api: api) {}

    public detail = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v2/novel/detail`, params)
        return response
    }

    public text = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v1/novel/text`, params)
        return response
    }

    public new = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/new`, params)
        return response as Promise<PixivNovelSearch>
    }

    public myPixiv = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/mypixiv'`, params)
        return response as Promise<PixivNovelSearch>
    }

    public follow = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/follow`, params)
        return response
    }

    public recommended = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/recommended`, params)
        return response as Promise<PixivNovelSearch>
    }

    public recommendedNoLogin = async (params?: PixivParams & {include_ranking_novels: true}) => {
        const response = await this.api.get(`/v1/novel/recommended-nologin`, params)
        return response as Promise<PixivNovelSearch>
    }

    public popularPreview = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/popular-preview/novel`, params)
        return response as Promise<PixivNovelSearch>
    }

    public bookmarkRanges = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/bookmark-ranges/novel`, params)
        return response as Promise<PixivBookmarkSearch>
    }

    public trendingTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/trending-tags/novel`, params)
        return response as Promise<PixivTrendTags>
    }

    public comments = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v1/novel/comments`, params)
        return response as Promise<PixivCommentSearch>
    }

    public commentsV2 = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v2/novel/comments`, params)
        return response as Promise<PixivCommentSearch>
    }

    public commentReplies = async (params: PixivParams & {comment_id: number}) => {
        const response = await this.api.get(`/v1/novel/series`, params)
        return response
    }

    public series = async (params: PixivParams & {series_id: number}) => {
        const response = await this.api.get(`/v1/novel/series`, params)
        return response
    }

    public ranking = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/ranking`, params)
        return response as Promise<PixivNovelSearch>
    }

    public bookmarkDetail = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v2/novel/bookmark/detail`, params)
        return response
    }
}
