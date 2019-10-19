import Pixiv from "../Pixiv"

require("dotenv").config()
let pixiv: Pixiv

export default async () => {
    if (!pixiv) {
        pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    }
}

export {pixiv}
