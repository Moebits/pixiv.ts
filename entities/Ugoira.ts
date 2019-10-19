import api from "../API"
import {PixivParams, UgoiraMetaData} from "../types"

export class Ugoira {
    constructor(private readonly api: api) {}

    public get = async (ugoiraResolvable: string | number) => {
        const ugoiraId = String(ugoiraResolvable).match(/\d{8,}/) ? String(ugoiraResolvable).match(/\d{8,}/)[0] : null
        if (!ugoiraId) return Promise.reject("This url or id is invalid.")
        return this.metadata({illust_id: Number(ugoiraId)})
    }

    public metadata = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/ugoira/metadata`, params)
        return response as Promise<UgoiraMetaData>
    }

}
