import {translate} from "bing-translate-api"

/**
 * Translates search terms to japanese
 */
export default class Translate {
    public static translateTag = async (tag: string) => {
        const newTag = tag
        .replace(/gabriel dropout/i, "ガヴリールドロップアウト")
        .replace(/tenma gabriel white|gabriel white|gabriel/i, "天真=ガヴリール=ホワイト")
        .replace(/vignette tsukinose april|vignette tsukinose|vignette|vigne/i, "月乃瀬=ヴィネット=エイプリル")
        .replace(/satanichia kurumizawa mcDowell|satania/i, "胡桃沢=サタニキア=マクドウェル")
        .replace(/chisaki tapris sugarbell|tapris/i, "千咲=タプリス=シュガーベル")
        .replace(/shiraha raphiel ainsworth|raphiel|raphi/i, "白羽=ラフィエル=エインズワース")
        .replace(/kisaragi/i, "如月(アズールレーン)")
        .replace(/sagiri izumi|sagiri/i, "和泉紗霧")
        .replace(/eromanga sensei/i, "エロマンガ先生")
        .replace(/black tights/i, "黒タイツ")
        .replace(/white tights/i, "白タイツ")
        .replace(/konosuba/i, "この素晴らしい世界に祝福を!")
        .replace(/megumin/i, "めぐみん")
        .replace(/aqua/i, "アクア(このすば)")
        .replace(/kiniro mosaic/i, "きんいろモザイク")
        .replace(/tight|tights/i, "タイツ")
        .replace(/karen kujo|karen/i, "九条カレン")
        .replace(/chino kafuu|chino/i, "香風智乃")
        .replace(/is the order a rabbit[\s\S]*/i, "ご注文はうさぎですか?")
        .replace(/tohru/i, "トール(小林さんちのメイドラゴン)")
        .replace(/kanna kamui|kanna/i, "カンナカムイ")
        .replace(/miss kobayashi[\s\S]*dragon maid|dragon maid/i, "小林さんちのメイドラゴン")
        .replace(/kancolle/i, "艦これ")
        .replace(/azur lane/i, "アズールレーン")
        .replace(/laffey/i, "ラフィー(アズールレーン)")
        .replace(/senko[\s\S]*san|senko/i, "仙狐さん")
        .replace(/kancolle|kantai collection/i, "艦隊これくしょん")
        .replace(/interspecies reviewers/i, "異種族レビュアーズ")
        .replace(/stockings/i, "ストッキング")
        .replace(/ugoira/i, "うごイラ")
        .replace(/hibiki/i, "響(艦隊これくしょん)")
        .replace(/loli/i, "ロリ")
        .replace(/R18/i, "R-18")
        .replace(/R18G/i, "R-18G")
        if (!/[a-z]/i.test(newTag)) return newTag
        try {
            const translated = await translate(tag, "en", "ja")
            return translated.translation
        } catch {
            return tag
        }
    }

    public static translateTitle = async (title: string) => {
        try {
            const translated = await translate(title, "ja", "en")
            return translated.translation
        } catch {
            return title
        }
    }
}
