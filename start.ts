import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)
    const result = await pixiv.illust.get("https://www.pixiv.net/en/artworks/6618255")
    console.log(result)
})()
