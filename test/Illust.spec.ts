import {assert} from "chai"
import "mocha"
import login, {pixiv} from "./login"

/*
Removed:
recommendedNoLogin
commentReplies
related
*/

describe("Illust", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get an illust", async function() {
        const response = await pixiv.illust.get("https://www.pixiv.net/artworks/70115510")
        assert(response.hasOwnProperty("title"))
    })

    it("should get an illusts detail", async function() {
        const response = await pixiv.illust.detail({illust_id: 70728512})
        assert(response.hasOwnProperty("title"))
    })

    it("should get an illusts bookmark detail", async function() {
        const response = await pixiv.illust.bookmarkDetail({illust_id: 70728512})
        assert(response.bookmark_detail.hasOwnProperty("tags"))
    })

    it("should get bookmark ranges", async function() {
        const response = await pixiv.illust.bookmarkRanges({word: "cute"})
        assert(response.hasOwnProperty("bookmark_ranges"))
    })

    it("should get bookmark tags", async function() {
        const response = await pixiv.illust.bookmarkTags({illust_id: 70728512})
        console.log(response)
        assert(response?.[0].hasOwnProperty("name"))
    })

    it("should get comments", async function() {
        const response = await pixiv.illust.comments({illust_id: 70728512})
        assert(response.hasOwnProperty("comments"))
    })

    it("should get followed illusts", async function() {
        const response = await pixiv.illust.follow({user_id: 2913676})
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should get new illusts", async function() {
        const response = await pixiv.illust.new()
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should get popular previews", async function() {
        const response = await pixiv.illust.popularPreview({word: "gabriel dropout"})
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should get ranking illusts", async function() {
        const response = await pixiv.illust.ranking()
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should get recommended illusts", async function() {
        const response = await pixiv.illust.recommended()
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should get trending tags", async function() {
        const response = await pixiv.illust.trendingTags()
        assert(response.hasOwnProperty("trend_tags"))
    })

})
