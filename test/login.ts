import Pixiv from "../pixiv"

require("dotenv").config()
let pixiv: Pixiv

export default async () => {
    if (!pixiv) {
        pixiv = await Pixiv.refreshLogin(process.env.REFRESH_TOKEN)
    }
}

export {pixiv}
