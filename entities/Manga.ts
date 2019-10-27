import api from "../API"
import {PixivManga, PixivMangaDetail, PixivMangaSearch, PixivParams} from "../types"
import {Search} from "./index"

export class Manga {
    private readonly search = new Search(this.api)
    public constructor(private readonly api: api) {}

    /**
     * Gets a manga by URL or ID.
     */
    public get = async (illustResolvable: string | number, params?: PixivParams) => {
        let illustId = String(illustResolvable).match(/\d{8,}/) ? String(illustResolvable).match(/\d{8,}/)[0] : null
        if (!illustId) {
            if (!params) params = {}
            params.word = String(illustResolvable)
            const result = await this.search.illusts(params as PixivParams & {word: string})
            let illusts = result.illusts
            Array.prototype.sort.call(illusts, ((a: PixivManga, b: PixivManga) => (a.total_bookmarks - b.total_bookmarks) * -1))
            illusts = illusts.filter((i) => {
                return (i.type === "manga") ? true : false
            })
            illustId = String(illusts[0].id)
        }
        const response = await this.detail({illust_id: Number(illustId)})
        response.illust.url = `https://www.pixiv.net/en/artworks/${response.illust.id}`
        return response
    }

    /**
     * Gets all of the pages in a manga.
     */
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

    /**
     * Gets the details for a manga.
     */
    public detail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/detail`, params)
        if (response.illust.type !== "manga") return Promise.reject(`This is not a manga, it is an ${response.illust.type}`)
        response.illust.url = `https://www.pixiv.net/en/artworks/${response.illust.id}`
        return response as Promise<PixivMangaDetail>
    }

    /**
     * Fetches new manga.
     */
    public new = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/new`, params)
        response.illusts.forEach((i: PixivManga) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        return response as Promise<PixivMangaSearch>
    }

    /**
     * Fetches recommended manga.
     */
    public recommended = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.include_ranking_label) params.include_ranking_label = true
        const response = await this.api.get(`v1/manga/recommended`, params)
        response.illusts.forEach((i: PixivManga) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        return response as Promise<PixivMangaSearch>
    }
}
