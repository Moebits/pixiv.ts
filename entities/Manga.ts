import api from "../API"
import {PixivManga, PixivMangaDetail, PixivMangaSearch, PixivParams} from "../types"
import {Search} from "./index"

export class Manga {
    public nextURL: string | null = null
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
            let illusts = await this.search.illusts(params as PixivParams & {word: string})
            Array.prototype.sort.call(illusts, ((a: PixivManga, b: PixivManga) => (a.total_bookmarks - b.total_bookmarks) * -1))
            illusts = illusts.filter((i) => {
                return (i.type === "manga") ? true : false
            })
            illustId = String(illusts[0].id)
        }
        const response = await this.detail({illust_id: Number(illustId)})
        response.url = `https://www.pixiv.net/en/artworks/${response.id}`
        return response
    }

    /**
     * Gets all of the pages in a manga.
     */
    public getPages = async (manga: PixivManga) => {
        const urls: string[] = []
        if (!manga.meta_pages[0]) {
            urls.push(manga.image_urls.large ? manga.image_urls.large : manga.image_urls.medium)
        } else {
            for (let i = 0; i < manga.meta_pages.length; i++) {
                urls.push(manga.meta_pages[i].image_urls.large ? manga.meta_pages[i].image_urls.large : manga.meta_pages[i].image_urls.medium)
            }
        }
        return urls
    }

    /**
     * Gets the details for a manga.
     */
    public detail = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/illust/detail`, params) as PixivMangaDetail
        if (response.illust.type !== "manga") return Promise.reject(`This is not a manga, it is an ${response.illust.type}`)
        response.illust.url = `https://www.pixiv.net/en/artworks/${response.illust.id}`
        return response.illust
    }

    /**
     * Fetches new manga.
     */
    public new = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/new`, params) as PixivMangaSearch
        response.illusts.forEach((i: PixivManga) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }

    /**
     * Fetches recommended manga.
     */
    public recommended = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.include_ranking_label) params.include_ranking_label = true
        const response = await this.api.get(`v1/manga/recommended`, params) as PixivMangaSearch
        response.illusts.forEach((i: PixivManga) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        this.nextURL = response.next_url
        return response.illusts
    }
}
