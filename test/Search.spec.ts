import {assert} from "chai"
import "mocha"
import login, {pixiv} from "./login"

describe("Search", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should search for illusts", async function() {
        const response = await pixiv.search.illusts({word: "gabriel"})
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should search for novels", async function() {
        const response = await pixiv.search.novels({word: "gabriel"})
        assert(response?.[0].hasOwnProperty("title"))
    })

    it("should search for users", async function() {
        const response = await pixiv.search.users({word: "tenpi"})
        assert(response.hasOwnProperty("user_previews"))
    })

    it("should search autocomplete", async function() {
        const response = await pixiv.search.autoComplete({word: "gabriel"})
        assert(response.hasOwnProperty("search_auto_complete_keywords"))
    })

    it("should search autocomplete v2", async function() {
        const response = await pixiv.search.autoCompleteV2({word: "gabriel"})
        assert(response.hasOwnProperty("tags"))
    })
})
