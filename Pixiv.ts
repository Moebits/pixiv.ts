import axios, {AxiosRequestConfig} from "axios"
import * as crypto from "crypto"
import {ParsedUrlQueryInput, stringify} from "querystring"
import api from "./API"
import {Illust} from "./entities/index"
import {PixivAPIResponse} from "./types/ApiTypes"
import {PixivAuthData, PixivAuthHeaders} from "./types/index"

const oauthURL = "https://oauth.secure.pixiv.net/auth/token"

const clientId = "MOBrBDS8blbauoSck0ZfDbtuzpyT"
const clientSecret = "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj"
const hashSecret = "28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c"
const clientTime = new Date().toISOString()
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

export default class Pixiv {
    public static accessToken: string
    public static refreshToken: string
    public api = new api(data, headers, Pixiv.refreshToken, Pixiv.accessToken, this.loginTime, this.expirationTime)
    public illust = new Illust(this.api)

    private constructor(private readonly loginTime: number, private readonly expirationTime: number) {}

    public refreshToken = async (refreshToken?: string) => {
        if (!refreshToken) refreshToken = Pixiv.refreshToken
        if (!refreshToken) return Promise.reject("You must login with a username and password first.")
        Pixiv.refreshToken = await this.api.refreshAccessToken(refreshToken)
        this.api = new api(data, headers, Pixiv.refreshToken, Pixiv.accessToken, this.loginTime, this.expirationTime)
        this.illust = new Illust(this.api)
        return Pixiv.refreshToken
    }

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
            data.grant_type = "refresh_token"
        }
        const result = await axios.post(oauthURL, stringify(data as unknown as ParsedUrlQueryInput), {headers} as AxiosRequestConfig).then((r) => r.data.response) as PixivAPIResponse
        Pixiv.accessToken = result.access_token
        Pixiv.refreshToken = result.refresh_token
        headers.authorization = `Bearer ${Pixiv.accessToken}`
        return new Pixiv(Date.now(), result.expires_in)
    }
}

module.exports.default = Pixiv
