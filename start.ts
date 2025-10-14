import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)
    const illust = await pixiv.illust.get("63646509")
    await pixiv.util.downloadIllust(illust, "./downloads", "original")
})()