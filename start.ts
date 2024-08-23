import axios from "axios"
import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.REFRESH_TOKEN)
    const result = await pixiv.illust.comments({illust_id: 72301885})
    console.log(result.comments[0])
})()
