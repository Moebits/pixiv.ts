<div align="left">
  <p>
    <a href="https://tenpi.github.io/pixiv.ts/"><img src="https://raw.githubusercontent.com/Tenpi/pixiv.ts/master/images/pixiv.tslogo.gif" width="500" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/pixiv.ts/"><img src="https://nodei.co/npm/pixiv.ts.png" /></a>
  </p>
</div>

### About
This is a wrapper for the Pixiv API that includes typings and various utility functions
to make getting content from pixiv a lot easier. You can also mass download illusts and download ugoiras as gifs!

### Insall
```ts
npm install pixiv.ts
```

### Getting Started
In order to receive an **access token** from pixiv, you must login using your **username** and **password**. All subsequent logins after the first will be done using the **refresh token** you receive on first login, and it will be regenerated automatically whenever it expires.

### Useful Links
- [**Pixiv.ts Documentation**](https://tenpi.github.io/pixiv.ts/)
- [**Pixivpy Wiki**](https://github.com/upbit/pixivpy/wiki)

### Notes on password login
Pixiv stopped supporting user/password logins, so you can only login with refresh token for now. Follow
this [guide](https://gist.github.com/ZipFile/c9ebedb224406f4f11845ab700124362) to obtain your refresh token,
and login instead with `await Pixiv.refreshLogin(process.env.PIXIV_REFRESH_TOKEN)`. 

#### Searching for illusts, novels, and manga
```ts
import Pixiv from "pixiv.ts"

async function useAPI() {
    /*Logging in is an asynchronous function. Don't try to use the constructor, all the properties will be undefined!*/
    const pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)

    /*If you wish, you can regenerate and return your refresh token manually if it has expired*/
    const refreshToken = await pixiv.refreshToken()

    /*You can get an illust very easily with it's url or id. Most endpoints will have a get() method
    that will parse the id out of the url automatically.*/
    const illust = await pixiv.illust.get("https://www.pixiv.net/en/artworks/76833012")

    /*You could also get the most bookmarked illust from the query. This uses search internally, so you can
    specify the parameters in the second argument.*/
    const shortcut = await pixiv.illust.get("gabriel", {r18: true})

    /*To parse the id out of any url, you can use util.parseID()*/
    const id = await pixiv.util.parseID("https://www.pixiv.net/en/artworks/75788934") //75788934

    /*You can search illusts with a query. The nextURL is stored in pixiv.search.nextURL.*/
    let illusts = await pixiv.search.illusts({word: "gabriel dropout"})
    /*There is also an utility to sort by most bookmarked.*/
    illusts = pixiv.util.sort(illusts)

    /*Filter parameters: en to search for english tags, type to filter by type, r18 to filter r18 illusts,
    and bookmarks to filter by minimum bookmarks. By default tags are translated to japanese, but you can change
    that behavior by changing en to true.*/
    const filteredSearch = await pixiv.search.illusts({word: "megumin", r18: true, type: "illust", bookmarks: "100"})
    const englishSearch = await pixiv.search.illusts({word: "cute", en: true})

    /*You can also search through the rankings, popular previews, etc.*/
    const rankings = await pixiv.illust.ranking({mode: "day_r18"})
    const popularPreviews = await pixiv.illust.popularPreview({word: "sagiri izumi"})

    /*And get all the illusts from a user.*/
    const userIllusts = await pixiv.user.illusts({user_id: 18590546})

    /*Getting novels is practically identical to illusts. The alternative to the get() method is
    to query the api for the details directly.*/
    const novel = await pixiv.novel.detail({novel_id: 11826198}).then((n) => n.novel)

    /*Novels obviously have text, and you can retrieve it with the text() method.*/
    const text = await pixiv.novel.text({novel_id: 11826198}).then((n) => n.novel_text)

    /*There is also manga, which 90% of the time will have multiple pages. You can get the
    urls of all the pages with the getPages() method.*/
    const manga = await pixiv.manga.get("https://www.pixiv.net/en/artworks/77333204")
    const pages = await pixiv.manga.getPages(manga)
}
useAPI()
```
#### Searching for users, bookmarks, tags, and articles
```ts
async function useAPI() {
    /*Again, you can use get() on the user class.*/
    const user = await pixiv.user.get("https://www.pixiv.net/member.php?id=35096162")

    /*You can also search for users using a query.*/
    const users = await pixiv.search.users({word: "kawaii"})

    /*You can retrieve a lot of info on bookmarks with the api, such as 
    the details, tags, and ranges.*/
    const bookmarkDetails = await pixiv.illust.bookmarkDetail({illust_id: 75788934}).then((b) => bookmark_detail)
    const bookmarkTags = await pixiv.illust.bookmarkTags().then((b) => b.bookmark_tags)
    const bookmarkRanges = await pixiv.illust.bookmarkRanges({word: "cute"}).then((b) => b.bookmark_ranges)

    /*Of course, you can also get all of the bookmarks of a user.*/
    const bookmarks = await pixiv.user.bookmarksIllust({user_id: 21479436})

    /*To get articles from pixiv vision, you can use the spotlight endpoint.*/
    const articles = await pixiv.spotlight.articles()
}
```

#### Downloading Illusts and Converting Ugoiras to gifs
```ts
async function useAPI() {
  /*You can download any illust locally with the function downloadIllust().*/
  await pixiv.util.downloadIllust("https://www.pixiv.net/en/artworks/72668134", "./illust", "large")

  /*One of my personal favorite methods is mass-downloading illusts and mapping them into separate
  folders based on the tags that they have.*/
  await pixiv.util.downloadIllusts("black tights", "./illust", "large", [{folder: "stockings", tag: "black tights"}])

  /*You can retrieve all of the metadata for a ugoira, including all of the image frames, the delay
  between each frame, and the url for the zip download.*/
  const metadata = await pixiv.ugoira.metadata({illust_id: 77329939})

  /*Using the above endpoint internally, there is an utility to download the zip file and extract
  it to a local path automatically.*/
  await pixiv.util.downloadZip("https://www.pixiv.net/en/artworks/77359698", "./ugoira")

  /*A ton of png/jpg files are not that useful... which is why you can also convert and download a 
  ugoira as a gif! This uses downloadZip() and encodeGif() internally. The third parameter has some
  options for speed and whether or not it's played in reverse.*/
  await pixiv.util.downloadUgoira("https://www.pixiv.net/en/artworks/68064543", "./ugoira", {speed: 1.0, reverse: false})
}
```

#### Obtaining subsequent API results
```ts
async function useAPI() {
  /*You can obtain all subsequent search with util.multiCall(). The optional limit specifies how many extra api calls to make.*/
  let limit = 100
  let illusts = await pixiv.search.illusts({word: "word"})
  if (pixiv.search.nextURL) illusts = await pixiv.util.multiCall({next_url: pixiv.search.nextURL, illusts}, limit)
}
```

### Common Parameters

- `illust_id`: ID of the illust.
- `user_id`: ID of the user.
- `novel_id`: ID of the novel.
- `series_id`: ID of the series.
- `word`: The search query to search.
- `type`: The type of content to search: `"illust" | "novel" | "manga" | "ugoira"`
- `restrict`: Restricts the bookmarks you search: `"public" | "private" | "all"`
- `search_target`: The matching options in the search endpoint: `"partial_match_for_tags" | "exact_match_for_tags" | "title_and_caption"`
- `mode`: For searching rankings, either: `"day" | "week" | "month" | "day_male" | "day_female" | "week_original" | "week_rookie" | "day_r18" | "day_male_r18" | "day_female_r18" | "week_r18" | "week_r18g" | "day_manga" | "week_manga" | "month_manga" | "week_rookie_manga" | "day_r18_manga" | "week_r18_manga" | "week_r18g_manga"`
- `duration`: Relative search duration: `"within_last_day" | "within_last_week" | "within_last_month"`

#### Common Types

<details>
<summary>PixivIllust</summary>

```ts
export interface PixivIllust {
    id: number
    title: string
    type: string
    image_urls: {
      square_medium: string
      medium: string
      large?: string
    }
    caption: string
    restrict: number
    user: PixivUser
    tags: PixivTag[]
    tools: string[]
    create_date: string
    page_count: number
    width: number
    height: number
    sanity_level: number
    meta_single_page: {
      original_image_url?: string
    }
    meta_pages: PixivMetaPage[]
    total_view: number
    total_bookmarks: number
    is_bookmarked: boolean
    visible: boolean
    x_restrict: number
    is_muted: boolean
    total_comments: number
  }

```
</details>

<details>
<summary>PixivUser</summary>

```ts
export interface PixivUser {
    id: number
    name: string
    account: string
    profile_image_urls: {
      medium: string
    }
    comment: string
    is_followed: boolean
}
```
</details>

<details>
<summary>PixivUserDetail</summary>

```ts
export interface PixivUserDetail {
    user: PixivUser
    profile: {
      webpage: string
      gender: string
      birth: string
      birth_day: string
      birth_year: number
      region: string
      address_id: number
      country_code: string
      job: string
      job_id: number
      total_follow_users: number
      total_mypixiv_users: number
      total_illusts: number
      total_manga: number
      total_novels: number
      total_illust_bookmarks_public: number
      total_illust_series: number
      background_image_url: string
      twitter_account: string
      twitter_url: string
      pawoo_url: string
      is_premium: boolean
      is_using_custom_profile_image: boolean
    }
    profile_publicity: {
      gender: string
      region: string
      birth_day: string
      birth_year: string
      job: string
      pawoo: boolean
    }
    workspace: {
      pc: string
      monitor: string
      tool: string
      scanner: string
      tablet: string
      mouse: string
      printer: string
      desktop: string
      music: string
      desk: string
      chair: string
      comment: string
      workspace_image_url: string | null
    }
}

```
</details>

<details>
<summary>PixivComment</summary>

```ts
export interface PixivComment {
    id: number
    comment: string
    date: string
    user: PixivUser
    parent_comment: PixivComment
}
```
</details>