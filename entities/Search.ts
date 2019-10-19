import api from "../API"
import {PixivAutoComplete, PixivIllustSearch, PixivNovelSearch,
PixivParams, PixivUserSearch} from "../types"

type SearchDefaults = {word: string, search_target: "partial_match_for_tags", sort: "date_desc"}

export class Search {
    constructor(private readonly api: api) {}

    public illusts = async (params: PixivParams & SearchDefaults) => {
        const response = await this.api.get(`/v1/search/illust`, params)
        return response as Promise<PixivIllustSearch>
    }

    public novels = async (params: PixivParams & SearchDefaults) => {
        const response = await this.api.get(`/v1/search/novel`, params)
        return response as Promise<PixivNovelSearch>
    }

    public users = async (params: PixivParams & SearchDefaults) => {
        const response = await this.api.get(`/v1/search/user`, params)
        return response as Promise<PixivUserSearch>
    }

    public autoComplete = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/autocomplete`, params)
        return response as Promise<PixivAutoComplete>
    }

    public autoCompleteV2 = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v2/search/autocomplete`, params)
        return response as Promise<PixivAutoComplete>
    }
}
