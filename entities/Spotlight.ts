import api from "../API"
import {PixivArticleSearch, PixivParams} from "../types"

export class Spotlight {
    constructor(private readonly api: api) {}

    /**
     * Gets articles on pixivision.
     */
    public articles = async (params?: PixivParams) => {
        if (!params) params = {}
        if (!params.category) params.category = "all"
        const response = await this.api.get(`/v1/spotlight/articles`, params)
        return response as Promise<PixivArticleSearch>
    }
}
