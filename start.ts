import axios from "axios"
import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.REFRESH_TOKEN)
    // const result = await pixiv.illust.get("https://www.pixiv.net/en/artworks/75565793")
    /*await pixiv.util.downloadIllusts("black tights 00", "./downloads", "large", [{
        folder: "stockings 2", tag: "black tights"
    }])*/
    // await pixiv.util.downloadUgoira("https://www.pixiv.net/en/artworks/77382629", "./downloads", "webp", 50)
    // const result = await pixiv.illust.get("hibiki", {bookmarks: "100", type: "ugoira"})
    // const dest = await pixiv.util.downloadUgoira(result, "./downloads", {speed: 4.0, reverse: false})
    // const result = await pixiv.novel.get("https://www.pixiv.net/novel/show.php?id=14577595")
    // console.log(dest)
    // let illusts = await pixiv.search.illusts({word: "loli"})
    // if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({next_url: pixiv.search.nextURL, illusts}, 2)
    // console.log(illusts)
    // let illusts = await pixiv.util.translateTag("chino")
    // console.log(illusts)
    let candidates = await pixiv.search.searchForCandidates({ keyword: 'chino', lang: 'en' })
    console.log(candidates)
})()
