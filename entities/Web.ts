import api from "../API"
import {PixivCandidates, PixivWebParams} from "../types"

export class Web {
    constructor(private readonly api: api) {}

    /**
     * Gets suggested candidates from web url that includes tag translation and access count.
     */
    public candidates = async (params?: PixivWebParams) => {
        const response = await this.api.getWeb(`/rpc/cps.php`, params)
        return response as Promise<PixivCandidates>
    }
}
