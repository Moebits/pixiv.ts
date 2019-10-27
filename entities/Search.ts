import api from "../API"
import replace from "../Translate"
import {PixivAutoComplete, PixivAutoCompleteV2, PixivIllust,
PixivIllustSearch, PixivNovel, PixivNovelSearch, PixivParams, PixivUserSearch} from "../types"

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

    private readonly processWord = async (params: PixivParams & {word: string}) => {
        if (!params.en) params.word = await replace.translateTag(params.word)
        if (params.r18 !== undefined) {
            switch (params.r18) {
                case true:
                    params.word += " R-18"
                    break
                case false:
                    params.word += " -R-18"
                    break
                default:
            }
        }
        if (params.bookmarks) {
            params.word += ` ${params.bookmarks}users入り`
        }
        return params
    }

    /**
     * Searches for illusts with a query.
     */
    public illusts = async (params: PixivParams & {word: string}) => {
        params = this.searchDefaults(params)
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/illust`, params)
        if (params.type) response.illusts = response.illusts.filter((i: PixivIllust) => i.type === params.type)
        response.illusts.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        return response as Promise<PixivIllustSearch>
    }

    /**
     * Searches for novels with a query.
     */
    public novels = async (params: PixivParams & {word: string}) => {
        params = this.searchDefaults(params)
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/novel`, params)
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        return response as Promise<PixivNovelSearch>
    }

    /**
     * Searches for users with a query.
     */
    public users = async (params: PixivParams & {word: string}) => {
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/user`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Gets autocompleted keywords for the word.
     */
    public autoComplete = async (params: PixivParams & {word: string}) => {
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/autocomplete`, params)
        return response as Promise<PixivAutoComplete>
    }

    /**
     * The V2 endpoint includes translated names.
     */
    public autoCompleteV2 = async (params: PixivParams & {word: string}) => {
        params = await this.processWord(params)
        const response = await this.api.get(`/v2/search/autocomplete`, params)
        return response as Promise<PixivAutoCompleteV2>
    }
}
