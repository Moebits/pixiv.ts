import api from "../API"
import {PixivBookmarkDetail, PixivBookmarkSearch, PixivCommentSearch, PixivIllustDetail, PixivIllustSearch,
PixivParams, PixivTrendTags} from "../types"

export class Illust {
    constructor(private readonly api: api) {}

    public detail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/detail`, params)
        return response as Promise<PixivIllustDetail>
    }

    public new = async (params?: PixivParams & {content_type: "illust"}) => {
        const response = await this.api.get(`/v1/illust/new`, params)
        return response as Promise<PixivIllustSearch>
    }

    public follow = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v2/illust/follow`, params)
        return response as Promise<PixivIllustSearch>
    }

    public comments = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/comments`, params)
        return response as Promise<PixivCommentSearch>
    }

    public commentsV2 = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/comments`, params)
        return response as Promise<PixivCommentSearch>
    }

    public commentReplies = async (params: PixivParams & {comment_id: number}) => {
        const response = await this.api.get(`/v1/illust/comment/replies`, params)
        return response as Promise<PixivCommentSearch>
    }

    public related = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/related`, params)
        return response as Promise<PixivIllustSearch>
    }

    public recommended = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/recommended`, params)
        return response as Promise<PixivIllustSearch>
    }

    public recommendedNoLogin = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/recommended-nologin`, params)
        return response as Promise<PixivIllustSearch>
    }

    public walkthrough = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/walkthrough/illusts`, params)
        return response as Promise<PixivIllustSearch>
    }

    public ranking = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/ranking`, params)
        return response as Promise<PixivIllustSearch>
    }

    public popularPreview = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/popular-preview/illust`, params)
        return response as Promise<PixivIllustSearch>
    }

    public trendingTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/trending-tags/illust`, params)
        return response as Promise<PixivTrendTags>
    }

    public bookmarkDetail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/bookmark/detail`, params)
        return response as Promise<PixivBookmarkDetail>
    }

    public bookmarkTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/user/bookmark-tags/illust`, params)
        return response as Promise<PixivBookmarkSearch>
    }

    public bookmarkRanges = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/bookmark-ranges/illust`, params)
        return response as Promise<PixivBookmarkSearch>
    }
}
