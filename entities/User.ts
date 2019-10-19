import api from "../API"
import {PixivIllustSearch, PixivNovelSearch, PixivParams, PixivUserDetail, PixivUserSearch} from "../types"

export class User {
    constructor(private readonly api: api) {}

    public detail = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/detail`, params)
        return response as Promise<PixivUserDetail>
    }

    public illusts = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/illusts`, params)
        return response as Promise<PixivIllustSearch>
    }

    public novels = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/novels`, params)
        return response as Promise<PixivNovelSearch>
    }

    public illustBookmarks = async (params: PixivParams & {user_id: number, restrict: "public"}) => {
        const response = await this.api.get(`/v1/user/bookmarks/illust`, params)
        return response as Promise<PixivIllustSearch>
    }

    public bookmarkIllustTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/user/bookmark-tags/illust`, params)
        return response
    }

    public bookmarkDetail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v2/illust/bookmark/detail`, params)
        return response
    }

    public novelBookmarks = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/bookmarks/novel`, params)
        return response
    }

    public bookmarkNovelTags = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/user/bookmark-tags/novel`, params)
        return response
    }

    public following = async (params: PixivParams & {user_id: number, restrict: "public"}) => {
        const response = await this.api.get(`/v1/user/following`, params)
        return response as Promise<PixivUserSearch>
    }

    public followers = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/follower`, params)
        return response as Promise<PixivUserSearch>
    }

    public myPixiv = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/mypixiv`, params)
        return response as Promise<PixivUserSearch>
    }

    public recommended = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/user/recommended`, params)
        return response as Promise<PixivUserSearch>
    }

    public followDetail = async (params: PixivParams & {user_id: number}) => {
        const response = await this.api.get(`/v1/user/follow/detail`, params)
        return response
    }
}
