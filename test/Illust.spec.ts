import {assert} from "chai"
import "mocha"
import login, {pixiv} from "./login"

describe("Illust", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get an illust", async function() {
        const response = await pixiv.illust.get("https://www.pixiv.net/en/artworks/70115510")
        assert(response.illust.hasOwnProperty("title"))
    })

    it("should get an illusts detail", async function() {
        const response = await pixiv.illust.detail({illust_id: 70728512})
        assert(response.illust.hasOwnProperty("title"))
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
        assert(response.hasOwnProperty("bookmark_tags"))
    })

    it.only("should get comments", async function() {
        const response = await pixiv.illust.comments({illust_id: 70728512})
        console.log(response)
        assert(response.hasOwnProperty("comments"))
    })

    it.only("should get comments V2", async function() {
        const response = await pixiv.illust.commentsV2({illust_id: 70728512})
        console.log(response)
        assert(response.hasOwnProperty("comments"))
    })

    it("should get comment replies", async function() {
        const response = await pixiv.illust.commentReplies({comment_id: 70728512})
        assert(response.hasOwnProperty("comments"))
    })

    it("should get followed illusts", async function() {
        const response = await pixiv.illust.follow({user_id: 2913676})
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get new illusts", async function() {
        const response = await pixiv.illust.new()
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get popular previews", async function() {
        const response = await pixiv.illust.popularPreview({word: "gabriel dropout"})
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get ranking illusts", async function() {
        const response = await pixiv.illust.ranking()
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get recommended illusts", async function() {
        const response = await pixiv.illust.recommended()
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get recommended no login illusts", async function() {
        const response = await pixiv.illust.recommendedNoLogin()
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get recommended illusts", async function() {
        const response = await pixiv.illust.related({illust_id: 2912676})
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get trending tags", async function() {
        const response = await pixiv.illust.trendingTags()
        assert(response.hasOwnProperty("trend_tags"))
    })

    it("should get walkthrough illusts", async function() {
        const response = await pixiv.illust.walkthrough()
        assert(response.hasOwnProperty("illusts"))
    })

})
