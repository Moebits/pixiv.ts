import axios, {AxiosRequestConfig} from "axios"
import * as crypto from "crypto"
import {ParsedUrlQueryInput, stringify} from "querystring"
import api from "./API"
import {Illust, Manga, Novel, Search, Spotlight, Ugoira, User, Util, Web} from "./entities/index"
import {PixivAPIResponse, PixivAuthData, PixivAuthHeaders} from "./types/index"

const oauthURL = "https://oauth.secure.pixiv.net/auth/token"

const clientId = "MOBrBDS8blbauoSck0ZfDbtuzpyT"
const clientSecret = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj"
const hashSecret = "28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c"
const clientTime = new Date().toISOString().slice(0, -5) + "+00:00"
const clientHash = crypto.createHash("md5").update(String(clientTime + hashSecret)).digest("hex")

const data: PixivAuthData = {
    client_id: clientId,
    client_secret: clientSecret,
    get_secure_url: true
}

const headers: PixivAuthHeaders = {
    "app-os": "ios",
    "app-os-version": "13.2.0",
    "app-version": "7.7.5",
    "user-agent": "PixivIOSApp/7.7.5 (iOS 13.2.0; iPhone XR)",
    "host": "oauth.secure.pixiv.net",
    "accept-language": "en_US",
    "x-client-time": clientTime,
    "x-client-hash": clientHash,
    "content-type": "application/x-www-form-urlencoded",
    "accept-encoding": "gzip"
}

/**
 * The main class for interacting with the Pixiv API.
 */
export default class Pixiv {
    public static accessToken: string
    public static refreshToken: string
    public acceptLanguage: 'English' | undefined
    public api = new api(data, headers, Pixiv.refreshToken, Pixiv.accessToken, this.loginTime, this.expirationTime)
    public illust = new Illust(this.api)
    public manga = new Manga(this.api)
    public novel = new Novel(this.api)
    public search = new Search(this.api)
    public user = new User(this.api)
    public ugoira = new Ugoira(this.api)
    public util = new Util(this.api)
    public spotlight = new Spotlight(this.api)
    public web = new Web(this.api)

    private constructor(private readonly loginTime: number, private readonly expirationTime: number) {}

    /**
     * Refreshes your refresh token and access token if they have expired.
     */
    public refreshToken = async (refreshToken?: string) => {
        if (!refreshToken) refreshToken = Pixiv.refreshToken
        if (!refreshToken) return Promise.reject("You must login with a username and password first.")
        Pixiv.refreshToken = await this.api.refreshAccessToken(refreshToken)
        this.api = new api(data, headers, Pixiv.refreshToken, Pixiv.accessToken, this.loginTime, this.expirationTime, this.acceptLanguage)
        this.illust = new Illust(this.api)
        this.illust = new Illust(this.api)
        this.manga = new Manga(this.api)
        this.novel = new Novel(this.api)
        this.search = new Search(this.api)
        this.user = new User(this.api)
        this.ugoira = new Ugoira(this.api)
        this.util = new Util(this.api)
        this.spotlight = new Spotlight(this.api)
        this.web = new Web(this.api)
        return Pixiv.refreshToken
    }

    /**
     * Set language to interact with the API. If language is set to Japanese, then Accept-Language header will not be passed into the api
     */
    public setLanguage = (language: 'English' | 'Japanese') => {
        this.acceptLanguage = language === 'Japanese' ? undefined : language
        this.api = new api(data, headers, Pixiv.refreshToken, Pixiv.accessToken, this.loginTime, this.expirationTime, this.acceptLanguage)
        this.illust = new Illust(this.api)
        this.illust = new Illust(this.api)
        this.manga = new Manga(this.api)
        this.novel = new Novel(this.api)
        this.search = new Search(this.api)
        this.user = new User(this.api)
        this.ugoira = new Ugoira(this.api)
        this.util = new Util(this.api)
        this.spotlight = new Spotlight(this.api)
        this.web = new Web(this.api)
    }


    /**
     * Logs into Pixiv with your username and password, or refresh token if it is available.
     */
    public static login = async (username: string, password: string) => {
        if (!username || !password) {
            const missing = username ? "password" : (password ? "username" : "username and password")
            return Promise.reject(`You must provide a ${missing} in order to login!`)
        }
        if (!Pixiv.refreshToken) {
            data.username = username
            data.password = password
            data.grant_type = "password"
        } else {
            data.refresh_token = Pixiv.refreshToken
            data.grant_type = "refresh_token"
        }
        const result = await axios.post(oauthURL, stringify(data as unknown as ParsedUrlQueryInput), {headers} as AxiosRequestConfig).then((r) => r.data) as PixivAPIResponse
        Pixiv.accessToken = result.response.access_token
        Pixiv.refreshToken = result.response.refresh_token
        headers.authorization = `Bearer ${Pixiv.accessToken}`
        return new Pixiv(Date.now(), result.response.expires_in)
    }

    /**
     * Logs in with username and password only.
     */
    public static passwordLogin = async (username: string, password: string) => {
        if (!username || !password) {
            const missing = username ? "password" : (password ? "username" : "username and password")
            return Promise.reject(`You must provide a ${missing} in order to login!`)
        }
        data.username = username
        data.password = password
        data.grant_type = "password"
        const result = await axios.post(oauthURL, stringify(data as unknown as ParsedUrlQueryInput), {headers} as AxiosRequestConfig).then((r) => r.data) as PixivAPIResponse
        Pixiv.accessToken = result.response.access_token
        Pixiv.refreshToken = result.response.refresh_token
        headers.authorization = `Bearer ${Pixiv.accessToken}`
        return new Pixiv(Date.now(), result.response.expires_in)
    }

    /**
     * Logs in with refresh token only.
     */
    public static refreshLogin = async (refreshToken: string) => {
        data.refresh_token = refreshToken
        data.grant_type = "refresh_token"
        const result = await axios.post(oauthURL, stringify(data as unknown as ParsedUrlQueryInput), {headers} as AxiosRequestConfig).then((r) => r.data) as PixivAPIResponse
        Pixiv.accessToken = result.response.access_token
        Pixiv.refreshToken = result.response.refresh_token
        headers.authorization = `Bearer ${Pixiv.accessToken}`
        return new Pixiv(Date.now(), result.response.expires_in)
    }
}

module.exports.default = Pixiv
export * from "./entities/index"
export * from "./types/index"
