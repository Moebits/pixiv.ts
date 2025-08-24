import {axiosInstance as axios} from "./AxiosInstance"
import * as fs from "fs"
import {imageSize} from "image-size"
import * as path from "path"
import * as stream from "stream"
import * as unzip from "unzipper"
import * as child_process from "child_process"
import API from "../API"
import replace from "../Translate"
import {PixivFolderMap, PixivIllust, PixivNovel, PixivMultiCall} from "../types"
import {Illust, Novel, Search, Ugoira} from "./index"

export class Util {
    private readonly illust = new Illust(this.api)
    private readonly novel = new Novel(this.api)
    private readonly search = new Search(this.api)
    private readonly ugoira = new Ugoira(this.api)
    constructor(private readonly api: API) {}

    /**
     * Parsed a pixiv id from the url.
     */
    public parseID = (input: string) => {
        const parsed = input.match(/\d{5,}/)
        return parsed ? Number(parsed) : null
    }

    /**
     * Translates a tag to Japanese.
     *
     */
    public translateTag = async (tag: string) => {
        return replace.translateTag(tag) as unknown as string
    }

    /**
     * Translates a title to English.
     */
    public translateTitle = async (title: string) => {
        return replace.translateTitle(title) as unknown as string
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
            writeStream.on("end", resolve)
            writeStream.on("error", reject)
        })
    }

    /**
     * Makes subsequent api calls to get more search results, then returns them.
     */
    public multiCall = async (response: PixivMultiCall, limit?: number) => {
        let responseArray = []
        let counter = limit || Infinity
        if (!response.next_url) return Promise.reject("You can only use this method on search responses.")
        while ((response.next_url !== null) && (counter > 0)) {
            response = await this.api.next(response.next_url).catch(() => ({next_url: null}))
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
            await this.timeout(500)
            counter--
        }
        if (response.hasOwnProperty("illusts")) {
            responseArray = [...response.illusts, responseArray]
        } else if (response.hasOwnProperty("user_previews")) {
            responseArray = [...response.user_previews, responseArray]
        } else if (response.hasOwnProperty("comments")) {
            responseArray = [...response.comments, responseArray]
        } else if (response.hasOwnProperty("novels")) {
            responseArray = [...response.novels, responseArray]
        } else if (response.hasOwnProperty("bookmark_tags")) {
            responseArray = [...response.bookmark_tags, responseArray]
        }
        return responseArray.flat(Infinity)
    }

    public bookmarkMultiCall = async (response: PixivMultiCall, bookmarks: number, limit?: number) => {
        let responseArray = []
        if (!response.next_url) return Promise.reject("You can only use this method on search responses.")
        let thresholdReached = false
        while ((response.next_url !== null) && !thresholdReached) {
            response = await this.api.next(response.next_url).catch(() => ({next_url: null}))
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
            await this.timeout(500)
            const lastBookmarks = response?.illusts?.[response.illusts.length - 1]?.total_bookmarks
            if (lastBookmarks === undefined) thresholdReached = true
            if (!thresholdReached) thresholdReached = lastBookmarks <= bookmarks
            const amount = responseArray.reduce((p, c) => p + c.length, 0)
            if (amount >= limit) thresholdReached = true
        }
        if (response.hasOwnProperty("illusts")) {
            responseArray = [...response.illusts, responseArray]
        } else if (response.hasOwnProperty("user_previews")) {
            responseArray = [...response.user_previews, responseArray]
        } else if (response.hasOwnProperty("comments")) {
            responseArray = [...response.comments, responseArray]
        } else if (response.hasOwnProperty("novels")) {
            responseArray = [...response.novels, responseArray]
        } else if (response.hasOwnProperty("bookmark_tags")) {
            responseArray = [...response.bookmark_tags, responseArray]
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

    private download = async (url: string,  folder: string, nameExt?: string, fileExt = "png") => {
        const basename = path.basename(folder)
        if (!path.isAbsolute(folder)) {
            if (__dirname.includes("node_modules")) {
                folder = path.join(__dirname, "../../../../", folder)
            } else {
                folder = path.join(__dirname, "../../", folder)
            }
        }
        if (basename.includes(".")) folder = folder.replace(basename, "")
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const dest = basename.includes(".") ? `${folder}${basename}` : path.join(folder, `${url.match(/\d{6,}/) ? url.match(/\d{6,}/)[0] : "illust"}${nameExt ?? ""}.${fileExt}`)
        const writeStream = fs.createWriteStream(dest)
        await axios.get(url, {responseType: "stream", headers: {Referer: "https://www.pixiv.net/"}})
        .then((r) => r.data.pipe(writeStream))
        await this.awaitStream(writeStream)
        return dest
    }

    private downloadData = async (data: string,  folder: string, id?: number, fileExt = "txt") => {
        const basename = path.basename(folder)
        if (!path.isAbsolute(folder)) {
            if (__dirname.includes("node_modules")) {
                folder = path.join(__dirname, "../../../../", folder)
            } else {
                folder = path.join(__dirname, "../../", folder)
            }
        }
        if (basename.includes(".")) folder = folder.replace(basename, "")
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const dest = basename.includes(".") ? `${folder}${basename}` : `${path.join(folder, id ? `${id}` : "data")}.${fileExt}`
        fs.writeFileSync(dest, data)
        return dest
    }

    /**
     * Downloads an illust locally.
     */
    public downloadIllust = async (illustResolvable: string | PixivIllust, folder: string, size?: "medium" | "large" | "square_medium" | "original"): Promise<string> => {
        if (!illustResolvable) return ""
        if (!size) size = "medium"
        let url: string
        let illust = illustResolvable as PixivIllust
        if (illustResolvable.hasOwnProperty("image_urls")) {
            if (illust.meta_pages.length === 0) {
                // Single Image
                if (size == "original") {
                    url = illust.meta_single_page.original_image_url
                } else {
                    url = illust.image_urls[size]
                }
                return this.download(url, folder)
            } else {
                let dest = ""
                let i = 0
                // Multiple Images
                for (const image of illust.meta_pages) {
                    url = image.image_urls[size]
                    if (!dest) dest = await this.download(url, folder, `_p${i++}`)
                }
                return dest
            }
        } else {
            url = illustResolvable as string
            if (url.startsWith("https://i.pximg.net/")) {
                return this.download(url, folder)
            } else {
                illust = await this.illust.get(url)
                return this.downloadIllust(illust, folder, size)
            }
        }
    }

    /**
     * Downloads an author"s profile picture locally.
     */
    public downloadProfilePicture = async (illustResolvable: string | PixivIllust, folder: string, size?: string) => {
        if (!illustResolvable) return ""
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
            const illust = await this.illust.get(url)
            if (!illust) return ""
            url = illust.user.profile_image_urls[size] ?
            illust.user.profile_image_urls[size] : illust.user.profile_image_urls.medium
            username = illust.user.name
        }
        if (!path.isAbsolute(folder)) {
            if (__dirname.includes("node_modules")) {
                folder = path.join(__dirname, "../../../../", folder)
            } else {
                folder = path.join(__dirname, "../../", folder)
            }
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
     * Downloads a novel locally.
     */
    public downloadNovel = async (novelResolvable: string | PixivNovel, folder: string) => {
        let novel = novelResolvable as PixivNovel
        if (novelResolvable.hasOwnProperty("image_urls")) {
            // ignore
        } else {
            novel = await this.novel.get(novelResolvable as string)
        }
        const data = await this.novel.text({novel_id: novel.id})
        const dest = await this.downloadData(data.content, folder, novel.id)
        await this.download(data.coverUrl, folder)
        return dest
    }

    /**
     * Mass downloads illusts from a search result. You can map the results into different folders by tag
     * with the folderMap parameter.
     */
    public downloadIllusts = async (query: string, dest: string, size?:  "medium" | "large" | "square_medium" | "original", folderMap?: PixivFolderMap[], r18?: boolean) => {
        if (!size) size = "medium"
        if (!r18) r18 = false
        const illusts = await this.search.illusts({word: query, r18})
        const promiseArray = []
        loop1:
        for (let i = 0; i < illusts.length; i++) {
            const illust = illusts[i]
            if (!r18) {
                if (illust.x_restrict !== 0) continue
            }
            if (folderMap) {
                for (let k = 0; k < illust.tags.length; k++) {
                    for (let j = 0; j < folderMap.length; j++) {
                        const tag = await replace.translateTag(folderMap[j].tag)
                        if (tag.includes(illust.tags[k].name)) {
                            const promise = this.downloadIllust(illust, path.join(dest, folderMap[j].folder), size)
                            promiseArray.push(promise)
                            continue loop1
                        }
                    }
                }
            }
            const promise = this.downloadIllust(illust, dest, size)
            promiseArray.push(promise)
        }
        const resolved = await Promise.all(promiseArray)
        return resolved
    }

    /**
     * Encodes a new gif from an array of file paths.
     */
    public encodeGif = async (files: string[], delays?: number[], dest?: string) => {
        const GifEncoder = require("gif-encoder")
        const getPixels = require("get-pixels")
        return new Promise<string>((resolve) => {
            const dimensions = imageSize(files[0])
            const gif = new GifEncoder(dimensions.width, dimensions.height)
            const pathIndex = files[0].search(/\d{5,}/)
            const pathDir = files[0].slice(0, pathIndex)
            if (!dest) dest = `${pathDir}${files[0].match(/\d{5,}/)[0]}.gif`
            const file = fs.createWriteStream(dest)
            gif.pipe(file)
            gif.setQuality(10)
            gif.setRepeat(0)
            gif.writeHeader()
            let counter = 0

            const addToGif = (frames: string[]) => {
                getPixels(frames[counter], function(err: Error, pixels: any) {
                    delays ? gif.setDelay(delays[counter]) : gif.setDelay(0)
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
                    resolve(dest)
                })
            })
    }

    /**
     * Encodes a webp from an array of file paths.
     */
    public encodeAnimatedWebp = async (files: string[], delays: number[], dest?: string, webpPath?: string) => {
        const pathIndex = files[0].search(/\d{5,}/)
        const pathDir = files[0].slice(0, pathIndex)
        if (!dest) dest = `${pathDir}${files[0].match(/\d{5,}/)[0]}.webp`
        const frames = files.map((f, i) => `-d ${delays[i]} "${f}"`).join(" ")
        const absolute = webpPath ? path.normalize(webpPath).replace(/\\/g, "/") : path.join(__dirname, "../../webp")
        let program = `cd "${absolute}" && img2webp.exe`
        if (process.platform === "darwin") program = `cd "${absolute}" && ./img2webp.app`
        let command = `${program} -loop "0" ${frames} -o "${dest}"`
        const child = child_process.exec(command)
        let error = ""
        await new Promise<void>((resolve, reject) => {
            child.stderr.on("data", (chunk) => error += chunk)
            child.on("close", () => resolve())
        })
        console.log(error)
        return dest
    }

    /**
     * Gives permission to webp binaries.
     */
    public chmod777 = (webpPath?: string) => {
        if (process.platform === "win32") return
        const webp = webpPath ? path.normalize(webpPath).replace(/\\/g, "/") : path.join(__dirname, "../../webp")
        fs.chmodSync(webp, "777")
    }

    /**
     * Downloads and extracts all of the individual images in a ugoira.
     */
    public downloadZip = async (url: string, dest: string) => {
        if (!url.startsWith("https://i.pximg.net/")) {
            url = await this.ugoira.get(url).then((u) => u.ugoira_metadata.zip_urls.medium)
        }
        if (!path.isAbsolute(dest)) {
            if (__dirname.includes("node_modules")) {
                dest = path.join(__dirname, "../../../../", dest, url.match(/\d{5,}/)[0])
            } else {
                dest = path.join(__dirname, "../../", dest, url.match(/\d{5,}/)[0])
            }
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
    public downloadUgoira = async (illustResolvable: string | PixivIllust, dest: string, options?: {speed?: number, reverse?: boolean, webp?: boolean, webpPath?: string}) => {
        if (!options) options = {speed: 1, reverse: false, webp: false, webpPath: null}
        let url: string
        if (illustResolvable.hasOwnProperty("id")) {
            url = String((illustResolvable as PixivIllust).id)
        } else {
            url = illustResolvable as string
        }
        let id = this.parseID(url)
        const metadata = await this.ugoira.get(url).then((r) => r.ugoira_metadata)
        const zipUrl = metadata.zip_urls.medium
        let zipDest = path.extname(dest) ? path.dirname(dest) + `/${id}` : dest + `/${id}`
        const destPath = await this.downloadZip(zipUrl, zipDest).then((p) => p.replace("\\", "/"))
        const files = fs.readdirSync(destPath).filter((f) => f.endsWith(".jpg") || f.endsWith(".png"))
        const constraint = options?.speed > 1 ? files.length / options.speed : files.length
        let step = Math.ceil(files.length / constraint)
        let fileArray: string[] = []
        let delayArray: number[] = []
        for (let i = 0; i < files.length; i += step) {
            if (files[i].slice(-5) === ".webp") continue
            if (!metadata.frames[i]) break
            fileArray.push(`${destPath}/${files[i]}`)
            delayArray.push(metadata.frames[i].delay)
        }
        if (options?.speed < 1) delayArray = delayArray.map((n) => n / options.speed)
        if (options.reverse) {
            fileArray = fileArray.reverse()
            delayArray = delayArray.reverse()
        }
        let destination = ""
        if (options.webp) {
            destination = await this.encodeAnimatedWebp(fileArray, delayArray, dest, options.webpPath)
        } else {
            destination = await this.encodeGif(fileArray, delayArray, dest)
        }
        try {
            this.removeLocalDirectory(zipDest)
        } catch {}
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
            id = String(illustResolvable).match(/\d{5,}/)?.[0]?.trim()
        }
        const html = await axios.get(`https://www.pixiv.net/artworks/${id}`, {headers: {referer: "https://www.pixiv.net/"}}).then((r) => r.data)
        const match = html.match(/(?<="regular":")(.*?)(?=")/gm)?.map((m: string) => m)?.[0]
        if (match && (match.match(/i-cf/) || match.match(/tc-px/))) {
            try {
                await axios.get(match, {headers: {referer: "https://www.pixiv.net/"}})
                return match
            } catch {
                return null
            }
        } else {
            return null
        }
    }

    private removeLocalDirectory = (dir: string) => {
        if (!fs.existsSync(dir)) return
        fs.readdirSync(dir).forEach((file) => {
            const current = path.join(dir, file)
            if (fs.lstatSync(current).isDirectory()) {
                this.removeLocalDirectory(current)
            } else {
                fs.unlinkSync(current)
            }
        })
        try {
            fs.rmdirSync(dir)
        } catch (error) {
            console.log(error)
        }
    }
}
