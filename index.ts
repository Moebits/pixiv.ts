import Pixiv from "./Pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    // const result = await pixiv.illust.get("https://www.pixiv.net/en/artworks/77240733")
    const result = pixiv.util.parseID("https://www.pixiv.net/en/artworks/75788934")
    console.log(result)
})()
