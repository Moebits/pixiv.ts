import {assert} from "chai"
import "mocha"
import login, {pixiv} from "./login"

describe("Spotlight", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get spotlight articles", async function() {
        const response = await pixiv.spotlight.articles()
        assert(response?.[0].hasOwnProperty("title"))
    })
})
