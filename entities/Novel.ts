import api from "../API"
import {PixivBookmarkDetail, PixivBookmarkRanges, PixivCommentSearch, PixivCommentSearchV2,
PixivNovel, PixivNovelDetail, PixivNovelSearch, PixivNovelText, PixivParams, PixivTrendTags} from "../types"
import {Search} from "./index"

export class Novel {
    public nextURL: string | null = null
    private readonly search = new Search(this.api)
    constructor(private readonly api: api) {}

    /**
     * Gets a novel by URL or ID.
     */
    public get = async (novelResolvable: string | number, params?: PixivParams) => {
        let novelId = String(novelResolvable).match(/\d{8,}/) ? String(novelResolvable).match(/\d{8,}/)[0] : null
        if (!novelId) {
            if (!params) params = {}
            params.word = String(novelResolvable)
            let illusts = await this.search.illusts(params as PixivParams & {word: string})
            Array.prototype.sort.call(illusts, ((a: PixivNovel, b: PixivNovel) => (a.total_bookmarks - b.total_bookmarks) * -1))
            illusts = illusts.filter((i) => {
                return (i.type === "novel") ? true : false
            })
            novelId = String(illusts[0].id)
        }
        const response = await this.detail({novel_id: Number(novelId)})
        response.url = `https://www.pixiv.net/novel/show.php?id=${response.id}`
        response.type = "novel"
        return response
    }

    /**
     * Gets the details for a novel.
     */
    public detail = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v2/novel/detail`, params) as PixivNovelDetail
        response.novel.url = `https://www.pixiv.net/novel/show.php?id=${response.novel.id}`
        response.novel.type = "novel"
        return response.novel
    }

    /**
     * Gets the text for a novel.
     */
    public text = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v1/novel/text`, params)
        return response as Promise<PixivNovelText>
    }

    /**
     * Gets new novels.
     */
    public new = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/new`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Gets novels from users you follow.
     */
    public follow = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.restrict) params.restrict = "all"
        const response = await this.api.get(`/v1/novel/follow`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Gets recommended novels.
     */
    public recommended = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/novel/recommended`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Fetches novels from the popular preview.
     */
    public popularPreview = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/popular-preview/novel`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Gets novel bookmark ranges.
     */
    public bookmarkRanges = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/bookmark-ranges/novel`, params)
        return response as Promise<PixivBookmarkRanges>
    }

    /**
     * Gets novel trending tags.
     */
    public trendingTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/trending-tags/novel`, params)
        return response as Promise<PixivTrendTags>
    }

    /**
     * Gets the comments on a novel.
     */
    public comments = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v1/novel/comments`, params)
        return response as Promise<PixivCommentSearch>
    }

    /**
     * CommentsV2 replaces parent_comment with has_replies.
     */
    public commentsV2 = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v2/novel/comments`, params)
        return response as Promise<PixivCommentSearchV2>
    }

    /**
     * Gets all the novels in the series.
     */
    public series = async (params: PixivParams & {series_id: number}) => {
        const response = await this.api.get(`/v1/novel/series`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Gets novel rankings. Defaults to daily rankings.
     */
    public ranking = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.mode) params.mode = "day"
        const response = await this.api.get(`/v1/novel/ranking`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Gets the details of a novel bookmark.
     */
    public bookmarkDetail = async (params: PixivParams & {novel_id: number}) => {
        const response = await this.api.get(`/v2/novel/bookmark/detail`, params)
        return response as Promise<PixivBookmarkDetail>
    }
}
