import Pixiv from "./Pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    // const result = await pixiv.illust.get("https://www.pixiv.net/en/artworks/77240733")
    /*await pixiv.util.downloadIllusts("black tights 00", "./downloads", "large", [{
        folder: "stockings 2", tag: "black tights"
    }])*/
    // await pixiv.util.downloadUgoira("https://www.pixiv.net/en/artworks/77382629", "./downloads", "webp", 50)
    const result = await pixiv.illust.get("gabriel", {bookmarks: "1000", r18: false})
    console.log(result)
})()
