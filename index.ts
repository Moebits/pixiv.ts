import Pixiv from "./Pixiv"

require("dotenv").config();
(async () => {
    const pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const result = await pixiv.ugoira.metadata({illust_id: 68064543})
    console.log(result)
})()
