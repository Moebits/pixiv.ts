import api from "../API"
import {PixivBookmarkDetail, PixivBookmarkRanges, PixivBookmarkSearch, PixivCommentSearch, PixivCommentSearchV2, PixivIllust,
PixivIllustDetail, PixivIllustSearch, PixivParams, PixivTrendTags} from "../types"
import {Search} from "./index"

export class Illust {
    public nextURL: string | null = null
    private readonly search = new Search(this.api)
    public constructor(protected readonly api: api) {}

    /**
     * Gets an illust by either URL or ID.
     */
    public get = async (illustResolvable: string | number, params?: PixivParams) => {
        let illustId = String(illustResolvable).match(/\d{8,}/) ? String(illustResolvable).match(/\d{8,}/)[0] : null
        if (!illustId) {
            if (!params) params = {}
            params.word = String(illustResolvable)
            let illusts = await this.search.illusts(params as PixivParams & {word: string})
            Array.prototype.sort.call(illusts, ((a: PixivIllust, b: PixivIllust) => (a.total_bookmarks - b.total_bookmarks) * -1))
            illusts = illusts.filter((i) => {
                return (i.type === "illust" || i.type === "ugoira") ? true : false
            })
            illustId = String(illusts[0].id)
        }
        const response = await this.detail({illust_id: Number(illustId)})
        response.url = `https://www.pixiv.net/en/artworks/${response.id}`
        return response
    }

    /**
     * Gets the details for an illust.
     */
    public detail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/detail`, params) as PixivIllustDetail
        if (response.illust.type === "novel") return Promise.reject(`This is not an illust, it is a novel.`)
        response.illust.url = `https://www.pixiv.net/en/artworks/${response.illust.id}`
        return response.illust
    }

    /**
     * Gets the URLS of all the pages for an illust.
     */
    public getPages = async (illust: PixivIllust) => {
        const urls: string[] = []
        if (!illust.meta_pages[0]) {
            urls.push(illust.image_urls.large ? illust.image_urls.large : illust.image_urls.medium)
        } else {
            for (let i = 0; i < illust.meta_pages.length; i++) {
                urls.push(illust.meta_pages[i].image_urls.large ? illust.meta_pages[i].image_urls.large : illust.meta_pages[i].image_urls.medium)
            }
        }
        return urls
    }

    /**
     * Gets new illusts.
     */
    public new = async (params?: PixivParams) => {
        if (!params) params = {}
        params.content_type = "illust"
        const response = await this.api.get(`/v1/illust/new`, params) as PixivIllustSearch
        if (params.type) response.illusts = response.illusts.filter((i: PixivIllust) => i.type === params.type)
        response.illusts.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Gets illusts from users you follow.
     */
    public follow = async (params: PixivParams & {user_id: number}) => {
        if (!params.restrict) params.restrict = "all"
        const response = await this.api.get(`/v2/illust/follow`, params) as PixivIllustSearch
        if (params.type) response.illusts = response.illusts.filter((i: PixivIllust) => i.type === params.type)
        response.illusts.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Fetches the comments on an illust.
     */
    public comments = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/comments`, params)
        return response as Promise<PixivCommentSearch>
    }

    /**
     * The difference from the V1 API is that parent_comment was replaced with
     * has_replies.
     */
    public commentsV2 = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/comments`, params)
        return response as Promise<PixivCommentSearchV2>
    }

    /**
     * Gets recommended illusts.
     */
    public recommended = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/recommended`, params) as PixivIllustSearch
        if (params.type) response.illusts = response.illusts.filter((i: PixivIllust) => i.type === params.type)
        response.illusts.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Gets illusts from the ranking. Defaults to daily ranking
     */
    public ranking = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.mode) params.mode = "day"
        const response = await this.api.get(`/v1/illust/ranking`, params) as PixivIllustSearch
        if (params.type) response.illusts = response.illusts.filter((i: PixivIllust) => i.type === params.type)
        response.illusts.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Searches illusts in the popular previews.
     */
    public popularPreview = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/popular-preview/illust`, params) as PixivIllustSearch
        if (params.type) response.illusts = response.illusts.filter((i: PixivIllust) => i.type === params.type)
        response.illusts.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Gets trending tags.
     */
    public trendingTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/trending-tags/illust`, params)
        return response as Promise<PixivTrendTags>
    }

    /**
     * Gets the details for a bookmark.
     */
    public bookmarkDetail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/bookmark/detail`, params)
        return response as Promise<PixivBookmarkDetail>
    }

    /**
     * Gets the tags for a bookmark.
     */
    public bookmarkTags = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.restrict) params.restrict = "public"
        const response = await this.api.get(`/v1/user/bookmark-tags/illust`, params) as PixivBookmarkSearch
        this.nextURL = response.next_url
        return response.bookmark_tags
    }

    /**
     * Gets the bookmark ranges.
     */
    public bookmarkRanges = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/bookmark-ranges/illust`, params)
        return response as Promise<PixivBookmarkRanges>
    }
}
