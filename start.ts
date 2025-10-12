import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)
    let illust = await pixiv.illust.get("https://www.pixiv.net/en/artworks/136109954")
    console.log(pixiv.util.isAI(illust))
})()