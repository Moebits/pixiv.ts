import axios from "axios"
import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.REFRESH_TOKEN)
    // let illusts = await pixiv.search.illusts({word: "loli"})
    // if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({next_url: pixiv.search.nextURL, illusts}, 2)
    // console.log(illusts)
    let candidates = await pixiv.web.candidates({keyword: "klee", lang: "en"})
    console.log(candidates)
})()
