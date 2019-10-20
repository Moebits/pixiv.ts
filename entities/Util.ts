import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as stream from "stream"
import * as unzip from "unzip"
import api from "../API"
import {PixivFolderMap, PixivIllustSearch, PixivMultiCall} from "../types"

export class Util {
    constructor(private readonly api: api) {}

    public parseID = (input: string) => {
        const parsed = input.match(/\d{8,}/)
        return parsed ? Number(parsed) : null
    }

    public timeout = async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    public multiCall = async (response: PixivMultiCall, limit?: number) => {
        const responseArray = []
        let counter = limit || Infinity
        if (!response.next_url) return Promise.reject("You can only use this method on search responses.")
        while ((response.next_url !== null) || (counter === 0)) {
            response = await this.api.next(response.next_url)
            if (response.hasOwnProperty("illusts")) {
                responseArray.push(response.illusts)
            } else if (response.hasOwnProperty("user_previews")) {
                responseArray.push(response.user_previews)
            } else if (response.hasOwnProperty("comments")) {
                responseArray.push(response.comments)
            } else if (response.hasOwnProperty("novels")) {
                responseArray.push(response.novels)
            } else if (response.hasOwnProperty("bookmark_tags")) {
                responseArray.push(response.bookmark_tags)
            }
            await this.timeout(1000)
            counter--
        }
        return responseArray.flat(Infinity)
    }

    public downloadZip = async (url: string, dest: string) => {
        dest = path.join(path.resolve(__dirname, dest), url.match(/\d{8,}/)[0])
        const writeStream = await axios.get(url, {headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(unzip.Extract({path: dest})))

        this.awaitStream(writeStream)
    }

    public downloadImage = async (url: string, dest: string) => {
        dest = path.join(path.resolve(__dirname, dest), `${url.match(/\d{8,}/)[0]}.png`)
        const writeStream = await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(dest))

        this.awaitStream(writeStream)
    }

    public awaitStream = async (writeStream: stream.Writable) => {
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
        })
    }

    public massDownload = async (response: PixivIllustSearch, dest: string, folderMap?: PixivFolderMap[]) => {
        dest = path.resolve(__dirname, dest)
        loop1:
        for (let i = 0; i < response.illusts.length; i++) {
            const illust = response.illusts[i]
            if (folderMap) {
                for (let j = 0, k = 0; j < folderMap.length, k < illust.tags.length; j++, k++) {
                    if (folderMap[j].tag.includes(illust.tags[k].name)) {
                        await this.downloadImage(illust.image_urls.medium, path.join(dest, folderMap[j].folder))
                        continue loop1
                    }
                }
            }
            await this.downloadImage(illust.image_urls.medium, dest)
        }
    }
}
