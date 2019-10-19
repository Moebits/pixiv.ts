import axios, {AxiosRequestConfig} from "axios"
import {ParsedUrlQueryInput, stringify} from "querystring"
import {PixivParams} from "./dist/types/ApiTypes.d"
import {PixivAuthData, PixivAuthHeaders} from "./types/index"

const oauthURL = "https://oauth.secure.pixiv.net/auth/token"
const appURL = "https://app-api.pixiv.net/"
const webURL = "https://www.pixiv.net/"

export default class API {
    public constructor(private readonly data: PixivAuthData,
                       private readonly headers: PixivAuthHeaders,
                       private refreshToken: string,
                       private accessToken: string,
                       private readonly loginTime: number,
                       private readonly expirationTime: number) {}

    public refreshAccessToken = async (refreshToken?: string) => {
        if (refreshToken) this.refreshToken = refreshToken
        const expired = (Date.now() - this.loginTime) > (this.expirationTime * 900)
        if (expired) {
            this.data.grant_type = "refresh_token"
            const result = await axios.post(oauthURL, stringify(this.data as unknown as ParsedUrlQueryInput), {headers: this.headers} as AxiosRequestConfig).then((r) => r.data)
            this.accessToken = result.response.access_token
            this.refreshToken = result.response.refresh_token
            this.headers.authorization = `Bearer ${this.accessToken}`
        }
        return this.refreshToken
    }

    public get = async (endpoint: string, params?: PixivParams) => {
        await this.refreshAccessToken()
        if (!params) params = {}
        params.filter = "for_ios"
        // params.access_token = this.accessToken
        if (endpoint.startsWith("/")) endpoint = endpoint.slice(1)
        console.log(endpoint)
        console.log(params)
        const response = await axios.get(appURL + endpoint, {json: true, form: true, params} as AxiosRequestConfig).then((r) => r.data)
        return response
    }

}
