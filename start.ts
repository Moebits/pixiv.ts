import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)
    let result = await pixiv.util.downloadNovel("23364636", "./downloads")
    console.log(result)
})()