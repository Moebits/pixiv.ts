import Pixiv from "./pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)
    let result = await pixiv.user.webDetail(1055457)
    console.log(result.social.twitter.url)
})()