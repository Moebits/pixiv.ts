import api from "../API"
import replace from "../Replace"
import {PixivAutoComplete, PixivAutoCompleteV2, PixivIllustSearch,
PixivNovelSearch, PixivParams, PixivUserSearch} from "../types"

export class Search {
    constructor(private readonly api: api) {}

    /**
     * Default params for searches are `partial_match_for_tags` and `date_desc`.
     */
    private readonly searchDefaults = (params?: PixivParams & {word: string}) => {
        if (!params.search_target) params.search_target = "partial_match_for_tags"
        if (!params.sort) params.sort = "date_desc"
        return params
    }

    /**
     * Searches for illusts with a query.
     */
    public illusts = async (params: PixivParams & {word: string}) => {
        params = this.searchDefaults(params)
        params.word = replace.replaceTag(params.word)
        const response = await this.api.get(`/v1/search/illust`, params)
        return response as Promise<PixivIllustSearch>
    }

    /**
     * Searches for novels with a query.
     */
    public novels = async (params: PixivParams & {word: string}) => {
        params = this.searchDefaults(params)
        params.word = replace.replaceTag(params.word)
        const response = await this.api.get(`/v1/search/novel`, params)
        return response as Promise<PixivNovelSearch>
    }

    /**
     * Searches for users with a query.
     */
    public users = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/user`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Gets autocompleted keywords for the word.
     */
    public autoComplete = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v1/search/autocomplete`, params)
        return response as Promise<PixivAutoComplete>
    }

    /**
     * The V2 endpoint includes translated names.
     */
    public autoCompleteV2 = async (params: PixivParams & {word: string}) => {
        const response = await this.api.get(`/v2/search/autocomplete`, params)
        return response as Promise<PixivAutoCompleteV2>
    }
}
