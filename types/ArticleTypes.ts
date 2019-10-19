export interface PixivArticleSearch {
    spotlight_articles: PixivArticle[]
    next_url: string | null
}

export interface PixivArticle {
    id: number
    title: string
    pure_title: string
    thumbnail: string
    article_url: string
    publish_date: string
    category: string
    subcategory_label: string
}
