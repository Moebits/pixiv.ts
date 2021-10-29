import api from "../API"
import {PixivBookmarkDetail, PixivBookmarkSearch, PixivFollowDetail, PixivIllustSearch, PixivNovelSearch,
PixivParams, PixivUserDetail, PixivUserSearch, PixivNovel} from "../types"

export class User {
    public nextURL: string | null = null
    constructor(private readonly api: api) {}

    /**
     * Gets a user by URL or ID.
     */
    public get = async (userResolvable: string | number) => {
        const userId = String(userResolvable).match(/\d{8,}/)
        if (!userId) return Promise.reject("Invalid id or url provided.")
        const response = await this.detail({user_id: Number(userId[0])})
        return response
    }

    /**
     * Gets a detailed user profile.
     */
    public detail = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/detail`, params)
        return response as Promise<PixivUserDetail>
    }

    /**
     * Gets all illusts by the user.
     */
    public illusts = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/illusts`, params) as PixivIllustSearch
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Gets all novels by the user.
     */
    public novels = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/novels`, params) as PixivNovelSearch
        this.nextURL = response.next_url
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        return response.novels
    }

    /**
     * Gets all the public bookmarked illusts by the user.
     */
    public bookmarksIllust = async (params: PixivParams & {user_id: number}) => {
        if (!params.restrict) params.restrict = "public"
        const response = await this.api.get(`/v1/user/bookmarks/illust`, params) as PixivIllustSearch
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Gets bookmark illust tags.
     */
    public bookmarkIllustTags = async (params?: PixivParams) => {
        if (!params) params = {}
        params.restrict = "public"
        const response = await this.api.get(`/v1/user/bookmark-tags/illust`, params) as PixivBookmarkSearch
        this.nextURL = response.next_url
        return response.bookmark_tags
    }

    /**
     * Gets details on a bookmark.
     */
    public bookmarkDetail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/bookmark/detail`, params)
        return response as Promise<PixivBookmarkDetail>
    }

    /**
     * Gets a user's public bookmarked novels.
     */
    public bookmarksNovel = async (params: PixivParams & {user_id: number}) => {
        if (!params.restrict) params.restrict = "public"
        const response = await this.api.get(`/v1/user/bookmarks/novel`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Fetches bookmark novel tags.
     */
    public bookmarkNovelTags = async (params: PixivParams & {user_id: number}) => {
        if (!params.restrict) params.restrict = "public"
        const response = await this.api.get(`/v1/user/bookmark-tags/novel`, params) as PixivBookmarkSearch
        this.nextURL = response.next_url
        return response.bookmark_tags
    }

    /**
     * Fetches the users a user is following.
     */
    public following = async (params: PixivParams & {user_id: number}) => {
        if (!params.restrict) params.restrict = "public"
        const response = await this.api.get(`/v1/user/following`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Fetches the followers of a user.
     */
    public followers = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/follower`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Gets the MyPixiv of a user.
     */
    public myPixiv = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/mypixiv`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Gets recommended users.
     */
    public recommended = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/user/recommended`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Gets details on a user follow.
     */
    public followDetail = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/follow/detail`, params)
        return response as Promise<PixivFollowDetail>
    }
}
