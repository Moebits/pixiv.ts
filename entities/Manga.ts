import api from "../API"
import {PixivMangaSearch, PixivParams} from "../types"

export class Manga {
    constructor(private readonly api: api) {}

    public new = async (params?: PixivParams) => {
        const response = await this.api.get(`/v1/illust/new`, params)
        return response as Promise<PixivMangaSearch>
    }

    public recommended = async (params?: PixivParams & {include_ranking_label: true}) => {
        const response = await this.api.get(`v1/manga/recommended`, params)
        return response as Promise<PixivMangaSearch>
    }
}
