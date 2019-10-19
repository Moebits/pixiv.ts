import Pixiv from "./Pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const result = await pixiv.illust.get("https://www.pixiv.net/en/artworks/77240733")
    console.log(result)
})()
