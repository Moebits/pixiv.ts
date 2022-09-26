import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.REFRESH_TOKEN)
    let illusts = await pixiv.search.illusts({word: "cute"})
    await pixiv.util.downloadIllust(illusts[0], "./downloads", "original")
    const files = fs.readdirSync(path.join(__dirname, "../downloads")).map((p) =>{
        return path.join(__dirname, "../downloads", p)
    })
    const hash = crypto.createHash("md5").update(fs.readFileSync(files[0])).digest("hex")
    console.log(hash)
})()
