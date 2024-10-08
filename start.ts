import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)
    //let result = await pixiv.search.illusts({word: "橘ヒカリ", restrict: "public"})
    //console.log(result.length)
})()
