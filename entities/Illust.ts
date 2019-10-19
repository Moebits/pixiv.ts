import api from "../API"
import {PixivParams} from "./../types/ApiTypes"
import {PixivIllustDetail} from "./../types/IllustTypes"

export class Illust {
    constructor(private readonly api: api) {}

    public detail = async (params: PixivParams & {illust_id: number}) => {
        const result = await this.api.get(`/v1/illust/detail`, params)
        return result as PixivIllustDetail
    }

    public new = async (params?: PixivParams & {contentType: "illust"}) => {
        const result = await this.api.get(`/v1/illust/new`, params)
        return result
    }
}
