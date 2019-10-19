import api from "../API"
import {PixivManga, PixivMangaDetail, PixivMangaSearch, PixivParams} from "../types"

export class Manga {
    constructor(private readonly api: api) {}

    public get = async (illustResolvable: string | number) => {
        const illustId = String(illustResolvable).match(/\d{8,}/)
        if (!illustId) return Promise.reject("Invalid id or url provided.")
        const response = await this.detail({illust_id: Number(illustId[0])})
        return response
    }

    public getPages = async (manga: PixivManga, size?: string) => {
        if (!size) size = "medium"
        const urls: string[] = []
        if (!manga.meta_pages[0]) {
            urls.push(manga.image_urls[size])
        } else {
            for (let i = 0; i < manga.meta_pages.length; i++) {
                urls.push(manga.meta_pages[i].image_urls[size])
            }
        }
        return urls
    }

    public detail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/detail`, params)
        if (response.illust.type !== "manga") return Promise.reject(`This is not a manga, it is an ${response.illust.type}`)
        return response as Promise<PixivMangaDetail>
    }

    public new = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/new`, params)
        return response as Promise<PixivMangaSearch>
    }

    public recommended = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.include_ranking_label) params.include_ranking_label = true
        const response = await this.api.get(`v1/manga/recommended`, params)
        return response as Promise<PixivMangaSearch>
    }
}
