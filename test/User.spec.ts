import {assert} from "chai"
import "mocha"
import login, {pixiv} from "./login"

describe("User", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get a user", async function() {
        const response = await pixiv.user.get("https://www.pixiv.net/member.php?id=35096162")
        assert(response.hasOwnProperty("user"))
    })

    it("should get a user bookmark", async function() {
        const response = await pixiv.user.bookmarkDetail({illust_id: 73346537})
        assert(response.hasOwnProperty("bookmark_detail"))
    })

    it("should get bookmark illust tags", async function() {
        const response = await pixiv.user.bookmarkIllustTags()
        assert(response.hasOwnProperty("bookmark_tags"))
    })

    it("should get bookmark novel tags", async function() {
        const response = await pixiv.user.bookmarkNovelTags({user_id: 23040640})
        assert(response.hasOwnProperty("bookmark_tags"))
    })

    it("should get bookmarked illusts", async function() {
        const response = await pixiv.user.bookmarksIllust({user_id: 23040640})
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get bookmarked novels", async function() {
        const response = await pixiv.user.bookmarksNovel({user_id: 23040640})
        assert(response.hasOwnProperty("novels"))
    })

    it("should get follow details", async function() {
        const response = await pixiv.user.followDetail({user_id: 23040640})
        assert(response.hasOwnProperty("follow_detail"))
    })

    it("should get user followers", async function() {
        const response = await pixiv.user.followers({user_id: 23040640})
        assert(response.hasOwnProperty("user_previews"))
    })

    it("should get user following", async function() {
        const response = await pixiv.user.following({user_id: 23040640})
        assert(response.hasOwnProperty("user_previews"))
    })

    it("should get user illusts", async function() {
        const response = await pixiv.user.illusts({user_id: 23040640})
        assert(response.hasOwnProperty("illusts"))
    })

    it("should get user my pixiv", async function() {
        const response = await pixiv.user.myPixiv({user_id: 23040640})
        assert(response.hasOwnProperty("user_previews"))
    })

    it("should get user novels", async function() {
        const response = await pixiv.user.novels({user_id: 23040640})
        assert(response.hasOwnProperty("novels"))
    })

    it("should get user illusts", async function() {
        const response = await pixiv.user.recommended()
        assert(response.hasOwnProperty("user_previews"))
    })

})
