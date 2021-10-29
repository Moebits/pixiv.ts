import api from "../API"
import Pixiv from "../pixiv"
import replace from "../Translate"
import axios from "axios"
import {PixivAutoComplete, PixivAutoCompleteV2, PixivIllust,
PixivIllustSearch, PixivNovel, PixivNovelSearch, PixivParams, PixivUserSearch} from "../types"

export class Search {
    public nextURL: string | null = null
    private readonly defaults = [
        "gabriel dropout", "kisaragi", "azur lane", "konosuba",
        "megumin", "aqua", "black tights", "white tights", "eromanga sensei",
        "sagiri", "kancolle", "loli", "is the order a rabbit", "chino", "kiniro mosaic",
        "gabriel", "hibiki", "tohru", "laffey", "kanna", "tights"
    ]
    constructor(private readonly api: api) {}

    /**
     * Default params for searches are `partial_match_for_tags` and `date_desc`.
     */
    private readonly searchDefaults = (params?: PixivParams) => {
        if (!params?.word) params.word = this.defaults[Math.floor(Math.random()*this.defaults.length)]
        if (!params?.search_target) params.search_target = "partial_match_for_tags"
        if (!params?.sort) params.sort = "date_desc"
        return params
    }

    private readonly processWord = async (params: PixivParams) => {
        if (!params?.word) params.word = this.defaults[Math.floor(Math.random()*this.defaults.length)]
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
        if (params.bookmarks && Number(params.bookmarks) > 0) {
            params.word += ` ${params.bookmarks}users入り`
        }
        return params
    }

    /**
     * Searches for illusts with a query.
     */
    public illusts = async (params?: PixivParams & {moe?: boolean}) => {
        params = this.searchDefaults(params)
        params = await this.processWord(params)
        let response: PixivIllust[]
        if (params.moe) {
            let setUgoira = false
            if (params?.type === "ugoira") setUgoira = true
            response = await this.moe({query: params.word, r18: params.r18, en: params.en, ugoira: setUgoira})
            if (!response?.[0]) {
                params.moe = undefined
                const res = await this.api.get(`/v1/search/illust`, params) as PixivIllustSearch
                this.nextURL = res.next_url
                response = res.illusts
            }
        } else {
            const res = await this.api.get(`/v1/search/illust`, params) as PixivIllustSearch
            this.nextURL = res.next_url
            response = res.illusts
        }
        if (params.type) response = response.filter((i: PixivIllust) => i.type === params.type)
        response.forEach((i: PixivIllust) => i.url = `https://www.pixiv.net/en/artworks/${i.id}`)
        return response
    }

    /**
     * Searches for novels with a query.
     */
    public novels = async (params?: PixivParams) => {
        params = this.searchDefaults(params)
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/novel`, params) as PixivNovelSearch
        response.novels.forEach((i: PixivNovel) => i.url = `https://www.pixiv.net/novel/show.php?id=${i.id}`)
        response.novels.forEach((i: PixivNovel) => i.type = "novel")
        this.nextURL = response.next_url
        return response.novels
    }

    /**
     * Searches for users with a query.
     */
    public users = async (params?: PixivParams) => {
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/user`, params)
        return response as Promise<PixivUserSearch>
    }

    /**
     * Gets autocompleted keywords for the word.
     */
    public autoComplete = async (params?: PixivParams) => {
        params = await this.processWord(params)
        const response = await this.api.get(`/v1/search/autocomplete`, params)
        return response as Promise<PixivAutoComplete>
    }

    /**
     * The V2 endpoint includes translated names.
     */
    public autoCompleteV2 = async (params?: PixivParams) => {
        params = await this.processWord(params)
        const response = await this.api.get(`/v2/search/autocomplete`, params)
        return response as Promise<PixivAutoCompleteV2>
    }

    /**
     * Searches pixiv.moe. If there is no query, some defaults are provided.
     */
    public moe = async (params?: {query?: string, r18?: boolean, ugoira?: boolean, en?: boolean}) => {
        if (!params) params = {}
        if (!params?.query) params.query = this.defaults[Math.floor(Math.random()*this.defaults.length)]
        if (!params?.en) params.query = await replace.translateTag(params.query)
        if (params?.ugoira) params.query += " うごイラ"
        if (params?.r18 === true) {
            params.query += " R-18"
        } else {
            params.query += " -R-18"
        }
        const kotoriToken = await axios.get("https://api.pixiv.moe/session").then(((r) => r.data.response.access_token))
        const response = await axios.get(`https://api.pixiv.moe/v2/search?word=${encodeURIComponent(params.query)}`, {headers: {"x-kotori-token": kotoriToken}}).then((r) => r.data.response.illusts)
        return response as Promise<PixivIllust[]>
    }
}
