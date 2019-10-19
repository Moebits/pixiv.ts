<div align="left">
  <p>
    <a href="https://tenpi.github.io/pixiv.ts/"><img src="https://raw.githubusercontent.com/Tenpi/pixiv.ts/master/images/pixiv.tslogo.gif" width="500" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/pixiv.ts/"><img src="https://nodei.co/npm/pixiv.ts.png" /></a>
  </p>
</div>

### About
This is a wrapper for the Pixiv API that covers the mobile and desktop endpoints, includes typings, and offers various utility
functions to make downloading pixiv illusts easier.

### Insall
```ts
npm install pixiv.ts
```

### Getting Started
In order to receive an access token from pixiv, you must login using your **username** and **password**. All subsequent logins after the first will be done using the **refreshToken**, and it will be regenerated automatically whenever it expires.

#### Searching for illusts and novels
```ts
import Pixiv from "pixiv.ts"

async function useAPI() {
    /*Logging in is an asynchronous function. Don't try to use the constructor, all the properties will be undefined!*/
    const pixiv = await Pixiv.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)

    /*You can get an illust very easily with it's url or id.*/
    const illust = await pixiv.illust.get("https://www.pixiv.net/en/artworks/76833012")

    /*Alternatively, we can search pixiv for multiple.*/
    const illusts = await pixiv.search.illusts({word: "gabriel dropout"})

    /*You can also search through the rankings.*/
    const rankings = await pixiv.illust.ranking({mode: "day"})

    /*Getting novels is practically identical to illusts.*/
    const novel = await pixiv.novel.detail({novel_id: 11826198})

    /*There is also manga, but it doesn't have that many endpoints.*/
    const manga = await pixiv.manga.recommended()
}
useAPI()
```
#### Searching for users
```ts
    /*Again, you can use get() on the user class.*/
    const me = await pixiv.user.get("https://www.pixiv.net/member.php?id=35096162")

    /*You can also search for users using a query.*/
    const users = await pixiv.search.users({word: "kawaii"})

```