import {assert} from "chai"
import "mocha"
import login, {pixiv} from "./login"

describe("Manga", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get a manga", async function() {
        const response = await pixiv.manga.get("https://www.pixiv.net/en/artworks/77338440")
        assert(response.illust.hasOwnProperty("series"))
    })

    it("should get all manga pages", async function() {
        const response = await pixiv.manga.get("https://www.pixiv.net/en/artworks/77351709")
        const pages = await pixiv.manga.getPages(response.illust)
        assert(typeof pages[0] === "string")
    })

    it("should get new manga", async function() {
        const response = await pixiv.manga.new()
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get recommended manga", async function() {
        const response = await pixiv.manga.recommended()
        assert(response.hasOwnProperty("illusts"))
    })
})
