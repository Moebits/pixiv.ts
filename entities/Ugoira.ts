import api from "../API"
import {PixivParams, UgoiraMetaData} from "../types"

export class Ugoira {
    constructor(private readonly api: api) {}

    public metadata = async (params: PixivParams & {illust_id: number}) => {
        const response = await this.api.get(`/v1/ugoira/metadata`, params)
        return response as Promise<UgoiraMetaData>
    }

}
