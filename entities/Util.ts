import axios from "axios"
import * as fs from "fs"
import {imageSize} from "image-size"
import * as path from "path"
import * as stream from "stream"
import * as unzip from "unzip"
import {URLSearchParams} from "url"
import api from "../API"
import replace from "../Translate"
import {PixivFolderMap, PixivIllust, PixivMultiCall} from "../types"
import {Illust, Search, Ugoira} from "./index"

export class Util {
    private readonly illust = new Illust(this.api)
    private readonly search = new Search(this.api)
    private readonly ugoira = new Ugoira(this.api)
    constructor(private readonly api: api) {}

    /**
     * Parsed a pixiv id from the url.
     */
    public parseID = (input: string) => {
        const parsed = input.match(/\d{8,}/)
        return parsed ? Number(parsed) : null
    }

    /**
     * Utility for awaiting a setTimeout
     */
    public timeout = async (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    /**
     * Utility for awaiting a stream.Writable
     */
    public awaitStream = async (writeStream: stream.Writable) => {
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
        })
    }

    /**
     * Makes subsequent api calls to get more search results, then returns them.
     */
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

    /**
     * Utility for sorting by bookmarks.
     */
    public sort = (illusts: PixivIllust[]) => {
        Array.prototype.sort.call(illusts, ((a: PixivIllust, b: PixivIllust) => (a.total_bookmarks - b.total_bookmarks) * -1))
        return illusts
    }

    /**
     * Downloads an illust locally.
     */
    public downloadIllust = async (illustResolvable: string | PixivIllust, folder: string, size?: string) => {
        const basename = path.basename(folder)
        if (!size) size = "medium"
        let url: string
        if (illustResolvable.hasOwnProperty("image_urls")) {
            url = (illustResolvable as PixivIllust).image_urls[size]
        } else {
            url = illustResolvable as string
        }
        if (!url.startsWith("https://i.pximg.net/")) {
            url = await this.illust.get(url).then((i) => i.illust.image_urls[size] ?
            i.illust.image_urls[size] : i.illust.image_urls.medium)
        }
        if (__dirname.includes("node_modules")) {
            folder = path.join(__dirname, "../../../../", folder)
        } else {
            folder = path.join(__dirname, "../../", folder)
        }
        if (basename.includes(".")) folder = folder.replace(basename, "")
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const dest = basename.includes(".") ? `${folder}${basename}` : path.join(folder, `${url.match(/\d{6,}/) ? url.match(/\d{6,}/)[0] : "illust"}.png`)
        const writeStream = fs.createWriteStream(dest)
        await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(writeStream))
        await this.awaitStream(writeStream)
        return dest
    }

    public downloadProfilePicture = async (illustResolvable: string | PixivIllust, folder: string, size?: string) => {
        const basename = path.basename(folder)
        if (!size) size = "medium"
        let url: string
        let username: string
        if (illustResolvable.hasOwnProperty("image_urls")) {
            url = (illustResolvable as PixivIllust).user.profile_image_urls[size]
            username = (illustResolvable as PixivIllust).user.name
        } else {
            url = illustResolvable as string
            username = (illustResolvable as string).match(/\d{6,}/) ? (illustResolvable as string).match(/\d{6,}/)[0] : "profile"
        }
        if (!url.startsWith("https://i.pximg.net/")) {
            const illust = await this.illust.get(url).then((i) => i.illust)
            url = illust.user.profile_image_urls[size] ?
            illust.user.profile_image_urls[size] : illust.user.profile_image_urls.medium
            username = illust.user.name
        }
        if (__dirname.includes("node_modules")) {
            folder = path.join(__dirname, "../../../../", folder)
        } else {
            folder = path.join(__dirname, "../../", folder)
        }
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const dest = basename.includes(".") ? `${folder}${basename}` : path.join(folder, `${username}.png`)
        const writeStream = fs.createWriteStream(dest)
        await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(writeStream))
        await this.awaitStream(writeStream)
        return dest
    }

    /**
     * Mass downloads illusts from a search result. You can map the results into different folders by tag
     * with the folderMap parameter.
     */
    public downloadIllusts = async (query: string, dest: string, size?: string, folderMap?: PixivFolderMap[]) => {
        if (!size) size = "medium"
        let illusts = await this.search.moe({query})
        if (!illusts?.[0]?.title) illusts = await this.search.illusts({word: query}).then((r) => r.illusts)
        const promiseArray = []
        loop1:
        for (let i = 0; i < illusts.length; i++) {
            const illust = illusts[i]
            const imgUrl = illust.image_urls[size] ? illust.image_urls[size] : illust.image_urls.medium
            if (folderMap) {
                for (let k = 0; k < illust.tags.length; k++) {
                    for (let j = 0; j < folderMap.length; j++) {
                        const tag = await replace.translateTag(folderMap[j].tag)
                        if (tag.includes(illust.tags[k].name)) {
                            const promise = this.downloadIllust(imgUrl, path.join(dest, folderMap[j].folder))
                            promiseArray.push(promise)
                            continue loop1
                        }
                    }
                }
            }
            const promise = this.downloadIllust(imgUrl, dest)
            promiseArray.push(promise)
        }
        const resolved = await Promise.all(promiseArray)
        return resolved
    }

    /**
     * Encodes a new gif from an array of file paths.
     */
    public encodeGif = async (files: string[], dest?: string) => {
        const GifEncoder = require("gif-encoder")
        const getPixels = require("get-pixels")
        const dimensions = imageSize(files[0])
        const gif = new GifEncoder(dimensions.width, dimensions.height)
        const pathIndex = files[0].search(/\d{8,}/)
        const pathDir = files[0].slice(0, pathIndex)
        if (!dest) dest = `${pathDir}${files[0].match(/\d{8,}/)[0]}.gif`
        const file = fs.createWriteStream(dest)
        gif.pipe(file)
        gif.setQuality(20)
        gif.setDelay(0)
        gif.setRepeat(0)
        gif.writeHeader()
        let counter = 0

        const addToGif = (frames: string[]) => {
                getPixels(frames[counter], function(err: Error, pixels: any) {
                    gif.addFrame(pixels.data)
                    gif.read()
                    if (counter >= frames.length - 1) {
                        gif.finish()
                    } else {
                        counter++
                        addToGif(files)
                    }
                })
            }
        addToGif(files)
        async function awaitGIF(gif: any) {
            return new Promise((resolve) => {
                gif.on("end", () => {
                    resolve()
                })
            })
        }
        await awaitGIF(gif)
        return dest
    }

    /**
     * @ignore
     */
    /*
    private readonly encodeWebp = async (files: string[], delays: number[], dest?: string) => {
        const pathIndex = files[0].search(/\d{8,}/)
        const pathDir = files[0].slice(0, pathIndex)
        const subDir = files[0].match(/(?<=\/)(\d{8,})(?=\/)/)[0]
        if (!dest) dest = `${pathDir}${subDir}.webp`
        const webpArray: string[] = []
        const inputArray: string[] = []

        async function convertToWebp(ifile: string, wFile: string) {
            return new Promise((resolve) => {
                webp.cwebp(ifile, wFile, "-q 80", (status, error) => {
                    resolve()
                })
            })
        }

        for (let i = 0; i < files.length; i++) {
            const webpFile = `${files[i].slice(0, -4)}.webp`
            webpArray.push(webpFile)
            await convertToWebp(files[i], webpFile)
        }

        for (let j = 0; j < webpArray.length; j++) {
            inputArray.push(`${webpArray[j]} +${delays[j]}`)
        }
        webp.webpmux_animate(inputArray, dest, "10", "255,255,255,255", (status, error) => {console.log(status, error)})
    }*/

    /**
     * Downloads and extracts all of the individual images in a ugoira.
     */
    public downloadZip = async (url: string, dest: string) => {
        if (!url.startsWith("https://i.pximg.net/")) {
            url = await this.ugoira.get(url).then((u) => u.ugoira_metadata.zip_urls.medium)
        }
        if (__dirname.includes("node_modules")) {
            dest = path.join(__dirname, "../../../../", dest, url.match(/\d{8,}/)[0])
        } else {
            dest = path.join(__dirname, "../../", dest, url.match(/\d{8,}/)[0])
        }
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, {recursive: true})
        const writeStream = await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(unzip.Extract({path: dest})))

        await this.awaitStream(writeStream)
        return dest
    }

    /**
     * Downloads the zip archive of a ugoira and converts it to a gif.
     */
    public downloadUgoira = async (illustResolvable: string | PixivIllust, dest: string, constrain?: number) => {
        let url: string
        if (illustResolvable.hasOwnProperty("id")) {
            url = String((illustResolvable as PixivIllust).id)
        } else {
            url = illustResolvable as string
        }
        const metadata = await this.ugoira.get(url).then((r) => r.ugoira_metadata)
        const zipUrl = metadata.zip_urls.medium
        const destPath = await this.downloadZip(zipUrl, dest).then((p) => p.replace("\\", "/"))
        const files = fs.readdirSync(destPath)
        const frameAmount = files.length
        let step = 1
        if (constrain) step = Math.ceil(frameAmount / constrain)
        const fileArray: string[] = []
        const delayArray: number[] = []
        for (let i = 0; i < frameAmount; i += step) {
            if (files[i].slice(-5) === ".webp") continue
            if (!metadata.frames[i]) break
            fileArray.push(`${destPath}/${files[i]}`)
            delayArray.push(metadata.frames[i].delay)
        }
        const destination = await this.encodeGif(fileArray)
        return destination
    }

    /**
     * Gets a viewable link for an illust, if it exists.
     */
    public viewLink = async (illustResolvable: string | PixivIllust): Promise<string | null> => {
        let id: string
        if (illustResolvable.hasOwnProperty("id")) {
            id = String((illustResolvable as PixivIllust).id)
        } else {
            id = String(illustResolvable).match(/\d{8,}/)?.[0]?.trim()
        }
        const html = await axios.get(`https://www.pixiv.net/en/artworks/${id}`, {headers: {referer: "https://www.pixiv.net/"}}).then((r) => r.data)
        const matches = html.match(/(?<="regular":")(.*?)(?=")/gm)?.map((m: string) => m)?.[0]
        if (matches && (matches.match(/i-cf/) || matches.match(/tc-px/))) {
            return matches
        } else {
            return null
        }
    }
}
