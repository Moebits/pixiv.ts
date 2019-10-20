import axios from "axios"
import * as fs from "fs"
import {imageSize} from "image-size"
import * as path from "path"
import * as stream from "stream"
import * as unzip from "unzip"
import api from "../API"
import replace from "../Replace"
import {PixivFolderMap, PixivIllustSearch, PixivMultiCall} from "../types"
import {Illust, Search, Ugoira} from "./index"

const GifEncoder = require("gif-encoder")
const getPixels = require("get-pixels")
const webp = require("webp-converter")

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
     * Downloads an illust locally.
     */
    public downloadIllust = async (url: string, folder: string, size?: string) => {
        if (!size) size = "medium"
        if (!url.startsWith("https://i.pximg.net/")) {
            url = await this.illust.get(url).then((i) => i.illust.image_urls[size] ?
            i.illust.image_urls[size] : i.illust.image_urls.medium)
        }
        if (!fs.existsSync(folder)) fs.mkdirSync(folder)
        const dest = path.join(folder, `${url.match(/\d{8,}/)[0]}.png`)
        const writeStream = fs.createWriteStream(dest)
        await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(writeStream))
        this.awaitStream(writeStream)
    }

    /**
     * Mass downloads illusts from a search result. You can map the results into different folders by tag
     * with the folderMap parameter.
     */
    public downloadIllusts = async (query: string, dest: string, size?: string, folderMap?: PixivFolderMap[]) => {
        if (!size) size = "medium"
        const illusts = await this.search.illusts({word: query}).then((r) => r.illusts)
        loop1:
        for (let i = 0; i < illusts.length; i++) {
            const illust = illusts[i]
            const imgUrl = illust.image_urls[size] ? illust.image_urls[size] : illust.image_urls.medium
            if (folderMap) {
                for (let k = 0; k < illust.tags.length; k++) {
                    for (let j = 0; j < folderMap.length; j++) {
                        const tag = replace.replaceTag(folderMap[j].tag)
                        if (tag.includes(illust.tags[k].name)) {
                            this.downloadIllust(imgUrl, path.join(dest, folderMap[j].folder))
                            continue loop1
                        }
                    }
                }
            }
            this.downloadIllust(imgUrl, dest)
        }
    }

    /**
     * Encodes a new gif from an array of file paths.
     */
    public encodeGif = async (files: string[], dest?: string) => {
        return new Promise((resolve) => {
            const dimensions = imageSize(files[0])
            const gif = new GifEncoder(dimensions.width, dimensions.height)
            const pathIndex = files[0].search(/\d{8,}/)
            const pathDir = files[0].slice(0, pathIndex)
            if (!dest) dest = `${pathDir}${files[0].match(/(?<=\/)(\d{8,})(?=\/)/)[0]}.gif`
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
            gif.on("end", () => {
                    resolve()
                })
            })
    }

    /**
     * @ignore
     */
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
        console.log(inputArray)
        webp.webpmux_animate(inputArray, dest, "10", "255,255,255,255", (status, error) => {console.log(status, error)})
    }

    /**
     * Downloads and extracts all of the individual images in a ugoira.
     */
    public downloadZip = async (url: string, dest: string) => {
        if (!url.startsWith("https://i.pximg.net/")) {
            url = await this.ugoira.get(url).then((u) => u.ugoira_metadata.zip_urls.medium)
        }
        dest = path.join(dest, url.match(/\d{8,}/)[0])
        if (!fs.existsSync(dest)) fs.mkdirSync(dest)
        const writeStream = await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(unzip.Extract({path: dest})))

        await this.awaitStream(writeStream)
        return dest
    }

    /**
     * Downloads the zip archive of a ugoira and converts it to a gif.
     */
    public downloadUgoira = async (url: string, dest: string, constrain?: number) => {
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
        this.encodeGif(fileArray)
    }
}
